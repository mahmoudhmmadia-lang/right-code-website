import type { ReactNode } from "react";

function InitProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default InitProvider;
