import type { AuditInput, AuditResult, Lead } from "../types";

const FORM_KEY = "stacktrim.form";
const AUDIT_KEY = "stacktrim.audits";
const LEAD_KEY = "stacktrim.leads";

export function loadForm(): AuditInput | null {
  try {
    const raw = localStorage.getItem(FORM_KEY);
    return raw ? (JSON.parse(raw) as AuditInput) : null;
  } catch {
    return null;
  }
}

export function saveForm(input: AuditInput) {
  localStorage.setItem(FORM_KEY, JSON.stringify(input));
}

export function saveAudit(result: AuditResult) {
  const audits = loadAudits();
  audits[result.id] = publicAudit(result);
  localStorage.setItem(AUDIT_KEY, JSON.stringify(audits));
}

export function loadAudit(id: string) {
  return loadAudits()[id] ?? null;
}

export function saveLead(lead: Lead) {
  const leads = loadLeads();
  leads.push(lead);
  localStorage.setItem(LEAD_KEY, JSON.stringify(leads));
}

export function canSubmitLead() {
  const recent = loadLeads().filter((lead) => Date.now() - new Date(lead.createdAt).getTime() < 60_000);
  return recent.length < 3;
}

function loadAudits(): Record<string, AuditResult> {
  try {
    return JSON.parse(localStorage.getItem(AUDIT_KEY) ?? "{}") as Record<string, AuditResult>;
  } catch {
    return {};
  }
}

function loadLeads(): Lead[] {
  try {
    return JSON.parse(localStorage.getItem(LEAD_KEY) ?? "[]") as Lead[];
  } catch {
    return [];
  }
}

function publicAudit(result: AuditResult): AuditResult {
  return {
    ...result,
    input: {
      ...result.input,
      items: result.input.items.map((item) => ({ ...item }))
    }
  };
}
