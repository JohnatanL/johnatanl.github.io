import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { z } from 'astro/zod';
import { siteConfig } from '../src/data/site.ts';
import { hasConfirmedUrl, isCurrentRoute, isPending, normalizeBase, withBase } from '../src/utils/paths.ts';
import {
  externalHttpUrl,
  normalizeProjectEntryId,
  optionalHttpUrlOrPending,
  safePublicFilePath,
  siteConfigSchema,
} from '../src/utils/schemas.ts';

describe('safePublicFilePath() — Blindaje de rutas descargables en /files/', () => {
  const generalFileSchema = safePublicFilePath('/files/');
  const certificateFileSchema = safePublicFilePath('/files/certificates/');

  it('acepta rutas locales válidas dentro de /files/ y /files/certificates/', () => {
    const validGeneralPaths = [
      '/files/cv.pdf',
      '/files/manual-tecnico-smartcut.pdf',
      '/files/documentos/arquitectura_v1.2.pdf',
      '/files/certificates/constancia-sena-2026.pdf',
    ];

    for (const filePath of validGeneralPaths) {
      const result = generalFileSchema.safeParse(filePath);
      assert.equal(result.success, true, `Debió aceptar la ruta válida: ${filePath}`);
    }

    const validCertPaths = [
      '/files/certificates/certificado-sena.pdf',
      '/files/certificates/2026/curso-complementario_01.pdf',
    ];

    for (const certPath of validCertPaths) {
      const result = certificateFileSchema.safeParse(certPath);
      assert.equal(result.success, true, `Debió aceptar el certificado válido: ${certPath}`);
    }
  });

  it('rechaza traversal con segmentos .. o . que salgan o alteren /files/', () => {
    const traversalPaths = [
      '/files/../package.json',
      '/files/../../etc/passwd',
      '/files/subcarpeta/../../astro.config.mjs',
      '/files/./cv.pdf',
      '/files/sub/./doc.pdf',
      '/files/..',
      '/files/.',
    ];

    for (const badPath of traversalPaths) {
      assert.equal(
        generalFileSchema.safeParse(badPath).success,
        false,
        `Debió rechazar traversal: ${badPath}`
      );
    }

    assert.equal(
      certificateFileSchema.safeParse('/files/certificates/../otro-documento.pdf').success,
      false,
      'Debió rechazar salida desde /files/certificates/ hacia /files/'
    );
  });

  it('rechaza barras invertidas de Windows (\\)', () => {
    const backslashPaths = [
      '/files/..\\package.json',
      '/files\\cv.pdf',
      '\\files\\cv.pdf',
      '/files/sub\\archivo.pdf',
      '/files/certificates\\cert.pdf',
    ];

    for (const badPath of backslashPaths) {
      assert.equal(
        generalFileSchema.safeParse(badPath).success,
        false,
        `Debió rechazar barra invertida: ${badPath}`
      );
    }
  });

  it('rechaza secuencias codificadas (%) incluyendo variantes simples y doblemente codificadas', () => {
    const encodedPaths = [
      '/files/%2e%2e/package.json',
      '/files/%2E%2E/secret.txt',
      '/files/%2e%2e%2fpackage.json',
      '/files/%252e%252e/package.json',
      '/files/..%5cpackage.json',
      '/files/certificates/%2e%2e/cv.pdf',
      '/files/documento%20con%20espacios.pdf',
      '/files/nulo%00.pdf',
    ];

    for (const badPath of encodedPaths) {
      assert.equal(
        generalFileSchema.safeParse(badPath).success,
        false,
        `Debió rechazar secuencia codificada: ${badPath}`
      );
    }
  });

  it('rechaza archivos o directorios ocultos (prefijo punto)', () => {
    const hiddenPaths = [
      '/files/.gitkeep',
      '/files/.env',
      '/files/.htaccess',
      '/files/sub/.oculto.pdf',
      '/files/.carpeta/documento.pdf',
      '/files/certificates/.gitkeep',
    ];

    for (const badPath of hiddenPaths) {
      assert.equal(
        generalFileSchema.safeParse(badPath).success,
        false,
        `Debió rechazar ruta oculta: ${badPath}`
      );
    }
  });

  it('rechaza parámetros query (?), fragmentos (#), dobles barras, prefijos ajenos y directorios vacíos', () => {
    const malformedPaths = [
      '/files/cv.pdf?download=1',
      '/files/cv.pdf#page=2',
      '/files/cv.pdf?v=1#top',
      '/files//cv.pdf',
      '/files/',
      '/files/subcarpeta/',
      '/assets/cv.pdf',
      'files/cv.pdf',
      'https://example.com/files/cv.pdf',
      '/files/nulo\u0000.pdf',
    ];

    for (const badPath of malformedPaths) {
      assert.equal(
        generalFileSchema.safeParse(badPath).success,
        false,
        `Debió rechazar ruta malformada o con parámetros: ${badPath}`
      );
    }
  });
});

describe('externalHttpUrl, normalizeProjectEntryId y z.strictObject() en Zod 4', () => {
  it('valida sintácticamente HTTP/HTTPS y rechaza esquemas no permitidos o localhost', () => {
    assert.equal(
      externalHttpUrl.safeParse('https://github.com/JohnatanL/SmartCut-AI-Frontend').success,
      true
    );
    assert.equal(externalHttpUrl.safeParse('http://ejemplo.edu.co/verificacion').success, true);
    assert.equal(optionalHttpUrlOrPending.safeParse('PENDIENTE').success, true);

    for (const invalidUrl of [
      'javascript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'file:///C:/Windows/win.ini',
      'ftp://servidor.ejemplo.com/archivo.zip',
      'mailto:correo@ejemplo.com',
      'http://localhost:8000/docs',
      '/proyectos/smartcut-ai/',
    ]) {
      assert.equal(
        externalHttpUrl.safeParse(invalidUrl).success,
        false,
        `Debió rechazar URL inválida: ${invalidUrl}`
      );
    }
  });

  it('genera identificadores limpios desde <slug>/index.md y rechaza nombres inválidos', () => {
    assert.equal(normalizeProjectEntryId('smartcut-ai/index.md'), 'smartcut-ai');
    assert.equal(normalizeProjectEntryId('SmartCut-AI\\index.md'), 'smartcut-ai');
    assert.throws(() => normalizeProjectEntryId('Proyecto Con Espacios/index.md'));
  });

  it('rechaza propiedades desconocidas en objetos raíz y anidados con z.strictObject()', () => {
    const sampleNestedSchema = z.strictObject({
      architecture: z.strictObject({
        summary: z.string(),
        layers: z.array(z.strictObject({ name: z.string(), description: z.string() })),
      }),
    });

    assert.equal(
      sampleNestedSchema.safeParse({
        architecture: {
          summary: 'Resumen válido',
          layers: [{ name: 'API', description: 'FastAPI' }],
        },
      }).success,
      true
    );

    assert.equal(
      sampleNestedSchema.safeParse({
        slug: 'no-permitido',
        architecture: {
          summary: 'Resumen válido',
          layers: [],
        },
      }).success,
      false
    );

    assert.equal(
      sampleNestedSchema.safeParse({
        architecture: {
          summary: 'Resumen válido',
          campoDesconocido: true,
          layers: [],
        },
      }).success,
      false
    );
  });
});

describe('withBase(filePath) — Enlaces descargables y rutas en dominio raíz y subruta GitHub Pages', () => {
  it('resuelve correctamente documentos descargables en dominio raíz (/)', () => {
    assert.equal(normalizeBase('/'), '/');
    assert.equal(withBase('/files/cv.pdf', '/'), '/files/cv.pdf');
    assert.equal(
      withBase('/files/certificates/certificado-sena.pdf', '/'),
      '/files/certificates/certificado-sena.pdf'
    );
    assert.equal(withBase('/proyectos/smartcut-ai', '/'), '/proyectos/smartcut-ai/');
  });

  it('resuelve correctamente documentos descargables en subruta (/portafolio) sin barra final en archivos', () => {
    assert.equal(normalizeBase('/portafolio/'), '/portafolio');
    assert.equal(normalizeBase('portafolio'), '/portafolio');

    assert.equal(withBase('/files/cv.pdf', '/portafolio'), '/portafolio/files/cv.pdf');
    assert.equal(withBase('/files/cv.pdf', '/portafolio/'), '/portafolio/files/cv.pdf');
    assert.equal(
      withBase('/files/certificates/certificado-sena.pdf', '/portafolio'),
      '/portafolio/files/certificates/certificado-sena.pdf'
    );
    // Evita doble prefijo si ya estuviese prefijado
    assert.equal(
      withBase('/portafolio/files/cv.pdf', '/portafolio'),
      '/portafolio/files/cv.pdf'
    );
    // Conserva barra final únicamente en rutas de páginas
    assert.equal(withBase('/', '/portafolio'), '/portafolio/');
    assert.equal(
      withBase('/proyectos/smartcut-ai', '/portafolio'),
      '/portafolio/proyectos/smartcut-ai/'
    );
  });

  it('verifica helpers de estado pendiente y ruta activa bajo raíz y subruta', () => {
    assert.equal(isPending('PENDIENTE'), true);
    assert.equal(isPending(''), true);
    assert.equal(hasConfirmedUrl('https://github.com/JohnatanL'), true);
    assert.equal(hasConfirmedUrl('PENDIENTE'), false);

    assert.equal(isCurrentRoute('/proyectos/smartcut-ai/', '/proyectos/', '/'), true);
    assert.equal(
      isCurrentRoute('/portafolio/proyectos/smartcut-ai/', '/proyectos/', '/portafolio'),
      true
    );
    assert.equal(isCurrentRoute('/portafolio/proyectos/', '/', '/portafolio'), false);
  });

  it('garantiza que todos los componentes con descargas usen withBase(filePath)', () => {
    const downloadableComponents = [
      'src/components/ui/HeroBand.astro',
      'src/components/layout/Footer.astro',
      'src/components/contact/ContactCard.astro',
      'src/components/evidence/EvidenceGallery.astro',
      'src/components/education/CertificateCard.astro',
    ];

    for (const relativeFile of downloadableComponents) {
      const fullPath = resolve(process.cwd(), relativeFile);
      const source = readFileSync(fullPath, 'utf-8');

      assert.match(
        source,
        /withBase\([^)]*filePath\)/,
        `El componente ${relativeFile} debe envolver filePath con withBase(...)`
      );
      assert.doesNotMatch(
        source,
        /href=\{[^}]*(?<!withBase\()([a-zA-Z0-9_.]+filePath)\}/,
        `El componente ${relativeFile} no debe usar filePath directo en href sin withBase()`
      );
    }
  });

  it('valida íntegramente src/data/site.ts y la consistencia del archivo físico cv.pdf', () => {
    const parsed = siteConfigSchema.safeParse(siteConfig);
    assert.equal(
      parsed.success,
      true,
      `siteConfig no superó la validación Zod: ${parsed.success ? '' : JSON.stringify(parsed.error.issues)}`
    );

    if (siteConfig.cv.isAvailable) {
      const physicalCv = resolve(process.cwd(), 'public', siteConfig.cv.filePath.replace(/^\/+/, ''));
      assert.equal(
        existsSync(physicalCv),
        true,
        `siteConfig.cv.isAvailable es true pero no existe el archivo ${physicalCv}`
      );
    }
  });
});

