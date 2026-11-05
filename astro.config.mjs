import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Normaliza BASE_PATH para soportar despliegue dual en GitHub Pages:
 * - Dominio raíz (https://johnatanl.github.io) -> "/"
 * - Subruta de repositorio (https://johnatanl.github.io/portafolio) -> "/portafolio"
 */
function resolveBasePath(rawBase) {
  if (!rawBase || rawBase.trim() === '' || rawBase.trim() === '/') {
    return '/';
  }
  const withLeading = rawBase.trim().startsWith('/') ? rawBase.trim() : `/${rawBase.trim()}`;
  return withLeading.replace(/\/+$/, '');
}

const siteUrl = (process.env.SITE_URL || 'https://johnatanl.github.io').replace(/\/+$/, '');
const basePath = resolveBasePath(process.env.BASE_PATH);

export default defineConfig({
  site: siteUrl,
  base: basePath,
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/404/'),
    }),
  ],
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Plus Jakarta Sans',
      cssVariable: '--font-heading',
      weights: [600, 700, 800],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-sans',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['monospace'],
    },
  ],
});

