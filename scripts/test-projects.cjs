const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: {} };
vm.runInNewContext(read('assets/project-articles.js'), context);
const projects = context.window.PROJECT_ARTICLES;

test('every homepage project has exactly one technical dossier', () => {
  const ids = Array.from(read('index.html').matchAll(/<article id="(projecte-[^"]+)"/g), (match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(Object.keys(projects).sort(), ids.sort());
});

for (const [id, project] of Object.entries(projects)) {
  test(id + ' includes implementation, privacy and scope details', () => {
    for (const field of ['title', 'lead', 'status', 'reviewed']) {
      assert.equal(typeof project[field], 'string');
      assert.ok(project[field].trim());
    }
    for (const field of ['features', 'stack', 'architecture', 'privacy', 'limits']) {
      assert.ok(Array.isArray(project[field]) && project[field].length > 0, field);
    }
    for (const feature of project.features) {
      assert.ok(feature.title && feature.desc);
    }
    for (const link of project.links) {
      assert.equal(new URL(link.url).protocol, 'https:');
      assert.ok(link.label);
    }
  });
}

test('project details have no routing or return-state machinery', () => {
  for (const file of ['index.html', 'assets/main.js', 'assets/project-dialog.js']) {
    assert.doesNotMatch(read(file), /producte\.html|portfolio-return-state|restoreProjectReturnState|history\.(pushState|replaceState)/);
  }
  assert.equal(fs.existsSync(path.join(root, 'producte.html')), false);
  assert.equal(fs.existsSync(path.join(root, 'assets/product-page.js')), false);
});

test('project scripts are valid JavaScript and are loaded in dependency order', () => {
  const scripts = ['assets/project-visuals.js', 'assets/project-articles.js', 'assets/project-dialog.js', 'assets/main.js'];
  const html = read('index.html');
  let previous = -1;
  for (const file of scripts) {
    new vm.Script(read(file));
    const position = html.indexOf('src="' + file);
    assert.ok(position > previous, file);
    previous = position;
  }
});