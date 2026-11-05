import { posix } from 'node:path';
import { z } from 'astro/zod';

/**
 * Validación sintáctica de esquema HTTP/HTTPS y formato de hostname.
 * No verifica que el dominio esté registrado, exista en DNS o sea accesible en red.
 */
export const externalHttpUrl = z.httpUrl({
  error:
    'Debe ser una URL externa con esquema https:// (recomendado) o http:// y formato de hostname válido.',
});

export const optionalHttpUrlOrPending = z
  .union([z.literal('PENDIENTE'), externalHttpUrl])
  .optional();

export const emailOrPending = z.union([
  z.literal('PENDIENTE'),
  z.email({ error: 'Debe ser un correo electrónico válido o el literal "PENDIENTE".' }),
]);

export const slugSegmentRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Genera de forma determinista el identificador de proyecto a partir de
 * src/content/projects/<slug>/index.md evitando sufijos /index o duplicidad de rutas.
 */
export function normalizeProjectEntryId(entry: string): string {
  const id = entry.replace(/\\/g, '/').replace(/\/index\.md$/i, '').toLowerCase();
  if (!slugSegmentRegex.test(id)) {
    throw new Error(
      `Nombre de carpeta de proyecto inválido "${id}". Usa kebab-case como src/content/projects/mi-proyecto/index.md.`
    );
  }
  return id;
}

/**
 * Restringe rutas locales descargables para que permanezcan estrictamente dentro de /files/
 * (o /files/certificates/), rechazando traversal (..), barras invertidas (\), variantes
 * codificadas (%), archivos ocultos y parámetros o fragmentos (?, #).
 */
export function safePublicFilePath(allowedPrefix: '/files/' | '/files/certificates/' = '/files/') {
  return z.string().refine(
    (val) => {
      if (!val.startsWith(allowedPrefix) || val.length <= allowedPrefix.length) {
        return false;
      }

      if (
        val.includes('\\') ||
        val.includes('%') ||
        val.includes('?') ||
        val.includes('#') ||
        val.includes('//') ||
        val.endsWith('/') ||
        /[\u0000-\u001f\u007f]/.test(val)
      ) {
        return false;
      }

      const normalized = posix.normalize(val);
      if (normalized !== val || !normalized.startsWith(allowedPrefix)) {
        return false;
      }

      const segments = val.slice(allowedPrefix.length).split('/');
      return segments.every(
        (seg) =>
          seg.length > 0 &&
          seg !== '.' &&
          seg !== '..' &&
          !seg.startsWith('.') &&
          /^[a-zA-Z0-9._-]+$/.test(seg)
      );
    },
    {
      error: `La ruta debe permanecer dentro de "${allowedPrefix}" sin segmentos "..", barras invertidas, archivos ocultos, parámetros ni secuencias codificadas.`,
    }
  );
}

/**
 * Esquema estricto para validar src/data/site.ts antes de publicar.
 */
export const siteConfigSchema = z.strictObject({
  siteName: z.string().min(5),
  defaultTitle: z.string().min(5),
  defaultDescription: z.string().min(30),
  locale: z.string().min(2),
  author: z.strictObject({
    name: z.string().min(2),
    shortRole: z.string().min(5),
    fullRole: z.string().min(5),
    institution: z.string().min(3),
    location: z.string().min(2),
    tagline: z.string().min(10),
  }),
  availability: z.strictObject({
    isAvailable: z.boolean(),
    label: z.string().min(5),
    detail: z.string().min(10),
  }),
  social: z.strictObject({
    github: z.strictObject({
      label: z.string().min(2),
      handle: z.string().min(2),
      url: z.union([z.literal('PENDIENTE'), externalHttpUrl]),
    }),
    linkedin: z.strictObject({
      label: z.string().min(2),
      url: z.union([z.literal('PENDIENTE'), externalHttpUrl]),
    }),
    email: z.strictObject({
      label: z.string().min(2),
      value: emailOrPending,
    }),
  }),
  cv: z.strictObject({
    isAvailable: z.boolean(),
    filePath: safePublicFilePath('/files/'),
    label: z.string().min(3),
    pendingLabel: z.string().min(3),
  }),
  navigation: z
    .array(
      z.strictObject({
        label: z.string().min(2),
        href: z.string().startsWith('/'),
      })
    )
    .min(1),
});

