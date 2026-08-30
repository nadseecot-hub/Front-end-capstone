import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";

const srcDirectory = fileURLToPath(new URL("./src/", import.meta.url));

export default {
  plugins: [react()],
  resolve: {
    alias: {
      "@": srcDirectory,
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
    globals: true,
    css: true,
    coverage: {
      provider: "v8",
      include: [
        "src/services/profileService.ts",
        "src/features/Dashboard/DashboardControls.tsx",
        "src/features/Auth/useTutorRegistrationViewModel.ts",
        "src/components/BecomeATutorModal.tsx",
      ],
      reporter: ["text", "html"],
      exclude: ["**/*.d.ts", "tests/**", ".next/**", ".next-local/**", "coverage/**"],
    },
  },
};
