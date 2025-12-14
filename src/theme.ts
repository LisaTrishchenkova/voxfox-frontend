// theme.ts
import type { ThemeConfig } from "antd";

export const customTheme: ThemeConfig = {
  token: {
    // Основные цвета
    colorPrimary: "#52c41a",
    colorSuccess: "#52c41a",
    colorWarning: "#fa8c16",
    colorError: "#ff4d4f",
    colorInfo: "#1890ff",
    colorLink: "#52c41a",
    
    // Текст
    colorTextBase: "#262626",
    colorTextSecondary: "#595959",
    colorTextTertiary: "#999",
    
    // Фоны
    colorBgContainer: "#fff",
    colorBgElevated: "#fafafa",
    colorBgLayout: "#fafafa",
    colorBgSpotlight: "#f9fff4",
    
    // Границы
    colorBorder: "#e8e8e8",
    colorBorderSecondary: "#f0f0f0",
    
    // Радиусы
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 4,
    borderRadiusXS: 2,
    
    // Размеры шрифтов
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 20,
    
    // Отступы
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    paddingXXS: 4,
    
    // Тени
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    boxShadowSecondary: "0 4px 12px rgba(0,0,0,0.08)",
    boxShadowTertiary: "0 8px 24px rgba(0,0,0,0.12)",
    
    // Высота строк
    lineHeight: 1.5715,
    lineHeightLG: 1.5,
    lineHeightSM: 1.66,
  },
  components: {
    Button: {
      borderRadius: 8,
      fontWeight: 600,
      primaryShadow: "0 4px 15px rgba(82, 196, 26, 0.3)",
      algorithm: true,
    },
    Card: {
      borderRadiusLG: 16,
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      paddingLG: 24,
    },
    Input: {
      borderRadius: 12,
      fontSizeLG: 16,
    },
    Tag: {
      borderRadius: 12,
      fontSizeSM: 11,
    },
    Badge: {
      fontSizeSM: 10,
      textFontSize: 10,
    },
    Typography: {
      titleMarginBottom: 16,
      titleMarginTop: 0,
    },
    Layout: {
      headerBg: "#fff",
      headerPadding: "0 24px",
      bodyBg: "#fafafa",
      footerBg: "#f9fff4",
      footerPadding: "64px 24px 24px",
    },
    Menu: {
      itemBorderRadius: 8,
      itemMarginInline: 8,
      itemMarginBlock: 4,
    },
    Progress: {
      defaultColor: "#52c41a",
      remainingColor: "#f0f0f0",
    },
    Avatar: {
      // borderColor настраивается через style
    },
  },
};

// Утилиты для градиентов (используются только там, где Ant Design не поддерживает)
export const gradients = {
  primary: "linear-gradient(135deg, #52c41a 0%, #fa8c16 100%)",
  primaryText: "linear-gradient(135deg, #52c41a 0%, #fa8c16 50%)",
  primaryLight: "linear-gradient(135deg, rgba(82, 196, 26, 0.1) 0%, rgba(250, 140, 22, 0.1) 100%)",
  primaryBackground: "linear-gradient(135deg, #f9fff4 0%, #f0f9e6 100%)",
  primaryOverlay: "linear-gradient(135deg, rgba(82, 196, 26, 0.95) 0%, rgba(250, 140, 22, 0.95) 100%)",
  green: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
  orange: "linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)",
  blue: "linear-gradient(135deg, #1890ff 0%, #69c0ff 100%)",
  purple: "linear-gradient(135deg, #722ed1 0%, #9254de 100%)",
  avatar: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
} as const;

// Переиспользуемые пропсы для компонентов Ant Design
export const componentProps = {
  // Space компонент
  space: {
    vertical: {
      direction: "vertical" as const,
      style: { width: "100%" },
    },
    verticalWithPadding: {
      direction: "vertical" as const,
      style: { width: "100%", padding: "16px 0" },
      size: "middle" as const,
    },
    flexBetween: {
      style: { width: "100%", justifyContent: "space-between" },
    },
    flexCenter: {
      style: { width: "100%", justifyContent: "center" },
    },
    wrapCenter: {
      wrap: true,
      style: { marginTop: 24, justifyContent: "center" },
    },
    authButtons: {
      size: "large" as const,
    },
  },
  
  // Text компонент
  text: {
    secondary: {
      type: "secondary" as const,
    },
    strong: {
      strong: true,
    },
    secondaryStrong: {
      type: "secondary" as const,
      strong: true,
    },
    center: {
      style: { textAlign: "center" as const },
    },
    white: {
      style: { color: "#fff" },
    },
    whiteStrong: {
      strong: true,
      style: { color: "#fff", fontSize: 16 },
    },
  },
  
  // Button компонент
  button: {
    primaryGradient: {
      type: "primary" as const,
      style: { background: gradients.primary, border: "none" },
    },
    link: {
      type: "link" as const,
    },
    circle: {
      shape: "circle" as const,
      size: "large" as const,
    },
  },
  
  // Card компонент
  card: {
    withPadding: {
      bodyStyle: { padding: "16px 0" },
    },
  },
  
  // Progress компонент
  progress: {
    small: {
      size: "small" as const,
    },
  },
} as const;

// Переиспользуемые стили для div и других элементов
export const commonStyles = {
  // Контейнеры
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "40px 20px",
  },
  
  // Информационные блоки
  infoBox: {
    background: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  
  infoBoxSuccess: {
    background: "#f6ffed",
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
  },
  
  // Иконки в боксах
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  
  iconBoxSmall: {
    width: 48,
    height: 48,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 8px",
  },
  
  // Декоративные элементы
  decorativeCircle: {
    position: "absolute" as const,
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.1)",
  },
  
  // Flex контейнеры
  flexBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  flexCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  
  // Текстовые блоки
  textCenter: {
    textAlign: "center" as const,
  },
  
  // Hero секция
  heroSection: {
    background: gradients.primaryLight,
    padding: "80px 20px",
    textAlign: "center" as const,
  },
  
  // Layout
  pageLayout: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
  },
  
  mainContent: {
    flex: 1,
  },
  
  // Auth side
  authSide: {
    height: "100%",
    minHeight: 600,
    background: gradients.primaryOverlay,
    position: "relative" as const,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 48px",
    overflow: "hidden" as const,
  },
  
  // Auth формы
  authForm: {
    padding: "60px 48px",
  },
  
  authFormHeader: {
    textAlign: "center" as const,
    marginBottom: 40,
  },
  
  authIconBox: {
    width: 64,
    height: 64,
    background: gradients.primary,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  
  authTitle: {
    background: gradients.primaryText,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: 12,
    fontWeight: 700,
  },
  
  authCard: {
    maxWidth: 1200,
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(82, 196, 26, 0.15)",
    background: "#fff",
  },
  
  authContainer: {
    minHeight: "100vh",
    background: gradients.primaryBackground,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },
  
  // Иконки
  iconPrimary: {
    color: "#52c41a",
  },
  
  iconWhite: {
    color: "#fff",
    fontSize: 28,
  },
  
  // Ссылки
  linkPrimary: {
    color: "#52c41a",
  },
  
  linkPrimaryUnderline: {
    color: "#52c41a",
    fontWeight: 600,
    borderBottom: "1px dashed #52c41a",
  },
  
  // Формы
  formLabel: {
    fontSize: 16,
    fontWeight: 600,
    color: "#262626",
    marginBottom: 8,
  },
  
  formItemMargin: {
    marginTop: 40,
  },
  
  formTextCenter: {
    textAlign: "center" as const,
    marginBottom: 24,
  },
  
  // Кнопки социальных сетей
  socialButton: {
    width: 52,
    height: 52,
    border: "1px solid #e8e8e8",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  
  // Декоративные элементы auth
  decorativeCircleLight: {
    position: "absolute" as const,
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.05)",
  },
  
  // Иконки в боксах с blur
  iconBoxBlur: {
    width: 80,
    height: 80,
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    marginBottom: 16,
  },
  
  // Текст заголовков с градиентом
  titleGradient: {
    background: gradients.primaryText,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 800,
  },
  
  // Параграфы
  paragraphLarge: {
    fontSize: 20,
    maxWidth: 800,
    margin: "0 auto 48px",
  },
  
  // Контейнеры с ограничением ширины
  containerNarrow: {
    maxWidth: 800,
    margin: "0 auto",
  },
} as const;
