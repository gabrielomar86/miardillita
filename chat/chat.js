/* ===========================================================
   chat/chat.js — chat volátil para dos personas.

   No hay historial: los mensajes viajan por el canal y no se
   guardan en ninguna base. Al recargar, la conversación empieza
   en blanco.

   Dos transportes, misma interfaz:
     · supabase — de verdad, entre dispositivos distintos.
     · local    — de prueba, entre dos pestañas del mismo
                  navegador (BroadcastChannel). Se usa solo
                  cuando config.js no tiene llaves.
   =========================================================== */
(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const params    = new URLSearchParams(location.search);
  const nombreSala = params.get('sala') || CHAT.sala;
  const hayLlaves = Boolean(CHAT.supabaseUrl && CHAT.supabaseKey);
  const CUPO      = CHAT.maxPersonas || 2;
  const FUERA     = (CHAT.tiempoFuera || 12) * 1000;

  const yo = {
    id: (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2)),
    nombre: '',
    av: 'ella',
    unido: Date.now(),
  };

  /* ---------- Ardillas ---------- */
  const OPC = {
    ella: { outfit: 'dress', flower: true, bow: true, fur: '#D08A4F', furD: '#A96334', furL: '#EDB782' },
    el:   { outfit: 'tee', pelo: 'mono' },
  };

  const cara = (av) =>
    `<svg viewBox="34 -6 62 76" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${ART.squirrel(Object.assign({}, OPC[av] || OPC.ella, { tail: false, eyes: 'happy', x: 0, y: 0, s: 1 }))}
    </svg>`;

  const pareja = () =>
    `<svg viewBox="-6 0 222 124" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${ART.she({ x: 0, y: 12, s: .82, arms: 'side', eyes: 'happy' })}
      ${ART.he({ x: 200, y: 12, s: .82, flip: true, arms: 'side', eyes: 'happy' })}
      <g opacity=".9">${ART.heart(103, 34, 2.1, '#D62828', 1)}</g>
    </svg>`;

  const solita = () =>
    `<svg viewBox="0 0 130 126" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${ART.she({ x: 10, y: 14, s: .84, eyes: 'sad' })}
    </svg>`;

  /* ==========================================================
     Transporte local (pruebas entre pestañas)
     ========================================================== */
  function transporteLocal(manejo) {
    const canal = new BroadcastChannel('ardillita-chat:' + nombreSala);
    const otros = new Map();
    let latido = 0, poda = 0;

    const emitirPresencia = () => {
      const lista = [{ id: yo.id, nombre: yo.nombre, av: yo.av, unido: yo.unido }];
      otros.forEach((o) => lista.push(o));
      manejo.presencia(lista);
    };

    const vi = (d) => {
      const nuevo = !otros.has(d.id);
      otros.set(d.id, { id: d.id, nombre: d.nombre, av: d.av, unido: d.unido, visto: Date.now() });
      if (nuevo) manejo.entra(d);
      emitirPresencia();
    };

    canal.onmessage = (ev) => {
      const d = ev.data || {};
      if (d.sala !== nombreSala || d.id === yo.id) return;
      if (d.tipo === 'hola')  { vi(d); di('aqui'); return; }
      if (d.tipo === 'aqui')  { vi(d); return; }
      if (d.tipo === 'chao')  {
        const o = otros.get(d.id);
        otros.delete(d.id);
        if (o) manejo.sale(o);
        emitirPresencia();
        return;
      }
      if (d.tipo === 'msg')     { manejo.mensaje(d); return; }
      if (d.tipo === 'escribe') { manejo.escribe(d); return; }
    };

    function di(tipo, extra) {
      canal.postMessage(Object.assign(
        { sala: nombreSala, tipo, id: yo.id, nombre: yo.nombre, av: yo.av, unido: yo.unido },
        extra || {}
      ));
    }

    return {
      modo: 'local',
      async conectar() {
        di('hola');
        latido = setInterval(() => di('aqui'), 4000);
        poda = setInterval(() => {
          let cambio = false;
          otros.forEach((o, id) => {
            if (Date.now() - o.visto > FUERA) { otros.delete(id); manejo.sale(o); cambio = true; }
          });
          if (cambio) emitirPresencia();
        }, 3000);
        emitirPresencia();
      },
      enviar(tipo, datos) { di(tipo, datos); },
      salir() {
        clearInterval(latido); clearInterval(poda);
        try { di('chao'); canal.close(); } catch (e) {}
      },
    };
  }

  /* ==========================================================
     Transporte Supabase (de verdad)
     ========================================================== */
  function transporteSupabase(manejo) {
    let canal = null, cliente = null;
    const conocidos = new Map();

    const cargarSDK = () => new Promise((ok, mal) => {
      if (window.supabase && window.supabase.createClient) return ok();
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
      s.onload = ok;
      s.onerror = () => mal(new Error('No se pudo cargar la librería del chat.'));
      document.head.appendChild(s);
    });

    const sincronizar = () => {
      const estado = canal.presenceState();
      const lista = [];
      Object.keys(estado).forEach((clave) => {
        const p = estado[clave][0] || {};
        lista.push({ id: p.id || clave, nombre: p.nombre, av: p.av, unido: p.unido || 0 });
      });
      lista.forEach((p) => {
        if (p.id !== yo.id && !conocidos.has(p.id)) { conocidos.set(p.id, p); manejo.entra(p); }
      });
      conocidos.forEach((p, id) => {
        if (!lista.some((q) => q.id === id)) { conocidos.delete(id); manejo.sale(p); }
      });
      manejo.presencia(lista);
    };

    return {
      modo: 'supabase',
      async conectar() {
        await cargarSDK();
        cliente = window.supabase.createClient(CHAT.supabaseUrl, CHAT.supabaseKey, {
          auth: { persistSession: false },
        });
        canal = cliente.channel('sala:' + nombreSala, {
          config: { broadcast: { self: false }, presence: { key: yo.id } },
        });

        canal.on('broadcast', { event: 'msg' },     ({ payload }) => manejo.mensaje(payload));
        canal.on('broadcast', { event: 'escribe' }, ({ payload }) => manejo.escribe(payload));
        canal.on('presence', { event: 'sync' }, sincronizar);

        await new Promise((ok, mal) => {
          const reloj = setTimeout(() => mal(new Error('El chat tardó demasiado en conectarse.')), 12000);
          canal.subscribe((estado) => {
            if (estado === 'SUBSCRIBED') {
              clearTimeout(reloj);
              canal.track({ id: yo.id, nombre: yo.nombre, av: yo.av, unido: yo.unido });
              ok();
            } else if (estado === 'CHANNEL_ERROR' || estado === 'TIMED_OUT') {
              clearTimeout(reloj);
              mal(new Error('No se pudo conectar con el servidor del chat.'));
            }
          });
        });
      },
      enviar(tipo, datos) {
        if (!canal) return;
        canal.send({
          type: 'broadcast',
          event: tipo,
          payload: Object.assign({ id: yo.id, nombre: yo.nombre, av: yo.av }, datos || {}),
        });
      },
      salir() {
        try { if (canal) canal.unsubscribe(); } catch (e) {}
        try { if (cliente) cliente.removeAllChannels(); } catch (e) {}
      },
    };
  }

  /* ==========================================================
     Avisos: toast dentro de la página + notificación del sistema
     ========================================================== */
  const horaDe = (t) => {
    const h = new Date(t || Date.now());
    return String(h.getHours()).padStart(2, '0') + ':' + String(h.getMinutes()).padStart(2, '0');
  };

  const avisos = {
    activas: false,
    audio: null,

    /* El navegador solo pregunta si el permiso lo pide un clic. */
    async pedir() {
      if (!('Notification' in window)) return false;
      if (Notification.permission === 'granted') return true;
      if (Notification.permission === 'denied') return false;
      try { return (await Notification.requestPermission()) === 'granted'; }
      catch (e) { return false; }
    },

    guardar(v) { try { localStorage.setItem('chat-avisos', v ? '1' : '0'); } catch (e) {} },
    recordado() { try { return localStorage.getItem('chat-avisos') === '1'; } catch (e) { return false; } },

    /* Un pip corto, para cuando no está mirando la pantalla. */
    pip() {
      if (!this.activas) return;
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        this.audio = this.audio || new Ctx();
        const o = this.audio.createOscillator(), g = this.audio.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(880, this.audio.currentTime);
        o.frequency.exponentialRampToValueAtTime(1320, this.audio.currentTime + .12);
        g.gain.setValueAtTime(.0001, this.audio.currentTime);
        g.gain.exponentialRampToValueAtTime(.16, this.audio.currentTime + .02);
        g.gain.exponentialRampToValueAtTime(.0001, this.audio.currentTime + .3);
        o.connect(g); g.connect(this.audio.destination);
        o.start(); o.stop(this.audio.currentTime + .32);
      } catch (e) {}
    },

    /* La del sistema solo molesta si el chat no está a la vista. */
    sistema(titulo, cuerpo) {
      if (!this.activas || !('Notification' in window)) return;
      if (Notification.permission !== 'granted') return;
      if (!document.hidden) return;
      try {
        const n = new Notification(titulo, {
          body: cuerpo,
          tag: 'chat-ardillita',
          icon: 'data:image/svg+xml,' + encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐿️</text></svg>"),
        });
        n.onclick = () => { window.focus(); n.close(); };
        setTimeout(() => n.close(), 9000);
      } catch (e) {}
    },
  };

  function toast(clase, av, titulo, detalle) {
    const caja = $('#avisos');
    const t = document.createElement('div');
    t.className = 'toast ' + clase;
    t.innerHTML = '<div class="mini">' + cara(av) + '</div>'
      + '<div class="toast-txt"><b></b><span></span></div>';
    t.querySelector('b').textContent = titulo;
    t.querySelector('span').textContent = detalle;
    caja.appendChild(t);
    setTimeout(() => {
      t.classList.add('se-va');
      setTimeout(() => t.remove(), 320);
    }, 5200);
  }

  function avisarConexion(p, entro) {
    const hora = horaDe();
    const nombre = p.nombre || 'Alguien';
    if (entro) {
      toast('entra', p.av, nombre + ' se conectó', 'a las ' + hora + ' 🌻');
      avisos.pip();
      avisos.sistema(nombre + ' se conectó 🐿️', 'Entró al chat a las ' + hora);
    } else {
      toast('sale', p.av, nombre + ' se desconectó', 'a las ' + hora);
      avisos.sistema(nombre + ' se desconectó', 'Salió del chat a las ' + hora);
    }
  }

  /* ==========================================================
     Pantallas
     ========================================================== */
  function mostrar(cual) {
    ['#entrada', '#sala', '#aviso'].forEach((s) => { $(s).hidden = (s !== cual); });
  }

  function avisar(titulo, texto, conBoton) {
    $('#aviso-titulo').textContent = titulo;
    $('#aviso-texto').textContent = texto;
    $('#btn-reintentar').hidden = !conBoton;
    mostrar('#aviso');
  }

  /* ---------- Entrada ---------- */
  function prepararEntrada() {
    $('#entrada-art').innerHTML = pareja();
    $('#aviso-art').innerHTML = solita();
    $$('.av').forEach((b) => {
      b.querySelector('.av-art').innerHTML = cara(b.dataset.av);
      b.addEventListener('click', () => elegir(b.dataset.av));
    });

    let recordado = {};
    try { recordado = JSON.parse(localStorage.getItem('chat-ardillita') || '{}'); } catch (e) {}
    $('#campo-nombre').value = recordado.nombre || '';
    elegir(recordado.av || 'ella');

    $('#modo-aviso').innerHTML = hayLlaves
      ? 'Sala: <strong>' + nombreSala + '</strong>'
      : '🧪 <strong>Modo prueba local.</strong> Todavía no hay llaves en <code>chat/config.js</code>, '
        + 'así que la conversación solo viaja entre dos pestañas de este mismo navegador.';

    $('#forma-entrada').addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = $('#campo-nombre').value.trim();
      if (!nombre) return;
      yo.nombre = nombre;
      yo.unido = Date.now();
      try { localStorage.setItem('chat-ardillita', JSON.stringify({ nombre: yo.nombre, av: yo.av })); } catch (e2) {}
      $('#btn-entrar').disabled = true;
      $('#btn-entrar').textContent = 'Conectando…';
      entrar();
    });
  }

  function elegir(av) {
    yo.av = av;
    $$('.av').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.av === av)));
  }

  /* ---------- La sala ---------- */
  let transporte = null;
  let dentro = false;
  let ultimoEscribe = 0;
  let relojEscribe = 0;

  const relojes = new Map();   // quién está escribiendo

  function pintarSistema(texto) {
    const d = document.createElement('div');
    d.className = 'sistema';
    d.textContent = texto;
    $('#mensajes').appendChild(d);
    alFinal();
  }

  const soloEmoji = (t) => t.length <= 6 && !/[a-zA-Z0-9À-ɏ]/.test(t) && /\p{Extended_Pictographic}/u.test(t);

  function pintarMensaje(d, mio) {
    const fila = document.createElement('div');
    fila.className = 'msg ' + (mio ? 'mio' : 'suyo') + (soloEmoji(d.texto) ? ' solo-emoji' : '');
    const b = document.createElement('div');
    b.className = 'burbuja';
    b.textContent = d.texto;
    const m = document.createElement('div');
    m.className = 'meta';
    const h = new Date(d.t || Date.now());
    m.textContent = (mio ? '' : (d.nombre || 'alguien') + ' · ')
      + String(h.getHours()).padStart(2, '0') + ':' + String(h.getMinutes()).padStart(2, '0');
    fila.appendChild(b); fila.appendChild(m);
    $('#mensajes').appendChild(fila);
    alFinal();
  }

  function alFinal() {
    const c = $('#mensajes');
    c.scrollTop = c.scrollHeight;
  }

  function pintarEscribiendo() {
    const quienes = Array.from(relojes.keys());
    $('#escribiendo').textContent = quienes.length
      ? quienes.join(' y ') + (quienes.length > 1 ? ' están escribiendo…' : ' está escribiendo…')
      : '';
  }

  function pintarPresencia(lista) {
    const otros = lista.filter((p) => p.id !== yo.id);
    const caja = $('#conectados');
    if (otros.length) {
      caja.innerHTML = '<span class="punto"><i></i>' + otros.map((o) => o.nombre || 'alguien').join(', ') + '</span>';
      $('#estado-sala').textContent = otros.length + ' ' + (otros.length > 1 ? 'personas' : 'persona') + ' más en línea';
    } else {
      caja.innerHTML = '<span class="punto sola"><i></i>solo tú por aquí</span>';
      $('#estado-sala').textContent = 'esperando…';
    }
  }

  /* Cupo: se ordena por hora de llegada. Quien quede fuera de los
     primeros CUPO puestos, no entra. Así los dos siempre coinciden. */
  function revisarCupo(lista) {
    const orden = lista.slice().sort((a, b) => (a.unido - b.unido) || String(a.id).localeCompare(String(b.id)));
    const puesto = orden.findIndex((p) => p.id === yo.id);
    if (puesto >= CUPO) {
      dentro = false;
      if (transporte) transporte.salir();
      avisar('La sala está llena',
        'Este chat es solo para dos personas y ya hay ' + CUPO + ' conectadas. Prueba en un rato.',
        true);
      return false;
    }
    return true;
  }

  const manejo = {
    presencia(lista) {
      if (!revisarCupo(lista)) return;
      pintarPresencia(lista);
    },
    entra(p) {
      if (!dentro) return;
      pintarSistema((p.nombre || 'Alguien') + ' se conectó a las ' + horaDe() + ' 🌻');
      avisarConexion(p, true);
    },
    sale(p)  {
      relojes.delete(p.nombre);
      pintarEscribiendo();
      if (!dentro) return;
      pintarSistema((p.nombre || 'Alguien') + ' se desconectó a las ' + horaDe());
      avisarConexion(p, false);
    },
    mensaje(d) {
      if (!d || !d.texto) return;
      relojes.delete(d.nombre); pintarEscribiendo();
      pintarMensaje(d, false);
    },
    escribe(d) {
      if (!d || !d.nombre) return;
      clearTimeout(relojes.get(d.nombre));
      relojes.set(d.nombre, setTimeout(() => { relojes.delete(d.nombre); pintarEscribiendo(); }, 3200));
      pintarEscribiendo();
    },
  };

  async function entrar() {
    $('#mi-av').innerHTML = cara(yo.av);
    $('#mi-nombre').textContent = yo.nombre;
    $('#mensajes').innerHTML = '';
    mostrar('#sala');

    /* Si ya las había activado antes, se quedan activadas. */
    if (avisos.recordado()) { await avisos.pedir(); ponerCampana(true); }
    else ponerCampana(false);

    transporte = hayLlaves ? transporteSupabase(manejo) : transporteLocal(manejo);

    try {
      await transporte.conectar();
    } catch (err) {
      avisar('No se pudo conectar', err.message || 'Revisa la conexión e intenta otra vez.', true);
      $('#btn-entrar').disabled = false;
      $('#btn-entrar').textContent = 'Entrar al chat';
      return;
    }

    dentro = true;
    $('#estado-sala').textContent = 'esperando…';
    pintarSistema(transporte.modo === 'local'
      ? 'Modo prueba: abre esta misma página en otra pestaña para conversar contigo mismo.'
      : 'Listo. Lo que escriban aquí no se guarda en ninguna parte.');
    $('#campo-msg').focus();
  }

  function ponerCampana(activas) {
    avisos.activas = activas;
    avisos.guardar(activas);
    const b = $('#btn-campana');
    b.setAttribute('aria-pressed', String(activas));
    b.textContent = activas ? '🔔' : '🔕';
    b.title = activas
      ? 'Te avisamos cuando alguien se conecte'
      : 'Avisarme cuando alguien se conecte';
  }

  function prepararSala() {
    $('#forma-msg').addEventListener('submit', (e) => {
      e.preventDefault();
      const campo = $('#campo-msg');
      const texto = campo.value.trim();
      if (!texto || !dentro) return;
      const d = { texto, t: Date.now(), nombre: yo.nombre, av: yo.av, id: yo.id };
      transporte.enviar('msg', d);
      pintarMensaje(d, true);
      campo.value = '';
      campo.focus();
    });

    $('#campo-msg').addEventListener('input', () => {
      if (!dentro) return;
      const ahora = Date.now();
      if (ahora - ultimoEscribe < 1800) return;
      ultimoEscribe = ahora;
      transporte.enviar('escribe', {});
      clearTimeout(relojEscribe);
    });

    $$('.emojis button').forEach((b) => b.addEventListener('click', () => {
      const campo = $('#campo-msg');
      campo.value += b.dataset.e;
      campo.focus();
    }));

    $('#btn-campana').addEventListener('click', async () => {
      if (avisos.activas) { ponerCampana(false); return; }
      const ok = await avisos.pedir();
      ponerCampana(true);
      avisos.pip();
      if (!ok) {
        pintarSistema('No hay permiso para notificaciones del sistema, pero igual verás el aviso aquí dentro.');
      }
    });

    $('#btn-salir').addEventListener('click', () => {
      if (transporte) transporte.salir();
      dentro = false;
      location.reload();
    });

    $('#btn-reintentar').addEventListener('click', () => location.reload());

    window.addEventListener('pagehide', () => { if (transporte) transporte.salir(); });
    window.addEventListener('beforeunload', () => { if (transporte) transporte.salir(); });
  }

  prepararEntrada();
  prepararSala();
})();
