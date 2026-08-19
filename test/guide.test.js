const test = require('node:test');
const assert = require('node:assert/strict');
const { scenarios } = require('../server');

test('includes home, parking, and public scenarios', () => {
  assert.deepEqual(Object.keys(scenarios), ['home', 'parking', 'public']);
  assert.ok(Object.values(scenarios).every(item => item.priorities.length >= 4));
});

test('scenario guidance is escape and emergency focused', () => {
  const text = Object.values(scenarios).flatMap(item => item.priorities).join(' ').toLowerCase();
  assert.match(text, /call|leave|exit|escape|distance|retreat/);
  assert.doesNotMatch(text, /caliber|ammunition|shooting position/);
});
