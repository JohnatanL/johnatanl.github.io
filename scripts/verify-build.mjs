import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, posix, resolve } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');

function normalizeBase(rawBase) {
  if (!rawBase || rawBase.trim() === '' || rawBase.trim() === '/') {
    return '/';
  }
  const withLeading = rawBase.trim().startsWith('/') ? rawBase.trim() : `/${rawBase.trim()}`;
  return withLeading.replace(/\/+$/, '');
}

const basePath = normalizeBase(process.env.BASE_PATH);

if (!existsSync(distDir)) {
  console.error('[verify-build] ERROR: No existe el directorio dist/. Ejecuta "npm run build" primero.');
  process.exit(1);
}

const requiredFiles = [
  'index.html',
  'sobre-mi/index.html',
  'proyectos/index.html',
  'proyectos/smartcut-ai/index.html',
  'evidencias/index.html',
  'habilidades/index.html',
  'formacion/index.html',
  'contacto/index.html',
  '404.html',
  'robots.txt',
  'sitemap-index.xml',
  'sitemap-0.xml',
  'favicon.svg',
];

const errors = [];

for (const rel of requiredFiles) {
  const full = join(distDir, rel);
  if (!existsSync(full)) {
    errors.push(`Archivo esperado ausente en dist/: ${rel}`);
  }
}

function walkFiles(dir, extFilter) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...walkFiles(full, extFilter));
    } else if (!extFilter || full.endsWith(extFilter)) {
      results.push(full);
    }
  }
  return results;
}

const htmlFiles = walkFiles(distDir, '.html');
let totalBytes = 0;
for (const file of walkFiles(distDir)) {
  totalBytes += statSync(file).size;
}

function resolveDistTarget(urlValue) {
  const cleanUrl = urlValue.split('#')[0].split('?')[0];
  if (!cleanUrl || !cleanUrl.startsWith('/')) {
    return null;
  }

  let relativeToBase = cleanUrl;
  if (basePath !== '/') {
    if (cleanUrl !== basePath && !cleanUrl.startsWith(`${basePath}/`)) {
      return { missingBasePrefix: true, cleanUrl };
    }
    relativeToBase = cleanUrl.slice(basePath.length) || '/';
  }

  const normalizedRel = posix.normalize(relativeToBase).replace(/^\/+/, '');
  if (normalizedRel === '') {
    return { targetFile: join(distDir, 'index.html') };
  }

  const directCandidate = join(distDir, normalizedRel);
  if (existsSync(directCandidate) && statSync(directCandidate).isFile()) {
    return { targetFile: directCandidate };
  }

  const indexCandidate = join(distDir, normalizedRel, 'index.html');
  if (existsSync(indexCandidate) && statSync(indexCandidate).isFile()) {
    return { targetFile: indexCandidate };
  }

  return { missingTarget: true, cleanUrl, checked: [directCandidate, indexCandidate] };
}

for (const htmlFile of htmlFiles) {
  const relHtml = htmlFile.slice(distDir.length + 1).replace(/\\/g, '/');
  const html = readFileSync(htmlFile, 'utf-8');

  if (!/<html[^>]*\blang=["']es["']/i.test(html)) {
    errors.push(`[${relHtml}] Falta atributo lang="es" en <html>.`);
  }
  if (!/<title>[^<]+<\/title>/i.test(html)) {
    errors.push(`[${relHtml}] Falta etiqueta <title> con contenido.`);
  }
  if (!/<meta[^>]*name=["']description["'][^>]*content=["'][^"']+["']/i.test(html)) {
    errors.push(`[${relHtml}] Falta meta description válida.`);
  }
  if (!/<link[^>]*rel=["']canonical["'][^>]*href=["']https?:\/\/[^"']+["']/i.test(html)) {
    errors.push(`[${relHtml}] Falta enlace canonical absoluto.`);
  }

  // Verificar que og:image sea absoluto y utilice formato raster compatible con LinkedIn/WhatsApp/X (no .svg)
  const ogImgMatch = /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i.exec(html);
  if (!ogImgMatch) {
    errors.push(`[${relHtml}] Falta etiqueta meta og:image.`);
  } else {
    const ogImgUrl = ogImgMatch[1];
    if (/\.svg(?:[?#]|$)/i.test(ogImgUrl)) {
      errors.push(
        `[${relHtml}] og:image apunta a un archivo SVG ("${ogImgUrl}"), incompatible con vistas previas de LinkedIn/WhatsApp/X.`
      );
    }
    try {
      const parsedOg = new URL(ogImgUrl);
      const ogResolution = resolveDistTarget(parsedOg.pathname);
      if (ogResolution?.missingBasePrefix || ogResolution?.missingTarget) {
        errors.push(`[${relHtml}] El recurso og:image "${parsedOg.pathname}" no existe en dist/.`);
      }
    } catch {
      errors.push(`[${relHtml}] URL inválida en og:image: "${ogImgUrl}".`);
    }
  }

  // Verificar sintaxis JSON-LD válida
  const jsonLdMatch = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i.exec(
    html
  );
  if (!jsonLdMatch) {
    errors.push(`[${relHtml}] Falta bloque de datos estructurados application/ld+json.`);
  } else {
    try {
      JSON.parse(jsonLdMatch[1]);
    } catch {
      errors.push(`[${relHtml}] JSON-LD malformado.`);
    }
  }

  const h1Matches = html.match(/<h1\b/gi) ?? [];
  if (h1Matches.length !== 1) {
    errors.push(`[${relHtml}] Se esperaba exactamente 1 <h1> y se encontraron ${h1Matches.length}.`);
  }

  if (/href=["']PENDIENTE["']|mailto:PENDIENTE/i.test(html)) {
    errors.push(`[${relHtml}] Se filtró un valor 'PENDIENTE' como enlace activo.`);
  }

  if (/_ejemplo-certificado|Plantilla oculta en producción/i.test(html)) {
    errors.push(`[${relHtml}] Se filtró una entrada con draft: true en la compilación.`);
  }

  // Verificar todos los atributos href y src internos
  const attrRegex = /\b(?:href|src)=["']([^"']+)["']/gi;
  let match;
  while ((match = attrRegex.exec(html)) !== null) {
    const val = match[1];
    if (
      val.startsWith('http://') ||
      val.startsWith('https://') ||
      val.startsWith('mailto:') ||
      val.startsWith('#') ||
      val.startsWith('data:')
    ) {
      continue;
    }

    if (!val.startsWith('/')) {
      errors.push(`[${relHtml}] Ruta interna relativa sin barra inicial no permitida: "${val}".`);
      continue;
    }

    // Confirmar que ningún enlace a /files/ carezca de basePath cuando basePath != '/'
    if (basePath !== '/' && val.startsWith('/files/')) {
      errors.push(
        `[${relHtml}] Enlace descargable "${val}" no utilizó withBase(filePath) para BASE_PATH="${basePath}".`
      );
      continue;
    }

    const resolution = resolveDistTarget(val);
    if (resolution?.missingBasePrefix) {
      errors.push(
        `[${relHtml}] La ruta "${val}" no incluye el prefijo BASE_PATH="${basePath}".`
      );
    } else if (resolution?.missingTarget) {
      errors.push(
        `[${relHtml}] Enlace o recurso interno roto hacia "${val}".`
      );
    }
  }
}

const sitemapContent = existsSync(join(distDir, 'sitemap-0.xml'))
  ? readFileSync(join(distDir, 'sitemap-0.xml'), 'utf-8')
  : '';

if (sitemapContent.includes('_ejemplo-certificado') || sitemapContent.includes('/404')) {
  errors.push('[sitemap-0.xml] Contiene entradas en borrador o página 404.');
}

const expectedProjectLoc =
  basePath === '/' ? '/proyectos/smartcut-ai/' : `${basePath}/proyectos/smartcut-ai/`;
if (!sitemapContent.includes(expectedProjectLoc)) {
  errors.push(`[sitemap-0.xml] No incluye la ruta esperada "${expectedProjectLoc}".`);
}

const robotsContent = existsSync(join(distDir, 'robots.txt'))
  ? readFileSync(join(distDir, 'robots.txt'), 'utf-8')
  : '';
const expectedSitemapPath =
  basePath === '/' ? '/sitemap-index.xml' : `${basePath}/sitemap-index.xml`;
if (!robotsContent.includes(expectedSitemapPath)) {
  errors.push(`[robots.txt] No apunta a "${expectedSitemapPath}".`);
}

if (errors.length > 0) {
  console.error(`\n[verify-build] FALLÓ con ${errors.length} error(es) (BASE_PATH="${basePath}"):`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log(
  `[verify-build] OK (BASE_PATH="${basePath}") · ${htmlFiles.length} páginas HTML verificadas · Peso total dist/: ${(
    totalBytes / 1024
  ).toFixed(1)} KB · 0 enlaces rotos.`
);

