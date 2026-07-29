import type { ReactNode } from "react";

function PageLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen w-full bg-[#f2f6f5] p-6 dark:bg-[#081514]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <h1 className="text-3xl font-bold capitalize text-main">{title}</h1>
        {children}
      </div>
    </main>
  );
}

export default PageLayout;
