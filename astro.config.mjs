// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || 'https://jod75lab.github.io',
  base: process.env.BASE_PATH ?? '/jodnet',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'jodNET',
      description: 'Your links, organised around you.',
      favicon: '/favicon.svg',
      pagefind: false,
      sidebar: [],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/jod75lab/jodnet' }],
      customCss: ['./src/styles/hub.css'],
      components: { Footer: './src/components/Footer.astro' },
    }),
  ],
});
