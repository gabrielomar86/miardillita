/* ===========================================================
   pdf.js — arma "Nuestra historia" en PDF desde el navegador.

   Cada escena se rasteriza con el propio motor SVG del navegador
   (así salen idénticas a la página, con sus máscaras y degradados)
   y se monta en un A4 horizontal junto al título y el texto.
   =========================================================== */

const PDF_LIB = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

const HOJA = { ancho: 297, alto: 210 };         // A4 horizontal, en mm
const CREMA = [255, 248, 240];
const OSCURO = [62, 69, 80];
const ROJO = [214, 40, 40];
const TINTA = [74, 44, 26];
const TINTA2 = [138, 106, 78];
const CLARO = [255, 233, 201];
const GRIS_CLARO = [201, 210, 218];

function cargarScript(src) {
  return new Promise((ok, mal) => {
    if (window.jspdf) return ok();
    const s = document.createElement('script');
    s.src = src; s.onload = ok; s.onerror = () => mal(new Error('No se pudo cargar jsPDF'));
    document.head.appendChild(s);
  });
}

/* Convierte una escena SVG en un PNG de alta resolución */
function escenaAPng(svgTexto, anchoPx = 1700) {
  return new Promise((ok, mal) => {
    const blob = new Blob([svgTexto], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const alto = Math.round(anchoPx * 460 / 800);
      const lienzo = document.createElement('canvas');
      lienzo.width = anchoPx; lienzo.height = alto;
      const ctx = lienzo.getContext('2d');
      ctx.drawImage(img, 0, 0, anchoPx, alto);
      URL.revokeObjectURL(url);
      ok(lienzo.toDataURL('image/png'));
    };
    img.onerror = () => { URL.revokeObjectURL(url); mal(new Error('No se pudo dibujar la escena')); };
    img.src = url;
  });
}

/* El SVG que devuelve ART no trae medidas: se las ponemos para rasterizarlo */
function prepararSvg(texto) {
  return texto.replace('<svg ', '<svg width="800" height="460" ');
}

async function construirPDF(avisar) {
  await cargarScript(PDF_LIB);
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  const centrado = (t, y, size, color, estilo = 'bold') => {
    doc.setFont('helvetica', estilo); doc.setFontSize(size); doc.setTextColor(...color);
    doc.text(t, HOJA.ancho / 2, y, { align: 'center' });
  };

  const total = CAPITULOS.length + 2;
  let hecho = 0;
  const paso = () => avisar(Math.round((++hecho / total) * 100));

  /* ---- Portada ---- */
  doc.setFillColor(...CREMA); doc.rect(0, 0, HOJA.ancho, HOJA.alto, 'F');
  centrado('21 DE SEPTIEMBRE', 26, 10, ROJO);
  centrado('Feliz cumpleanos', 46, 34, ROJO);
  centrado(CONFIG.nombre, 62, 20, TINTA);
  const portada = await escenaAPng(prepararSvg(ART.scenes.hero()), 1500);
  doc.addImage(portada, 'PNG', 68, 70, 161, 92.6);
  centrado('Dos anos, mil aventuras y unas cuantas tormentas.', 178, 12, TINTA2, 'normal');
  centrado('Esta es nuestra historia, contada en dibujitos.', 186, 12, TINTA2, 'normal');
  paso();

  /* ---- Capítulos ---- */
  for (let i = 0; i < CAPITULOS.length; i++) {
    const c = CAPITULOS[i];
    doc.addPage();
    doc.setFillColor(...(c.oscuro ? OSCURO : CREMA));
    doc.rect(0, 0, HOJA.ancho, HOJA.alto, 'F');

    const png = await escenaAPng(prepararSvg(ART.scenes[c.escena]()));
    const ancho = 233, alto = ancho * 460 / 800;
    doc.addImage(png, 'PNG', (HOJA.ancho - ancho) / 2, 16, ancho, alto);

    let y = 16 + alto + 14;
    centrado(String(i + 1).padStart(2, '0'), y, 11, ROJO);
    centrado(c.titulo, y + 11, 19, c.oscuro ? CLARO : TINTA);

    doc.setFont('helvetica', 'normal'); doc.setFontSize(11.5);
    doc.setTextColor(...(c.oscuro ? GRIS_CLARO : TINTA2));
    const lineas = doc.splitTextToSize(c.texto, 225);
    doc.text(lineas, HOJA.ancho / 2, y + 21, { align: 'center' });
    paso();
  }

  /* ---- Carta final ---- */
  doc.addPage();
  doc.setFillColor(...CREMA); doc.rect(0, 0, HOJA.ancho, HOJA.alto, 'F');
  centrado('Una ultima cosa', 46, 24, TINTA);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(13); doc.setTextColor(...TINTA2);
  const parrafos = [
    'No vamos a estar juntos el dia exacto, y ya esta. El 21 es un numero en la pared; lo nuestro no cabe en un calendario. Nos vemos poquito despues, y eso es lo de menos.',
    'Lo que importa son los detalles: el vapor de las termales, los masajes a media tarde, los papelitos escritos a mano, Quito encendido desde el mirador, y tambien todas las veces que supimos volver.',
  ];
  let y = 72;
  parrafos.forEach((p) => {
    const l = doc.splitTextToSize(p, 205);
    doc.text(l, HOJA.ancho / 2, y, { align: 'center' });
    y += l.length * 6.4 + 8;
  });
  centrado('Feliz cumpleanos, mi ardillita. Te amo.', y + 12, 16, ROJO);
  paso();

  return doc;
}

/* ---- El botón ---- */
function prepararDescarga() {
  const boton = document.getElementById('boton-descarga');
  if (!boton) return;
  const original = boton.innerHTML;

  boton.addEventListener('click', async (e) => {
    e.preventDefault();
    if (boton.dataset.ocupado) return;
    boton.dataset.ocupado = '1';

    const avisar = (pct) => { boton.textContent = `Armando el libro… ${pct}%`; };
    avisar(0);

    try {
      const doc = await construirPDF(avisar);
      boton.textContent = '¡Listo!';
      doc.save('Nuestra historia.pdf');
      if (typeof lluviaDePetalos === 'function') lluviaDePetalos(40);
    } catch (err) {
      console.error(err);
      boton.textContent = 'No se pudo. Intenta de nuevo';
    } finally {
      setTimeout(() => { boton.innerHTML = original; delete boton.dataset.ocupado; }, 2600);
    }
  });
}
