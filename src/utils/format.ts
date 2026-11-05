export type ProjectStatus = 'prototipo' | 'en-desarrollo' | 'terminado' | 'archivado';
export type EvidenceType = 'captura' | 'diagrama' | 'documento' | 'video' | 'demo';
export type FeatureScope = 'implementado' | 'demostracion-visual' | 'en-progreso';
export type SkillAdoptionContext = 'aplicado-en-proyectos' | 'en-formacion' | 'uso-academico';
export type EducationCategory = 'formacion-academica' | 'curso-complementario' | 'logro';
export type EducationStatus = 'en-curso' | 'finalizado';

export const PROJECT_STATUS_META: Record<
  ProjectStatus,
  { label: string; tone: 'info' | 'warning' | 'success' | 'neutral' }
> = {
  prototipo: { label: 'Prototipo funcional académico', tone: 'info' },
  'en-desarrollo': { label: 'En desarrollo', tone: 'warning' },
  terminado: { label: 'Finalizado', tone: 'success' },
  archivado: { label: 'Archivado', tone: 'neutral' },
};

export const EVIDENCE_TYPE_LABELS: Record<EvidenceType, string> = {
  captura: 'Captura de interfaz',
  diagrama: 'Diagrama técnico',
  documento: 'Documento técnico',
  video: 'Demostración en video',
  demo: 'Demostración interactiva',
};

export const FEATURE_SCOPE_META: Record<
  FeatureScope,
  { label: string; description: string; tone: 'success' | 'info' | 'warning' }
> = {
  implementado: {
    label: 'Implementado y operativo',
    description: 'Funcionalidad verificada en código con integración real entre capas.',
    tone: 'success',
  },
  'demostracion-visual': {
    label: 'Demostración visual de interfaz',
    description: 'Módulo interactivo de prototipo sin persistencia final o sin motor externo.',
    tone: 'info',
  },
  'en-progreso': {
    label: 'En progreso',
    description: 'Funcionalidad en desarrollo o evolución planificada.',
    tone: 'warning',
  },
};

export const SKILL_CONTEXT_META: Record<
  SkillAdoptionContext,
  { label: string; tone: 'success' | 'info' | 'neutral' }
> = {
  'aplicado-en-proyectos': { label: 'Aplicado en proyectos', tone: 'success' },
  'en-formacion': { label: 'En formación', tone: 'info' },
  'uso-academico': { label: 'Práctica académica', tone: 'neutral' },
};

export const EDUCATION_CATEGORY_LABELS: Record<EducationCategory, string> = {
  'formacion-academica': 'Formación titulada',
  'curso-complementario': 'Formación complementaria',
  logro: 'Logro académico',
};

export const EDUCATION_STATUS_LABELS: Record<EducationStatus, string> = {
  'en-curso': 'En curso',
  finalizado: 'Finalizado',
};

const monthYearFormatter = new Intl.DateTimeFormat('es-CO', {
  year: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

/**
 * Formatea una fecha verificada en español colombiano usando UTC para evitar desfases de huso horario.
 * Si no existe fecha confirmada, devuelve null para que la interfaz la omita limpiamente.
 */
export function formatVerifiedDate(date?: Date): string | null {
  if (!date || Number.isNaN(date.getTime())) {
    return null;
  }
  return monthYearFormatter.format(date);
}

