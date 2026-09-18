/* ===========================================================
   visitas.js — registro y lectura de visitas.

   GitHub Pages no tiene servidor, así que no puede ver por sí
   mismo quién entra. Este módulo habla con un backend externo,
   configurable en VISITAS_CONFIG. Mientras esté en 'ninguno'
   no registra ni envía nada.
   =========================================================== */

const VISITAS_CONFIG = {
  // 'ninguno' | 'worker' | 'firebase'
  backend: 'ninguno',

  // --- si backend === 'worker' (Cloudflare) ---
  // El servidor ve la IP directamente: es el método fiel.
  worker: {
    registrar: '/api/visita',
    listar:    '/api/visitas',
  },

  // --- si backend === 'firebase' ---
  // El navegador pregunta su propia IP a un servicio y la guarda.
  firebase: {
    proyecto:  '',            // id del proyecto de Firebase
    coleccion: 'visitas',
  },

  // De dónde saca la IP el navegador (solo hace falta con firebase)
  proveedorIp: 'https://ipwho.is/',

  // Contraseña de la página /counter. Es solo un estorbo, no seguridad
  // de verdad: quien mire el código la encuentra.
  clave: 'girasoles',
};

/* -----------------------------------------------------------
   Datos que se pueden recoger desde el navegador
   ----------------------------------------------------------- */
async function datosDeLaVisita() {
  const d = {
    fecha: new Date().toISOString(),
    pagina: location.pathname + location.search,
    referencia: document.referrer || '(directo)',
    idioma: navigator.language || '',
    pantalla: `${screen.width}x${screen.height}`,
    zona: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    dispositivo: describirDispositivo(),
  };

  if (VISITAS_CONFIG.backend === 'firebase') {
    try {
      const r = await fetch(VISITAS_CONFIG.proveedorIp, { cache: 'no-store' });
      const j = await r.json();
      Object.assign(d, {
        ip: j.ip || '',
        ciudad: j.city || '',
        region: j.region || '',
        pais: j.country || '',
        bandera: (j.flag && j.flag.emoji) || '',
        proveedor: (j.connection && j.connection.org) || '',
      });
    } catch { /* si falla, se registra la visita sin IP */ }
  }
  return d;
}

function describirDispositivo() {
  const ua = navigator.userAgent;
  const sistema =
    /iPhone|iPad|iPod/.test(ua) ? 'iOS' :
    /Android/.test(ua)          ? 'Android' :
    /Mac OS X/.test(ua)         ? 'Mac' :
    /Windows/.test(ua)          ? 'Windows' :
    /Linux/.test(ua)            ? 'Linux' : 'otro';
  const navegador =
    /Edg\//.test(ua)     ? 'Edge' :
    /OPR\//.test(ua)     ? 'Opera' :
    /Chrome\//.test(ua)  ? 'Chrome' :
    /Firefox\//.test(ua) ? 'Firefox' :
    /Safari\//.test(ua)  ? 'Safari' : 'otro';
  return `${sistema} · ${navegador}`;
}

/* -----------------------------------------------------------
   Registrar una visita
   ----------------------------------------------------------- */
async function registrarVisita() {
  const cfg = VISITAS_CONFIG;
  if (cfg.backend === 'ninguno') return;

  // Una sola vez por pestaña, para que recargar no infle la cuenta
  try {
    if (sessionStorage.getItem('visita-anotada')) return;
    sessionStorage.setItem('visita-anotada', '1');
  } catch { /* navegación privada: se registra igual */ }

  const d = await datosDeLaVisita();

  try {
    if (cfg.backend === 'worker') {
      await fetch(cfg.worker.registrar, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
        keepalive: true,
      });
    } else if (cfg.backend === 'firebase') {
      const url = `https://firestore.googleapis.com/v1/projects/${cfg.firebase.proyecto}` +
                  `/databases/(default)/documents/${cfg.firebase.coleccion}`;
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: aFirestore(d) }),
        keepalive: true,
      });
    }
  } catch (e) {
    console.debug('No se pudo registrar la visita', e);
  }
}

/* -----------------------------------------------------------
   Leerlas (lo usa /counter)
   ----------------------------------------------------------- */
async function leerVisitas() {
  const cfg = VISITAS_CONFIG;
  if (cfg.backend === 'worker') {
    const r = await fetch(cfg.worker.listar, { cache: 'no-store' });
    if (!r.ok) throw new Error('El servidor respondió ' + r.status);
    return await r.json();
  }
  if (cfg.backend === 'firebase') {
    const url = `https://firestore.googleapis.com/v1/projects/${cfg.firebase.proyecto}` +
                `/databases/(default)/documents/${cfg.firebase.coleccion}?pageSize=1000`;
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error('Firestore respondió ' + r.status);
    const j = await r.json();
    return (j.documents || []).map((doc) => desdeFirestore(doc.fields || {}));
  }
  throw new Error('sin-backend');
}

/* Conversión al formato con tipos que pide Firestore */
const aFirestore = (o) => Object.fromEntries(
  Object.entries(o).map(([k, v]) => [k, { stringValue: String(v) }]));
const desdeFirestore = (f) => Object.fromEntries(
  Object.entries(f).map(([k, v]) => [k, v.stringValue ?? v.integerValue ?? '']));
