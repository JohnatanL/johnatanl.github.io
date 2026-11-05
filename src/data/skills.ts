import type { SkillAdoptionContext } from '../utils/format';

export interface SkillItem {
  name: string;
  context: SkillAdoptionContext;
  detail: string;
  relatedProjects: string[];
}

export interface SkillCategory {
  id: string;
  title: string;
  summary: string;
  skills: SkillItem[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'lenguajes',
    title: 'Lenguajes',
    summary:
      'Lenguajes empleados en interfaces web, servicios backend, tipado estático y formación en bases de datos.',
    skills: [
      {
        name: 'Python',
        context: 'aplicado-en-proyectos',
        detail:
          'Desarrollo de servicios REST con Python 3.12, organización modular por paquetes (routers, modelos, esquemas y seguridad).',
        relatedProjects: ['smartcut-ai'],
      },
      {
        name: 'JavaScript (ES6+)',
        context: 'aplicado-en-proyectos',
        detail:
          'Programación orientada a objetos en cliente (6 clases modulares), asincronía con async/await, Fetch API y manipulación segura del DOM.',
        relatedProjects: ['smartcut-ai'],
      },
      {
        name: 'HTML5',
        context: 'aplicado-en-proyectos',
        detail:
          'Maquetación semántica, formularios con validación nativa, tablas administrativas y diálogos modales nativos <dialog>.',
        relatedProjects: ['smartcut-ai'],
      },
      {
        name: 'CSS3',
        context: 'aplicado-en-proyectos',
        detail:
          'Variables personalizadas (custom properties), diseño adaptable con media queries, Flexbox, CSS Grid y estados de foco accesibles.',
        relatedProjects: ['smartcut-ai'],
      },
      {
        name: 'TypeScript',
        context: 'en-formacion',
        detail:
          'Tipado estricto aplicado en la arquitectura, esquemas de contenido y utilidades verificables de este portafolio web.',
        relatedProjects: [],
      },
      {
        name: 'SQL',
        context: 'en-formacion',
        detail:
          'Fundamentos de modelado relacional y consultas en formación técnica del SENA. En SmartCut AI la persistencia sobre SQLite se gestiona mediante SQLAlchemy ORM, por lo que no se atribuyen consultas SQL manuales a ese proyecto.',
        relatedProjects: [],
      },
    ],
  },
  {
    id: 'frameworks-bibliotecas',
    title: 'Frameworks y bibliotecas',
    summary:
      'Herramientas utilizadas para exponer APIs REST, mapear entidades de datos, validar contratos y construir sitios estáticos.',
    skills: [
      {
        name: 'FastAPI',
        context: 'aplicado-en-proyectos',
        detail:
          'Construcción de API REST con routers desacoplados, inyección de dependencias de sesión de base de datos, CORS y generación OpenAPI.',
        relatedProjects: ['smartcut-ai'],
      },
      {
        name: 'SQLAlchemy 2.0 (ORM)',
        context: 'aplicado-en-proyectos',
        detail:
          'Definición declarativa de modelos (User, Service, Product), sesiones por petición y operaciones CRUD sobre SQLite.',
        relatedProjects: ['smartcut-ai'],
      },
      {
        name: 'Pydantic v2',
        context: 'aplicado-en-proyectos',
        detail:
          'Esquemas de entrada y respuesta con herencia, validación de correo (EmailStr) y serialización desde atributos ORM.',
        relatedProjects: ['smartcut-ai'],
      },
      {
        name: 'Tailwind CSS (vía CDN en prototipo)',
        context: 'aplicado-en-proyectos',
        detail:
          'Utilizado mediante CDN como apoyo de utilidades visuales en la interfaz prototipo de SmartCut AI junto a hojas CSS propias.',
        relatedProjects: ['smartcut-ai'],
      },
      {
        name: 'Astro',
        context: 'en-formacion',
        detail:
          'Generación estática sin JavaScript innecesario, Content Layer API con colecciones tipadas y optimización de activos en este portafolio.',
        relatedProjects: [],
      },
    ],
  },
  {
    id: 'bases-de-datos',
    title: 'Bases de datos',
    summary:
      'Persistencia local empleada en prototipos funcionales con conservación de datos fuera del ciclo efímero de contenedores.',
    skills: [
      {
        name: 'SQLite',
        context: 'aplicado-en-proyectos',
        detail:
          'Base de datos relacional embebida (smartcut.db) integrada con FastAPI/SQLAlchemy y persistida mediante volumen en Docker Compose.',
        relatedProjects: ['smartcut-ai'],
      },
    ],
  },
  {
    id: 'herramientas',
    title: 'Herramientas de desarrollo',
    summary:
      'Entornos de control de versiones, contenerización reproducible, edición de código y automatización de flujo de trabajo.',
    skills: [
      {
        name: 'Git y GitHub',
        context: 'aplicado-en-proyectos',
        detail:
          'Gestión de repositorios separados para frontend y backend, control de cambios y flujos de integración con GitHub Actions.',
        relatedProjects: ['smartcut-ai'],
      },
      {
        name: 'Docker y Docker Compose',
        context: 'aplicado-en-proyectos',
        detail:
          'Empaquetado del backend Python 3.12 con Uvicorn y montaje de volumen persistente (./data:/app/data) para SQLite.',
        relatedProjects: ['smartcut-ai'],
      },
      {
        name: 'GitHub Codespaces',
        context: 'aplicado-en-proyectos',
        detail:
          'Configuración y prueba de entorno de ejecución contenerizado en la nube durante el desarrollo del backend de SmartCut AI.',
        relatedProjects: ['smartcut-ai'],
      },
      {
        name: 'Visual Studio Code',
        context: 'aplicado-en-proyectos',
        detail:
          'Entorno principal de desarrollo, inspección de código, depuración de peticiones y edición de documentación técnica en Markdown.',
        relatedProjects: ['smartcut-ai'],
      },
    ],
  },
  {
    id: 'otros-conocimientos',
    title: 'Otros conocimientos técnicos',
    summary:
      'Patrones de diseño de aplicaciones web, seguridad básica de autenticación y contratos de comunicación.',
    skills: [
      {
        name: 'Programación Orientada a Objetos (POO)',
        context: 'aplicado-en-proyectos',
        detail:
          'Estructuración del frontend de SmartCut AI en seis clases con responsabilidades diferenciadas (ApiClient, CrudModule, AuthController, UIController, ToastController y ApiError).',
        relatedProjects: ['smartcut-ai'],
      },
      {
        name: 'Diseño y consumo de APIs REST',
        context: 'aplicado-en-proyectos',
        detail:
          'Integración real de endpoints HTTP (GET, POST, PUT, DELETE), manejo de códigos de estado y coexistencia de payloads JSON y formularios OAuth2.',
        relatedProjects: ['smartcut-ai'],
      },
      {
        name: 'Autenticación JWT y hashing Bcrypt',
        context: 'aplicado-en-proyectos',
        detail:
          'Emisión y verificación de tokens firmados con HS256 (Python-JOSE) y almacenamiento de contraseñas con hash Bcrypt mediante Passlib.',
        relatedProjects: ['smartcut-ai'],
      },
      {
        name: 'Documentación OpenAPI / Swagger UI',
        context: 'aplicado-en-proyectos',
        detail:
          'Verificación interactiva de contratos, esquemas de respuesta y rutas expuestas por FastAPI.',
        relatedProjects: ['smartcut-ai'],
      },
    ],
  },
];

