import { format, formatDistanceToNow } from "date-fns";

/** Format a duration in milliseconds as a compact string, e.g. "1m 24s". */
export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "0s";
  const totalSeconds = Math.round(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes < 60) return `${minutes}m ${seconds}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

/** Format milliseconds as a ticking clock, e.g. "01:24". */
export function formatClock(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/** Relative time, e.g. "5 minutes ago". */
export function formatRelativeTime(timestamp: number): string {
  if (!timestamp) return "—";
  return `${formatDistanceToNow(timestamp, { addSuffix: true })}`;
}

/** Absolute date-time, e.g. "Aug 8, 2026 · 2:41 PM". */
export function formatDateTime(timestamp: number): string {
  return format(timestamp, "MMM d, yyyy '·' h:mm a");
}

/** Compact date, e.g. "Aug 8". */
export function formatDateShort(timestamp: number): string {
  return format(timestamp, "MMM d");
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

export function titleCase(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .map((word) => (word.length > 2 ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}

let idCounter = 0;

/** Generate a short unique id with a readable prefix. */
export function createId(prefix = "id"): string {
  idCounter += 1;
  return `${prefix}_${Date.now().toString(36)}${idCounter.toString(36)}${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

/** Serialize a value for the clipboard (JSON pretty-printed when object). */
export function toClipboardText(value: unknown): string {
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}
