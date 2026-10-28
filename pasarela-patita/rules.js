(function (root) {
  const ranks = ['Principiante', 'Glamourista', 'Fashionista', 'Ícono de estilo', 'Reina de la pasarela', 'Leyenda de la moda'];
  const themes = [
    { name: 'Jardín de primavera', icon: '🌸', description: 'La pasarela florece. Crea un look dulce, fresco y lleno de color.', tags: ['dulce', 'floral'], color: '#e9a2c5' },
    { name: 'Noche de estrellas', icon: '🌙', description: 'Se encienden los focos. Es tu momento de vestir elegante y brillar.', tags: ['elegante', 'brillo'], color: '#8c80cb' },
    { name: 'Fiesta en la playa', icon: '🐚', description: 'Sol, brisa y mucho estilo. Prepara una entrada fresca y divertida.', tags: ['fresco', 'divertido'], color: '#61b9b4' },
    { name: 'Alfombra rosa', icon: '🎀', description: 'Una gran gala te espera. Combina elegancia con un toque dulce.', tags: ['elegante', 'dulce'], color: '#dc87ab' },
    { name: 'Pop superstar', icon: '🪩', description: 'Hoy tú eres la estrella. Atrévete con brillo y mucha diversión.', tags: ['brillo', 'divertido'], color: '#bc89d0' },
    { name: 'Bosque encantado', icon: '🦋', description: 'Una aventura entre flores. Busca un estilo floral y fresco.', tags: ['floral', 'fresco'], color: '#7ab38d' }
  ];
  const categories = [
    { id: 'dress', name: 'Vestidos', hint: 'El comienzo de un look inolvidable.', items: [
      { id: 'petal', name: 'Pétalos de rosa', icon: '🌷', color: '#eb90b5', tags: ['dulce', 'floral'], kind: 'petal' },
      { id: 'gala', name: 'Gala violeta', icon: '✨', color: '#8272bb', tags: ['elegante', 'brillo'], kind: 'gala' },
      { id: 'sea', name: 'Brisa marina', icon: '🐚', color: '#60c3bd', tags: ['fresco', 'divertido'], kind: 'short' },
      { id: 'pearl', name: 'Perla de seda', icon: '🤍', color: '#ecd9b3', tags: ['elegante', 'dulce'], kind: 'gala' },
      { id: 'pop', name: 'Estrella pop', icon: '🪩', color: '#d380cf', tags: ['brillo', 'divertido'], kind: 'short' },
      { id: 'garden', name: 'Jardín de menta', icon: '🌿', color: '#83b88e', tags: ['floral', 'fresco'], kind: 'petal' },
      { id: 'tutu', name: 'Tutú de algodón', icon: '🩰', color: '#f1aed2', tags: ['dulce', 'floral'], kind: 'tutu' },
      { id: 'midnight', name: 'Medianoche azul', icon: '🌌', color: '#3c5797', tags: ['elegante', 'brillo'], kind: 'gala' },
      { id: 'lemon', name: 'Limón de verano', icon: '🍋', color: '#e6c653', tags: ['fresco', 'divertido'], kind: 'ruffles' },
      { id: 'rosy', name: 'Princesa de encaje', icon: '🎀', color: '#d989a6', tags: ['elegante', 'dulce'], kind: 'princess' },
      { id: 'disco-dress', name: 'Disco plateado', icon: '🪩', color: '#9badd0', tags: ['brillo', 'divertido'], kind: 'pleats' },
      { id: 'lavender', name: 'Lavanda silvestre', icon: '🪻', color: '#b39aca', tags: ['floral', 'fresco'], kind: 'ruffles' }
    ]},
    { id: 'hair', name: 'Peinados', hint: 'Un peinado para tu gran entrada.', items: [
      { id: 'bows', name: 'Coletas con lazos', icon: '🎀', color: '#64402f', tags: ['dulce', 'floral'] },
      { id: 'bun', name: 'Moño de gala', icon: '👑', color: '#493440', tags: ['elegante', 'brillo'] },
      { id: 'waves', name: 'Ondas de verano', icon: '🌊', color: '#a66735', tags: ['fresco', 'floral'] },
      { id: 'silk', name: 'Moño de seda', icon: '🤍', color: '#64402f', tags: ['elegante', 'dulce'] },
      { id: 'disco', name: 'Coletas pop', icon: '⭐', color: '#493440', tags: ['brillo', 'divertido'] },
      { id: 'breeze', name: 'Ondas playeras', icon: '☀️', color: '#a66735', tags: ['fresco', 'divertido'] },
      { id: 'braids', name: 'Trenzas de miel', icon: '🍯', color: '#b77b3d', tags: ['dulce', 'floral'], kind: 'braids' },
      { id: 'bob', name: 'Corte francés', icon: '🖤', color: '#322c38', tags: ['elegante', 'brillo'], kind: 'bob' },
      { id: 'curls', name: 'Rizos de sol', icon: '🌞', color: '#a8542c', tags: ['fresco', 'divertido'], kind: 'curls' },
      { id: 'long', name: 'Melena de seda', icon: '🤎', color: '#563729', tags: ['elegante', 'dulce'], kind: 'long' },
      { id: 'pink-tail', name: 'Coleta de chicle', icon: '🍬', color: '#d67fae', tags: ['brillo', 'divertido'], kind: 'ponytail' },
      { id: 'pixie', name: 'Cortito de hada', icon: '🧚', color: '#9277ac', tags: ['floral', 'fresco'], kind: 'pixie' }
    ]},
    { id: 'accessory', name: 'Accesorios', hint: 'Los pequeños detalles cuentan una historia.', items: [
      { id: 'flowers', name: 'Corona de flores', icon: '🌸', color: '#e893b3', tags: ['floral', 'dulce'] },
      { id: 'tiara', name: 'Tiara de luz', icon: '💎', color: '#b5a1df', tags: ['brillo', 'elegante'] },
      { id: 'glasses', name: 'Gafas corazón', icon: '🕶️', color: '#e27b97', tags: ['divertido', 'fresco'] },
      { id: 'pearls', name: 'Tiara de perlas', icon: '🤍', color: '#e2c795', tags: ['elegante', 'dulce'] },
      { id: 'star', name: 'Tiara pop', icon: '⭐', color: '#dc86d4', tags: ['brillo', 'divertido'] },
      { id: 'wildflowers', name: 'Flores silvestres', icon: '🌼', color: '#88b597', tags: ['floral', 'fresco'] },
      { id: 'ribbon', name: 'Lazo de fresa', icon: '🎀', color: '#d75c8c', tags: ['dulce', 'floral'], kind: 'bow' },
      { id: 'necklace', name: 'Collar de luna', icon: '📿', color: '#a790d3', tags: ['elegante', 'brillo'], kind: 'necklace' },
      { id: 'sunhat', name: 'Sombrero de sol', icon: '👒', color: '#dec28b', tags: ['fresco', 'divertido'], kind: 'hat' },
      { id: 'handbag', name: 'Bolsito corazón', icon: '👜', color: '#db8ca8', tags: ['elegante', 'dulce'], kind: 'bag' },
      { id: 'earrings', name: 'Aretes de estrella', icon: '🌟', color: '#e0b551', tags: ['brillo', 'divertido'], kind: 'earrings' },
      { id: 'butterfly', name: 'Broche mariposa', icon: '🦋', color: '#70b8b4', tags: ['floral', 'fresco'], kind: 'clip' }
    ]},
    { id: 'shoes', name: 'Zapatos', hint: 'Lista para dejar huella en la pasarela.', items: [
      { id: 'ballet', name: 'Bailarinas rosa', icon: '🩰', color: '#d96d9b', tags: ['dulce', 'floral'] },
      { id: 'sparkle', name: 'Pasos de cristal', icon: '💜', color: '#8a78bb', tags: ['brillo', 'elegante'] },
      { id: 'sneakers', name: 'Tenis de nube', icon: '👟', color: '#75bcb6', tags: ['fresco', 'divertido'] },
      { id: 'silk-shoes', name: 'Bailarinas de seda', icon: '🤍', color: '#c0a069', tags: ['elegante', 'dulce'] },
      { id: 'disco-shoes', name: 'Pasos de estrella', icon: '⭐', color: '#ce73c4', tags: ['brillo', 'divertido'] },
      { id: 'leaf-shoes', name: 'Pasos de menta', icon: '🌿', color: '#79a785', tags: ['floral', 'fresco'] },
      { id: 'ribbon-shoes', name: 'Zapatillas de lazo', icon: '🎀', color: '#e594b9', tags: ['dulce', 'floral'], kind: 'ribbons' },
      { id: 'moon-boots', name: 'Botas de luna', icon: '🌙', color: '#706da6', tags: ['elegante', 'brillo'], kind: 'boots' },
      { id: 'sandals', name: 'Sandalias de sol', icon: '🩴', color: '#d3a64b', tags: ['fresco', 'divertido'], kind: 'sandals' },
      { id: 'pearl-boots', name: 'Botines de perla', icon: '🤍', color: '#c1a9a1', tags: ['elegante', 'dulce'], kind: 'ankle' },
      { id: 'pop-boots', name: 'Botas de concierto', icon: '🎤', color: '#ba72b9', tags: ['brillo', 'divertido'], kind: 'boots' },
      { id: 'garden-sandals', name: 'Sandalias de jardín', icon: '🌿', color: '#75a88a', tags: ['floral', 'fresco'], kind: 'sandals' }
    ]}
  ];
  function item(category, id) { const c = categories.find(c => c.id === category); return c.items.find(i => i.id === id) || c.items[0]; }
  function score(outfit, theme, poses) {
    const matches = categories.reduce((sum, c) => sum + item(c.id, outfit[c.id]).tags.filter(t => theme.tags.includes(t)).length, 0);
    const style = Math.round(matches / 8 * 70);
    const performance = Math.round(poses.reduce((sum, n) => sum + Math.max(0, Math.min(1, Number(n) || 0)), 0) / 3 * 30);
    return { style, performance, total: style + performance };
  }
  function rank(xp) { return ranks[Math.min(ranks.length - 1, Math.floor(xp / 100))]; }
  function rivals(round) { const extra = Math.min(12, Math.floor(round / 6) * 2); return [{ name: 'Bella', subtitle: 'La reina del brillo', icon: '💜', score: 64 + extra }, { name: 'Coco', subtitle: 'Estilo sin límites', icon: '🧡', score: 70 + extra }, { name: 'Mía', subtitle: 'La favorita del jurado', icon: '🩷', score: 76 + extra }]; }
  const api = { ranks, themes, categories, item, score, rank, rivals };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.Pasarela = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
