export const TRANSLATOR = {
  en: {
    dashboard: "Dashboard",
    login: "Login",
    email: "Email",
    password: "Password",
    templateReady: "Template ready",
    templateReadyDescription:
      "Start adding pages under src/pages and wire them in src/routes.",
    logout: "Logout",
    success: "Success",
    error: "Error",
    warning: "Warning",
    done: "Done",
    somethingWentWrong: "Something went wrong",
  },
  ar: {
    dashboard: "Dashboard",
    login: "Login",
    email: "Email",
    password: "Password",
    templateReady: "Template ready",
    templateReadyDescription:
      "Start adding pages under src/pages and wire them in src/routes.",
    logout: "Logout",
    success: "Success",
    error: "Error",
    warning: "Warning",
    done: "Done",
    somethingWentWrong: "Something went wrong",
  },
  tr: {
    dashboard: "Yönetim Paneli",
    login: "Giriş",
    email: "E-posta",
    password: "Şifre",
    templateReady: "Şablon hazır",
    templateReadyDescription:
      "src/pages altına sayfalar ekleyin ve src/routes içinde bağlayın.",
    logout: "Çıkış",
    success: "Başarılı",
    error: "Hata",
    warning: "Uyarı",
    done: "Tamamlandı",
    somethingWentWrong: "Bir şeyler yanlış gitti",
  },
} as const;

export type TranslatorKey = keyof typeof TRANSLATOR.en;
