import { defineConfig } from "cypress";

export default defineConfig({
  video: true,
  videoCompression: true,
  projectId: "g46nc1",

  e2e: {
    baseUrl: "https://localhost:4200",
  },

  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
  },
});
