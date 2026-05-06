import type { AuditResult } from "../types";

export function shareUrl(result: AuditResult) {
  return `${window.location.origin}${window.location.pathname}#audit/${result.id}`;
}

export function auditIdFromHash(hash = window.location.hash) {
  const match = hash.match(/^#audit\/([\w-]+)$/);
  return match?.[1] ?? null;
}
