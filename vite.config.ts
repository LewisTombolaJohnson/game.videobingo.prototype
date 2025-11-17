import { defineConfig } from 'vite';

// Set base to repository name for correct asset paths on GitHub Pages
export default defineConfig({
  base: '/game.videobingo.prototype/',
  server: {
    port: 5173,
  },
});
