// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), sitemap()],
  site: 'https://texttoolbox.app',
  vite: {
    plugins: [tailwindcss()]
  }
});