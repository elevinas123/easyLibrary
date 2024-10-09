// vite.config.js
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import backendPlugin from "./backendPlugin";

export default defineConfig({
    plugins: [backendPlugin(), react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        proxy: {
            // Proxy all requests starting with /api to http://localhost:3000
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
                // Rewrite the path: remove "/api" prefix
                rewrite: (path) => path.replace(/^\/api/, ""),
                // Optional configurations:
            },
        },
    },
});
