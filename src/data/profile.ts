export interface ProfilePillar {
  title: string;
  description: string;
}

export interface ProfileData {
  headline: string;
  lead: string;
  paragraphs: string[];
  pillars: ProfilePillar[];
  currentGoals: string[];
}

export const profileData: ProfileData = {
  headline: 'Formación técnica orientada a construir software claro, verificable y mantenible',
  lead: 'Soy Johnatan Lozano, aprendiz del Servicio Nacional de Aprendizaje (SENA) en el programa Técnico en Programación de Software en Colombia.',
  paragraphs: [
    'Mi proceso formativo se centra en comprender cómo se conectan las distintas piezas de una aplicación real: desde la estructura semántica y la lógica modular en el navegador hasta el diseño de contratos REST, validación de esquemas y persistencia de datos en el servidor.',
    'Durante el desarrollo de proyectos académicos como SmartCut AI he trabajado en la separación explícita entre cliente y backend, la implementación de operaciones CRUD reales con FastAPI y SQLAlchemy sobre SQLite, la autenticación mediante JWT y la contenerización local con Docker Compose.',
    'Valoro la honestidad técnica en la ingeniería: documentar con precisión qué módulos están operativos de extremo a extremo, qué partes corresponden a prototipos visuales y qué limitaciones de seguridad deben resolverse antes de llevar un sistema a producción.',
  ],
  pillars: [
    {
      title: 'Separación de responsabilidades',
      description:
        'Organización del código en capas y clases con funciones claras (clientes HTTP centralizados, routers por dominio, esquemas de validación y modelos ORM).',
    },
    {
      title: 'Integración cliente-servidor real',
      description:
        'Consumo de APIs REST mediante Fetch API, manejo explícito de códigos de estado HTTP, serialización JSON/formularios OAuth2 y retroalimentación clara en interfaz.',
    },
    {
      title: 'Documentación y trazabilidad',
      description:
        'Registro verificable de decisiones técnicas, diagramas de arquitectura, alcance real de cada módulo y guías claras de ejecución y mantenimiento.',
    },
    {
      title: 'Aprendizaje continuo y autocrítica',
      description:
        'Identificación activa de oportunidades de mejora en autorización backend, validaciones de dominio, pruebas automatizadas y accesibilidad web.',
    },
  ],
  currentGoals: [
    'Consolidar buenas prácticas de seguridad y autorización en APIs REST con Python y FastAPI (protección completa por dependencias JWT y control de roles).',
    'Profundizar en escritura directa de consultas SQL, diseño relacional y pruebas automatizadas de integración.',
    'Fortalecer el desarrollo frontend estático y tipado con TypeScript, HTML semántico, CSS moderno y criterios de accesibilidad WCAG AA.',
    'Aportar valor real en un equipo de ingeniería durante mi etapa productiva o primera oportunidad en desarrollo de software.',
  ],
};

