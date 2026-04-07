import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",

    // Настройка покрытия
    coverage: {
      provider: "v8", // или 'istanbul' если нужен более точный coverage
      reporter: ["text", "json-summary", "html", "lcov"], // разные форматы отчета
      reportsDirectory: "./coverage", // куда сохранять отчеты

      // Что включать/исключать из покрытия
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
        "src/test/**/*",
        "src/**/index.{ts,tsx}",
        "src/vite-env.d.ts",
        "src/main.tsx",
      ],

      // Пороги покрытия (опционально, но полезно)
      // thresholds: {
      //   lines: 80,
      //   functions: 80,
      //   branches: 80,
      //   statements: 80,
      //   perFile: true, // проверяем каждый файл отдельно
      // },

      // Дополнительные настройки
      all: true, // включать файлы без тестов в отчет
      clean: true, // очищать папку перед генерацией
      cleanOnRerun: true, // очищать при перезапуске
      skipFull: false, // не пропускать файлы с полным покрытием
      watermarks: {
        // визуальные метки для отчетов
        statements: [70, 85],
        functions: [70, 85],
        branches: [70, 85],
        lines: [70, 85],
      },
    },
  },
});
