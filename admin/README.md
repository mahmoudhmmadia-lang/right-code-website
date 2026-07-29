# RightCode admin

React 19, Vite, TanStack Query, Tailwind 4 and shadcn/Radix components. The panel talks to the root `../server` project; `admin/server` is not part of the CMS runtime.

## Structure

```text
src/
  api/                  Axios client
  components/ui/        shadcn primitives only
  features/resources/   reusable CRUD and multilingual resource editor
  pages/landing/        specialized CMS-section editor
  hooks/                shared query/mutation behavior
  lang/                 panel-interface translations
  routes/               public/private route trees
```

`features/resources/config.ts` is the panel schema. It defines fields, enums, list columns and translated fields for pages, services, projects, posts, training programs and inquiries. `ResourcePage.tsx` owns the common list/create/update/delete lifecycle, so resource pages do not duplicate API logic.

## Database translations

Localized content is not stored in the panel translator. `MultilingualFields.tsx` edits `en`, `ar` and `tr`, then sends the same JSON translation object used by the production server:

```ts
translations: {
  en: { title: "..." },
  ar: { title: "..." },
  tr: { title: "..." },
}
```

`src/lang` only translates the administration interface. Public content lives in the server translation models.

## Run

Set `VITE_MODE`, `VITE_DEV_URL` and `VITE_PROD_URL` in `.env`, then run:

```bash
npm run dev
npm run build
npm run lint
```
