export const setCookie = (
  name: string,
  value: string,
  days = 7,
  path = "/",
) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=${path};SameSite=Strict${
    window.location.protocol === "https:" ? ";Secure" : ""
  }`;
};

export const getCookie = (name: string) => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";");

  for (const rawCookie of cookies) {
    const cookie = rawCookie.trim();
    if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length);
  }

  return null;
};

export const deleteCookie = (name: string, path = "/") => {
  document.cookie = `${name}=; Max-Age=-99999999; path=${path}`;
};

export const updateCookie = (
  name: string,
  value: string,
  days = 7,
  path = "/",
) => {
  setCookie(name, value, days, path);
};
