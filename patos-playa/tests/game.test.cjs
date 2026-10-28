const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
function game(saved='[]',seed=123456){
 const ids=new Map(),storage=new Map([['patos-stair-stars',saved],['patos-adventure-v3',String(seed)]]),timers=new Map();let timerId=0;
 class Element{
  constructor(attrs=''){this.dataset={};this.attributes={};this.disabled=/\bdisabled\b/.test(attrs);this.hidden=false;this.textContent='';this.className='';this.children=[];this.classList={add:()=>{}};this.focus=()=>{};for(const m of attrs.matchAll(/([\w-]+)="([^"]*)"/g)){this.attributes[m[1]]=m[2];if(m[1].startsWith('data-'))this.dataset[m[1].slice(5)]=m[2];if(m[1]==='id')ids.set(m[2],this)}}
  set innerHTML(html){this.html=html;this.children=[...html.matchAll(/<button\b([^>]*)>/g)].map(m=>new Element(m[1]))}
  get innerHTML(){return this.html||''}
  querySelectorAll(selector){return selector==='[data-dir]'?this.children.filter(x=>x.dataset.dir):this.children}
  getAttribute(n){return this.attributes[n]||''}setAttribute(n,v){this.attributes[n]=v}
 }
 const context={document:{getElementById(id){if(!ids.has(id))ids.set(id,new Element());return ids.get(id)}},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},setTimeout:fn=>{timers.set(++timerId,fn);return timerId},clearTimeout:id=>timers.delete(id)};
 vm.createContext(context);for(const file of ['challenges.js','game.js'])vm.runInContext(fs.readFileSync(require.resolve('../dist/'+file),'utf8'),context);
 return {run:s=>vm.runInContext(s,context),el:id=>ids.get(id),storage,flush:()=>{const pending=[...timers.values()];timers.clear();pending.forEach(fn=>fn())}};
}
function solve(g,wrong=false){const type=g.run('levels[selected].type');if(type==='different'){const answer=g.run('levels[selected].answer');if(wrong)g.el('activity').children[(answer+1)%g.el('activity').children.length].onclick();g.el('activity').children[answer].onclick()}
 else if(type==='memory'){g.el('remember').onclick();for(const d of g.run('levels[selected].expected'))g.el('activity').children.find(b=>b.dataset.dir===d).onclick()}
 else{const answer=g.run('levels[selected].choices.indexOf(levels[selected].answer)');if(wrong)g.el('activity').children[(answer+1)%g.el('activity').children.length].onclick();g.el('activity').children[answer].onclick()}}
test('50 randomized challenges complete, preserve stars, and regenerate on replay',()=>{
 const g=game();for(let n=0;n<50;n++){g.run(`openLevel(${n})`);solve(g,true);assert.equal(g.run('completed.size'),n+1);assert.equal(g.el('next').hidden,false)}g.el('next').onclick();assert.match(g.el('title').textContent,/no te ganaron/);assert.equal(JSON.parse(g.storage.get('patos-stair-stars')).length,50);
 g.run('openLevel(0)');const before=g.run('JSON.stringify(levels[0])');g.run('openLevel(0)');assert.notEqual(g.run('JSON.stringify(levels[0])'),before);solve(g);assert.equal(g.run('completed.size'),50);assert.equal(game(g.storage.get('patos-stair-stars')).run('completed.size'),50);
});
test('100 adventure seeds cover 7 types, avoid adjacent types and duplicate challenges, and shuffle answers',()=>{
 const sample=game();const answerPositions=new Set();for(let seed=1;seed<=100;seed++){const deck=JSON.parse(sample.run(`JSON.stringify(ChallengeFactory.generator(${seed}).deck())`));assert.equal(deck.length,50);assert.equal(new Set(deck.map(l=>l.type)).size,7);assert.equal(new Set(deck.map(l=>JSON.stringify(l))).size,50);for(let i=1;i<50;i++)assert.notEqual(deck[i].type,deck[i-1].type);for(const l of deck){if(l.choices){assert.equal(new Set(l.choices).size,l.choices.length);assert.equal(l.choices.filter(v=>v===l.answer).length,1);answerPositions.add(l.choices.indexOf(l.answer))}}}assert.ok(answerPositions.size>=4);
 assert.equal(game().run('JSON.stringify(levels)'),game().run('JSON.stringify(levels)'));assert.notEqual(game('[]',1).run('JSON.stringify(levels)'),game('[]',2).run('JSON.stringify(levels)'));
});
test('answers agree with the displayed arithmetic, codes, series, logic, and filtered drawings',()=>{
 const g=game();for(let seed=1;seed<=40;seed++){const deck=JSON.parse(g.run(`JSON.stringify(ChallengeFactory.generator(${seed}).deck())`));for(const l of deck){if(l.type==='count'){const actual=l.faces.filter((f,i)=>l.mode===0?f==='R'&&l.decorations[i]==='bow':l.mode===1?f==='L'&&l.decorations[i]!=='bow':l.mode===2?l.decorations[i]==='bow':f==='R').length;assert.equal(Number(l.answer),actual)}if(l.type==='arithmetic')assert.equal(Number(l.answer),l.mode===0?l.a*l.b-l.c:l.mode===1?l.a*3:l.a*l.b+l.c);if(l.type==='code')assert.equal(Number(l.answer),l.a+2*l.b+l.c);if(l.type==='logic'){assert.equal(l.answer,l.order[l.position-1]);for(let n=0;n<l.order.length-1;n++)assert.ok(l.clues.includes(`${l.order[n]} está justo delante de ${l.order[n+1]}.`))}if(l.type==='pattern'){const values=l.display.split(' · ').slice(0,-1).map(Number);values.push(Number(l.answer));for(let i=0;i<values.length-1;i++)assert.equal(values[i+1],l.mode===0?values[i]+l.a+i:l.mode===1?values[i]+(i%2?l.b:l.a):values[i]*2+l.a)}if(l.type==='memory')assert.deepEqual(l.expected,l.reverse?[...l.sequence].reverse():l.sequence)}}
});
test('memory auto-hides, wrong answers allow retry, and navigation cancels old timers',()=>{
 const g=game(JSON.stringify(Array.from({length:50},(_,i)=>i)));const index=g.run("levels.findIndex(l=>l.type==='memory')");g.run(`openLevel(${index})`);g.flush();assert.equal(g.run('memoryReady'),true);const wrong=g.run("levels[selected].expected.map(d=>d==='L'?'R':'L')");for(const d of wrong)g.el('activity').children.find(b=>b.dataset.dir===d).onclick();assert.match(g.el('feedback').textContent,/pista/);g.flush();assert.equal(g.run('memoryReady'),true);g.run('openLevel(0)');const title=g.el('title').textContent;g.flush();assert.equal(g.el('title').textContent,title);
});
test('old progress remains, gaps do not unlock steps, and all 50 steps remain in map',()=>{
 const g=game('[0,2,99]');assert.equal(g.run('completed.size'),1);g.run('openLevel(8)');assert.equal(g.run('selected'),1);g.el('hint').onclick();assert.match(g.el('feedback').textContent,/💡/);for(let page=0;page<5;page++){g.run(`mapPage=${page};map()`);assert.equal(g.el('stairs').children.length,10);assert.equal(Number(g.el('stairs').children[0].dataset.level),page*10)}assert.equal(game('not json').run('completed.size'),0);
});
