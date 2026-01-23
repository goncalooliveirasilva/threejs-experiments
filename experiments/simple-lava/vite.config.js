import { build } from "vite";
import glsl from "vite-plugin-glsl";

export default {
  root: "src/",
  publicDir: "../static/",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  plugins: [glsl()],
};
