import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import { lang } from "@/context/global";

const Tabs = (props: React.ComponentProps<typeof TabsPrimitive.Root>) => (
  <TabsPrimitive.Root data-slot="tabs" {...props} />
);
const TabsList = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) => (
  <TabsPrimitive.List
    data-slot="tabs-list"
    className={cn(
      "inline-flex h-10 items-center rounded-lg bg-muted p-1 text-muted-foreground mx-auto w-fit",
      className,
    )}
    {...props}
  />
);
const TabsTrigger = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) => (
  <TabsPrimitive.Trigger
    data-slot="tabs-trigger"
    className={cn(
      "inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium transition data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ",
      className,
    )}
    {...props}
  />
);
const TabsContent = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) => (
  <TabsPrimitive.Content
    data-slot="tabs-content"
    className={cn("mt-4 outline-none", className)}
    {...props}
    dir={lang.value == "ar" ? "rtl" : "ltr"}
  />
);

export { Tabs, TabsContent, TabsList, TabsTrigger };
