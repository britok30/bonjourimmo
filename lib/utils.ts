import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const inDevEnvironment = process.env.NODE_ENV === "development";

export function generateSlug(title: string, id: string | number) {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace special chars with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .slice(0, 50); // Limit length

  return `${baseSlug}-${id}`;
}

export const ADMIN_EMAIL = "britok30@gmail.com";

export const isAdmin = (email: string | null) => email === ADMIN_EMAIL;
