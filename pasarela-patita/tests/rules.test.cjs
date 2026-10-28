const test = require('node:test');
const assert = require('node:assert/strict');
const R = require('../rules.js');
test('Todos los temas se pueden ganar incluso contra las rivales de mayor nivel', () => {
  for (const theme of R.themes) {
    const outfit = Object.fromEntries(R.categories.map(c => {
      const best = [...c.items].sort((a,b) => b.tags.filter(t => theme.tags.includes(t)).length - a.tags.filter(t => theme.tags.includes(t)).length)[0];
      return [c.id, best.id];
    }));
    const score = R.score(outfit, theme, [1,1,1]);
    assert.ok(score.total > Math.max(...R.rivals(999).map(r => r.score)), theme.name);
    assert.equal(score.total, 100);
    assert.equal(R.score(outfit, theme, [0,0,0]).performance, 0);
  }
});
test('El tema distingue un look adecuado de uno con etiquetas diferentes', () => {
  const fitting = {dress:'petal',hair:'bows',accessory:'flowers',shoes:'ballet'};
  const other = {dress:'gala',hair:'bun',accessory:'tiara',shoes:'sparkle'};
  assert.ok(R.score(fitting,R.themes[0],[.5,.5,.5]).style > R.score(other,R.themes[0],[.5,.5,.5]).style);
  assert.equal(R.score(other,R.themes[0],[1,1,1]).style, 0);
});
test('Los rangos cambian en los límites y conservan el rango máximo', () => {
  assert.equal(R.rank(0),'Principiante'); assert.equal(R.rank(99),'Principiante');
  assert.equal(R.rank(100),'Glamourista'); assert.equal(R.rank(200),'Fashionista');
  assert.equal(R.rank(500),'Leyenda de la moda'); assert.equal(R.rank(5000),'Leyenda de la moda');
});
test('Un identificador guardado desconocido tiene una prenda válida de respaldo', () => {
  for (const c of R.categories) assert.equal(R.item(c.id,'desconocido').id,c.items[0].id);
});
