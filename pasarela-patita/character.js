(function (root) {
  'use strict';
  const R = typeof module !== 'undefined' && module.exports ? require('./rules.js') : root.Pasarela;
  function character(outfit, pose = -1) {
    const dress = R.item('dress', outfit.dress), hair = R.item('hair', outfit.hair);
    const accessory = R.item('accessory', outfit.accessory), shoes = R.item('shoes', outfit.shoes);
    const names = ['Saludo de estrella', 'Mano a la cintura', 'Brazos de mariposa'];
    const hairKind = hair.kind || (['bows','disco'].includes(hair.id) ? 'pigtails' : ['bun','silk'].includes(hair.id) ? 'bun' : 'waves');
    const hairShapes = {
      pigtails: '<ellipse cx="85" cy="124" rx="22" ry="43" transform="rotate(15 85 124)"/><ellipse cx="215" cy="124" rx="22" ry="43" transform="rotate(-15 215 124)"/>',
      bun: '<circle cx="150" cy="38" r="25"/><ellipse cx="150" cy="81" rx="57" ry="43"/>',
      waves: '<path d="M96 80Q94 34 150 38Q207 34 207 88L220 173Q205 190 191 168Q174 191 159 172Q139 192 122 171Q101 187 82 171Z"/>',
      braids: [97,203].map(x => [105,120,135,150,165,180].map((y,i) => `<ellipse cx="${x+(i%2?3:-3)}" cy="${y}" rx="11" ry="12"/>`).join('')).join(''),
      bob: '<path d="M95 78Q94 34 150 38Q207 34 205 83L212 137Q150 158 88 137Z"/>',
      curls: Array.from({length:12},(_,i) => { const a=i/11*Math.PI; return `<circle cx="${150+Math.cos(a)*58}" cy="${85+Math.sin(a)*65}" r="21"/>`; }).join(''),
      long: '<path d="M95 83Q92 35 150 38Q209 33 207 89L212 214Q185 225 174 211L128 215Q104 230 87 213Z"/>',
      ponytail: '<path d="M190 59Q239 29 231 95Q219 139 244 172Q193 166 203 105Z"/><circle cx="193" cy="66" r="13"/>',
      pixie: '<path d="M95 108Q77 65 112 47L105 30L133 41L149 24L164 40Q211 35 210 88L198 115Z"/>'
    };
    const long = ['gala','princess'].includes(dress.kind);
    const hem = long ? 333 : dress.kind === 'short' ? 266 : 285;
    const edge = dress.kind === 'princess' ? 77 : dress.kind === 'tutu' ? 73 : long ? 91 : 94;
    const dressPath = `M114 158Q125 153 133 155Q150 174 167 155Q175 153 186 158L179 181L170 212Q174 238 ${300-edge} ${hem}Q150 ${hem+16} ${edge} ${hem}Q126 238 130 212L121 181Z`;
    let decoration = '';
    if (dress.kind === 'petal' || dress.tags.includes('floral')) {
      decoration = [112,149,183,127,174].map((x,i) => `<g transform="translate(${x} ${235+(i%3)*15})" fill="#fff2f8"><circle cx="-4" r="4"/><circle cx="4" r="4"/><circle cy="-4" r="4"/><circle cy="4" r="4"/><circle r="2.5" fill="#d5ae51"/></g>`).join('');
    } else if (dress.kind === 'gala' || dress.kind === 'pleats') {
      decoration = [120,151,179].map((x,i) => `<path d="M${x} ${239+i*18}l2 6 6 0-5 4 2 6-5-4-5 4 2-6-5-4 6 0Z" fill="#fff1cd"/>`).join('');
    }
    if (['ruffles','tutu','princess'].includes(dress.kind)) {
      decoration += [hem-36,hem-17,hem].map((y,i) => `<path d="M${107-i*10} ${y}Q150 ${y+18} ${193+i*10} ${y}" fill="none" stroke="#fff8" stroke-width="7"/>`).join('');
    }
    if (dress.kind === 'pleats') decoration += [110,128,150,172,190].map(x => `<path d="M${150+(x-150)*.35} 218L${x} 277" stroke="#fff6" stroke-width="3"/>`).join('');
    const arms = [
      ['M115 167Q93 181 86 185L69 151L69 128', 'M185 167L202 206L207 246', [69,128], [207,246]],
      ['M115 167L90 201Q91 211 126 217', 'M185 167L210 201Q209 211 174 217', [126,217], [174,217]],
      ['M115 167L79 145L40 138', 'M185 167L221 145L260 138', [40,138], [260,138]]
    ][pose] || ['M115 167L98 207L93 246','M185 167L202 207L207 246',[93,246],[207,246]];
    const hands = [arms[2],arms[3]].map(([x,y]) => `<g fill="url(#skin)" stroke="#d7b786" stroke-width="1"><ellipse cx="${x}" cy="${y}" rx="6.5" ry="8"/><path d="M${x-3} ${y}l-3-6M${x+1} ${y}v-7" fill="none" stroke-linecap="round"/></g>`).join('');
    const shoeKind = shoes.kind || (shoes.id === 'sneakers' ? 'sneakers' : 'flats');
    let footwear = '';
    for (const [x,flip] of [[127,1],[173,-1]]) {
      footwear += `<g transform="translate(${x} 0) scale(${flip} 1)">`;
      if (['boots','ankle'].includes(shoeKind)) {
        const top = shoeKind === 'boots' ? 343 : 370;
        footwear += `<path d="M-8 ${top}L9 ${top}L10 384Q13 392 10 399L-26 399Q-30 389-10 383Z" fill="${shoes.color}" stroke="#fff8" stroke-width="2"/><path d="M-6 ${top+8}h13M-5 ${top+15}h12" stroke="#fff9" stroke-width="2"/><circle cx="1" cy="${top+9}" r="2" fill="#e7c677"/>`;
      } else {
        footwear += `<path d="M-8 383Q-25 385-27 394Q-27 400-16 400L10 398L9 384Q0 394-8 383Z" fill="${shoes.color}" stroke="#fff8" stroke-width="1.5"/>`;
        if (shoeKind === 'sandals') footwear += `<path d="M-9 380L8 386M-11 392L7 382" fill="none" stroke="${shoes.color}" stroke-width="4"/>`;
        if (shoeKind === 'sneakers') footwear += '<path d="M-24 397H8M-9 386l12 2m-14 1l12 2" stroke="#fff" stroke-width="2.5"/>';
        if (shoeKind === 'ribbons') footwear += `<path d="M-5 383L6 366L-5 354M6 383L-5 367L6 354" fill="none" stroke="${shoes.color}" stroke-width="2.5"/>`;
      }
      footwear += '</g>';
    }
    const flowerCrown = [107,127,150,173,193].map((x,i) => `<g transform="translate(${x} ${57-Math.sin(i/4*Math.PI)*10})" fill="${accessory.color}"><circle cx="-5" r="6"/><circle cx="5" r="6"/><circle cy="-5" r="6"/><circle cy="5" r="6"/><circle r="3" fill="#f9e4a2"/></g>`).join('');
    let headAccessory = '', bodyAccessory = '';
    const ac = accessory.color;
    if (['flowers','wildflowers'].includes(accessory.id)) headAccessory = flowerCrown;
    else if (['tiara','pearls','star'].includes(accessory.id)) headAccessory = `<path d="M118 56L114 33L135 44L150 23L165 44L186 33L182 56Z" fill="#e8cb7a" stroke="#fff0bf" stroke-width="2"/><g fill="${ac}"><circle cx="150" cy="40" r="5"/><circle cx="130" cy="47" r="3"/><circle cx="170" cy="47" r="3"/></g>`;
    else if (accessory.id === 'glasses') headAccessory = '<g fill="#b74c78" fill-opacity=".75" stroke="#ef98b9" stroke-width="4"><path d="M120 94C108 77 92 98 121 116C150 98 133 77 120 94ZM180 94C168 77 152 98 181 116C210 98 193 77 180 94Z"/><path d="M138 98Q150 92 162 98" fill="none"/></g>';
    else if (accessory.kind === 'bow') headAccessory = `<g fill="${ac}" stroke="#fff5" stroke-width="2"><path d="M150 52Q114 22 117 53Q119 73 150 52Q186 22 183 53Q181 73 150 52Z"/><circle cx="150" cy="52" r="6"/></g>`;
    else if (accessory.kind === 'hat') headAccessory = `<path d="M111 57L121 29Q150 18 179 29L189 57Z" fill="${ac}"/><path d="M115 49H185" stroke="#c36c91" stroke-width="9"/><ellipse cx="150" cy="61" rx="72" ry="12" fill="${ac}" stroke="#bb975d" stroke-width="1.5"/>`;
    else if (accessory.kind === 'clip') headAccessory = `<g transform="translate(195 74)" fill="${ac}" stroke="#fff9" stroke-width="1.5"><ellipse cx="-7" cy="-4" rx="9" ry="12" transform="rotate(-25)"/><ellipse cx="7" cy="-4" rx="9" ry="12" transform="rotate(25)"/><ellipse cx="-6" cy="9" rx="7" ry="7"/><ellipse cx="6" cy="9" rx="7" ry="7"/><path d="M0-8V15" stroke="#726087" stroke-width="3"/></g>`;
    else if (accessory.kind === 'earrings') headAccessory = [98,202].map(x => `<path d="M${x} 113l3 7 8 0-6 5 2 8-7-5-7 5 2-8-6-5 8 0Z" fill="${ac}"/>`).join('');
    else if (accessory.kind === 'necklace') bodyAccessory = `<path d="M133 159Q150 190 167 159" fill="none" stroke="#e9ca85" stroke-width="2.5"/><path d="M150 175l7 8-7 10-7-10Z" fill="${ac}" stroke="#fff" stroke-width="1.5"/>`;
    else if (accessory.kind === 'bag') bodyAccessory = `<path d="M176 166Q209 208 212 258" fill="none" stroke="#b96b8b" stroke-width="3"/><path d="M197 246Q212 227 227 246L235 276Q212 288 189 276Z" fill="${ac}" stroke="#fff8" stroke-width="2"/><path d="M207 260Q199 250 198 261Q199 269 212 274Q227 265 223 258Q219 253 212 260Z" fill="#fff2f7"/>`;
    const hairFront = hairKind === 'bob' ? '<path d="M98 91Q92 39 150 42Q210 39 203 91L171 84L171 61L159 87L110 87L105 118Z"/>' : hairKind === 'pixie' ? '<path d="M96 88Q88 49 137 43Q190 28 205 72L177 64L158 83L156 59L129 88Z"/>' : '<path d="M97 93Q88 38 147 41Q212 37 204 92Q182 84 174 61Q152 90 119 83Q113 104 98 110Z"/>';
    return `<svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${pose >= 0 ? names[pose] : 'Niña pato'} con ${dress.name}, ${hair.name}, ${accessory.name} y ${shoes.name}">
      <defs><linearGradient id="skin" x2="1" y2="1"><stop stop-color="#fff8df"/><stop offset="1" stop-color="#eed4a4"/></linearGradient><linearGradient id="fabric" x2="1" y2="1"><stop stop-color="${dress.color}"/><stop offset="1" stop-color="${dress.color}" stop-opacity=".78"/></linearGradient></defs>
      <g fill="${hair.color}" data-hair="${hairKind}">${hairShapes[hairKind]}</g>
      <g data-body="human"><path d="M138 127L138 157Q150 170 162 157L162 127" fill="url(#skin)" stroke="#d7b786" stroke-width="1"/>
      <path d="M127 275L126 327L127 387M173 275L174 327L173 387" fill="none" stroke="url(#skin)" stroke-width="15" stroke-linecap="round"/>
      <path d="M135 161Q150 173 165 161L174 187L169 216L131 216L126 187Z" fill="url(#skin)"/>
      <g data-shoes="${shoeKind}">${footwear}</g>
      <g fill="none" stroke="url(#skin)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"><path d="${arms[0]}"/><path d="${arms[1]}"/></g>
      <g data-dress="${dress.kind}"><path d="${dressPath}" fill="url(#fabric)" stroke="${dress.color}" stroke-width="2"/>
      <path d="M115 162L125 180M185 162L175 180" stroke="#fff8" stroke-width="7" stroke-linecap="round"/>
      <path d="M130 212Q150 221 170 212" fill="none" stroke="#fff8" stroke-width="5"/>
      <path d="M150 216q-17-14-17-1q0 12 17 1q17-14 17-1q0 12-17 1" fill="#fff2ef"/>
      ${decoration}<path d="M${edge+3} ${hem-1}Q150 ${hem+13} ${297-edge} ${hem-1}" fill="none" stroke="#ffffff70" stroke-width="3"/></g>
      ${pose === 1 ? `<g fill="none" stroke="url(#skin)" stroke-width="11" stroke-linecap="round"><path d="M91 202L126 217"/><path d="M209 202L174 217"/></g>` : ''}${hands}</g>
      <g data-head="duck"><ellipse cx="150" cy="95" rx="53" ry="48" fill="url(#skin)"/>
      <g fill="${hair.color}">${hairFront}</g>
      <g fill="#513a37"><ellipse cx="124" cy="101" rx="5.5" ry="8"/><ellipse cx="176" cy="101" rx="5.5" ry="8"/></g>
      <g fill="none" stroke="#513a37" stroke-width="2" stroke-linecap="round"><path d="M119 97l-4-4M123 95l-1-5M177 95l1-5M181 97l4-4"/></g>
      <g fill="#fff"><circle cx="126" cy="98" r="2"/><circle cx="178" cy="98" r="2"/></g>
      <g fill="#e89c9e" opacity=".65"><ellipse cx="113" cy="116" rx="10" ry="5"/><ellipse cx="187" cy="116" rx="10" ry="5"/></g>
      <path d="M134 113Q150 105 166 113Q176 123 150 132Q124 126 134 113Z" fill="#ebb064"/><path d="M136 120Q150 124 164 120" fill="none" stroke="#c48a46" stroke-width="1.5" stroke-linecap="round"/>
      ${hairKind === 'pigtails' ? '<g fill="#eaa0c0"><path d="M98 94q-23-20-21 0q0 16 21 0q23-20 21 0q0 16-21 0ZM202 94q-23-20-21 0q0 16 21 0q23-20 21 0q0 16-21 0Z"/></g>' : ''}
      ${headAccessory}</g><g data-accessory="${accessory.kind || accessory.id}">${bodyAccessory}</g>
    </svg>`;
  }
  R.character = character;
  if (typeof module !== 'undefined' && module.exports) module.exports = character;
})(typeof globalThis !== 'undefined' ? globalThis : this);
