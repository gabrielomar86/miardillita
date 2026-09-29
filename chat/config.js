/* ===========================================================
   chat/config.js — lo único que hay que editar del chat.

   Mientras supabaseUrl y supabaseKey estén vacíos, el chat
   funciona en MODO PRUEBA LOCAL: se conversa entre dos pestañas
   del mismo navegador, sin internet y sin cuenta. Sirve para
   revisar cómo se ve y cómo se siente.

   Para que funcione entre dos celulares de verdad:
     1. Crea un proyecto gratis en https://supabase.com
     2. Settings → API → copia "Project URL" y la llave "anon public"
     3. Pégalas aquí abajo y sube el cambio.
   No hace falta crear tablas: los mensajes viajan por el canal
   y no se guardan en ninguna parte.
   =========================================================== */

const CHAT = {
  supabaseUrl: 'https://qxdcprntxaohkwmfhfpo.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4ZGNwcm50eGFvaGt3bWZoZnBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3MDc3NTksImV4cCI6MjEwNjI4Mzc1OX0.mBCMJt4JqcR73w9_LEAvO_g9x3o4KbIAoPYD6DO8h_s',

  // Nombre de la sala. Quien no lo sepa, no entra.
  // Cámbialo por algo que solo ustedes dos sepan.
  sala: 'ardillitas-girasol-21',

  // Cuánta gente cabe. La tercera persona ve "la sala está llena".
  maxPersonas: 2,

  // Segundos sin señal para dar a alguien por desconectado.
  tiempoFuera: 12,
};
