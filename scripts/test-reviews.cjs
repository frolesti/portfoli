const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { EventEmitter } = require('node:events');
const test = require('node:test');

function service(initial = [], adminKey = 'fixture') {
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
      require: (name) => {
        if (name === '../../assets/review-projects') return require('../assets/review-projects.js');
        assert.equal(name, 'https');
        return https;
      },
      process: { env: { GIST_ID: 'fixture', GH_PAT: 'fixture', REVIEWS_ADMIN_KEY: adminKey } }
    };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'netlify/functions', file), 'utf8'), context);
    return context.exports.handler;
  }
  return { public: load('reviews.js'), admin: load('reviews-admin.js'), records: () => reviews };
}

const event = (httpMethod, body) => ({ httpMethod, body: JSON.stringify(body), headers: { 'x-admin-key': 'fixture' } });

test('client review is published directly with its verified project and can be withdrawn', async () => {
  const api = service();
  const submitted = await api.public(event('POST', {
    name: 'Client de prova', message: "L'equip ha treballat molt bé. <b>Text literal</b>",
    companyId: 'aesso', clientToken: 'aesso-3d9a8c7e21', projectId: 'projecte-aesso', projectName: 'Nom no verificat'
  }));
  assert.equal(submitted.statusCode, 201);
  assert.equal(JSON.parse(submitted.body).published, true);
  assert.equal(JSON.parse(submitted.body).pending, false);
  assert.equal(JSON.parse((await api.public(event('GET'))).body).length, 1);
  const dashboard = JSON.parse((await api.admin(event('GET'))).body);
  assert.equal(dashboard.pending.length, 0);
  const review = dashboard.reviews[0];
  assert.equal(review.projectId, 'projecte-aesso');
  assert.equal(review.projectName, 'Calculadora de protecció solar');
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
  for (const file of ['assets/review-projects.js', 'assets/review-preview.js', 'assets/review-card.js', 'assets/client-review.js', 'admin/reviews.js']) {
    new vm.Script(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'));
  }
  for (const [file, consumer] of [['index.html', 'assets/main.js'], ['admin/reviews.html', 'src="reviews.js']]) {
    const html = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    const renderer = html.indexOf('review-card.js');
    assert.ok(renderer >= 0 && renderer < html.indexOf(consumer));
  }
  for (const [file, consumer] of [['index.html', 'review-card.js'], ['review.html', 'client-review.js']]) {
    const html = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    const projects = html.indexOf('review-projects.js');
    assert.ok(projects >= 0 && projects < html.indexOf(consumer));
  }
});

test('client form has no logo, preview component or project selector', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'review.html'), 'utf8');
  const script = fs.readFileSync(path.join(__dirname, '..', 'assets/client-review.js'), 'utf8');
  assert.doesNotMatch(html, /client-review-logo|clientReviewPreview|review-card\.js|<select\b/);
  assert.doesNotMatch(script, /<img\b|clientReviewPreview|createClientReviewCard/);
  assert.match(html, /type="hidden" id="rv-project"/);
});

test('local review simulation is disabled on the public website', () => {
  const context = { window: {}, location: { protocol: 'https:', search: '?preview=reviews' } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'assets/review-preview.js'), 'utf8'), context);
  assert.equal(context.window.initLocalReviewPreview(), false);
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

test('publication does not require an administration key', async () => {
  const api = service([], '');
  const result = await api.public(event('POST', { companyId: 'alta-medical-services', clientToken: 'alta-7c5d2f41b9', projectId: 'projecte-odc', message: 'Una col·laboració molt positiva.' }));
  assert.equal(result.statusCode, 201);
  assert.equal(JSON.parse((await api.public(event('GET'))).body).length, 1);
});

test('a project from another client cannot be attached or published', async () => {
  const api = service();
  const result = await api.public(event('POST', { companyId: 'aesso', clientToken: 'aesso-3d9a8c7e21', projectId: 'projecte-odc', message: 'No ha de passar la validació.' }));
  assert.equal(result.statusCode, 400);
  assert.equal(JSON.parse(result.body).error, 'invalid_project');
  assert.equal(api.records().length, 0);
});

test('invitations match the approved drafts and only the two approved recipients', () => {
  const { buildMessages } = require('../newsletter/scripts/send-review-invitations');
  const draft = fs.readFileSync(path.join(__dirname, '..', 'admin/plantilla-mail-ressenya-client.md'), 'utf8');
  const messages = buildMessages('sender@example.com');
  assert.deepEqual(messages.map((message) => message.to), ['secretaria@aes-so.org', 'anna.munoz@altamedicalservices.com']);
  for (const message of messages) {
    assert.ok(draft.includes(message.subject));
    assert.ok(!message.cc && !message.bcc);
    for (const paragraph of message.text.split('\n\n')) {
      assert.ok(draft.includes(paragraph.replace('Deixar la ressenya:\n', '')));
    }
  }
});

test('invitations send only after the approved form and project validation are published', async () => {
  for (const published of [false, true]) {
    const sent = [];
    const errors = [];
    const module = {};
    const require = (name) => {
      assert.equal(name, 'nodemailer');
      return { createTransport: () => ({ sendMail: async (message) => {
        sent.push(message.to);
        return { accepted: [message.to], rejected: [], messageId: 'fixture' };
      } }) };
    };
    require.main = module;
    const fetch = async (url, options) => {
      if (options?.method === 'POST') {
        assert.equal(JSON.parse(options.body).message, '');
        return new Response(JSON.stringify({ error: 'invalid_project' }), { status: 400 });
      }
      const file = new URL(url).pathname.slice(1);
      return new Response(file.startsWith('.netlify/') ? '[]' : published ? fs.readFileSync(path.join(__dirname, '..', file), 'utf8') : 'clientReviewPreview');
    };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'newsletter/scripts/send-review-invitations.js'), 'utf8'), {
      require, module, fetch, URL, URLSearchParams,
      process: { argv: ['node', 'sender', '--send'], env: { GMAIL_USER: 'sender@example.com', GMAIL_APP_PASSWORD: 'fixture' } },
      console: { log() {}, error(message) { errors.push(message); } }
    });
    await new Promise((resolve) => setImmediate(resolve));
    assert.deepEqual(sent, published ? ['secretaria@aes-so.org', 'anna.munoz@altamedicalservices.com'] : []);
    assert.equal(errors.length, published ? 0 : 1);
  }
});