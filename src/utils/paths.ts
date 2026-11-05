/**
 * Normaliza el prefijo base configurado para el despliegue estático.
 * - "/" o vacío -> "/"
 * - "/portafolio/" o "portafolio" -> "/portafolio"
 */
export function normalizeBase(rawBase?: string): string {
  if (!rawBase || rawBase.trim() === '' || rawBase.trim() === '/') {
    return '/';
  }
  const withLeading = rawBase.trim().startsWith('/') ? rawBase.trim() : `/${rawBase.trim()}`;
  return withLeading.replace(/\/+$/, '');
}

function getRuntimeBase(explicitBase?: string): string {
  if (explicitBase !== undefined) {
    return normalizeBase(explicitBase);
  }
  const envBase =
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    typeof import.meta.env.BASE_URL === 'string'
      ? import.meta.env.BASE_URL
      : '/';
  return normalizeBase(envBase);
}

/**
 * Antepone el base path de GitHub Pages tanto a rutas internas como a archivos descargables
 * ubicados en public/files/ (por ejemplo, withBase('/files/cv.pdf')).
 *
 * Respeta enlaces externos (http/https/mailto) y anclas puras (#seccion).
 */
export function withBase(targetPath: string, explicitBase?: string): string {
  if (!targetPath) {
    return withBase('/', explicitBase);
  }

  if (
    targetPath.startsWith('http://') ||
    targetPath.startsWith('https://') ||
    targetPath.startsWith('mailto:') ||
    targetPath.startsWith('#')
  ) {
    return targetPath;
  }

  const base = getRuntimeBase(explicitBase);

  // Separar query string o fragmento si existiera en una ruta interna de navegación
  const match = /^([^?#]*)(.*)$/.exec(targetPath);
  const rawPathname = match?.[1] ?? targetPath;
  const suffix = match?.[2] ?? '';

  let pathname = rawPathname.startsWith('/') ? rawPathname : `/${rawPathname}`;

  // Evitar prefijar dos veces si la ruta ya contiene el base path
  if (base !== '/' && (pathname === base || pathname.startsWith(`${base}/`))) {
    pathname = pathname.slice(base.length) || '/';
  }

  const lastSegment = pathname.split('/').filter(Boolean).pop() ?? '';
  const isFileResource = lastSegment.includes('.');

  if (!isFileResource && !pathname.endsWith('/')) {
    pathname = `${pathname}/`;
  }

  if (base === '/') {
    return `${pathname}${suffix}`;
  }

  return pathname === '/' ? `${base}/${suffix}` : `${base}${pathname}${suffix}`;
}

/**
 * Determina si un campo de configuración o frontmatter continúa pendiente de confirmación.
 */
export function isPending(value?: string | null): boolean {
  if (!value) return true;
  const normalized = value.trim();
  return normalized === '' || normalized.toUpperCase() === 'PENDIENTE';
}

/**
 * Guardia de tipo para enlaces externos confirmados (excluye vacíos y 'PENDIENTE').
 */
export function hasConfirmedUrl(value?: string | null): value is string {
  return typeof value === 'string' && !isPending(value);
}

/**
 * Comprueba si un enlace de navegación corresponde a la ruta activa actual,
 * funcionando tanto en dominio raíz como bajo subruta de repositorio.
 */
export function isCurrentRoute(
  currentPathname: string,
  navHref: string,
  explicitBase?: string
): boolean {
  const resolvedTarget = withBase(navHref, explicitBase);
  const normalizedCurrent = currentPathname.endsWith('/')
    ? currentPathname
    : `${currentPathname}/`;
  const rootWithBase = withBase('/', explicitBase);

  if (resolvedTarget === rootWithBase) {
    return normalizedCurrent === rootWithBase;
  }

  return normalizedCurrent === resolvedTarget || normalizedCurrent.startsWith(resolvedTarget);
}

