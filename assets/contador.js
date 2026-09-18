/* ===========================================================
   contador.js — la vista de /counter
   =========================================================== */

const $$$ = (s) => document.querySelector(s);
let VISITAS = [];

/* ---- puerta ---- */
function abrirPuerta() {
  const intento = $$$('#clave').value.trim();
  if (intento !== VISITAS_CONFIG.clave) {
    $$$('#mal').textContent = 'No es esa.';
    $$$('#clave').value = '';
    return;
  }
  try { sessionStorage.setItem('counter-ok', '1'); } catch {}
  mostrarPanel();
}

function mostrarPanel() {
  $$$('#puerta').hidden = true;
  $$$('#panel').hidden = false;
  cargar();
}

/* ---- datos ---- */
async function cargar() {
  const destino = $$$('#contenido');
  try {
    VISITAS = await leerVisitas();
    VISITAS.sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
    pintarFichas();
    pintarTabla();
    $$$('#resumen').textContent =
      `${VISITAS.length} visitas registradas · backend: ${VISITAS_CONFIG.backend}`;
  } catch (e) {
    $$$('#fichas').innerHTML = '';
    $$$('#resumen').textContent = '';
    destino.innerHTML = e.message === 'sin-backend' ? avisoSinBackend() :
      `<div class="aviso"><strong>No se pudieron leer las visitas.</strong><br>${e.message}</div>`;
  }
}

function avisoSinBackend() {
  return `<div class="aviso">
    <strong>Todavía no hay nada que contar.</strong>
    <p>GitHub Pages es hosting estático: sirve archivos y ya. No hay ningún
    servidor del lado del sitio que pueda ver la IP de quien entra, así que el
    registro necesita apoyarse en algo externo.</p>
    <p>Mientras <code>VISITAS_CONFIG.backend</code> siga en <code>'ninguno'</code>,
    la página no registra ni envía absolutamente nada. En
    <code>assets/visitas.js</code> están listos los dos caminos posibles
    (<code>'worker'</code> y <code>'firebase'</code>); falta elegir uno y
    rellenar sus datos.</p>
  </div>`;
}

/* ---- resumen ---- */
function pintarFichas() {
  const ips = new Set(VISITAS.map((v) => v.ip).filter(Boolean));
  const hoy = new Date().toISOString().slice(0, 10);
  const deHoy = VISITAS.filter((v) => String(v.fecha).slice(0, 10) === hoy).length;
  const ultima = VISITAS[0] ? fechaBonita(VISITAS[0].fecha) : '—';

  const fichas = [
    [VISITAS.length, 'visitas'],
    [ips.size || '—', 'IP distintas'],
    [deHoy, 'hoy'],
    [ultima, 'la última'],
  ];
  $$$('#fichas').innerHTML = fichas.map(([n, l]) =>
    `<div class="ficha"><div class="n">${n}</div><div class="l">${l}</div></div>`).join('');
}

/* ---- tabla ---- */
function pintarTabla() {
  if (!VISITAS.length) {
    $$$('#contenido').innerHTML =
      '<div class="aviso">El backend responde, pero todavía no entró nadie.</div>';
    return;
  }
  const filas = VISITAS.map((v) => `<tr>
    <td>${fechaBonita(v.fecha)}</td>
    <td class="ip">${esc(v.ip || '—')}</td>
    <td>${esc([v.bandera, v.ciudad, v.region, v.pais].filter(Boolean).join(' ') || '—')}</td>
    <td>${esc(v.dispositivo || '—')}</td>
    <td>${esc(v.proveedor || '—')}</td>
    <td>${esc(v.referencia || '—')}</td>
    <td>${esc(v.pagina || '—')}</td>
  </tr>`).join('');

  $$$('#contenido').innerHTML = `<div class="envoltura"><table>
    <thead><tr><th>Cuándo</th><th>IP</th><th>Dónde</th><th>Dispositivo</th>
    <th>Proveedor</th><th>Llegó desde</th><th>Página</th></tr></thead>
    <tbody>${filas}</tbody></table></div>`;
}

const esc = (t) => String(t).replace(/[<>&"]/g, (c) =>
  ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));

function fechaBonita(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return String(iso || '—');
  return d.toLocaleString('es-EC', { day: '2-digit', month: 'short',
    hour: '2-digit', minute: '2-digit' });
}

/* ---- CSV ---- */
function bajarCsv() {
  if (!VISITAS.length) return;
  const cols = ['fecha', 'ip', 'ciudad', 'region', 'pais', 'proveedor',
                'dispositivo', 'referencia', 'pagina', 'idioma', 'zona', 'pantalla'];
  const linea = (o) => cols.map((c) => `"${String(o[c] ?? '').replace(/"/g, '""')}"`).join(',');
  const csv = [cols.join(','), ...VISITAS.map(linea)].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  a.download = 'visitas.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ---- arranque ---- */
document.addEventListener('DOMContentLoaded', () => {
  $$$('#entrar').addEventListener('click', abrirPuerta);
  $$$('#clave').addEventListener('keydown', (e) => { if (e.key === 'Enter') abrirPuerta(); });
  $$$('#recargar').addEventListener('click', cargar);
  $$$('#csv').addEventListener('click', bajarCsv);
  try { if (sessionStorage.getItem('counter-ok')) mostrarPanel(); } catch {}
});
