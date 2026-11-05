# Portafolio Profesional — Johnatan Lozano

Aplicación web estática, accesible y mantenible construida con **Astro 7.4.5** y **TypeScript 6 estricto** para documentar proyectos de software, arquitectura, habilidades verificables, formación en el SENA y evidencias técnicas.

---

## Decisiones técnicas y stack

- **Generador estático:** `astro@^7.4.5` (Content Layer API con `glob()`, Fonts API local, optimización `astro:assets`).
- **Tipado y calidad estática:** `typescript@^6.0.3` (`astro/tsconfigs/strictest`) + `@astrojs/check@^0.9.12`.
- **Validación de contenido:** **Zod 4** (`astro/zod`) con `z.strictObject()` en esquemas raíz y anidados, `z.httpUrl()` sintáctico para enlaces externos y `safePublicFilePath()` para documentos descargables bajo `/files/`.
- **SEO:** Metadatos canónicos, Open Graph, esquema `Person` y `WebSite` en `JSON-LD`, `robots.txt` dinámico y `@astrojs/sitemap@^3.7.4`.
- **Estilos e interactividad:** CSS moderno nativo con variables de diseño (identidad híbrida Navy `#101827` + superficie clara `#f4f6fa`), sin frameworks CSS ni bibliotecas JS de cliente innecesarias.
- **Entorno recomendado:** **Node.js `24.22.2` LTS** (`>= 22.23.4`) y `npm >= 9.6.5`.

---

## Estructura principal del proyecto

```text
Portafolio/
├── .github/workflows/deploy.yml   # Pipeline CI/CD reproducible con Node 24 y npm ci
├── public/
│   ├── favicon.svg                # Monograma vectorial JL
│   └── files/                     # Archivos descargables públicos (cv.pdf, certificates/)
├── scripts/verify-build.mjs       # Verificador de rutas, enlaces, metadatos y BASE_PATH
├── src/
│   ├── assets/images/             # Imagen Open Graph raster (og-default.png) y fuente SVG editable
│   ├── components/                # Componentes modulares (layout, seo, ui, projects, evidence...)
│   ├── content/                   # Contenido editable en Markdown (projects, education, certificates)
│   ├── data/                      # Configuración tipada (site.ts, profile.ts, skills.ts)
│   ├── layouts/                   # BaseLayout.astro y CaseStudyLayout.astro
│   ├── pages/                     # Rutas estáticas y robots.txt.ts
│   ├── styles/                    # tokens.css, reset.css y global.css
│   ├── utils/                     # paths.ts (withBase), schemas.ts, content.ts y format.ts
│   └── content.config.ts          # Definición de colecciones y esquemas Zod 4
├── templates/                     # Plantillas reutilizables para proyectos, certificados y formación
├── tests/                         # Pruebas automatizadas con node:test
├── GUIA_DE_CONTENIDO.md           # Manual paso a paso de edición y mantenimiento autónomo
└── astro.config.mjs               # Configuración estática y compatibilidad dual GitHub Pages
```

---

## Ejecución local y comandos de verificación

1. **Instalar dependencias de forma exacta:**
   ```bash
   npm ci
   ```
   *(O `npm install` únicamente cuando actualices paquetes deliberadamente).*

2. **Iniciar servidor de desarrollo local (`http://localhost:4321/`):**
   ```bash
   npm run dev
   ```

3. **Ejecutar pruebas automatizadas (`safePublicFilePath`, `z.strictObject`, `z.httpUrl` y `withBase`):**
   ```bash
   npm test
   ```

4. **Verificar tipado TypeScript y plantillas Astro (`0 errors` y `0 warnings` exigidos):**
   ```bash
   npm run check
   ```

5. **Compilar para producción y verificar integridad de `dist/`:**
   ```bash
   npm run build
   npm run verify
   ```

6. **Previsualizar el sitio estático compilado localmente:**
   ```bash
   npm run preview
   ```

### Prueba local con subruta de GitHub Pages (`BASE_PATH=/portafolio`)

En PowerShell puedes comprobar el comportamiento cuando el sitio se aloja en `https://johnatanl.github.io/portafolio/`:

```powershell
$env:BASE_PATH="/portafolio"; npm run build; npm run verify; Remove-Item Env:\BASE_PATH
```

---

## Mantenimiento del contenido

Consulta **[GUIA_DE_CONTENIDO.md](./GUIA_DE_CONTENIDO.md)** para instrucciones detalladas paso a paso sobre cómo agregar proyectos, capturas limpias, diagramas, certificados, hoja de vida y enlaces sin modificar los componentes visuales.

