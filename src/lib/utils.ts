export { cn } from "cn";

export function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return "U";
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
