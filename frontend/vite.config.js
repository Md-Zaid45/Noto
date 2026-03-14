import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/':"http://localHost:5000/api/v1"
    }
  }
});
