import type { ReactNode } from "react";
import { Card, CardContent } from "./ui/card";

function AuthContainer({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f2f6f5] p-4 transition-colors dark:bg-[#081514]">
      <div className="absolute -top-44 -right-32 size-[34rem] rounded-full bg-main/10 blur-3xl" />
      <div className="absolute -bottom-52 -left-40 size-[32rem] rounded-full bg-cyan-400/8 blur-3xl" />
      <Card className="relative w-full max-w-md rounded-[2rem] border-white/80 bg-white/85 py-8 shadow-[0_32px_100px_rgba(18,36,35,.15)] backdrop-blur-xl dark:border-white/10 dark:bg-card/85 dark:shadow-black/30">
        <CardContent className="px-7 sm:px-10">{children}</CardContent>
      </Card>
    </main>
  );
}

export default AuthContainer;
