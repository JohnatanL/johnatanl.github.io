import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import {
  externalHttpUrl,
  normalizeProjectEntryId,
  optionalHttpUrlOrPending,
  safePublicFilePath,
} from './utils/schemas';

const projects = defineCollection({
  loader: glob({
    base: './src/content/projects',
    pattern: '**/index.md',
    generateId: ({ entry }) => normalizeProjectEntryId(entry),
  }),
  schema: ({ image }) =>
    z
      .strictObject({
        title: z.string().min(2),
        summary: z.string().min(20).max(220),
        status: z.enum(['prototipo', 'en-desarrollo', 'terminado', 'archivado']),
        createdAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
        coverImage: image().optional(),
        coverAlt: z.string().min(10).optional(),
        technologies: z.array(z.string().min(1)).min(1),
        participation: z.string().min(10),
        problem: z.string().min(20),
        objective: z.string().min(20),
        architecture: z.strictObject({
          summary: z.string().min(20),
          layers: z
            .array(
              z.strictObject({
                name: z.string().min(2),
                description: z.string().min(10),
              })
            )
            .default([]),
        }),
        features: z
          .array(
            z.strictObject({
              title: z.string().min(3),
              description: z.string().min(10),
              scope: z.enum(['implementado', 'demostracion-visual', 'en-progreso']),
            })
          )
          .min(1),
        evidences: z
          .array(
            z.strictObject({
              title: z.string().min(3),
              type: z.enum(['captura', 'diagrama', 'documento', 'video', 'demo']),
              image: image().optional(),
              filePath: safePublicFilePath('/files/').optional(),
              externalUrl: externalHttpUrl.optional(),
              alt: z.string().min(10).optional(),
              caption: z.string().min(10),
            })
          )
          .default([]),
        challenges: z
          .array(
            z.strictObject({
              challenge: z.string().min(10),
              solution: z.string().min(10),
            })
          )
          .default([]),
        learnings: z.array(z.string().min(10)).default([]),
        // Estado técnico actual verificado por auditoría (brechas y restricciones reales)
        limitations: z.array(z.string().min(10)).default([]),
        // Evolución futura propuesta (separada de lo implementado hoy)
        futureImprovements: z.array(z.string().min(10)).default([]),
        repositories: z
          .array(
            z.strictObject({
              label: z.string().min(2),
              url: optionalHttpUrlOrPending,
              visibility: z.enum(['publico', 'privado', 'pendiente']).default('pendiente'),
            })
          )
          .default([]),
        demoUrl: optionalHttpUrlOrPending,
        draft: z.boolean().default(false),
        featured: z.boolean().default(false),
        order: z.number().int().default(100),
      })
      .superRefine((data, ctx) => {
        if (data.coverImage && !data.coverAlt) {
          ctx.addIssue({
            code: 'custom',
            path: ['coverAlt'],
            message: 'coverAlt es obligatorio cuando se incluye coverImage.',
          });
        }

        if (data.createdAt && data.updatedAt && data.updatedAt < data.createdAt) {
          ctx.addIssue({
            code: 'custom',
            path: ['updatedAt'],
            message: 'updatedAt no puede ser anterior a createdAt.',
          });
        }

        data.evidences.forEach((ev, idx) => {
          const definedSources = [
            Boolean(ev.image),
            Boolean(ev.filePath),
            Boolean(ev.externalUrl),
          ].filter(Boolean).length;

          if (definedSources !== 1) {
            ctx.addIssue({
              code: 'custom',
              path: ['evidences', idx],
              message: `La evidencia "${ev.title}" debe tener exactamente una fuente principal válida (image, filePath o externalUrl); actualmente tiene ${definedSources}.`,
            });
          }

          if (ev.image && !ev.alt) {
            ctx.addIssue({
              code: 'custom',
              path: ['evidences', idx, 'alt'],
              message: `La imagen informativa de la evidencia "${ev.title}" requiere texto alternativo (alt) obligatorio.`,
            });
          }
        });
      }),
});

const certificates = defineCollection({
  loader: glob({
    base: './src/content/certificates',
    pattern: '**/*.md',
  }),
  schema: ({ image }) =>
    z
      .strictObject({
        title: z.string().min(3),
        issuer: z.string().min(2),
        issueDate: z.coerce.date().optional(),
        description: z.string().min(10),
        previewImage: image().optional(),
        previewAlt: z.string().min(10).optional(),
        filePath: safePublicFilePath('/files/certificates/').optional(),
        verificationUrl: optionalHttpUrlOrPending,
        draft: z.boolean().default(false),
      })
      .superRefine((data, ctx) => {
        if (data.previewImage && !data.previewAlt) {
          ctx.addIssue({
            code: 'custom',
            path: ['previewAlt'],
            message: 'previewAlt es obligatorio cuando incluyes previewImage.',
          });
        }
      }),
});

const education = defineCollection({
  loader: glob({
    base: './src/content/education',
    pattern: '**/*.md',
  }),
  schema: z.strictObject({
    title: z.string().min(3),
    institution: z.string().min(2),
    category: z.enum(['formacion-academica', 'curso-complementario', 'logro']),
    status: z.enum(['en-curso', 'finalizado']),
    location: z.string().default('Colombia'),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    summary: z.string().min(15),
    highlights: z.array(z.string().min(5)).default([]),
    order: z.number().int().default(100),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, certificates, education };

