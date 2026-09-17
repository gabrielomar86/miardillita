/* ===========================================================
   app.js — lógica de la página
   =========================================================== */

/* -----------------------------------------------------------
   ⚙️  CONFIGURACIÓN — edita solo estas líneas
   ----------------------------------------------------------- */
const CONFIG = {
  nombre:       'Ardillita',                 // cómo la llamas
  apertura:     '2026-09-21T00:00:00',       // la página se abre aquí (21 sept, 00:00)
  reencuentro:  '2026-09-25T00:00:00',       // el día que se ven
  aniversario:  '2024-09-01',                // desde cuándo están juntos (AAAA-MM-DD)
  nacimiento:   '',                          // opcional: AAAA-MM-DD para mostrar la edad

  // 🧪 PRUEBA: ignora la fecha real y hace que el candado se abra en X segundos.
  //    Ponlo en 0 (o null) cuando quieras dejarla lista de verdad.
  demoSegundos: 20,

  // 📸 Fotos. La primera sale grande arriba; el resto, en la galería.
  // Copia tus imágenes a  assets/fotos/  y escribe aquí sus nombres.
  fotos: [
    'assets/fotos/ardillitas.jpg',           // <- la ilustración del abrazo
    // 'assets/fotos/piscina.jpg',
    // 'assets/fotos/mirador.jpg',
  ],
};
/* Para ver la página antes del 21, abre el archivo con  ?preview=1  al final. */

/* -----------------------------------------------------------
   Capítulos
   ----------------------------------------------------------- */
const CAPITULOS = [
  { escena:'desconocidos', titulo:'Dos desconocidos',
    texto:'Había una vez dos ardillas en el mismo árbol que todavía no se conocían. Nada especial, nada anunciado. Solo el día en que, sin saberlo, empezó todo.' },

  { escena:'chispa', titulo:'La ratita que era ardillita',
    texto:'Lo nuestro empezó rarísimo: le dije que su voz parecía de ratita. Me corregí al toque — de ardilla, más bien. Ardillita. Y así se quedó, para siempre.' },

  { escena:'termales', titulo:'Papallacta',
    texto:'Agua caliente, vapor subiendo y las montañas alrededor. Ahí mismo, los masajes y los silencios buenos. Descubrimos que en esa poza el mundo se queda afuera.' },

  { escena:'cartas', titulo:'Cartitas de papel',
    texto:'Papelitos escritos a mano, doblados, entregados así nomás. Cosas que en el celular no caben.' },

  { escena:'zoo', titulo:'El zoológico',
    texto:'Fuimos a ver animales y terminamos siendo los dos más felices del lugar.' },

  { escena:'quito', titulo:'Los miradores',
    texto:'Quito entero encendido allá abajo… y yo mirándote a ti.' },

  { escena:'tormenta', titulo:'La tormenta', oscuro:true,
    texto:'También hubo días grises. Dolieron, no lo voy a negar. Pero ninguno alcanzó a borrar el camino que ya habíamos hecho.' },

  { escena:'volver', titulo:'Volver',
    texto:'Y siempre, siempre, encontramos la forma de volver. Eso también es amor: quedarse después de la lluvia.' },

  { escena:'ardillita', titulo:'Mi ardillita',
    texto:'Recogí todos los pétalos rojos del camino y, al soltarlos, solo se formaron dos palabras.' },

  { escena:'calendario', titulo:'Tu día y el nuestro',
    texto:'Tu cumpleaños es el 21, y nuestro abrazo llega poquito después. Y está bien: la fecha es apenas un número en una pared. Lo que cuenta son los detalles, las ganas y todo lo que ya te estoy guardando.' },

  { escena:'pastel', titulo:'Feliz cumpleaños',
    texto:'Dos años, mil aventuras y un montón de girasoles. Gracias por todo esto. Te amo, ardillita.' },
];

/* -----------------------------------------------------------
   Utilidades
   ----------------------------------------------------------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const pad = (n) => String(n).padStart(2, '0');
const preview = new URLSearchParams(location.search).has('preview');

function diffPartes(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 };
}

function mesesEntre(desde, hasta) {
  let m = (hasta.getFullYear() - desde.getFullYear()) * 12 + (hasta.getMonth() - desde.getMonth());
  if (hasta.getDate() < desde.getDate()) m--;
  return Math.max(0, m);
}

/* -----------------------------------------------------------
   Pétalos cayendo
   ----------------------------------------------------------- */
function lluviaDePetalos(n = 22) {
  const capa = $('#petalos');
  if (!capa) return;
  const formas = [
    `<svg width="18" height="12" viewBox="0 0 18 12"><ellipse cx="9" cy="6" rx="9" ry="5" fill="#D62828"/></svg>`,
    `<svg width="16" height="11" viewBox="0 0 16 11"><ellipse cx="8" cy="5.5" rx="8" ry="4.5" fill="#9E1B1B"/></svg>`,
    `<svg width="15" height="11" viewBox="0 0 15 11"><ellipse cx="7.5" cy="5.5" rx="7.5" ry="4.5" fill="#F6B800"/></svg>`,
  ];
  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    el.className = 'petalo';
    el.innerHTML = formas[Math.floor(Math.random() * formas.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.setProperty('--dx', (Math.random() * 220 - 110).toFixed(0) + 'px');
    el.style.animationDuration = (9 + Math.random() * 11).toFixed(1) + 's';
    el.style.animationDelay = (-Math.random() * 18).toFixed(1) + 's';
    el.style.opacity = (0.5 + Math.random() * 0.5).toFixed(2);
    capa.appendChild(el);
  }
}

/* Corazones al tocar la pantalla */
function corazonesAlTocar() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('a,button')) return;
    const capa = $('#petalos');
    for (let i = 0; i < 6; i++) {
      const el = document.createElement('div');
      el.style.cssText = `position:absolute;left:${e.clientX}px;top:${e.clientY}px;pointer-events:none;
        transition:transform 1s cubic-bezier(.2,.7,.3,1),opacity 1s ease;font-size:${12 + Math.random() * 16}px`;
      el.textContent = ['❤️', '🌻', '🌹'][i % 3];
      capa.appendChild(el);
      requestAnimationFrame(() => {
        el.style.transform = `translate(${(Math.random() * 160 - 80).toFixed(0)}px,${(-60 - Math.random() * 110).toFixed(0)}px) rotate(${Math.random() * 90 - 45}deg)`;
        el.style.opacity = '0';
      });
      setTimeout(() => el.remove(), 1100);
    }
  });
}

/* -----------------------------------------------------------
   Candado hasta el 21 a las 00:00
   ----------------------------------------------------------- */
function iniciarCandado(onAbrir) {
  const demo = Number(CONFIG.demoSegundos) > 0;
  const meta = demo
    ? Date.now() + Number(CONFIG.demoSegundos) * 1000
    : new Date(CONFIG.apertura).getTime();
  const candado = $('#candado');

  if (preview || Date.now() >= meta) { candado.remove(); onAbrir(); return; }

  if (demo) $('#candado-nota').innerHTML =
    '<em>Modo prueba: se abre en unos segundos.</em>';

  $('#candado-titulo').textContent = `Falta poquito, ${CONFIG.nombre}`;
  $('#candado-art').innerHTML = ART.scenes.candado();

  const tick = () => {
    const resta = meta - Date.now();
    if (resta <= 0) { clearInterval(t); candado.style.transition = 'opacity .8s ease';
      candado.style.opacity = '0'; setTimeout(() => { candado.remove(); onAbrir(); }, 800); return; }
    const { d, h, m, s } = diffPartes(resta);
    $('#c-d').textContent = d; $('#c-h').textContent = pad(h);
    $('#c-m').textContent = pad(m); $('#c-s').textContent = pad(s);
  };
  tick();
  const t = setInterval(tick, 1000);
}

/* -----------------------------------------------------------
   Construcción de la página
   ----------------------------------------------------------- */
function construir() {
  $('#nombre-hero').textContent = CONFIG.nombre;
  $('#hero-art').innerHTML = ART.scenes.hero();

  // Capítulos
  const cont = $('#capitulos');
  cont.innerHTML = CAPITULOS.map((c, i) => {
    const ultimo = i === CAPITULOS.length - 1;
    return `
    <article class="capitulo${c.oscuro ? ' oscuro' : ''}" id="cap-${i}">
      <span class="num">${pad(i + 1)}</span>
      <div class="lienzo">${ART.scenes[c.escena]()}</div>
      <div class="texto">
        <h4>${c.titulo}</h4>
        <p>${c.texto}</p>
        <button class="siguiente" data-ir="${ultimo ? 'carta' : 'cap-' + (i + 1)}">
          ${ultimo ? 'Leer la carta' : 'Siguiente capítulo'}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </div>
    </article>`;
  }).join('');

  // Cada botón lleva al siguiente capítulo
  $$('.siguiente').forEach((b) => b.addEventListener('click', () => {
    detenerRecorrido();
    const destino = b.dataset.ir === 'carta' ? $('.carta') : $('#' + b.dataset.ir);
    if (!destino) return;
    destino.classList.add('visible');
    destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  // Aparecer al hacer scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$('.capitulo').forEach((el) => io.observe(el));

  montarFotos();
  actualizarContadores();
  setInterval(actualizarContadores, 1000);
}

/* Fotos: se muestran solo las que existan de verdad */
function montarFotos() {
  const lista = (CONFIG.fotos || []).filter(Boolean);
  if (!lista.length) return;

  const seccion = $('#fotos');
  const galeria = $('#galeria');
  let cargadas = 0;

  lista.forEach((src, i) => {
    const img = new Image();
    img.src = src;
    img.alt = 'Nosotros';
    img.loading = 'lazy';
    img.onload = () => {
      cargadas++;
      seccion.hidden = false;
      if (i === 0) {
        const d = document.createElement('div');
        d.className = 'destacada';
        d.appendChild(img);
        seccion.insertBefore(d, galeria);
      } else {
        const f = document.createElement('figure');
        f.appendChild(img);
        galeria.appendChild(f);
      }
    };
    img.onerror = () => { if (!cargadas) seccion.hidden = true; };
  });
}

function actualizarContadores() {
  const ahora = new Date();

  // Tiempo juntos (redondeado: son cuentas aproximadas, no cronómetro)
  const ani = new Date(CONFIG.aniversario + 'T00:00:00');
  const dias = Math.floor((ahora - ani) / 86400000);
  const diasAprox = Math.round(dias / 10) * 10;
  const meses = mesesEntre(ani, ahora);
  $('#t-dias').textContent = '~' + diasAprox.toLocaleString('es-EC');
  $('#t-meses').textContent = '~' + meses;

  // Cuenta regresiva al reencuentro
  const re = new Date(CONFIG.reencuentro).getTime();
  const resta = re - ahora.getTime();
  const caja = $('#tarjeta-reencuentro');
  if (resta > 0) {
    const { d, h, m, s } = diffPartes(resta);
    $('#t-reencuentro').textContent = d > 0 ? `${d}d ${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(h)}:${pad(m)}:${pad(s)}`;
    $('#t-reencuentro-cap').textContent = 'para vernos';
  } else {
    $('#t-reencuentro').textContent = '¡Hoy!';
    $('#t-reencuentro-cap').textContent = 'nos vemos';
  }
  caja.hidden = false;

  // Edad (opcional)
  if (CONFIG.nacimiento) {
    const n = new Date(CONFIG.nacimiento + 'T00:00:00');
    let edad = ahora.getFullYear() - n.getFullYear();
    const cumpleYa = (ahora.getMonth() > n.getMonth()) ||
      (ahora.getMonth() === n.getMonth() && ahora.getDate() >= n.getDate());
    if (!cumpleYa) edad--;
    $('#t-edad').textContent = edad;
    $('#tarjeta-edad').hidden = false;
  }
}

/* -----------------------------------------------------------
   Recorrido guiado: pasa por cada imagen, una por una
   ----------------------------------------------------------- */
let recorrido = { activo:false, i:0, timer:null, parar:null };

function alternarRecorrido() {
  recorrido.activo ? detenerRecorrido() : iniciarRecorrido();
}

function iniciarRecorrido() {
  const paradas = [...$$('.capitulo'), $('.carta')].filter(Boolean);
  if (!paradas.length) return;

  recorrido.activo = true;
  recorrido.i = 0;
  $('#bajar-texto').textContent = 'Detener el recorrido';
  document.body.classList.add('en-recorrido');

  // Cualquier gesto del usuario corta el recorrido
  const corta = () => detenerRecorrido();
  recorrido.parar = corta;
  ['wheel', 'touchstart', 'keydown'].forEach((ev) =>
    window.addEventListener(ev, corta, { passive: true }));

  const paso = () => {
    if (!recorrido.activo) return;
    if (recorrido.i >= paradas.length) { detenerRecorrido(); return; }

    const el = paradas[recorrido.i];
    el.classList.add('visible', 'destacada-paso');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    recorrido.timer = setTimeout(() => {
      el.classList.remove('destacada-paso');
      recorrido.i++;
      paso();
    }, 3400);
  };
  paso();
}

function detenerRecorrido() {
  recorrido.activo = false;
  clearTimeout(recorrido.timer);
  if (recorrido.parar)
    ['wheel', 'touchstart', 'keydown'].forEach((ev) =>
      window.removeEventListener(ev, recorrido.parar));
  $$('.destacada-paso').forEach((el) => el.classList.remove('destacada-paso'));
  document.body.classList.remove('en-recorrido');
  const t = $('#bajar-texto');
  if (t) t.textContent = 'Míralas una por una';
}

/* -----------------------------------------------------------
   Arranque
   ----------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  lluviaDePetalos();
  corazonesAlTocar();
  iniciarCandado(construir);

  $('#bajar')?.addEventListener('click', (e) => { e.preventDefault(); alternarRecorrido(); });

  $('#boton-confeti')?.addEventListener('click', () => {
    lluviaDePetalos(40);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
