import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const repoName = process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` : '/';
  
  const rawAiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || '';
  // Простая обфускация ключа на этапе сборки, чтобы он не лежал в открытом виде (Base64 + реверс)
  const obfuscatedAiKey = Buffer.from(rawAiKey).toString('base64').split('').reverse().join('');
  
  const rawHfKey = process.env.HF_API_KEY || env.HF_API_KEY || '';
  const obfuscatedHfKey = Buffer.from(rawHfKey).toString('base64').split('').reverse().join('');
  
  return {
    base: repoName,
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY_OBFUSCATED': JSON.stringify(obfuscatedAiKey),
      'process.env.HF_API_KEY_OBFUSCATED': JSON.stringify(obfuscatedHfKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
