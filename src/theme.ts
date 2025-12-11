// theme.ts
// theme.ts
import type { ThemeConfig } from "antd";

export const customTheme: ThemeConfig = {
  token: {
    colorPrimary: "#afdb5eff", // Ваш цвет
    colorLink: "#1890ff",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorInfo: "#1890ff",
    borderRadius: 6,
    colorTextBase: "#000000",
    fontSize: 14,
    colorBgContainer: "#fff",
  },
  components: {
    Button: {
      //   colorPrimary: "#1890ff",
      algorithm: true, // Включить алгоритм
    },
    Progress: {
        defaultColor: "#52c41a"
    },
  },
};
