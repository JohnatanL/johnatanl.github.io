# Guía de Edición y Mantenimiento de Contenido

Esta guía explica paso a paso cómo actualizar y ampliar tu portafolio editando únicamente archivos Markdown y de configuración en `src/content/`, `src/data/` y `public/files/`, **sin necesidad de modificar componentes `.astro` ni hojas CSS**.

---

## 1. Cómo añadir un proyecto nuevo

Cada proyecto vive en su propia carpeta autocontenida usando `index.md`:

1. Crea una carpeta en formato `kebab-case` (solo letras minúsculas, números y guiones) dentro de `src/content/projects/`:
   ```text
   src/content/projects/mi-nuevo-proyecto/
   ├── index.md
   └── evidence/
   ```
2. Copia el contenido de `templates/proyecto-plantilla.md` dentro de `src/content/projects/mi-nuevo-proyecto/index.md`.
3. Completa los campos del encabezado (`frontmatter`). **No agregues un campo `slug`**: la ruta final `/proyectos/mi-nuevo-proyecto/` se genera automáticamente a partir del nombre de la carpeta.
4. Escribe el desarrollo técnico en Markdown debajo del bloque `---`.
5. Mientras estés redactando, deja `draft: true`. Cuando hayas revisado todo, cámbialo a `draft: false`.

---

## 2. Cómo incorporar capturas de interfaz seguras y limpias

1. Antes de guardar una captura en `src/content/projects/<slug>/evidence/`, verifica estas tres reglas de calidad y privacidad:
   - **Cero datos reales de terceros:** usa siempre cuentas y correos ficticios (por ejemplo `cliente.demo@ejemplo.com`). Nunca publiques nombres reales, correos `@gmail.com` de personas reales, teléfonos ni documentos de identidad.
   - **Cero fotografías de personas identificables** sin autorización expresa.
   - **Cero recuadros rojos o flechas manuales** de manuales de usuario; toma capturas limpias directamente del navegador.
2. Guarda la imagen (preferiblemente `.png` o `.webp`) en `src/content/projects/<slug>/evidence/panel-principal.png`.
3. Regístrala en la lista `evidences:` de `index.md` incluyendo texto alternativo `alt` obligatorio (mínimo 10 caracteres):
   ```yaml
   evidences:
     - title: "Panel administrativo con indicadores en tiempo real"
       type: "captura"
       image: "./evidence/panel-principal.png"
       alt: "Vista del panel principal mostrando contadores de servicios y productos conectados a la API."
       caption: "Interfaz conectada mediante Fetch API mostrando datos ficticios de demostración."
   ```
   Astro generará automáticamente versiones optimizadas `AVIF` y `WebP` y habilitará la ampliación modal accesible `<dialog>`.

---

## 3. Cómo crear o actualizar diagramas de arquitectura (`.mmd` + `.svg`)

1. Conserva siempre la fuente editable Mermaid en `src/content/projects/<slug>/evidence/arquitectura-<slug>.mmd`.
2. Exporta su representación vectorial estática como `arquitectura-<slug>.svg` en la misma carpeta `evidence/` (asegurándote de incluir `<title>` o `alt` descriptivo y representar únicamente componentes reales del proyecto).
3. Referencia el archivo `.svg` en `coverImage` o dentro de `evidences` con `image: "./evidence/arquitectura-<slug>.svg"`.

---

## 4. Cómo añadir documentos PDF descargables a un proyecto

1. Revisa página por página que el PDF no contenga datos sensibles ni capturas con correos reales de terceros (por ejemplo, anonimiza cualquier tabla con datos reales antes de exportar el PDF).
2. Guarda el PDF en `public/files/` usando un nombre limpio sin espacios ni tildes (solo letras, números, puntos, guiones o guiones bajos), por ejemplo:
   `public/files/manual-tecnico-smartcut-anonimizado.pdf`
3. Regístralo en `evidences` usando **únicamente** `filePath` (recuerda: cada evidencia debe tener **exactamente una** fuente principal entre `image`, `filePath` o `externalUrl`):
   ```yaml
   - title: "Manual técnico anonimizado"
     type: "documento"
     filePath: "/files/manual-tecnico-smartcut-anonimizado.pdf"
     caption: "Documentación de instalación y operación revisada sin datos personales."
   ```
   El sitio aplica automáticamente `withBase(filePath)` para que la descarga funcione tanto en dominio raíz como en subruta de GitHub Pages.

---

## 5. Cómo publicar o actualizar tu Hoja de Vida (`cv.pdf`)

1. Exporta tu hoja de vida revisada (sin dirección residencial exacta ni datos sensibles que no desees exponer públicamente) y cópiala exactamente en:
   `public/files/cv.pdf`
2. Abre `src/data/site.ts` y cambia `cv.isAvailable` de `false` a `true`:
   ```ts
   cv: {
     isAvailable: true,
     filePath: '/files/cv.pdf',
     label: 'Descargar hoja de vida (PDF)',
     pendingLabel: 'Hoja de vida en PDF pendiente de publicación',
   },
   ```
3. Los botones del Hero, Contacto y Pie de página se activarán automáticamente usando `withBase('/files/cv.pdf')`.

---

## 6. Cómo añadir certificados verificables

1. Si tienes el PDF del certificado, guárdalo en `public/files/certificates/` con un nombre limpio (ej. `public/files/certificates/sena-python-2026.pdf`).
2. Crea un archivo nuevo en `src/content/certificates/sena-python-2026.md` basándote en `templates/certificado-plantilla.md`.
3. Completa `title`, `issuer`, `description`, opcionalmente `issueDate` (solo si tienes la fecha exacta), `filePath: "/files/certificates/sena-python-2026.pdf"` y `verificationUrl` (`"PENDIENTE"` o una URL `https://...`).
4. Cambia `draft: false`. Al existir al menos un certificado publicado, la sección **Certificados publicados** aparecerá automáticamente en `/formacion/`.

---

## 7. Cómo actualizar o añadir entradas de formación académica

1. Para actualizar tu formación actual en el SENA, edita `src/content/education/sena-programacion-software.md`. Cuando culmines el programa, basta con cambiar `status: "en-curso"` a `status: "finalizado"`.
2. Para agregar otro estudio o curso complementario relevante, copia `templates/formacion-plantilla.md` en `src/content/education/<nuevo-estudio>.md`, ajusta `order` (números menores aparecen primero) y pon `draft: false`.

---

## 8. Cómo actualizar habilidades técnicas (incluyendo cuándo reclasificar `SQL`)

Edita `src/data/skills.ts`:
- Cada habilidad usa un contexto objetivo: `'aplicado-en-proyectos'`, `'en-formacion'` o `'uso-academico'`.
- **Regla de autenticidad sobre `SQL`:** Actualmente `SQL` está clasificado como `'en-formacion'` porque SmartCut AI interactúa con SQLite mediante `SQLAlchemy ORM`. Cuando publiques un proyecto o script donde hayas escrito consultas o esquemas SQL directamente (`SELECT`, `JOIN`, `CREATE TABLE`, vistas o migraciones SQL propias), cambia su `context` a `'aplicado-en-proyectos'` y añade el identificador del proyecto en `relatedProjects: ['slug-del-proyecto']`.

---

## 9. Cómo activar LinkedIn, correo electrónico o enlaces externos

Abre `src/data/site.ts` y reemplaza `'PENDIENTE'` por tus datos reales confirmados:
```ts
linkedin: {
  label: 'LinkedIn',
  url: 'https://www.linkedin.com/in/tu-usuario/',
},
email: {
  label: 'Correo electrónico',
  value: 'tu.correo@dominio.com',
},
```
Al guardar y compilar, las etiquetas *Pendiente de enlazar* / *En actualización* se sustituirán automáticamente por botones activos y `LinkedIn` se incorporará en `sameAs` de los datos estructurados `JSON-LD`.

---

## 10. Cómo actualizar tu narrativa "Sobre mí" y disponibilidad

- **Disponibilidad profesional:** En `src/data/site.ts`, edita `availability.isAvailable` (`true` o `false`), `availability.label` y `availability.detail`.
- **Texto de Sobre mí:** En `src/data/profile.ts`, edita `headline`, `lead`, `paragraphs`, `pillars` y `currentGoals`.

---

## 11. Uso del modo borrador (`draft: true`) y ocultamiento de secciones

- Cualquier archivo en `projects/`, `certificates/` o `education/` con `draft: true` es validado por Zod (para detectar errores a tiempo), pero **queda completamente excluido** de las páginas generadas y de `sitemap-0.xml`.
- Si una colección queda con `0` elementos publicados (como ocurre inicialmente con `certificates/`), la interfaz oculta automáticamente el bloque vacío sin mostrar recuadros rotos.

---

## 12. Flujo obligatorio de comprobación antes de publicar cambios

Ejecuta siempre estos cuatro comandos desde la carpeta `Portafolio` antes de confirmar cambios:

```bash
npm test
npm run check
npm run build
npm run verify
```

Si los cuatro terminan sin errores (`exit code 0`), tu contenido cumple todas las reglas de tipado, accesibilidad de imágenes, enlaces internos y seguridad de rutas.

---

## 13. Solución rápida de errores frecuentes de validación

- **`Unrecognized key(s) in object`:** Escribiste un nombre de campo con error tipográfico o agregaste `slug` en el frontmatter. Revisa `templates/` porque `z.strictObject()` rechaza propiedades desconocidas.
- **`debe tener exactamente una fuente principal válida`:** Una entrada en `evidences` no tiene ninguna fuente o tiene dos al mismo tiempo (por ejemplo `image` y `externalUrl` juntos). Deja solo una.
- **`requiere texto alternativo (alt) obligatorio`:** Agregaste `image` (o `coverImage` / `previewImage`) sin definir su texto descriptivo `alt` (`coverAlt` / `previewAlt`) de al menos 10 caracteres.
- **`La ruta debe permanecer dentro de "/files/"`:** En `filePath` usaste espacios codificados (`%20`), barras invertidas (`\`), segmentos `..` o no comenzaste con `/files/`. Renombra el archivo usando solo letras, números, puntos y guiones.
- **`Debe ser una URL externa con esquema https://...`:** Pusiste una ruta relativa, `localhost` o un esquema distinto de `https://` / `http://` en `externalUrl`, `demoUrl`, `verificationUrl` o `repositories[].url` (si aún no existe la URL, escribe exactamente `"PENDIENTE"`).

