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
    define: {
        "global": {},
    },
});