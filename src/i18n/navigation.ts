import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Wrapper localizzati di Link / useRouter / usePathname / redirect.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
