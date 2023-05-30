import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "@midwayjs/hooks-kit";

export default defineConfig({
  vite: {
    plugins: [react()],
    css: {
      devSourcemap: true,
    },
  },
});
