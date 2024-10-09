import ReactRefresh from '@vitejs/plugin-react-refresh';
import {defineConfig} from 'vite';

export default defineConfig({
    plugins: [ReactRefresh()],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "./src/index.css";`,
            },
        },
    },
    //TODO FIND WHY IT CAUSES A BUILD ERROR

    // define: {
    //     "global": {},
    // },
    build: {
        outDir: 'dist',
        rollupOptions: {
            external: ['electron'],
        },
    },
    server: {
        port: 5173, // Ensure this matches the port in your main.js
        strictPort: true,
    },
});