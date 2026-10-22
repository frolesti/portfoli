const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { EventEmitter } = require('node:events');
const test = require('node:test');

function service(initial = []) {
  let reviews = structuredClone(initial);
  const https = {
    request(options, callback) {
      const request = new EventEmitter();
      let body = '';
      request.write = (chunk) => { body += chunk; };
      request.end = () => queueMicrotask(() => {
        if (options.method === 'PATCH') reviews = JSON.parse(JSON.parse(body).files['reviews.json'].content);
        const response = new EventEmitter();
        response.statusCode = 200;
        callback(response);
        response.emit('data', JSON.stringify({ files: { 'reviews.json': { content: JSON.stringify(reviews) } } }));
        response.emit('end');
      });
      return request;
    }
  };
  function load(file) {
    const context = {
      exports: {},
      require: (name) => { assert.equal(name, 'https'); return https; },
      process: { env: { GIST_ID: 'fixture', GH_PAT: 'fixture', REVIEWS_ADMIN_KEY: 'fixture' } }
    };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'netlify/functions', file), 'utf8'), context);
    return context.exports.handler;
  }
  return { public: load('reviews.js'), admin: load('reviews-admin.js'), records: () => reviews };
}

const event = (httpMethod, body) => ({ httpMethod, body: JSON.stringify(body), headers: { 'x-admin-key': 'fixture' } });

test('client review remains private until approved and can be withdrawn', async () => {
  const api = service();
  const submitted = await api.public(event('POST', {
    name: 'Client de prova', message: "L'equip ha treballat molt bé. <b>Text literal</b>",
    companyId: 'aesso', clientToken: 'aesso-3d9a8c7e21'
  }));
  assert.equal(submitted.statusCode, 201);
  assert.equal(JSON.parse(submitted.body).pending, true);
  assert.equal(JSON.parse((await api.public(event('GET'))).body).length, 0);
  const dashboard = JSON.parse((await api.admin(event('GET'))).body);
  assert.equal(dashboard.pending.length, 1);
  const review = dashboard.reviews[0];
  assert.equal(review.message, "L'equip ha treballat molt bé. <b>Text literal</b>");
  assert.equal((await api.admin(event('PATCH', { id: review.id, action: 'approve' }))).statusCode, 200);
  assert.equal(JSON.parse((await api.public(event('GET'))).body).length, 1);
  assert.equal((await api.admin(event('PATCH', { id: review.id, action: 'reject' }))).statusCode, 200);
  assert.equal(JSON.parse((await api.public(event('GET'))).body).length, 0);
  assert.equal((await api.admin(event('PATCH', { id: review.id, action: 'delete' }))).statusCode, 200);
  assert.equal(api.records().length, 0);
});

test('internal test is server-labelled, cannot be approved and can be deleted', async () => {
  const api = service();
  assert.equal((await api.public(event('POST', {
    name: 'Prova interna', message: 'Prova del formulari sense publicació.',
    companyId: 'prova-interna', clientToken: 'prova-interna-20261022', isTest: false
  }))).statusCode, 201);
  const review = api.records()[0];
  assert.equal(review.isTest, true);
  const approval = await api.admin(event('PATCH', { id: review.id, action: 'approve' }));
  assert.equal(approval.statusCode, 400);
  assert.equal(JSON.parse(approval.body).error, 'test_review');
  assert.equal(JSON.parse((await api.public(event('GET'))).body).length, 0);
  assert.equal((await api.admin(event('PATCH', { id: review.id, action: 'delete' }))).statusCode, 200);
  assert.equal(api.records().length, 0);
});

test('even an accidentally approved internal test is excluded from the public API', async () => {
  const api = service([
    { id: 1, companyId: 'prova-interna', approved: true, status: 'approved' },
    { id: 2, companyId: 'aesso', isTest: true, approved: true, status: 'approved' }
  ]);
  assert.equal(JSON.parse((await api.public(event('GET'))).body).length, 0);
});

test('invalid invitation and unauthenticated moderation cannot modify reviews', async () => {
  const api = service();
  assert.equal((await api.public(event('POST', { companyId: 'aesso', clientToken: 'incorrecte', message: 'Una prova' }))).statusCode, 403);
  assert.equal((await api.admin({ httpMethod: 'GET', headers: {} })).statusCode, 401);
  assert.equal(api.records().length, 0);
});

test('review scripts parse and the shared renderer loads before its consumers', () => {
  assert.match(fs.readFileSync(path.join(__dirname, '..', 'review.html'), 'utf8'), /#clientReviewForm\[hidden\]\s*\{\s*display:\s*none/);
  for (const file of ['assets/review-card.js', 'assets/client-review.js', 'admin/reviews.js']) {
    new vm.Script(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'));
  }
  for (const [file, consumer] of [['index.html', 'assets/main.js'], ['review.html', 'assets/client-review.js'], ['admin/reviews.html', 'src="reviews.js']]) {
    const html = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    const renderer = html.indexOf('review-card.js');
    assert.ok(renderer >= 0 && renderer < html.indexOf(consumer));
  }
});

test('the email test sends only to its configured sender and uses the internal invitation', async () => {
  let message;
  const module = {};
  const require = (name) => {
    assert.equal(name, 'nodemailer');
    return {
      createTransport: () => ({
        sendMail: async (mail) => {
          message = mail;
          return { accepted: [mail.to], rejected: [] };
        }
      })
    };
  };
  require.main = module;
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'newsletter/scripts/send-review-test.js'), 'utf8'), {
    require, module, process: { env: { GMAIL_USER: 'prova@example.com', GMAIL_APP_PASSWORD: 'fixture' } },
    console: { log() {}, error() { assert.fail('unexpected email error'); } }
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(message.to, 'prova@example.com');
  assert.equal(message.from.address, message.to);
  assert.match(message.subject, /\[PROVA\]/);
  assert.match(message.text, /client=prova-interna/);
  assert.match(message.text, /\/admin\/comentaris/);
});