import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));

/**
 * manifest.json と content.css を dist 直下に出力する。
 * manifest の version は package.json から流し込むため、二重に管理しない。
 */
function extensionAssets() {
  return {
    name: 'extension-assets',
    generateBundle(this: { emitFile: (f: Record<string, string>) => void }) {
      const manifest = JSON.parse(readFileSync(resolve(__dirname, 'manifest.json'), 'utf-8'));
      manifest.version = pkg.version;

      this.emitFile({
        type: 'asset',
        fileName: 'manifest.json',
        source: `${JSON.stringify(manifest, null, 2)}\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'content.css',
        source: readFileSync(resolve(__dirname, 'src/content/content.css'), 'utf-8'),
      });
    },
  };
}

export default defineConfig({
  // popup / options の HTML を dist/popup/popup.html のように浅く出力するため
  // src をルートにする。public と dist はプロジェクト直下のまま使う。
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/popup.html'),
        options: resolve(__dirname, 'src/options/options.html'),
        background: resolve(__dirname, 'src/background/background.ts'),
        content: resolve(__dirname, 'src/content/content.ts'),
      },
      output: {
        // service worker と content script は manifest から名前で参照するので固定名にする
        entryFileNames: (chunkInfo) =>
          chunkInfo.name === 'background' || chunkInfo.name === 'content'
            ? '[name].js'
            : 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    minify: false, // 審査時にソースを追えるようにする
    sourcemap: true,
  },
  plugins: [extensionAssets()],
});
