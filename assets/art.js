/* ============================================================
   art.js — Ilustraciones vectoriales dibujadas a mano (SVG).
   Dos personajes: ÉL (camiseta negra metalera, calavera cyborg)
   y ELLA (vestido blanco de playa, flor roja en la oreja).
   ============================================================ */

const ART = (() => {

  /* ---------- Paleta ---------- */
  const C = {
    fur:   '#C4713A',
    furD:  '#8E4E22',
    furL:  '#E2A165',
    belly: '#F4DCC0',
    ear:   '#E2917A',
    ink:   '#3A2317',
    blush: '#F0928F',
    red:   '#D62828',
    redD:  '#9E1B1B',
    sun:   '#F6B800',
    sunD:  '#E08A1E',
    leaf:  '#5C8A4A',
    leafD: '#416634',
    white: '#FFFFFF',
  };

  let uid = 0;
  const id = (p) => `${p}${++uid}`;
  const rnd = (a, b) => a + Math.random() * (b - a);

  /* ---------- Piezas sueltas ---------- */

  const heart = (x, y, s = 1, fill = C.red, op = 1) =>
    `<path transform="translate(${x},${y}) scale(${s})" opacity="${op}" fill="${fill}"
      d="M0,6 C-9,-2 -9,-12 -2,-12 C1.5,-12 0,-8.5 0,-8.5 C0,-8.5 -1.5,-12 2,-12 C9,-12 9,-2 0,6 Z"/>`;

  const petal = (x, y, s = 1, rot = 0, fill = C.red, op = 1) =>
    `<ellipse cx="${x}" cy="${y}" rx="${7 * s}" ry="${3.4 * s}" fill="${fill}" opacity="${op}"
      transform="rotate(${rot} ${x} ${y})"/>`;

  const star = (x, y, s = 1, op = 1) =>
    `<path transform="translate(${x},${y}) scale(${s})" fill="#FFF7D6" opacity="${op}"
      d="M0,-4 L1.1,-1.1 L4,0 L1.1,1.1 L0,4 L-1.1,1.1 L-4,0 L-1.1,-1.1 Z"/>`;


  /* Corazón partido en dos mitades, con el filo dentado */
  const corazonRoto = (x, y, s = 1, fill = '#8E3B44', op = .9) => {
    const c = id('clip');
    const d = 'M0,6 C-9,-2 -9,-12 -2,-12 C1.5,-12 0,-8.5 0,-8.5 C0,-8.5 -1.5,-12 2,-12 C9,-12 9,-2 0,6 Z';
    const izq = '-14,-15 0.6,-15 -1.6,-9.4 1.2,-5.2 -1.2,-1 1.6,3 0,8.6 -14,8.6';
    const der = '0.6,-15 14,-15 14,8.6 0,8.6 1.6,3 -1.2,-1 1.2,-5.2 -1.6,-9.4';
    return `<g transform="translate(${x},${y}) scale(${s})" opacity="${op}">
      <defs>
        <clipPath id="${c}a"><polygon points="${izq}"/></clipPath>
        <clipPath id="${c}b"><polygon points="${der}"/></clipPath>
      </defs>
      <g transform="translate(-3.4,0.6) rotate(-13)">
        <g clip-path="url(#${c}a)"><path d="${d}" fill="${fill}"/>
          <path d="${d}" fill="none" stroke="#5E2730" stroke-width="1.1"/></g>
      </g>
      <g transform="translate(3.4,2.4) rotate(15)">
        <g clip-path="url(#${c}b)"><path d="${d}" fill="${fill}"/>
          <path d="${d}" fill="none" stroke="#5E2730" stroke-width="1.1"/></g>
      </g>
    </g>`;
  };

  /* Corazón ya curado: cosido por la mitad y con su parche encima */
  const corazonCurado = (x, y, s = 1) => `
    <g transform="translate(${x},${y}) scale(${s})">
      <path d="M0,6 C-9,-2 -9,-12 -2,-12 C1.5,-12 0,-8.5 0,-8.5 C0,-8.5 -1.5,-12 2,-12 C9,-12 9,-2 0,6 Z" fill="${C.red}"/>
      <path d="M0,6 C-9,-2 -9,-12 -2,-12 C1.5,-12 0,-8.5 0,-8.5 C0,-8.5 -1.5,-12 2,-12 C9,-12 9,-2 0,6 Z"
        fill="none" stroke="${C.redD}" stroke-width=".9" opacity=".7"/>
      <!-- la costura, por donde se partió -->
      <path d="M-0.4,-9.4 L1,-5.2 L-1,-1 L1.4,3 L0,6" stroke="${C.redD}" stroke-width=".9"
        fill="none" opacity=".75"/>
      <g stroke="#FFE3C8" stroke-width=".85" stroke-linecap="round" opacity=".95">
        <path d="M-2.6,-8.4 L2,-9.6 M-1.4,-4.6 L3,-5.8 M-3.4,-0.4 L1,-1.6 M-1,3.6 L3.4,2.4"/>
      </g>
      <!-- el parche -->
      <g transform="rotate(-28)">
        <rect x="-9.5" y="-2.6" width="19" height="5.2" rx="2.6" fill="#F3DCBE"
          stroke="#DCC19C" stroke-width=".6"/>
        <rect x="-3.4" y="-2.6" width="6.8" height="5.2" fill="#E9CFAC"/>
        <g fill="#D8BC95">
          <circle cx="-2" cy="-1" r=".5"/><circle cx="0" cy="0" r=".5"/><circle cx="2" cy="1" r=".5"/>
          <circle cx="0" cy="-1.6" r=".5"/><circle cx="-1.6" cy="1" r=".5"/><circle cx="1.6" cy="-1" r=".5"/>
        </g>
      </g>
    </g>`;

  /* Girasol */
  const sunflower = (x, y, s = 1, rot = 0) => {
    let p = '';
    for (let i = 0; i < 14; i++) {
      const a = (360 / 14) * i;
      p += `<ellipse cx="0" cy="-20" rx="6.5" ry="13" fill="${i % 2 ? C.sun : C.sunD}"
             transform="rotate(${a}) translate(0,0)"/>`;
    }
    return `<g transform="translate(${x},${y}) scale(${s}) rotate(${rot})">
      <path d="M0,0 C-4,-30 -2,-60 0,-92" stroke="${C.leafD}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M0,-40 C-18,-46 -26,-34 -12,-28 C-4,-25 0,-33 0,-40 Z" fill="${C.leaf}"/>
      <path d="M0,-58 C18,-64 26,-52 12,-46 C4,-43 0,-51 0,-58 Z" fill="${C.leafD}"/>
      <g transform="translate(0,-92)">${p}
        <circle r="14" fill="#6B3E12"/><circle r="9" fill="#8A4F17"/>
        <circle r="4" fill="#A86524"/>
      </g></g>`;
  };

  /* Flor roja */
  const redFlower = (x, y, s = 1) => {
    let p = '';
    for (let i = 0; i < 6; i++) p += `<ellipse cx="0" cy="-11" rx="6" ry="11" fill="${i % 2 ? C.red : C.redD}" transform="rotate(${60 * i})"/>`;
    return `<g transform="translate(${x},${y}) scale(${s})">
      <path d="M0,0 C-3,-20 -1,-38 0,-54" stroke="${C.leafD}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <path d="M0,-24 C-14,-30 -20,-20 -9,-15 C-3,-13 0,-19 0,-24 Z" fill="${C.leaf}"/>
      <g transform="translate(0,-54)">${p}<circle r="5" fill="#FFD447"/></g></g>`;
  };

  const cloud = (x, y, s = 1, op = 0.9, fill = '#FFFFFF') =>
    `<g transform="translate(${x},${y}) scale(${s})" opacity="${op}" fill="${fill}">
      <ellipse cx="0" cy="0" rx="34" ry="20"/><ellipse cx="-28" cy="6" rx="24" ry="14"/>
      <ellipse cx="28" cy="6" rx="26" ry="15"/></g>`;

  /* ---------- Ropa ---------- */

  // Camiseta negra con calavera cyborg (diseño original estilo metal)
  const teeMetal = () => `
    <path d="M34,64 C44,55 70,55 80,64 L88,73 L78,81 L76,104 C65,109 49,109 38,104 L36,81 L26,73 Z" fill="#17181C"/>
    <path d="M34,64 C44,55 70,55 80,64 L76,68 C68,62 46,62 38,68 Z" fill="#2A2C33"/>
    <g transform="translate(57,84) scale(0.92)">
      <path d="M0,-13 c-8,0 -13,5.5 -13,12 0,4.4 2,7.6 4.4,9.6 l0,3.6 c0,2 1.8,3.4 4,3.4 l9.2,0 c2.2,0 4,-1.4 4,-3.4 l0,-3.6 c2.4,-2 4.4,-5.2 4.4,-9.6 0,-6.5 -5,-12 -13,-12 z" fill="#C9D2DA"/>
      <path d="M0,-13 c-8,0 -13,5.5 -13,12 0,2 0.5,3.8 1.2,5.4 l24,0 c0.7,-1.6 1.2,-3.4 1.2,-5.4 0,-6.5 -5,-12 -13,-12 z" fill="#98A6B2"/>
      <ellipse cx="-5" cy="-2" rx="3.4" ry="3.8" fill="#0B0C10"/>
      <ellipse cx="5.2" cy="-2" rx="3.6" ry="4" fill="#E01F1F"/>
      <circle cx="5.2" cy="-2" r="1.3" fill="#FFD2D2"/>
      <path d="M-2,4 l4,0 -2,3.4 z" fill="#0B0C10"/>
      <path d="M-6,10 l12,0 M-3,10 l0,4 M1,10 l0,4" stroke="#0B0C10" stroke-width="1.4"/>
      <path d="M9,-9 l7,-3 M9,-5 l8,0 M-9,-9 l-7,-3" stroke="#7E8B97" stroke-width="1.4" fill="none"/>
      <circle cx="17" cy="-12" r="1.8" fill="#E01F1F"/>
    </g>
    <path d="M40,100 l34,0" stroke="#2A2C33" stroke-width="3"/>`;

  // Vestido blanco de playa
  const dressBeach = () => `
    <path d="M42,62 C50,56 66,56 74,62 L72,74 C82,86 87,101 89,110 C73,117 41,117 27,110 C30,99 35,86 44,74 Z" fill="#FFFFFF"/>
    <path d="M44,74 C40,86 34,99 31,110 C38,113 44,114 50,115 C48,100 47,86 48,72 Z" fill="#EFE7DC" opacity=".75"/>
    <path d="M27,110 q8,7 16,1 q8,-6 16,1 q8,7 16,0 q7,-6 14,-2" stroke="#E4DACC" stroke-width="2.6" fill="none"/>
    <path d="M47,60 l3,-10 M69,60 l-2,-10" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M42,62 C50,56 66,56 74,62" stroke="#E4DACC" stroke-width="2" fill="none"/>`;

  const towel = () => `
    <path d="M36,66 C46,58 70,58 80,66 L82,86 C70,92 46,92 34,86 Z" fill="#F2A0A0"/>
    <path d="M34,74 l48,0" stroke="#FFFFFF" stroke-width="3" opacity=".7"/>`;

  /* ---------- Ardilla ---------- */
  /* opts: x,y,s,flip,outfit('tee'|'dress'|'towel'|'none'),
           eyes('open'|'happy'|'closed'|'sad'|'wink'), arms('down'|'up'|'hug'|'side'),
           flower(bool), extra(svg), tail(bool), tint(color) */
  function squirrel(o = {}) {
    const {
      x = 0, y = 0, s = 1, flip = false, outfit = 'none',
      eyes = 'happy', arms = 'down', flower = false, bow = false, pelo = 'none', extra = '', tail = true,
      fur = C.fur, furD = C.furD, furL = C.furL, belly = C.belly, tears = false,
    } = o;

    const tailPath = 'M34,88 C4,84 -8,50 12,26 C25,10 52,12 57,28 C61,40 51,51 42,47';

    const eyeSet = {
      open:   `<circle cx="72" cy="40" r="5" fill="${C.ink}"/><circle cx="73.6" cy="38" r="1.8" fill="#fff"/>
               <circle cx="56" cy="39" r="4.4" fill="${C.ink}"/><circle cx="57.4" cy="37" r="1.6" fill="#fff"/>`,
      happy:  `<path d="M67,41 q5,-7 10,0" stroke="${C.ink}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
               <path d="M51,40 q5,-6.5 9,0" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
      closed: `<path d="M67,41 q5,5 10,0" stroke="${C.ink}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
               <path d="M51,40 q5,5 9,0" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
      wink:   `<path d="M67,41 q5,-7 10,0" stroke="${C.ink}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
               <circle cx="56" cy="39" r="4.4" fill="${C.ink}"/><circle cx="57.4" cy="37" r="1.6" fill="#fff"/>`,
      sad:    `<circle cx="72" cy="42" r="4.4" fill="${C.ink}"/><circle cx="56" cy="41" r="4" fill="${C.ink}"/>
               <path d="M66,33 q6,3 11,1 M51,33 q5,2.5 9,1" stroke="${C.ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
    }[eyes];

    const mouth = eyes === 'sad'
      ? `<path d="M76,58 q-6,-4 -11,0" stroke="${C.ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
      : `<path d="M81,52 q-4,6 -10,3" stroke="${C.ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;

    const armR = {
      down: `<ellipse cx="80" cy="79" rx="7.5" ry="12" fill="${fur}" transform="rotate(14 80 79)"/>`,
      up:   `<ellipse cx="86" cy="58" rx="7" ry="13" fill="${fur}" transform="rotate(42 86 58)"/>`,
      hug:  `<ellipse cx="88" cy="76" rx="13" ry="7" fill="${fur}" transform="rotate(-8 88 76)"/>`,
      side: `<ellipse cx="88" cy="72" rx="12" ry="7" fill="${fur}" transform="rotate(8 88 72)"/>`,
    }[arms];

    const outfitSVG = { tee: teeMetal(), dress: dressBeach(), towel: towel(), none: '' }[outfit] || '';

    // Solo el moño de la coronilla
    const pelo1 = '#2F2A28', pelo2 = '#4A423E';
    const peloMono = pelo === 'mono' ? `
      <path d="M45,30 C45,17 55,9 66,10 C77,11 83,19 81,28 C75,19 62,15 45,30 Z" fill="${pelo1}"/>
      <path d="M49,26 C53,18 60,14 69,15" stroke="${pelo2}" stroke-width="2.4" fill="none"
        stroke-linecap="round" opacity=".8"/>
      <g transform="translate(66,11)">
        <path d="M-9,4 C-11,-6 -3,-11 4,-9 C11,-7 12,2 6,6 C1,9 -7,9 -9,4 Z" fill="${pelo1}"/>
        <path d="M-6,2 C-7,-4 -2,-7 3,-6" stroke="${pelo2}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M-2,-10 l-3,-6 M4,-10 l4,-5" stroke="${pelo1}" stroke-width="2.4"
          fill="none" stroke-linecap="round"/>
        <ellipse cx="-1" cy="7" rx="7.5" ry="3" fill="#B31F2A"/>
        <ellipse cx="-1" cy="6.2" rx="7.5" ry="1.6" fill="#D62828"/>
      </g>` : '';

    return `<g class="sq" transform="translate(${x},${y}) scale(${flip ? -s : s},${s})">
      ${tail ? `
      <path d="${tailPath}" fill="none" stroke="${furD}" stroke-width="32" stroke-linecap="round"/>
      <path d="${tailPath}" fill="none" stroke="${fur}" stroke-width="23" stroke-linecap="round"/>
      <path d="M34,88 C10,82 0,52 18,30 C29,17 47,18 52,30" fill="none" stroke="${furL}" stroke-width="8" stroke-linecap="round" opacity=".75"/>` : ''}
      <ellipse cx="45" cy="106" rx="12" ry="7" fill="${furD}"/>
      <ellipse cx="69" cy="106" rx="12" ry="7" fill="${furD}"/>
      <ellipse cx="57" cy="80" rx="24" ry="28" fill="${fur}"/>
      <ellipse cx="61" cy="84" rx="15" ry="20" fill="${belly}"/>
      ${outfitSVG}
      <ellipse cx="36" cy="79" rx="7.5" ry="12" fill="${furD}" transform="rotate(-14 36 79)"/>
      ${armR}
      <path d="M50,30 C45,10 57,4 62,22 Z" fill="${furD}"/>
      <path d="M52,28 C50,15 57,12 60,22 Z" fill="${C.ear}"/>
      <path d="M74,24 C80,5 91,11 84,30 Z" fill="${furD}"/>
      <path d="M76,26 C80,14 86,14 83,25 Z" fill="${C.ear}"/>
      <circle cx="62" cy="44" r="23" fill="${fur}"/>
      <ellipse cx="72" cy="53" rx="15" ry="11" fill="${belly}"/>
      <ellipse cx="82" cy="48" rx="4" ry="3.2" fill="${C.ink}"/>
      ${mouth}
      ${eyeSet}
      <ellipse cx="78" cy="60" rx="5.5" ry="3.2" fill="${C.blush}" opacity=".55"/>
      <ellipse cx="52" cy="57" rx="5" ry="3" fill="${C.blush}" opacity=".5"/>
      <path d="M86,50 l10,-3 M86,54 l10,2" stroke="${C.ink}" stroke-width="1.2" opacity=".5"/>
      ${peloMono}
      ${tears ? `<ellipse cx="74" cy="52" rx="2.6" ry="4" fill="#8FC7E8" opacity=".9"/>` : ''}
      ${bow ? `<g transform="translate(80,20) rotate(14)">
        <path d="M0,0 C-14,-12 -22,-2 -12,5 C-7,8 -2,5 0,0 Z" fill="#F58AA8"/>
        <path d="M0,0 C14,-12 22,-2 12,5 C7,8 2,5 0,0 Z" fill="#F7A0BA"/>
        <circle r="4.2" fill="#E8749A"/></g>` : ''}
      ${flower ? `<g transform="translate(46,24) scale(0.42)">${redFlower(0, 0, 1)}</g>` : ''}
      ${extra}
    </g>`;
  }

  const he = (o = {}) => {
    const base = o.s ?? 1;
    return squirrel({
      outfit: 'tee', pelo: 'mono', ...o,
      s: base * 1.09,
      y: (o.y ?? 0) - 106 * base * 0.09,   // compensa el alto extra para que no se hunda
    });
  };
  const she = (o = {}) => squirrel({ outfit: 'dress', flower: true, bow: true, fur: '#D08A4F', furD: '#A96334', furL: '#EDB782', ...o });

  /* ---------- Marco de escena ---------- */
  const frame = (defs, inner) =>
    `<svg class="scene-svg" viewBox="0 0 800 460" role="img" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs}</defs>${inner}</svg>`;

  const skyGrad = (a, b) => {
    const g = id('sky');
    return [g, `<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${a}"/><stop offset="100%" stop-color="${b}"/></linearGradient>`];
  };

  const ground = (c1 = '#84BC6A', c2 = '#6BA155') => `
    <path d="M0,372 Q200,346 400,362 T800,352 L800,460 L0,460 Z" fill="${c1}"/>
    <path d="M0,404 Q220,382 440,398 T800,390 L800,460 L0,460 Z" fill="${c2}"/>`;

  const sun = (x, y) => `
    <circle cx="${x}" cy="${y}" r="42" fill="#FFE08A" opacity=".45"/>
    <circle cx="${x}" cy="${y}" r="28" fill="#FFD447"/>`;

  const skyHearts = (n = 7, yMax = 200) => {
    let s = '';
    for (let i = 0; i < n; i++)
      s += `<g class="float" style="--d:${(i * 0.7).toFixed(1)}s">${heart(rnd(60, 740), rnd(40, yMax), rnd(0.9, 2.1), i % 2 ? C.red : '#F2708C', rnd(0.35, 0.8))}</g>`;
    return s;
  };

  /* ============================================================
     ESCENAS
     ============================================================ */
  const scenes = {};

  /* 01 — Dos desconocidos */
  scenes.desconocidos = () => {
    const [g, d] = skyGrad('#CDEAF7', '#F7F1E4');
    return frame(d, `
      <rect width="800" height="460" fill="url(#${g})"/>
      ${sun(690, 78)}${cloud(150, 92, 1)}${cloud(520, 64, .8, .8)}
      ${ground()}
      <path d="M380,460 L380,150 C380,120 420,120 420,150 L420,460 Z" fill="#7A5230"/>
      <path d="M390,240 C320,236 270,208 214,196" stroke="#7A5230" stroke-width="16" fill="none" stroke-linecap="round"/>
      <path d="M412,270 C480,266 540,240 596,228" stroke="#7A5230" stroke-width="16" fill="none" stroke-linecap="round"/>
      <ellipse cx="400" cy="120" rx="190" ry="86" fill="#5C8A4A"/>
      <ellipse cx="290" cy="146" rx="96" ry="52" fill="#6C9B56"/>
      <ellipse cx="520" cy="140" rx="104" ry="54" fill="#6C9B56"/>
      ${he({ x: 150, y: 86, s: .95, flip: true, eyes: 'open', arms: 'down' })}
      ${she({ x: 556, y: 118, s: .95, eyes: 'open', arms: 'down' })}
      <text x="356" y="196" font-size="40" fill="#9A5C2D" opacity=".5">?</text>
      <text x="446" y="222" font-size="40" fill="#9A5C2D" opacity=".5">?</text>
      ${sunflower(90, 430, .8)}${sunflower(720, 440, .9, 6)}${redFlower(640, 434, .8)}${redFlower(180, 442, .7)}`);
  };

  /* 02 — La primera chispa (lo de "ratita") */
  scenes.chispa = () => {
    const [g, d] = skyGrad('#FCE1D4', '#FFF6E8');
    const bocadillo = (x, y, w, h, punta, fill, txt) => `
      <g transform="translate(${x},${y})">
        <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h / 2.6}" fill="${fill}"
          stroke="#E8D3B4" stroke-width="2.5"/>
        <path d="M${punta},${h / 2 - 2} l14,22 l6,-22 z" fill="${fill}"/>
        ${txt}
      </g>`;
    const t = (y, size, txt, fill = '#4A2C1A', w = '600') =>
      `<text x="0" y="${y}" text-anchor="middle" font-family="Quicksand, Nunito, Verdana, sans-serif"
        font-size="${size}" font-weight="${w}" fill="${fill}">${txt}</text>`;
    return frame(d, `
      <rect width="800" height="460" fill="url(#${g})"/>
      ${sun(120, 74)}${cloud(620, 70, .85, .8)}
      ${skyHearts(4, 120)}
      ${ground('#8FC46F', '#75AC59')}

      ${bocadillo(228, 92, 300, 74, -40, '#FFFFFF',
        t(-4, 23, 'Tu voz parece') + t(22, 23, 'de ratita…'))}
      <g transform="translate(96,92) scale(.9)" opacity=".85">
        <ellipse rx="16" ry="11" fill="#B9AFA6"/><circle cx="-11" cy="-9" r="7" fill="#B9AFA6"/>
        <circle cx="13" cy="-2" r="2" fill="#3A2317"/>
        <path d="M16,3 q10,6 18,2" stroke="#B9AFA6" stroke-width="2.5" fill="none"/>
        <path d="M-26,-18 L26,18 M26,-18 L-26,18" stroke="#D62828" stroke-width="5" stroke-linecap="round"/>
      </g>

      ${bocadillo(566, 176, 330, 78, 20, '#FFF0D6',
        t(-6, 23, 'no… mejor dicho:') + t(24, 27, '¡de ardillita!', '#D62828', '700'))}

      ${he({ x: 236, y: 250, s: 1.15, eyes: 'happy', arms: 'up' })}
      ${she({ x: 520, y: 250, s: 1.15, flip: true, eyes: 'open', arms: 'up' })}
      <g class="pulse">${heart(400, 268, 2.2, C.red, .9)}</g>
      ${sunflower(60, 452, .9)}${sunflower(744, 458, .95)}
      ${redFlower(150, 450, .78)}${redFlower(660, 452, .8)}`);
  };

  /* 03 — Termales de Papallacta: el agua caliente y los masajes, todo ahí mismo */
  scenes.termales = () => {
    const [g, d] = skyGrad('#A9CFE3', '#E8F3EC');
    let vapor = '';
    for (let i = 0; i < 11; i++) {
      const x = 60 + i * 70, sc = rnd(.7, 1.35);
      vapor += `<g class="float" style="--d:${(i * .48).toFixed(1)}s" opacity="${rnd(.28, .6)}">
        <path d="M${x},318 q-16,-36 2,-64 q18,-30 0,-60" stroke="#FFFFFF" stroke-width="${10 * sc}"
          fill="none" stroke-linecap="round"/></g>`;
    }
    let burbujas = '';
    for (let i = 0; i < 24; i++)
      burbujas += `<circle cx="${rnd(70, 740)}" cy="${rnd(330, 432)}" r="${rnd(2, 6)}" fill="#fff" opacity="${rnd(.3, .7)}"/>`;

    return frame(d, `
      <rect width="800" height="460" fill="url(#${g})"/>
      ${cloud(180, 58, .8, .55)}${cloud(640, 48, .7, .45)}

      <!-- montañas -->
      <path d="M-40,250 L130,96 L250,192 L360,70 L470,186 L600,86 L740,200 L860,130 L860,300 L-40,300 Z" fill="#6E7F86"/>
      <path d="M130,96 L168,130 L96,130 Z M360,70 L400,110 L318,110 Z M600,86 L640,128 L558,128 Z" fill="#F2F6F8"/>
      <path d="M-40,300 L120,206 L280,286 L420,200 L560,282 L700,212 L860,288 L860,340 L-40,340 Z" fill="#4F6B58"/>
      <path d="M-40,336 L860,336 L860,460 L-40,460 Z" fill="#3E5B49"/>

      <!-- borde de piedra y poza -->
      <path d="M40,320 q120,-22 260,-8 q160,16 300,-4 q100,-14 180,4 l0,34 l-740,0 z" fill="#8A7A66"/>
      <rect x="54" y="338" width="692" height="112" rx="40" fill="#2E9A94"/>
      <rect x="54" y="338" width="692" height="112" rx="40" fill="#55BDB4" opacity=".62"/>
      ${burbujas}
      ${[...Array(6)].map((_, i) => `<ellipse cx="${[30,116,706,768,20,754][i]}" cy="${[332,320,320,334,354,354][i]}"
        rx="${rnd(16,30)}" ry="${rnd(10,18)}" fill="#7C6E5E"/>`).join('')}

      <!-- él detrás, ella adelante: el masaje dentro del agua -->
      ${he({ x: 314, y: 178, s: 1.0, eyes: 'happy', arms: 'down' })}
      ${she({ x: 352, y: 222, s: 1.12, eyes: 'closed', arms: 'down' })}
      <g>
        <ellipse cx="398" cy="302" rx="14" ry="10.5" fill="#C4713A" transform="rotate(-16 398 302)"/>
        <ellipse cx="398" cy="302" rx="8.5" ry="6" fill="#E2A165" transform="rotate(-16 398 302)" opacity=".8"/>
        <ellipse cx="452" cy="299" rx="14" ry="10.5" fill="#C4713A" transform="rotate(14 452 299)"/>
        <ellipse cx="452" cy="299" rx="8.5" ry="6" fill="#E2A165" transform="rotate(14 452 299)" opacity=".8"/>
      </g>

      <!-- la superficie del agua les tapa de la cintura para abajo -->
      <rect x="54" y="352" width="692" height="98" rx="34" fill="#2E9A94" opacity=".62"/>
      <path d="M78,368 q30,-11 60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0"
        stroke="#BFEDE6" stroke-width="4.5" fill="none" opacity=".75"/>
      <path d="M78,404 q30,-10 60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0"
        stroke="#BFEDE6" stroke-width="3.5" fill="none" opacity=".5"/>

      ${vapor}
      <g opacity=".55">${heart(400, 120, 1.9, C.red, .8)}${heart(322, 148, 1.1, '#F2708C', .7)}</g>
      ${sunflower(24, 344, .7)}${redFlower(778, 346, .7)}`);
  };

  /* 05 — Zoológico */
  scenes.zoo = () => {
    const [g, d] = skyGrad('#CFEAF6', '#F3F6E4');
    return frame(d, `
      <rect width="800" height="460" fill="url(#${g})"/>
      ${sun(90, 70)}${cloud(560, 78, .9, .8)}
      ${ground('#8CC46B', '#72A857')}
      <g opacity=".95">
        <path d="M600,372 L600,180 C600,150 640,144 652,168 C660,184 646,196 638,190" fill="none" stroke="#E7B84B" stroke-width="24" stroke-linecap="round"/>
        <circle cx="660" cy="166" r="20" fill="#E7B84B"/>
        <circle cx="654" cy="160" r="3" fill="#3A2317"/>
        <path d="M648,148 l-3,-12 M664,148 l4,-12" stroke="#E7B84B" stroke-width="5" stroke-linecap="round"/>
        <circle cx="608" cy="230" r="8" fill="#B8862F"/><circle cx="600" cy="280" r="9" fill="#B8862F"/>
        <circle cx="606" cy="330" r="8" fill="#B8862F"/>
      </g>
      <g transform="translate(150,300)">
        <path d="M0,72 L0,20 C0,4 14,-2 22,8 C28,16 20,24 14,20" fill="none" stroke="#F58AA8" stroke-width="10" stroke-linecap="round"/>
        <ellipse cx="-12" cy="30" rx="26" ry="18" fill="#F58AA8"/>
        <circle cx="26" cy="4" r="8" fill="#F58AA8"/><circle cx="29" cy="2" r="2" fill="#3A2317"/>
        <path d="M32,4 l10,4 -10,3 z" fill="#3A2317"/>
      </g>
      <path d="M300,372 L300,262 M340,372 L340,262 M380,372 L380,262 M420,372 L420,262 M460,372 L460,262 M500,372 L500,262" stroke="#8C7A66" stroke-width="5" opacity=".45"/>
      <path d="M290,268 L510,268" stroke="#8C7A66" stroke-width="6" opacity=".45"/>
      ${he({ x: 300, y: 250, s: 1.05, eyes: 'happy', arms: 'side' })}
      ${she({ x: 412, y: 250, s: 1.05, eyes: 'happy', arms: 'up' })}
      <g transform="translate(560,258) rotate(12)">
        <path d="M0,0 l14,0 -7,30 z" fill="#E8B77A"/>
        <circle cx="4" cy="-6" r="8" fill="#F7A8C4"/><circle cx="11" cy="-8" r="7" fill="#FFF0B8"/>
      </g>
      ${sunflower(58, 440, .8)}${redFlower(740, 436, .8)}`);
  };

  /* 06 — Miradores de Quito */
  scenes.quito = () => {
    const [g, d] = skyGrad('#1B2A52', '#5C4A78');
    let lights = '';
    for (let i = 0; i < 260; i++)
      lights += `<rect x="${rnd(0, 800)}" y="${rnd(268, 400)}" width="${rnd(2, 4)}" height="${rnd(2, 4)}" fill="#FFD98A" opacity="${rnd(.3, 1)}"/>`;
    let stars = '';
    for (let i = 0; i < 46; i++) stars += star(rnd(10, 790), rnd(10, 220), rnd(.6, 1.5), rnd(.4, 1));
    return frame(d, `
      <rect width="800" height="460" fill="url(#${g})"/>
      ${stars}
      <circle cx="132" cy="84" r="34" fill="#FFF4CF"/><circle cx="118" cy="74" r="30" fill="#2A3560" opacity=".92"/>
      <path d="M0,290 L120,220 L240,272 L360,206 L470,268 L580,214 L700,266 L800,228 L800,460 L0,460 Z" fill="#26224A"/>
      ${lights}
      <g transform="translate(360,150)" opacity=".9">
        <path d="M0,58 L-14,14 L0,-16 L14,14 Z" fill="#3A3566"/>
        <circle cx="0" cy="-24" r="9" fill="#3A3566"/>
        <path d="M-22,0 q22,-18 44,0" stroke="#3A3566" stroke-width="5" fill="none"/>
      </g>
      <path d="M0,404 L800,404 L800,460 L0,460 Z" fill="#141329"/>
      <rect x="0" y="396" width="800" height="12" rx="6" fill="#2B2946"/>
      ${he({ x: 300, y: 286, s: .95, eyes: 'happy', arms: 'side' })}
      ${she({ x: 404, y: 286, s: .95, eyes: 'happy', arms: 'hug' })}
      ${skyHearts(5, 150)}
      ${redFlower(70, 452, .7)}${sunflower(736, 460, .7)}`);
  };

  /* 07 — La tormenta */
  scenes.tormenta = () => {
    const [g, d] = skyGrad('#3E4550', '#6B7280');
    let rain = '';
    for (let i = 0; i < 90; i++) {
      const x = rnd(0, 820), y = rnd(-20, 460);
      rain += `<path d="M${x},${y} l-6,18" stroke="#AEBECD" stroke-width="2" opacity="${rnd(.3, .8)}"/>`;
    }
    const bolt = (x, y, s) => `<path transform="translate(${x},${y}) scale(${s})" fill="#FFD447" opacity=".9"
      d="M0,0 L-16,26 L-3,26 L-9,52 L18,20 L4,20 L14,0 Z"/>`;
    return frame(d, `
      <rect width="800" height="460" fill="url(#${g})"/>
      ${cloud(160, 70, 1.3, .9, '#4E5663')}${cloud(430, 50, 1.5, .9, '#434B58')}${cloud(690, 82, 1.2, .9, '#4E5663')}
      ${bolt(122, 108, .78)}${bolt(268, 92, 1.15)}${bolt(412, 120, .62)}${bolt(556, 98, .95)}${bolt(688, 114, .7)}${bolt(212, 138, .5)}
      ${rain}
      ${ground('#5F6B55', '#4E5A47')}
      ${he({ x: 210, y: 240, s: 1.15, flip: true, eyes: 'sad', arms: 'down', tears: true, fur: '#8E6238', furD: '#6F4A29', furL: '#A87B4E' })}
      ${she({ x: 500, y: 240, s: 1.15, eyes: 'sad', arms: 'down', tears: true, fur: '#9C6C43', furD: '#7A5231', furL: '#B58757' })}
      <path d="M400,244 l-10,34 l14,26 l-12,32 l10,26" stroke="#2E333B" stroke-width="7" fill="none" stroke-linecap="round" opacity=".85"/>
      ${corazonRoto(400, 186, 3.6, '#8E3B44', .92)}
      ${redFlower(96, 452, .7)}${redFlower(716, 456, .65)}`);
  };

  /* 08 — Volver */
  scenes.volver = () => {
    const [g, d] = skyGrad('#8FC9E8', '#FDF3E0');
    const rb = id('rb');
    return frame(`${d}<linearGradient id="${rb}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E5484D"/><stop offset="25%" stop-color="#F6B800"/>
      <stop offset="50%" stop-color="#6BC46A"/><stop offset="75%" stop-color="#4FA3D9"/>
      <stop offset="100%" stop-color="#9B72CF"/></linearGradient>`, `
      <rect width="800" height="460" fill="url(#${g})"/>
      <path d="M90,400 A310,310 0 0 1 710,400" fill="none" stroke="url(#${rb})" stroke-width="34" opacity=".55"/>
      ${cloud(120, 130, 1.1, .95)}${cloud(690, 118, 1, .9)}
      ${sun(660, 76)}
      ${ground('#8FC46F', '#75AC59')}
      ${he({ x: 268, y: 232, s: 1.25, eyes: 'closed', arms: 'hug' })}
      ${she({ x: 452, y: 232, s: 1.25, flip: true, eyes: 'closed', arms: 'hug' })}
      <g class="pulse">${corazonCurado(400, 214, 2.9)}</g>
      ${[...Array(10)].map((_, i) => petal(rnd(60, 740), rnd(120, 340), rnd(.8, 1.5), rnd(0, 180), C.red, rnd(.4, .85))).join('')}
      ${sunflower(64, 452, .95)}${sunflower(744, 458, 1)}${redFlower(160, 448, .8)}${redFlower(648, 452, .8)}`);
  };

  /* Mi ardillita (pétalos que forman las palabras) */
  scenes.ardillita = () => {
    const [g, d] = skyGrad('#FDE9D2', '#FFF8EE');
    const m = id('mask');
    const rojos = ['#D62828', '#B81E1E', '#9E1B1B', '#E8453F', '#C22525', '#A81C1C'];
    // Muchos pétalos, bien apretados, para que las letras se lean sólidas
    let petalos = '';
    for (let i = 0; i < 1300; i++)
      petalos += petal(rnd(20, 780), rnd(50, 330), rnd(.7, 1.35), rnd(0, 180),
        rojos[(Math.random() * rojos.length) | 0], rnd(.85, 1));

    const letras = (fill, extra = '') => `
      <text x="400" y="176" text-anchor="middle" font-family="Quicksand, Nunito, Verdana, sans-serif"
        font-size="122" font-weight="700" fill="${fill}" ${extra}>Mi</text>
      <text x="400" y="292" text-anchor="middle" font-family="Quicksand, Nunito, Verdana, sans-serif"
        font-size="114" font-weight="700" fill="${fill}" ${extra}>Ardillita</text>`;

    return frame(`${d}<mask id="${m}"><rect width="800" height="460" fill="#000"/>${letras('#fff')}</mask>`, `
      <rect width="800" height="460" fill="url(#${g})"/>
      ${[...Array(9)].map((_, i) => sunflower(20 + i * 98, 476, rnd(.72, 1), rnd(-8, 8))).join('')}

      <!-- sombra suave para despegar las letras del fondo -->
      <g opacity=".16" transform="translate(5,7)">${letras('#7A3B22')}</g>

      <g mask="url(#${m})">
        <rect width="800" height="460" fill="#C41F1F"/>
        ${petalos}
      </g>

      <!-- pétalos sueltos alrededor, fuera de las letras -->
      ${[...Array(26)].map(() => petal(rnd(20, 780), rnd(340, 452), rnd(.7, 1.4), rnd(0, 180), C.red, rnd(.45, .95))).join('')}
      ${[...Array(10)].map(() => petal(rnd(20, 780), rnd(20, 60), rnd(.6, 1.1), rnd(0, 180), C.red, rnd(.3, .7))).join('')}

      ${he({ x: 70, y: 330, s: .88, eyes: 'happy', arms: 'up' })}
      ${she({ x: 632, y: 330, s: .88, flip: true, eyes: 'happy', arms: 'up' })}`);
  };

  /* 10 — Tu día y el nuestro (sin nombrar la segunda fecha) */
  scenes.calendario = () => {
    const [g, d] = skyGrad('#E8F1FB', '#FFF6EA');
    const hoja = (x, y, contenido, label, accent) => `
      <g transform="translate(${x},${y})">
        <rect x="-78" y="-96" width="156" height="192" rx="18" fill="#fff" stroke="#E3D6C4" stroke-width="3"/>
        <rect x="-78" y="-96" width="156" height="44" rx="18" fill="${accent}"/>
        <rect x="-78" y="-70" width="156" height="18" fill="${accent}"/>
        <text x="0" y="-64" text-anchor="middle" font-family="Quicksand, Nunito, Verdana, sans-serif"
          font-size="22" font-weight="700" fill="#fff">SEP</text>
        ${contenido}
        <text x="0" y="72" text-anchor="middle" font-family="Quicksand, Nunito, Verdana, sans-serif"
          font-size="20" fill="#8A6A4E">${label}</text>
        <circle cx="-40" cy="-100" r="7" fill="#C9B79E"/><circle cx="40" cy="-100" r="7" fill="#C9B79E"/>
      </g>`;

    const numero = `<text x="0" y="34" text-anchor="middle" font-family="Quicksand, Nunito, Verdana, sans-serif"
      font-size="86" font-weight="700" fill="#4A2C1A">21</text>`;

    // La segunda hoja no lleva número: lleva un corazón marcado a mano
    const marcado = `
      <g transform="translate(0,4)">
        <path d="M-52,-26 q52,-16 104,4" stroke="#F0C7C7" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M-52,36 q52,14 104,-6" stroke="#F0C7C7" stroke-width="3" fill="none" stroke-linecap="round"/>
        ${heart(0, 8, 3.2, '#D62828', .95)}
        <path d="M-46,6 a46,34 0 1 0 92,-6 a46,34 0 1 0 -92,6" stroke="#D62828" stroke-width="3.5"
          fill="none" opacity=".55" stroke-linecap="round"/>
      </g>`;

    let camino = '';
    for (let i = 0; i < 9; i++)
      camino += heart(300 + i * 26, 220 - Math.sin(i / 8 * Math.PI) * 60, .9 + (i % 3) * .25,
        i % 2 ? C.red : '#F2708C', .85);

    return frame(d, `
      <rect width="800" height="460" fill="url(#${g})"/>
      ${cloud(120, 66, .9, .8)}${cloud(680, 74, .9, .8)}
      ${ground('#8FC46F', '#75AC59')}
      ${hoja(190, 200, numero, 'tu día', C.sun)}
      ${hoja(610, 200, marcado, 'el nuestro', C.red)}
      ${camino}
      ${he({ x: 470, y: 320, s: .82, eyes: 'happy', arms: 'up' })}
      ${she({ x: 246, y: 320, s: .82, flip: true, eyes: 'happy', arms: 'up' })}
      ${sunflower(48, 458, .85)}${redFlower(760, 452, .8)}`);
  };

  /* 11 — Feliz cumpleaños */
  scenes.pastel = () => {
    const [g, d] = skyGrad('#FFE9CF', '#FFF9F0');
    let conf = '';
    for (let i = 0; i < 70; i++) {
      const cs = [C.red, C.sun, '#F2708C', '#6BC46A', '#4FA3D9'][i % 5];
      conf += `<rect x="${rnd(0, 800)}" y="${rnd(0, 330)}" width="${rnd(5, 11)}" height="${rnd(5, 11)}"
        rx="2" fill="${cs}" opacity="${rnd(.5, .95)}" transform="rotate(${rnd(0, 90)} 400 200)"/>`;
    }
    return frame(d, `
      <rect width="800" height="460" fill="url(#${g})"/>
      ${conf}${skyHearts(5, 140)}
      ${ground('#8FC46F', '#75AC59')}
      <g transform="translate(400,364)">
        <rect x="-96" y="-10" width="192" height="16" rx="8" fill="#C9A17C"/>
        <rect x="-86" y="-58" width="172" height="50" rx="10" fill="#F7C9D8"/>
        <rect x="-70" y="-100" width="140" height="44" rx="10" fill="#FFE3B0"/>
        <path d="M-86,-58 q22,14 43,0 q21,-14 43,0 q21,14 43,0 q21,-14 43,0" fill="#fff" opacity=".85"/>
        <path d="M-70,-100 q18,12 35,0 q17,-12 35,0 q18,12 35,0 q17,-12 35,0" fill="#fff" opacity=".8"/>
        <rect x="-4" y="-132" width="8" height="32" rx="4" fill="#E5484D"/>
        <ellipse cx="0" cy="-140" rx="7" ry="12" fill="#FFB43F" class="pulse"/>
        <ellipse cx="0" cy="-137" rx="3.4" ry="6" fill="#FFF0B0"/>
      </g>
      ${he({ x: 178, y: 246, s: 1.1, eyes: 'happy', arms: 'up' })}
      ${she({ x: 540, y: 246, s: 1.1, flip: true, eyes: 'happy', arms: 'up' })}
      ${sunflower(52, 456, .95)}${sunflower(752, 460, 1)}
      ${redFlower(140, 452, .8)}${redFlower(664, 456, .8)}`);
  };

  /* Pareja del hero */
  scenes.hero = () => {
    const [g, d] = skyGrad('#FFE4CB', '#FFF8EE');
    return frame(d, `
      <rect width="800" height="460" fill="url(#${g})" opacity="0"/>
      ${skyHearts(6, 130)}
      ${he({ x: 236, y: 220, s: 1.35, eyes: 'happy', arms: 'up' })}
      ${she({ x: 470, y: 220, s: 1.35, flip: true, eyes: 'happy', arms: 'up' })}
      <g class="pulse">${heart(400, 200, 2.4, C.red, .9)}</g>
      ${sunflower(70, 460, 1.05)}${sunflower(740, 460, 1.1, 5)}
      ${redFlower(180, 456, .85)}${redFlower(636, 458, .9)}`);
  };

  /* Las cartitas de papel, escritas a mano */
  scenes.cartas = () => {
    const [g, d] = skyGrad('#FDEFD8', '#FFF9F0');
    const renglon = (x, y, w, sw = 3.4, op = .8) =>
      `<path d="M${x},${y} q${w * .18},-4 ${w * .36},0 t${w * .32},0 t${w * .32},-1"
        stroke="#6E86B8" stroke-width="${sw}" fill="none" stroke-linecap="round" opacity="${op}"/>`;
    const notita = (x, y, rot, sc) => `
      <g transform="translate(${x},${y}) rotate(${rot}) scale(${sc})">
        <rect x="-52" y="-38" width="104" height="76" rx="6" fill="#FFFDF4" stroke="#E8DCC4" stroke-width="2.5"/>
        <path d="M52,-38 L52,-18 L32,-38 Z" fill="#EFE4CC"/>
        ${renglon(-38, -18, 72, 3, .65)}${renglon(-38, -4, 64, 3, .65)}${renglon(-38, 10, 70, 3, .65)}
        ${heart(30, 24, .9, '#D62828', .8)}
      </g>`;
    return frame(d, `
      <rect width="800" height="460" fill="url(#${g})"/>
      ${skyHearts(4, 110)}
      ${notita(96, 118, -14, .85)}${notita(694, 96, 12, .8)}${notita(742, 300, -8, .62)}
      ${notita(60, 306, 9, .6)}

      <!-- la carta grande, en el centro -->
      <g transform="translate(400,196) rotate(-3)">
        <rect x="-150" y="-112" width="300" height="224" rx="12" fill="#FFFDF4"
          stroke="#E8DCC4" stroke-width="3"/>
        <path d="M150,-112 L150,-70 L108,-112 Z" fill="#EFE4CC"/>
        <text x="-114" y="-66" font-family="Quicksand, Nunito, Verdana, sans-serif" font-size="26"
          font-weight="700" fill="#D62828">Para ti,</text>
        ${renglon(-114, -34, 226)}${renglon(-114, -8, 210)}${renglon(-114, 18, 232)}
        ${renglon(-114, 44, 180)}${renglon(-114, 70, 206)}
        ${heart(112, 84, 1.5, '#D62828', .9)}
        <path d="M-116,92 q26,-8 46,-2" stroke="#D62828" stroke-width="3" fill="none" stroke-linecap="round"/>
      </g>

      ${ground('#8FC46F', '#75AC59')}
      ${he({ x: 128, y: 326, s: .92, eyes: 'happy', arms: 'up' })}
      ${she({ x: 588, y: 326, s: .92, flip: true, eyes: 'happy', arms: 'up' })}
      ${sunflower(40, 456, .82)}${redFlower(764, 452, .78)}`);
  };

  /* Girasol del candado — grande, con candadito en el centro */
  scenes.candado = () => {
    let abejas = '';
    for (let i = 0; i < 3; i++) {
      const bx = [64, 246, 218][i], by = [150, 96, 250][i];
      abejas += `<g class="float" style="--d:${i * 0.9}s" transform="translate(${bx},${by})">
        <ellipse rx="7" ry="5.4" fill="#F6B800"/>
        <path d="M-3,-5 L-3,5 M2,-5 L2,5" stroke="#3A2317" stroke-width="2"/>
        <ellipse cx="-1" cy="-6" rx="5" ry="3" fill="#fff" opacity=".7"/></g>`;
    }
    return `<svg class="scene-svg" viewBox="0 0 300 380" role="img" xmlns="http://www.w3.org/2000/svg">
      ${abejas}
      ${sunflower(150, 372, 2.15)}
      <g transform="translate(150,174) scale(1.15)">
        <path d="M-17,-6 L-17,-22 A17,17 0 0 1 17,-22 L17,-6" fill="none" stroke="#E8D3B4" stroke-width="9" stroke-linecap="round"/>
        <rect x="-27" y="-7" width="54" height="44" rx="11" fill="#F3E2C8"/>
        <rect x="-27" y="-7" width="54" height="13" rx="6" fill="#FFF1DC"/>
        ${heart(0, 18, 1.35, '#D62828', .95)}
      </g>
    </svg>`;
  };

  return { scenes, squirrel, he, she, sunflower, redFlower, heart, petal, C };
})();
