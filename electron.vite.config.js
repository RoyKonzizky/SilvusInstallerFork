import { defineConfig } from "electron-vite";
import ReactRefresh from '@vitejs/plugin-react-refresh';

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