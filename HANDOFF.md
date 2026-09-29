# Handoff — OWD Site rebuild, dev tracker work

Generado el 2026-09-29. Este archivo es temporal (el usuario lo va a borrar); es
para darle contexto a otro agente que continúe el trabajo del dev tracker sin
tener que releer toda la conversación.

## 1. Qué es este repo

Reconstrucción del sitio de Outwork'em Digital (agencia de marketing para
contratistas de home services), hecha en HTML/CSS/JS plano — sin framework,
sin build step. 60 archivos `.html`, cada uno con su CSS mayormente inline
(parcialmente externalizado, ver ítem 18 abajo).

- **Repo:** `OWD-Organization/owd-dev` en GitHub (remoto local sigue apuntando
  a `TeamOWD/owd-dev`, funciona por redirect de GitHub).
- **Dominio final:** `outworkemdigital.com` (WordPress, todavía en producción).
- **Preview:** `https://owd-dev.vercel.app` — este build, sirviendo hoy.
- **Fuente de trabajo:** `OWD_Website_Audit_Dev_Tracker - Dev Tracker.csv` en
  la raíz del repo (bajado de un Google Sheet, pestaña "Dev Tracker"). El
  usuario lo actualiza a mano en Sheets y vuelve a bajar el CSV cuando hace
  falta releerlo — **no asumas que la copia local está actualizada**, hay que
  volver a pedírsela si pasó tiempo.

## 2. Lo más importante: cómo desplegar

**El proyecto de Vercel NO está conectado a GitHub.** Pushear a `main` no
publica nada. Cada cambio necesita, en este orden:

```
git add -A -- . ':!OWD_Website_Audit_Dev_Tracker - Dev Tracker.csv'
git commit -m "..."
git push origin main
vercel --prod --yes
```

(El CSV se excluye siempre del commit — es un archivo de trabajo del usuario,
no parte del sitio.)

Después de cada deploy, **verificar con `curl` contra
`https://owd-dev.vercel.app`** que el cambio esté realmente ahí — no asumir
que el deploy alcanzó lo que se pidió. Ya pasó más de una vez que el deploy
quedó desfasado del último commit.

El usuario dio autorización permanente para commitear/pushear/desplegar sin
preguntar en cada paso (ver memoria `no-commit-without-authorization.md`).
Sigue habiendo que avisar de defectos encontrados, no solo reportar éxito.

## 3. Reglas de estilo ya establecidas (no re-inventar)

- **Cero em dash (—) en texto visible.** Se reemplazaron los 340 que había,
  cada uno según su función (coma para aposición, punto para cláusulas
  independientes, dos puntos para título+subtítulo, etc. — ver
  `no-em-dashes-in-copy.md`). Los en dash (–) sí están permitidos para rangos.
- **El thumbnail de cada entrada del blog es su propia foto principal**, no
  una imagen aparte (`blog-thumbnail-is-main-photo.md`).
- El teléfono correcto y único del sitio es **833-695-1214** (no 844-931-4624,
  que era un remanente viejo). Formato `tel:` siempre `tel:8336951214`.
- Los enlaces de teléfono y los del footer van **sin subrayado** (`text-decoration:none`
  explícito); el texto corrido normal sí mantiene el subrayado nativo del navegador.
- El **CSS compartido** vive en 5 hojas por familia de plantilla en `/css/`,
  con hash de contenido en el nombre y `Cache-Control: immutable` un año
  (ver `vercel.json`). **Si editás una de esas hojas, hay que rotar el hash del
  nombre de archivo y actualizar los `<link>` que la referencian** — si no, el
  cambio nunca llega a nadie con caché (immutable = 1 año).
- `vercel.json` tiene una regla de header `X-Robots-Tag: noindex, nofollow`
  **condicionada a host `*.vercel.app`** — se apaga sola cuando el dominio
  real apunte acá. No tocar esa condición sin pensar en el día del lanzamiento.
- Los tags de analítica (Google Ads, Meta Pixel, Microsoft Clarity) ya están
  portados del WordPress, pero **con la misma guarda de host `*.vercel.app`**
  aplicada en JS (no se puede hacer por header porque hay que inyectar script
  condicionalmente). Ver el bloque `<script>` justo después de Feedbucket en
  cualquier página.

## 4. Estado real del Dev Tracker (43 filas: ID 1-38 + L1-L5)

**Ojo: el CSV dice "Done" en dos filas donde no hay NINGUNA implementación
real en este repo.** Verificalo vos mismo antes de confiar en la columna
Status — parece que alguien marcó Done pensando en lo que ya existe en el
WordPress en vivo (vía RankMath, etc.), no en este build nuevo.

| ID | Estado real | Qué se hizo |
|---|---|---|
| 1 | ✅ Hecho, desplegado | `X-Robots-Tag: noindex` condicionado a `*.vercel.app` en `vercel.json` |
| 2 | ✅ Hecho, desplegado | Teléfono unificado a 833-695-1214 en todo el sitio |
| 3 | ❌ **CSV dice Done, es MENTIRA** | Cero JSON-LD en el repo. Nadie implementó Schema.org acá. Sigue 100% pendiente. |
| 4 | ✅ Hecho, desplegado | Canonical + Open Graph + Twitter card en las 58 páginas, apuntando a `outworkemdigital.com` |
| 5 | ⚠️ Parcial, no lo pedía el tracker así | Los pixeles YA están portados (Ads, Meta, Clarity) con guarda de host, pero **no dentro de un contenedor GTM** como pide el fix — se cargan directo. Falta el contenedor GTM si insisten en esa arquitectura, y falta verificar el submit del iframe de GHL en `/schedule/`. |
| 6 | ❌ Pendiente | Redirects de URLs indexadas viejas. `docs/url-map.md` SÍ existe (no se sube al deploy por `.vercelignore`, pero está en el repo) y trae la lista exacta de las 9 URLs indexadas en producción que no tienen página en este build: `/verified-support/`, `/careers/`, `/workshops/`, `/outwork-em-podcast/`, `/trial/`, `/guides/`, `/news/reddit-chatgpt-citation-drop-ai-search/`, `/news/outworkem-digital-co-founder-thomas-eberts-achieves-clickfunnels-2-comma-club-award/`, `/news/thomas-eberts-featured-in-forbes-alongside-jordan-belfort/`. El fix del tracker pide reconstruir los dos posts de Forbes/Reddit-ChatGPT como páginas reales (son activos de trust/AI search) y decidir redirect vs. página nueva para el resto. Sigue faltando la pestaña "301 Redirect Map" del Sheet original para saber el destino de cada una — no vino en este CSV exportado, pedirla si hace falta. |
| 7 | ✅ Hecho, desplegado | 99 imágenes bajadas de WordPress a `/img`, convertidas a WebP, referencias repunteadas. (El tracker decía 138, el número real de archivos únicos era 99 en 156 referencias.) |
| 8 | ❌ Pendiente, decisión pendiente del usuario | Feedbucket sigue en las 58 páginas. El tracker pide sacarlo **antes de producción**; el usuario lo está usando activamente para recibir feedback de Ryan/Jana, así que sacarlo hoy cortaría ese canal. **No sacarlo sin confirmar con el usuario primero** — probablemente se saca recién el día del lanzamiento real. |
| 9 | ❌ **CSV dice Done, es MENTIRA** | No existe `robots.txt`, `sitemap.xml` ni `404.html` en el repo. Sigue 100% pendiente. |
| 10 | ✅ Hecho, desplegado | `.vercelignore` saca del deploy: `docs/`, `*.md`, `*.csv`, `inspiration/`, `wireframe-dark.html`, `web-design-page.pdf`, `stdout`, `.vscode/` |
| 11-13 | ❌ Pendiente | No revisados aún en esta sesión |
| 14 | ✅ Hecho, desplegado | Alt text real en 600 imágenes (eran `alt=""`, no ausente). De paso salieron 13 hotlinks más (Cloudinary + googleusercontent) que se migraron también. |
| 15 | ✅ Hecho, desplegado | 5 enlaces internos rotos (todos URLs absolutas a outworkemdigital.com) repunteados; 34 enlaces internos más que se iban del build por ser absolutos, pasados a relativos; 2 lead magnets (`/2025-plan`, `/2025-worksheet`) dejados absolutos a propósito porque no tienen equivalente en el build nuevo. |
| 16 | ✅ Hecho, desplegado | Marca vieja "TopSeer Marketers" limpiada (5 anchor IDs + 1 slug de noticia), con redirect 301 en `vercel.json` |
| 17 | ✅ Hecho, desplegado | width/height + loading explícito en 599/600 `<img>` (el único sin tocar es el lightbox de `our-work`, justificado: `display:none` hasta abrirse, CSS fuerza `auto`) |
| 18 | ✅ Hecho, desplegado | CSS compartido extraído a 5 hojas por familia de plantilla (ver sección 3) |
| 19-38 | ❌ Pendiente | No revisados aún en esta sesión |
| L1-L5 | ⚠️ **Fuera de alcance de este repo** | Son fixes al WordPress **en vivo** (`outworkemdigital.com`), no a este build. Nada que hacer acá salvo que el usuario pida replicar el mismo fix en el build nuevo. No hay acceso WordPress conectado en esta sesión (el conector WPvibe apareció disponible en herramientas pero nunca se usó). |

## 5. Trabajo hecho que NO está en el tracker

Antes y durante esta sesión se hicieron muchos cambios de diseño/contenido
pedidos directamente por el usuario (Ryan/Jana vía Feedbucket), sin ID de
tracker. Los más recientes, de más viejo a más nuevo (ver `git log` para el
detalle completo, son ~50 commits):

- Luz animada en el hero de la home, siguiendo el cursor
- Reemplazo de la foto del hero por un dashboard de leads/revenue (varias
  iteraciones — la imagen final es un render, no una captura real)
- Balance de líneas en títulos (`text-wrap:balance`) en todo el sitio
- Contraste y peso de fuente en tarjetas naranjas (WCAG AA)
- Sección de testimonios sacada temporalmente (esperando clips reales de
  clientes) — el CSS queda, solo falta pegar el markup cuando vuelva
- Reseñas de Google sacadas temporalmente (el Google Business Profile se está
  renombrando) — mismo criterio, CSS vivo, markup fuera
- "Real Work" (portfolio) relleno con los primeros 3 casos de estudio reales
- Video de podcast embebido (era un reproductor falso)
- Feed real de Instagram vía Elfsight (era una tarjeta de cuenta inventada)
- Contenedor principal ensanchado de 1120px a 1250px en todo el sitio
- Gráficos de trayectoria de 12 meses en `marketing-programs` (SVG inline,
  paleta validada con el skill de dataviz)
- Ilustración de cómic en la sección "Transparency"
- Foto de Ryan re-encuadrada en el hero de `/schedule/`

**Ojo con la sección de testimonios y reseñas de Google**: están
*deliberadamente* fuera del markup, no rotas. Si alguien pide "arreglar" esas
secciones, primero confirmar si es porque quieren que vuelvan (en cuyo caso el
CSS ya está listo) o si es un malentendido.

## 6. Cosas para verificar antes de seguir

1. **Volver a bajar el CSV** del Sheet si pasó tiempo — el usuario lo actualiza
   ahí, no acá.
2. **No confiar en la columna Status** sin verificar contra el repo (ver
   sección 4 — ID 3 y 9 son la prueba de que puede estar mal).
3. **Pedir la pestaña "301 Redirect Map"** del Sheet original si hace falta el
   destino de cada una de las 9 URLs listadas en `docs/url-map.md` — no vino
   en este CSV exportado.
4. Los IDs 11, 12, 13, 19-38 **no se tocaron todavía** en esta sesión — quedan
   enteros para la próxima.
