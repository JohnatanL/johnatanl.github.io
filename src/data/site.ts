export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
  locale: string;
  author: {
    name: string;
    shortRole: string;
    fullRole: string;
    institution: string;
    location: string;
    tagline: string;
  };
  availability: {
    isAvailable: boolean;
    label: string;
    detail: string;
  };
  social: {
    github: {
      label: string;
      handle: string;
      url: string;
    };
    linkedin: {
      label: string;
      url: string;
    };
    email: {
      label: string;
      value: string;
    };
  };
  cv: {
    isAvailable: boolean;
    filePath: '/files/cv.pdf';
    label: string;
    pendingLabel: string;
  };
  navigation: NavItem[];
}

export const siteConfig: SiteConfig = {
  siteName: 'Johnatan Lozano · Portafolio de Desarrollo de Software',
  defaultTitle: 'Johnatan Lozano — Desarrollo de Software | Portafolio Técnico',
  defaultDescription:
    'Portafolio técnico de Johnatan Lozano, aprendiz del SENA en el programa Técnico en Programación de Software en Colombia. Proyectos documentados, arquitectura cliente-servidor, habilidades verificables y evidencias.',
  locale: 'es_CO',
  author: {
    name: 'Johnatan Lozano',
    shortRole: 'Aprendiz SENA · Programación de Software',
    fullRole: 'Aprendiz del programa Técnico en Programación de Software',
    institution: 'Servicio Nacional de Aprendizaje (SENA)',
    location: 'Colombia',
    tagline:
      'Construcción de aplicaciones web modulares, integración de APIs REST y documentación técnica verificable con enfoque en mantenibilidad.',
  },
  availability: {
    isAvailable: true,
    label: 'Disponible para etapa productiva desde el 11 de enero de 2027',
    detail:
      'Interesado en vinculación formativa (contrato de aprendizaje / práctica) y roles iniciales de desarrollo web o backend en Colombia o modalidad remota.',
  },
  social: {
    github: {
      label: 'GitHub',
      handle: '@JohnatanL',
      url: 'https://github.com/JohnatanL',
    },
    linkedin: {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/johnatan-david-lozano-suarez-165529239/',
    },
    email: {
      label: 'Correo electrónico',
      value: 'johnatanlozano.dev@gmail.com',
    },
  },
  cv: {
    isAvailable: false,
    filePath: '/files/cv.pdf',
    label: 'Descargar hoja de vida (PDF)',
    pendingLabel: 'Hoja de vida en PDF pendiente de publicación',
  },
  navigation: [
    { label: 'Inicio', href: '/' },
    { label: 'Sobre mí', href: '/sobre-mi/' },
    { label: 'Proyectos', href: '/proyectos/' },
    { label: 'Evidencias', href: '/evidencias/' },
    { label: 'Habilidades', href: '/habilidades/' },
    { label: 'Formación', href: '/formacion/' },
    { label: 'Contacto', href: '/contacto/' },
  ],
};

