"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "bg-secondary border border-white/10 text-white shadow-2xl",
          title: "text-white font-medium",
          description: "text-white/60",
          success: "bg-emerald-500/10 border-emerald-500/30",
          error: "bg-red-500/10 border-red-500/30",
          warning: "bg-yellow-500/10 border-yellow-500/30",
          info: "bg-blue-500/10 border-blue-500/30",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
