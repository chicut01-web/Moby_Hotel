"use client";

import { usePathname } from "@/i18n/navigation";

export function PageFade({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
