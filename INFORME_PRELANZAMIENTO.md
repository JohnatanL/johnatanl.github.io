# Informe de Auditoría de Prepublicación (`INFORME_PRELANZAMIENTO.md`)

**Proyecto:** Portafolio Profesional — Johnatan Lozano  
**Fecha de auditoría:** 4 de noviembre de 2026  
**Directorio auditado:** `Portafolio/` (entorno local aislado)  
**Dictamen técnico:** **APTO TÉCNICAMENTE PARA PUBLICACIÓN INICIAL** *(todas las comprobaciones técnicas, de seguridad, compilación dual y presentación visual han sido ejecutadas y aprobadas; cero acciones de `git remote`, `git push` o despliegue ejecutadas).*

---

## 1. Resultado detallado de cada prueba (`Aprobado`, `Fallido` o `Pendiente`)

| # | Categoría | Prueba / Verificación | Estado | Evidencia empírica obtenida |
| :--- | :--- | :--- | :---: | :--- |
| 01 | Protección e integridad | Intangibilidad de repositorios originales **SmartCut AI** | **Aprobado** | `SmartCut_AI_Frontend` sin cambios (`git status -s` vacío); `SmartCut AI Backend Codespaces` conserva intacto su estado previo `MM docker-compose.yml`. |
| 02 | Protección e integridad | Ausencia de remotos Git, `git push` y publicación | **Aprobado** | No se inicializó `.git`, no se configuraron remotos ni se realizó publicación alguna. |
| 03 | Protección e integridad | Escaneo de credenciales, tokens, rutas locales privadas y `.env` | **Aprobado** | `0` archivos `.env*`, `0` claves API/JWT/secretos y `0` documentos personales no autorizados en el árbol del proyecto. |
| 04 | Protección e integridad | Cobertura de `.gitignore` | **Aprobado** | Excluye `node_modules/`, `.astro/`, `dist/`, `*.tsbuildinfo`, `coverage/`, `.env`, `.env.*` (`!.env.example`), `.vscode/*` (`!.vscode/extensions.json`), `.idea/` y archivos temporales/logs (`*.log`, `.DS_Store`, `Thumbs.db`, `Desktop.ini`). |
| 05 | Contenido y autenticidad | Revisión de `site.ts`, `profile.ts`, `skills.ts` y colecciones Markdown | **Aprobado** | Formación SENA (`Técnico en Programación de Software`, `en-curso`), ubicación (`Colombia`), GitHub (`@JohnatanL`), LinkedIn y correo electrónico representados de forma coherente en Hero, Contacto, Footer y `JSON-LD` (`sameAs`). `SQL` se mantiene en `'en-formacion'` sin atribución falsa a SmartCut AI. |
| 06 | Contenido y autenticidad | Veracidad funcional de **SmartCut AI** | **Aprobado** | Separación explícita entre módulos `implementado` (Auth/JWT, Dashboard con `Promise.all`, CRUD de Usuarios/Servicios/Productos) y `demostracion-visual` (Agendamiento sin persistencia de citas y Simulador local con `URL.createObjectURL` sin IA), junto con trazabilidad `20/15/5` endpoints y `9` limitaciones de seguridad. |
| 07 | Entorno y reproducibilidad | Versiones de Node.js y npm + `npm ci` | **Aprobado** | `Node.js v24.22.2` LTS y `npm 11.19.1` (cumplen `node >= 22.23.4` y `npm >= 9.6.5`). `npm ci` instaló `271` paquetes auditados con **`0 vulnerabilities`**. |
| 08 | Calidad estática | `npm run check` (`astro check --minimumFailingSeverity warning`) | **Aprobado** | `47` archivos analizados: **`0 errors`**, **`0 warnings`**, **`0 hints`**. |
| 09 | Pruebas automatizadas | `npm test` (`tests/schemas-and-paths.test.ts`) | **Aprobado** | **`14/14` pruebas aprobadas** (`3` suites, `0` fallos): validación Zod 4 (`z.strictObject()`), `externalHttpUrl` (`z.httpUrl()`), `normalizeProjectEntryId` y `siteConfigSchema`. |
| 10 | Seguridad de rutas locales | Rechazo exhaustivo de rutas inseguras en `safePublicFilePath()` | **Aprobado** | Rechazados todos los vectores del plan: traversal (`..`, `.`), salida de `/files/certificates/`, barras invertidas (`\`), codificación porcentual simple y doble (`%2e`, `%252e`, `%5c`, `%20`, `%00`), archivos ocultos (`.gitkeep`, `.env`), parámetros/fragmentos (`?`, `#`) y dobles barras (`//`). |
| 11 | Compilación raíz | PowerShell `$env:BASE_PATH="/"; npm run build; node scripts/verify-build.mjs` | **Aprobado** | `9` páginas HTML generadas (`844.4 KB` totales en `dist/`), `0` enlaces rotos, `robots.txt` y `sitemap-index.xml` / `sitemap-0.xml` apuntando a `https://johnatanl.github.io/`, `_ejemplo-certificado` y `/404` excluidos del sitemap. |
| 12 | Compilación subruta | PowerShell `$env:BASE_PATH="/portafolio"; npm run build; node scripts/verify-build.mjs` | **Aprobado** | `9` páginas HTML generadas (`850.4 KB` en `dist/`), `0` enlaces rotos, todos los enlaces internos y descargas (`withBase(filePath)`) prefijados con `/portafolio/...`, `robots.txt` y `sitemap-0.xml` bajo `https://johnatanl.github.io/portafolio/`. |
| 13 | GitHub Pages CI/CD | Auditoría de `astro.config.mjs` y `.github/workflows/deploy.yml` | **Aprobado** | Permisos mínimos (`contents: read`, `pages: write`, `id-token: write`), concurrencia segura y acciones oficiales actualizadas a sus versiones vigentes sobre Node 24 (`checkout@v7`, `setup-node@v7`, `configure-pages@v6`, `upload-pages-artifact@v5`, `deploy-pages@v5`). |
| 14 | Revisión visual y WCAG AA | Inspección en Chrome (`1440×900`, `375×812` y `320×568`) sobre las 9 rutas | **Aprobado** | `0` desbordamientos horizontales, `0` fallos de contraste WCAG 2.1 AA, `0` imágenes rotas, `0` errores de consola/red, `SkipLink` visible al pulsar `Tab`, menú móvil accesible (`aria-expanded` + `Escape`) y `<dialog>` de evidencias con retorno de foco. |
| 15 | Recursos opcionales | Hoja de vida en PDF (`public/files/cv.pdf`) y certificados verificados | **Pendiente** *(no bloqueante)* | `cv.isAvailable: false` muestra aviso informativo limpio sin enlaces rotos; certificados en `0` publicados ocultan automáticamente la sección vacía en `/formacion/`. |
| 16 | Publicación remota | Creación del repositorio en GitHub y primer `git push` | **Pendiente** *(por autorización)* | Bloqueado deliberadamente siguiendo tus instrucciones hasta que completes tu revisión personal y ejecutes el despliegue. |

---

## 2. Problemas técnicos detectados durante la auditoría y correcciones aplicadas

Todas las correcciones se realizaron exclusivamente sobre código técnico, estilos, metadatos y configuración dentro de `Portafolio/`, **sin alterar tus datos personales** en `src/data/site.ts`, `src/data/profile.ts`, `src/data/skills.ts` ni las colecciones Markdown:

1. **Recorte lateral de tarjetas en pantallas móviles ultracompactas (`320px`) al mostrar el correo electrónico largo (`src/styles/global.css`, `src/components/contact/ContactCard.astro`, `src/layouts/CaseStudyLayout.astro`):**
   - *Hallazgo:* Tras incorporar `johnatanlozano.dev@gmail.com` y la etiqueta de disponibilidad de 65 caracteres en `site.ts`, la inspección visual en `320×568` detectó que el botón secundario de correo expandía las pistas implícitas de CSS Grid (`auto`) en `ContactCard.astro`, recortando el borde derecho de las tarjetas en móviles de `320px`.
   - *Corrección:* Se añadió `max-width: 100%`, `text-align: center` y `overflow-wrap: anywhere` a `.btn` y `.prose code`, `min-width: 0` y padding adaptable a `.card`, `grid-template-columns: minmax(0, 1fr)` explícito en las rejillas de una columna, y radio adaptable (`1rem`) con `max-width: 100%` en `AvailabilityPill`, `PendingBadge` y `StatusBadge`. Re-verificado en captura real `320×568` con márgenes simétricos intactos.
2. **Fondo sólido de respaldo y contraste WCAG 2.1 AA en bandas oscuras (`HeroBand.astro`, `PageHero.astro`, `CaseStudyLayout.astro`, `global.css`):**
   - *Hallazgo:* Las cabeceras oscuras definían únicamente `background: linear-gradient(...)` sin `background-color` sólido de respaldo (`rgba(0, 0, 0, 0)` computado), lo que penalizaba auditores automáticos de contraste y modos sin imágenes de fondo; además, `opacity: 0.85` en `.btn--disabled` reducía innecesariamente la legibilidad del estado `"CV en PDF (en preparación)"`.
   - *Corrección:* Se declaró `background-color: var(--color-navy-900)` junto a `background-image` en las tres cabeceras oscuras y se eliminó la reducción de opacidad en `.btn--disabled`. El re-escaneo de contraste WCAG 2.1 AA en Chrome reportó **`0` incidencias en las 9 rutas**.
3. **Compatibilidad de imagen Open Graph (`og:image` y `twitter:image`) con LinkedIn, WhatsApp y X (`SeoHead.astro`, `CaseStudyLayout.astro`, `src/assets/images/og-default.png`):**
   - *Hallazgo:* `SeoHead.astro` y `CaseStudyLayout.astro` exponían archivos `.svg` (`og-default.svg` / `arquitectura-smartcut.svg`) en `og:image`. Los rastreadores de vistas previas de LinkedIn, WhatsApp, X y Discord ignoran imágenes SVG y exigen formatos raster (`PNG`/`JPG`/`WebP`).
   - *Corrección:* Se generó `src/assets/images/og-default.png` (`1200×630`, `image/png`, renderizado con las fuentes locales `Plus Jakarta Sans`, `Inter` y `JetBrains Mono` conservando `og-default.svg` como editable), se configuraron `og:image:type`, `og:image:width` y `og:image:height` en `SeoHead.astro`, se configuró `CaseStudyLayout.astro` para usar `og-default.png` cuando `coverImage` sea un diagrama `.svg`, y se añadió una regla en `scripts/verify-build.mjs` que impide publicar un `.svg` en `og:image`.
4. **Representación simétrica de LinkedIn y canales confirmados (`HeroBand.astro`, `Footer.astro`):**
   - *Hallazgo:* Tras añadir tu URL de LinkedIn y correo en `site.ts`, aparecían en `ContactCard.astro` y `JsonLd.astro`, pero `HeroBand.astro` solo mostraba el botón de GitHub y `Footer.astro` no enlazaba el correo confirmado.
   - *Corrección:* Se incorporó el botón condicional de LinkedIn junto al de GitHub en `HeroBand.astro` y el enlace `mailto:` condicional en `Footer.astro`.
5. **Visibilidad instantánea de `SkipLink` al navegar con teclado (`SkipLink.astro`):**
   - *Hallazgo:* La transición `transform 160ms` retardaba la aparición visual del enlace `"Saltar al contenido principal"` al presionar `Tab`.
   - *Corrección:* Se eliminó la transición de desplazamiento para que el enlace aparezca de forma inmediata (`top: 8px, left: 8px`) en el primer `Tab`.
6. **Actualización del workflow de GitHub Pages a acciones nativas sobre Node 24 (`.github/workflows/deploy.yml`):**
   - *Hallazgo:* El workflow utilizaba versiones anteriores basadas en el runtime Node 20 (`checkout@v4`, `setup-node@v4`, `configure-pages@v5`, `upload-pages-artifact@v3`, `deploy-pages@v4`). Al contrastarlo con la guía oficial vigente de Astro (`docs.astro.build/en/guides/deploy/github/`) y los repositorios oficiales de GitHub Actions en 2026, todas cuentan ya con versiones mayores sobre **Node 24**.
   - *Corrección:* Se actualizaron a `actions/checkout@v7`, `actions/setup-node@v7`, `actions/configure-pages@v6`, `actions/upload-pages-artifact@v5` y `actions/deploy-pages@v5`, conservando `npm ci`, `npm test`, `npm run check`, `npm run build` y `npm run verify` (superando en rigor a `withastro/action@v6`, que ejecuta `npm install` sin validaciones personalizadas).
7. **Endurecimiento de `.gitignore`, `siteConfigSchema` y `verify-build.mjs`:**
   - Se amplió `.gitignore` para cubrir configuraciones de editores, logs de gestores alternativos y `*.tsbuildinfo`.
   - Se añadió `siteConfigSchema` en `src/utils/schemas.ts` y una prueba en `tests/schemas-and-paths.test.ts` que valida `src/data/site.ts` (incluyendo formato de correo, URLs HTTP/HTTPS y verificación de existencia física de `public/files/cv.pdf` cuando `cv.isAvailable` pase a `true`), además de validar la sintaxis `JSON-LD` en `scripts/verify-build.mjs`.

---

## 3. Información que todavía necesitas confirmar o revisar

1. **Verificación personal de tus tres datos recién actualizados en `src/data/site.ts`:**
   - Disponibilidad (`línea 65`): `'Disponible para etapa productiva desde el 11 de diciembre de 2026'`.
   - URL pública exacta de LinkedIn (`línea 77`): `https://www.linkedin.com/in/johnatan-david-lozano-suarez-165529239/` *(comprueba en una ventana privada o sesión abierta que el slug público siga siendo exactamente ese y si deseas personalizar la URL pública en LinkedIn para acortar el sufijo numérico)*.
   - Correo electrónico de contacto (`línea 81`): `johnatanlozano.dev@gmail.com` *(confirma que el buzón esté activo y reciba mensajes externos antes de hacer público el sitio)*.
2. **Fechas opcionales de formación o proyecto (no obligatorias para lanzar):**
   - En `src/content/education/sena-programacion-software.md`, `startDate` y `endDate` están omitidos para no inventar fechas; si deseas mostrar el año de inicio confirmado (por ejemplo `startDate: "2025"` y `endDate: "En curso"`), puedes añadirlos cuando quieras.
   - En `src/content/projects/smartcut-ai/index.md`, `demoUrl` permanece en `"PENDIENTE"` (`Sin despliegue en línea actual (ejecución local)`), lo cual es exacto mientras el backend no esté desplegado públicamente.

---

## 4. Archivos o evidencias opcionales que faltan (no bloquean el primer despliegue)

- **Hoja de vida en PDF (`public/files/cv.pdf`):** Actualmente no existe el archivo físico y `siteConfig.cv.isAvailable` está en `false`. Cuando tengas la versión revisada (sin dirección residencial exacta ni teléfono privado si prefieres resguardarlos), cópiala en `public/files/cv.pdf` y cambia `cv.isAvailable` a `true` en `src/data/site.ts`.
- **Certificados verificables (`public/files/certificates/*.pdf` y `src/content/certificates/*.md`):** Actualmente solo existe la plantilla de referencia `_ejemplo-certificado.md` con `draft: true`. Cuando dispongas de certificados emitidos por el SENA u otras entidades revisados sin datos sensibles innecesarios, publícalos siguiendo `GUIA_DE_CONTENIDO.md`.
- **Capturas de interfaz limpias adicionales de SmartCut AI (opcional):** El proyecto publica hoy el diagrama técnico verificado `arquitectura-smartcut.svg` (y su fuente `.mmd`). Si más adelante deseas añadir capturas de interfaz del Dashboard o del catálogo, usa únicamente capturas limpias con datos ficticios y sin recuadros rojos.

---

## 5. Nombre de repositorio recomendado y URL final prevista

Tienes **dos opciones plenamente soportadas** sin tocar el código fuente; te recomiendo la **Opción A**:

### Opción A — Recomendada (Dominio raíz de usuario en GitHub Pages)
- **Nombre exacto del repositorio:** `JohnatanL.github.io`
- **Visibilidad requerida en GitHub Free:** `Public`
- **URL final prevista:** `https://johnatanl.github.io/`
- **Ventaja:** Ofrece la URL más limpia, memorable y directa para tu hoja de vida, LinkedIn y firmas de correo, sin subrutas intermedias.

### Opción B — Alternativa (Repositorio de proyecto bajo subruta)
- **Nombre exacto del repositorio:** `portafolio` *(en minúsculas)*
- **Visibilidad requerida en GitHub Free:** `Public`
- **URL final prevista:** `https://johnatanl.github.io/portafolio/`
- **Ventaja:** Deja libre el dominio raíz `https://johnatanl.github.io/` por si en el futuro deseas alojar otra página principal distinta; el workflow `deploy.yml` inyecta automáticamente `BASE_PATH=/portafolio`.

---

## 6. Instrucciones exactas paso a paso para crear el repositorio y publicar

Ejecuta estos pasos **únicamente cuando hayas completado la lista de comprobación de la Sección 7**:

### Paso 1. Crear el repositorio vacío en GitHub
1. Inicia sesión en https://github.com/JohnatanL y haz clic en **New repository**.
2. En **Repository name**, escribe **`JohnatanL.github.io`** *(o `portafolio` si eliges la Opción B)*.
3. Selecciona **Public**.
4. **No marques** *Add a README file*, *Add .gitignore* ni *Choose a license* (el proyecto local ya los incluye).
5. Haz clic en **Create repository**.

### Paso 2. Configurar GitHub Pages para desplegar mediante GitHub Actions
1. Dentro del repositorio recién creado en GitHub, entra en **Settings** -> **Pages** (menú lateral izquierdo, sección *Code and automation*).
2. En **Build and deployment** -> **Source**, cambia *Deploy from a branch* a **GitHub Actions**.

### Paso 3. Inicializar Git localmente, verificar archivos y subir la rama `main`
Abre **PowerShell** en la carpeta `c:\Users\ADMIN\OneDrive\Documentos\SENA\PROGRAMACION DE SOFTWARE\Portafolio` y ejecuta:

```powershell
# 1. Ejecutar verificación técnica completa antes de confirmar cambios
npm test
npm run check
npm run build
npm run verify

# 2. Inicializar repositorio local en la rama main
git init -b main

# 3. Revisar qué archivos se van a incluir (confirmar que NO aparezcan node_modules, dist, .astro ni .env)
git status

# 4. Registrar el primer commit limpio
git add .
git commit -m "chore: lanzamiento inicial del portafolio profesional en Astro"

# 5. Conectar el remoto oficial (ajusta el nombre si elegiste portafolio)
git remote add origin https://github.com/JohnatanL/JohnatanL.github.io.git

# 6. Publicar en la rama main (esto disparará automáticamente el workflow de GitHub Actions)
git push -u origin main
```

### Paso 4. Verificar el despliegue en línea
1. Abre la pestaña **Actions** de tu repositorio en GitHub.
2. Verifica que el flujo **Desplegar Portafolio en GitHub Pages** complete en verde sus dos etapas:
   - `Verificar, compilar y empaquetar (Node 24)`
   - `Publicar en GitHub Pages`
3. Abre la URL publicada (`https://johnatanl.github.io/`) y comprueba la navegación en escritorio y desde tu teléfono móvil.

---

## 7. Lista de comprobaciones personales antes de autorizar el primer `git push`

Marca cada punto personalmente antes de ejecutar `git push`:

- [ ] **1. Correo operativo:** Envié un correo de prueba a `johnatanlozano.dev@gmail.com` y confirmé que recibo mensajes correctamente.
- [ ] **2. Enlace de LinkedIn:** Abrí `https://www.linkedin.com/in/johnatan-david-lozano-suarez-165529239/` en el navegador y confirmé que carga mi perfil público correcto y que su información coincide con la del portafolio.
- [ ] **3. Fecha de etapa productiva:** Confirmé que la frase `'Disponible para etapa productiva desde el 11 de diciembre de 2026'` en `src/data/site.ts` refleja exactamente la fecha oficial de mi ficha en el SENA.
- [ ] **4. Repositorios públicos de SmartCut AI:** Verifiqué en ventana de incógnito que `https://github.com/JohnatanL/SmartCut-AI-Frontend` y `https://github.com/JohnatanL/SmartCut-AI-Backend` abren sin error y no contienen archivos `.env` ni bases de datos con correos reales de terceros.
- [ ] **5. Privacidad personal:** Revisé con `npm run preview` (`http://localhost:4321/`) que en ninguna página aparezcan mi número de documento, teléfono celular ni dirección residencial.
- [ ] **6. Configuración previa en GitHub:** Confirmé que en el nuevo repositorio ya seleccioné **Settings -> Pages -> Source: GitHub Actions** antes de lanzar el push.
- [ ] **7. Revisión de `git status`:** Comprobé que `git status` solo lista los archivos fuente esperados del portafolio y ningún archivo temporal o personal ajeno.

