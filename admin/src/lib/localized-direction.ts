export function localizedInputDirection(locale: string) {
  return locale === "ar"
    ? "[&_input:not([dir])]:[direction:rtl] [&_textarea:not([dir])]:[direction:rtl] [&_select:not([dir])]:[direction:rtl]"
    : "[&_input:not([dir])]:[direction:ltr] [&_textarea:not([dir])]:[direction:ltr] [&_select:not([dir])]:[direction:ltr]";
}
