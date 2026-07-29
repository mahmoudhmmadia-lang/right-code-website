import { myAxios } from "@/api/myAxios";
import { deleteCookie, getCookie, setCookie } from "@/lib/cookies";
import { effect, signal } from "@preact/signals-react";

export type Lang = "en" | "ar" | "tr";

export type AccountInfo = {
  id: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  locale?: string;
  role: number;
  token: string;
};

function storedAccount(): AccountInfo | undefined {
  const value = getCookie("rightcode-admin-account");
  if (!value) return undefined;
  try {
    return JSON.parse(decodeURIComponent(value)) as AccountInfo;
  } catch {
    deleteCookie("rightcode-admin-account");
    return undefined;
  }
}
export const accountInfo = signal<AccountInfo | undefined>(storedAccount());

export const lang = signal<Lang>((getCookie("admin-lang") as Lang) ?? "en");
export const sidebarOpen = signal(false);
export const sidebarCollapsed = signal(getCookie("admin-sidebar-collapsed") === "true");
export const langLoader = signal(false);
export const page = signal(1);
export const fcmToken = signal(getCookie("admin-fcm") ?? "");
export const response = signal<
  | {
      type: "success" | "error" | "warning";
      message: string;
    }
  | undefined
>();

effect(() => {
  myAxios.defaults.headers.common["Accept-Language"] = lang.value;
  setCookie("admin-lang", lang.value);
});

effect(() => {
  const token = accountInfo.value?.token;

  if (token) {
    myAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
    setCookie(
      "rightcode-admin-account",
      encodeURIComponent(JSON.stringify(accountInfo.value)),
    );
  } else {
    delete myAxios.defaults.headers.common.Authorization;
    deleteCookie("rightcode-admin-account");
  }
});

effect(() => {
  if (fcmToken.value) setCookie("admin-fcm", fcmToken.value);
});

effect(() => setCookie("admin-sidebar-collapsed", String(sidebarCollapsed.value)));
