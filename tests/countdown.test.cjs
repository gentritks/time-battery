const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const script = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
const countdown = script.slice(
  script.indexOf('// ---------- Class Countdowns'),
  script.indexOf('// ---------- Wake Lock')
);

test('page JavaScript parses', () => {
  assert.doesNotThrow(() => new vm.Script(script));
});

test('dismissal time and deadline remain separate and clear after dismissal', () => {
  let currentTime = new Date(2026, 8, 2, 14, 20);
  const elements = new Map();
  class TestDate extends Date {
    constructor(...args) {
      super(...(args.length ? args : [currentTime.getTime()]));
    }
  }
  const context = vm.createContext({
    Date: TestDate,
    document: {
      getElementById(id) {
        if (!elements.has(id)) {
          elements.set(id, {textContent:'', hidden:true, style:{}, classList:{add(){}, remove(){}}});
        }
        return elements.get(id);
      }
    },
    setInterval() {}
  });
  vm.runInContext(countdown, context);
  const next = elements.get('nextLine');
  const note = elements.get('scheduleNote');
  const deadline = 'By 15:05, students must leave the building or be in designated activities.';
  assert.equal(next.textContent, 'Next: Dismissal at 14:50');
  assert.equal(note.textContent, deadline);
  assert.equal(note.hidden, false);

  currentTime = new Date(2026, 8, 2, 14, 50);
  vm.runInContext('updateCountdownsSchoolAware()', context);
  assert.equal(elements.get('nowLine').textContent, 'Dismissal — time remaining');
  assert.equal(next.textContent, '');
  assert.equal(note.textContent, deadline);

  currentTime = new Date(2026, 8, 2, 15, 5);
  vm.runInContext('updateCountdownsSchoolAware()', context);
  assert.equal(note.textContent, '');
  assert.equal(note.hidden, true);

  currentTime = new Date(2026, 8, 4, 11, 30);
  vm.runInContext('updateCountdownsSchoolAware()', context);
  assert.equal(next.textContent, 'Next: Dismissal at 12:00');
  assert.equal(note.hidden, true);

  currentTime = new Date(2026, 8, 2, 12, 10);
  vm.runInContext('updateCountdownsSchoolAware()', context);
  assert.equal(next.textContent, 'Next: High School Lunch — short bell at 12:15');
  assert.equal(note.hidden, true);
});
