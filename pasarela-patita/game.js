'use strict';
const R = window.Pasarela;
const $ = id => document.getElementById(id);
const STORAGE = 'pasarela-patita-v1';
let saved = {};
try { saved = JSON.parse(localStorage.getItem(STORAGE)) || {}; } catch (_) {}
let xp = Number.isFinite(saved.xp) ? Math.max(0, saved.xp) : 0;
let round = Number.isInteger(saved.round) ? Math.max(0, saved.round) : 0;
let playerName = typeof saved.name === 'string' ? saved.name.slice(0, 20) : 'Lola';
let outfit = Object.fromEntries(R.categories.map(c => [c.id, R.item(c.id, saved.outfit?.[c.id]).id]));
const poseNames = ['Saludo de estrella', 'Mano a la cintura', 'Brazos de mariposa'];
let currentPose = -1;
let category = 'dress', phase = 'dress', poses = [], needle = 0, frame = null, start = 0, sound = false, audioContext;
const theme = () => R.themes[round % R.themes.length];
function save() {
  try { localStorage.setItem(STORAGE, JSON.stringify({ xp, round, name: playerName, outfit })); }
  catch (_) { $('save-status').textContent = 'No se pudo guardar. Puedes seguir jugando en esta sesión.'; }
}
function tone(frequency = 640) {
  if (!sound) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    audioContext.resume();
    const oscillator = audioContext.createOscillator(), gain = audioContext.createGain();
    oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.06, audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + .18);
    oscillator.start(); oscillator.stop(audioContext.currentTime + .2);
  } catch (_) {}
}
function renderCharacter() {
  $('character').innerHTML = R.character(outfit, currentPose);
  $('outfit-caption').textContent = R.item('dress', outfit.dress).name + ' · ' + R.item('accessory', outfit.accessory).name;
}
function renderTabs() {
  $('tabs').replaceChildren(...R.categories.map(c => {
    const button = document.createElement('button'); button.textContent = c.name; button.id = 'tab-' + c.id;
    button.setAttribute('role', 'tab'); button.setAttribute('aria-selected', c.id === category); button.setAttribute('aria-controls', 'items');
    button.addEventListener('click', () => { category = c.id; renderTabs(); renderItems(); });
    return button;
  }));
}
function renderItems() {
  const selected = R.categories.find(c => c.id === category);
  $('category-hint').textContent = `${selected.hint} ${selected.items.length} modelos para elegir.`;
  $('items').setAttribute('aria-labelledby', 'tab-' + category);
  $('items').replaceChildren(...selected.items.map(i => {
    const button = document.createElement('button'); button.className = 'item'; button.disabled = phase !== 'dress'; button.setAttribute('aria-pressed', outfit[category] === i.id);
    button.innerHTML = `<span class="swatch" style="--swatch:${i.color}22">${i.icon}</span><strong>${i.name}</strong><small>${i.tags.join(' · ')}</small>${outfit[category] === i.id ? '<span class="check">✓</span>' : ''}`;
    button.addEventListener('click', () => { if (phase !== 'dress') return; outfit[category] = i.id; tone(520); save(); renderItems(); renderCharacter(); });
    return button;
  }));
}
function renderRound() {
  $('theme-name').textContent = theme().name; $('theme-icon').textContent = theme().icon; $('theme-description').textContent = theme().description;
  $('theme-tags').innerHTML = theme().tags.map(t => `<span class="tag">${t}</span>`).join('');
  $('rivals').innerHTML = R.rivals(round).map((r,i) => `<div class="rival"><span class="rival-icon">${r.icon}</span><div><strong>${r.name}</strong><small>${r.subtitle}</small></div><span>0${i+1}</span></div>`).join('');
  $('rank-name').textContent = R.rank(xp); $('xp-text').textContent = xp >= 500 ? xp + ' puntos · Rango máximo' : `${xp % 100} / 100 puntos`;
  $('xp').value = xp >= 500 ? 100 : xp % 100; $('rank-icon').textContent = ['✧','✿','✦','♛','♕','★'][Math.min(5, Math.floor(xp / 100))];
  $('round-label').textContent = `Reto ${round + 1} · ${R.rank(xp)}`;
}
function animate(timestamp) {
  if (phase !== 'walk') return;
  if (!start) start = timestamp;
  needle = (Math.sin((timestamp - start) / 470 - Math.PI / 2) + 1) / 2;
  $('needle').style.left = `calc(${needle * 100}% - 2px)`;
  frame = requestAnimationFrame(animate);
}
function walk() {
  if (phase !== 'dress') return;
  phase = 'walk'; poses = []; start = 0; needle = 0;
  $('walk').disabled = true; $('player-name').disabled = true; renderItems();
  $('stage-label').textContent = 'LA PASARELA'; $('pose-panel').hidden = false;
  currentPose = -1; renderCharacter();
  $('pose-title').textContent = '1 · Saludo de estrella';
  $('pose-instruction').textContent = 'Pulsa ¡POSAR! cuando la rayita llegue a la zona rosa del centro.';
  $('pose-button').textContent = '¡POSAR! ✦';
  $('pose-meter').hidden = false;
  $('pose-count').textContent = 'Son 3 poses. Puedes mirar cada una antes de seguir.';
  document.querySelector('.stage').classList.add('walking');
  $('pose-button').disabled = false; $('pose-button').focus({ preventScroll: true });
  document.querySelector('.stage').scrollIntoView({ behavior: 'smooth', block: 'start' });
  frame = requestAnimationFrame(animate); tone(800);
}
function sparkles() {
  for (let i = 0; i < 12; i++) {
    const star = document.createElement('span'); star.className = 'sparkle'; star.textContent = i % 2 ? '✦' : '♡';
    star.style.left = (15 + Math.random() * 70) + '%'; star.style.top = (25 + Math.random() * 45) + '%';
    $('sparkles').append(star); setTimeout(() => star.remove(), 1000);
  }
}
function pose() {
  if (phase === 'pose') {
    if (poses.length === 3) { finish(); return; }
    phase = 'walk'; currentPose = -1; start = 0; needle = 0; renderCharacter();
    document.querySelector('.stage').classList.remove('posing');
    document.querySelector('.stage').classList.add('walking');
    $('pose-title').textContent = `${poses.length + 1} · ${poseNames[poses.length]}`;
    $('pose-instruction').textContent = 'Pulsa ¡POSAR! cuando la rayita llegue a la zona rosa del centro.';
    $('pose-button').textContent = '¡POSAR! ✦';
    $('pose-meter').hidden = false;
    $('pose-count').textContent = `Pose ${poses.length + 1} de 3 · También puedes usar la barra de espacio`;
    frame = requestAnimationFrame(animate);
    return;
  }
  if (phase !== 'walk' || $('pose-button').disabled) return;
  const quality = Math.max(0, 1 - Math.max(0, Math.abs(needle - .5) - .15) / .35);
  poses.push(quality); tone(quality > .85 ? 1000 : 440); sparkles();
  phase = 'pose'; currentPose = poses.length - 1; cancelAnimationFrame(frame);
  document.querySelector('.stage').classList.remove('walking');
  document.querySelector('.stage').classList.add('posing');
  renderCharacter();
  $('pose-title').textContent = `${poses.length} · ${poseNames[currentPose]}`;
  $('pose-instruction').textContent = '¡Mira tu pose! Se queda así hasta que tú decidas continuar.';
  $('pose-meter').hidden = true;
  $('pose-count').textContent = quality > .99 ? '¡Pose perfecta! +10 puntos' : `¡Pose conseguida! +${Math.round(quality * 10)} puntos`;
  $('pose-button').textContent = poses.length === 3 ? 'VER RESULTADOS ♛' : 'SIGUIENTE POSE →';
}
function finish() {
  const points = R.score(outfit, theme(), poses);
  const entries = [...R.rivals(round).map(r => ({ ...r, player: false })), { name: playerName || 'Lola', score: points.total, player: true }];
  // Shared scores favor the player, so matching the leader is enough to win.
  entries.sort((a,b) => b.score - a.score || Number(b.player) - Number(a.player));
  const place = entries.findIndex(e => e.player) + 1, won = place === 1;
  const oldRank = R.rank(xp), reward = won ? 50 : place === 2 ? 25 : 15;
  xp += reward; if (won) round++;
  save(); renderRound();
  $('result-title').textContent = won ? '¡La pasarela es tuya!' : place === 2 ? '¡Casi tocas las estrellas!' : '¡Tu historia apenas empieza!';
  $('result-detail').textContent = won ? `${playerName || 'Lola'}, venciste a las tres mejores. ¡Avanzas al siguiente reto!` : 'Prueba prendas con las dos etiquetas del tema y posa en la zona rosa.';
  $('podium').replaceChildren(...entries.map((entry,i) => {
    const row = document.createElement('div'); row.className = 'result-row' + (entry.player ? ' player' : '');
    const placeEl = document.createElement('span'); placeEl.className = 'place'; placeEl.textContent = ['♛','②','③','④'][i];
    const nameEl = document.createElement('span'); nameEl.textContent = entry.name + (entry.player ? ' (tú)' : '');
    const scoreEl = document.createElement('strong'); scoreEl.textContent = `${entry.score} / 100`;
    row.append(placeEl, nameEl, scoreEl); return row;
  }));
  $('score-detail').textContent = `Tu look: ${points.style}/70 · Tus poses: ${points.performance}/30`;
  $('reward').textContent = `+${reward} puntos de experiencia` + (oldRank !== R.rank(xp) ? ` · ¡Ahora eres ${R.rank(xp)}!` : '');
  $('next').textContent = won ? 'SIGUIENTE RETO ↗' : 'VOLVER A INTENTAR ↗';
  phase = 'result'; document.querySelector('.stage').classList.remove('walking'); $('results').showModal();
}
function next() {
  $('results').close(); phase = 'dress'; $('pose-panel').hidden = true; $('walk').disabled = false; $('player-name').disabled = false;
  currentPose = -1; renderCharacter(); document.querySelector('.stage').classList.remove('posing');
  $('stage-label').textContent = 'EL PROBADOR'; renderRound(); renderItems(); $('walk').focus({ preventScroll: true });
}
$('walk').addEventListener('click', walk); $('pose-button').addEventListener('click', pose); $('next').addEventListener('click', next);
$('results').addEventListener('cancel', event => { event.preventDefault(); next(); });
$('player-name').value = playerName;
$('player-name').addEventListener('input', event => { playerName = event.target.value.trim().slice(0,20); $('character-name').textContent = playerName || 'Lola'; save(); });
$('character-name').textContent = playerName || 'Lola';
$('sound').addEventListener('click', () => { sound = !sound; $('sound').textContent = 'Sonido: ' + (sound ? 'encendido' : 'apagado'); $('sound').setAttribute('aria-pressed', sound); tone(); });
document.addEventListener('keydown', event => { if (event.code === 'Space' && (phase === 'walk' || phase === 'pose') && !event.repeat) { event.preventDefault(); pose(); } });
renderRound(); renderTabs(); renderItems(); renderCharacter();
