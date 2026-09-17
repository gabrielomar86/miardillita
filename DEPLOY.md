# Publicar en miardillita.org

La página es 100% estática (HTML + CSS + JS, sin servidor). Cualquier hosting
estático sirve. Opciones, de la más simple a la más manual:

## Opción A — Cloudflare Pages (recomendada)

1. Entra a <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Pages**
   → **Upload assets**.
2. Arrastra la carpeta completa del proyecto. Se publica en segundos.
3. En **Custom domains**, agrega `miardillita.org`.
4. Si el dominio ya está en Cloudflare, el DNS se configura solo. Si no, en tu
   registrador cambia los *nameservers* a los que te indique Cloudflare.

HTTPS automático y gratis.

## Opción B — Netlify (la más rápida de todas)

1. Entra a <https://app.netlify.com/drop> y arrastra la carpeta del proyecto.
2. Ya está publicada en una URL temporal.
3. **Domain settings** → **Add custom domain** → `miardillita.org`.
4. En tu registrador, apunta:
   - `A` de `@` → `75.2.60.5`
   - `CNAME` de `www` → el subdominio `.netlify.app` que te dieron

## Opción C — GitHub Pages

El archivo `CNAME` de este repo ya contiene `miardillita.org`, así que:

1. Sube el proyecto a un repositorio de GitHub.
2. **Settings** → **Pages** → Source: `main` / carpeta raíz.
3. En tu registrador, apunta `@` a estas cuatro `A`:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   y `www` como `CNAME` a `<usuario>.github.io`.
4. Marca **Enforce HTTPS** (puede tardar unos minutos en habilitarse).

---

## Antes de publicar — lista de control

- [ ] Poner `demoSegundos: 0` en `assets/app.js` (si no, el candado se abre a los
      20 segundos en lugar del 21 de septiembre).
- [ ] Copiar la ilustración a `assets/fotos/ardillitas.jpg`.
- [ ] Ajustar `aniversario` en `assets/app.js` con la fecha real.
- [ ] Abrir la página en el celular para revisarla.

## Ojo con la hora

El candado usa la hora **del dispositivo de quien abre la página**. Si ella está
en Ecuador y tú también, se abre a las 00:00 de allá y todo bien. Si estuviera en
otro país, se abriría a las 00:00 de *su* zona horaria.
