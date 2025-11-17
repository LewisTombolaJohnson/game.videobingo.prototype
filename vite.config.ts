import { defineConfig } from 'vite';

// Set base to repository name for correct asset paths on GitHub Pages
export default defineConfig({
  base: '/game.videobingo.prototype/',
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      // Ensure Vite processes all HTML entry points so <script type="module" src="/src/main.ts"> is rewritten
      input: {
        index: 'index.html',
        game: 'game.html',
        mobile: 'mobile.html'
      }
    }
  }
});
