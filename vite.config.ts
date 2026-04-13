import { sentryReactRouter } from "@sentry/react-router";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(config => ({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), sentryReactRouter({
    org: "priyanka-vaishnaw",
    project: "react-travel-app",
    authToken: process.env.SENTRY_AUTH_TOKEN
  }, config)],

  ssr: {
    noExternal: [/@syncfusion/]
  },

  optimizeDeps: {
    exclude: ["@sentry/react-router"]
  }
}));
