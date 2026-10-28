const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const R = require('../rules.js');
require('../character.js');

// Exercises the game controller without requiring a browser or external packages.
function session(storage = {}) {
  const nodes = new Map(); let animation;
  function element() {
    return { textContent: '', value: '', innerHTML: '', hidden: false, disabled: false, children: [], style: {}, handlers: {}, attributes: {},
      classList: { add() {}, remove() {} },
      addEventListener(name, callback) { this.handlers[name] = callback; },
      setAttribute(name, value) { this.attributes[name] = value; },
      replaceChildren(...children) { this.children = children; }, append(child) { this.children.push(child); },
      focus() {}, scrollIntoView() {}, remove() {}, showModal() { this.open = true; }, close() { this.open = false; }
    };
  }
  const get = id => { if (!nodes.has(id)) nodes.set(id, element()); return nodes.get(id); };
  const sandbox = {
    window: { Pasarela: R }, document: { getElementById: get, createElement: element, querySelector: get, addEventListener() {} },
    localStorage: { getItem: key => storage[key] || null, setItem: (key, value) => { storage[key] = value; } },
    requestAnimationFrame: callback => { animation = callback; return 1; }, cancelAnimationFrame() {}, setTimeout: callback => { callback(); }
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../game.js'), 'utf8'), sandbox);
  return { get, storage, click: id => get(id).handlers.click(), perfectPose() { animation(1000); animation(1000 + 470 * Math.PI / 2); get('pose-button').handlers.click(); } };
}

test('Una partida completa permite ganar, avanzar y recuperar el progreso', () => {
  const game = session();
  assert.equal(game.get('theme-name').textContent, 'Jardín de primavera');
  game.click('walk');
  assert.equal(game.get('pose-panel').hidden, false);
  assert.equal(game.get('walk').disabled, true);
  const seen = new Set();
  for (let i = 0; i < 3; i++) {
    game.perfectPose();
    seen.add(game.get('character').innerHTML);
    assert.equal(game.get('pose-meter').hidden, true);
    assert.match(game.get('pose-instruction').textContent, /hasta que tú decidas/);
    assert.notEqual(game.get('results').open, true);
    assert.match(game.get('pose-title').textContent, new RegExp('^' + (i + 1)));
    game.click('pose-button');
  }
  assert.equal(seen.size, 3, 'Las tres poses deben cambiar el dibujo de la patita');
  assert.equal(game.get('results').open, true);
  assert.equal(game.get('result-title').textContent, '¡La pasarela es tuya!');
  assert.match(game.get('reward').textContent, /50/);
  assert.equal(game.get('theme-name').textContent, 'Noche de estrellas');
  game.click('next');
  assert.equal(game.get('walk').disabled, false);
  assert.equal(game.get('pose-panel').hidden, true);
  const restored = session(game.storage);
  assert.equal(restored.get('theme-name').textContent, 'Noche de estrellas');
  assert.match(restored.get('xp-text').textContent, /50/);
});

test('Perder conserva el reto y entrega experiencia para volver a intentarlo', () => {
  const game = session(); game.click('walk');
  for (let i = 0; i < 3; i++) { game.click('pose-button'); game.click('pose-button'); }
  assert.equal(game.get('results').open, true);
  assert.equal(game.get('theme-name').textContent, 'Jardín de primavera');
  assert.equal(game.get('next').textContent, 'VOLVER A INTENTAR ↗');
  assert.match(game.get('reward').textContent, /25/);
});

test('Un guardado roto permite iniciar una partida nueva', () => {
  const game = session({ 'pasarela-patita-v1': '{broken' });
  assert.equal(game.get('rank-name').textContent, 'Principiante');
  assert.equal(game.get('character-name').textContent, 'Lola');
});

test('Todas las prendas nuevas se pueden elegir, dibujar y guardar desde el armario', () => {
  const game = session();
  R.categories.forEach((category, categoryIndex) => {
    const drawings = new Set();
    assert.ok(category.items.length >= 12);
    game.get('tabs').children[categoryIndex].handlers.click();
    category.items.forEach((item, itemIndex) => {
      game.get('items').children[itemIndex].handlers.click();
      const saved = JSON.parse(game.storage['pasarela-patita-v1']);
      assert.equal(saved.outfit[category.id], item.id);
      const svg = game.get('character').innerHTML;
      assert.ok(svg.includes(item.name), item.name);
      assert.ok(svg.includes('data-body="human"'));
      assert.ok(svg.includes('data-head="duck"'));
      drawings.add(svg);
    });
    assert.equal(drawings.size, category.items.length);
  });
});
