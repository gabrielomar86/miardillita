/* ===========================================================
   datos.js — lo único que hace falta editar: la configuración
   y los textos de los capítulos. Lo usan tanto la página como
   la versión imprimible en PDF.
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
  edad:         26,                          // el número que forman los pétalos al abrirse la página

  // 🧪 PRUEBA: ignora la fecha real y hace que el candado se abra en X segundos.
  //    En 0 manda la fecha real de arriba. Para revisarla igual, abre  ?preview=1
  demoSegundos: 5,

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
    texto:'Lo nuestro empezó rarísimo: le dije que su voz parecía de ratita. Me corregí enseguida — de ardilla, más bien. Ardillita. Y así se quedó, para siempre.' },

  { escena:'termales', titulo:'Papallacta',
    texto:'Agua caliente, vapor subiendo y las montañas alrededor. Ahí mismo, los masajes y los silencios buenos. Descubrimos que en esa poza el mundo se queda afuera.' },

  { escena:'carretera', titulo:'La carretera',
    texto:'Bajando de la montaña, sin luna y sin apuro. Las luces del carro alcanzaban apenas para el siguiente pedacito de camino, y con eso bastaba. Ni siquiera nos mirábamos: los dos íbamos mirando hacia adelante, que es la manera más bonita de ir juntos.' },

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
