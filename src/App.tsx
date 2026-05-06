import { FormEvent, useEffect, useMemo, useState } from "react";
import { BarChart3, CheckCircle2, Clipboard, DollarSign, Mail, Plus, Trash2 } from "lucide-react";
import { toolCatalog } from "./data/pricing";
import { auditSpend } from "./lib/auditEngine";
import { auditIdFromHash, shareUrl } from "./lib/share";
import { canSubmitLead, loadAudit, loadForm, saveAudit, saveForm, saveLead } from "./lib/storage";
import type { AuditInput, AuditResult, PlanId, SpendItem, ToolId, UseCase } from "./types";

const defaultInput: AuditInput = {
  teamSize: 4,
  useCase: "coding",
  items: [
    { id: "cursor-1", toolId: "cursor", planId: "team", monthlySpend: 160, seats: 4 },
    { id: "chatgpt-1", toolId: "chatgpt", planId: "team", monthlySpend: 120, seats: 4 }
  ]
};

const useCases: UseCase[] = ["coding", "writing", "data", "research", "mixed"];

function App() {
  const [input, setInput] = useState<AuditInput>(() => loadForm() ?? defaultInput);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [leadStatus, setLeadStatus] = useState<string>("");

  useEffect(() => {
    const id = auditIdFromHash();
    if (id) {
      setResult(loadAudit(id));
    }
  }, []);

  useEffect(() => {
    saveForm(input);
  }, [input]);

  const projectedSpend = useMemo(() => input.items.reduce((sum, item) => sum + Number(item.monthlySpend || 0), 0), [input.items]);

  function runAudit(event: FormEvent) {
    event.preventDefault();
    const next = auditSpend(input);
    saveAudit(next);
    window.history.replaceState(null, "", `#audit/${next.id}`);
    setResult(next);
    setLeadStatus("");
  }

  function updateItem(id: string, patch: Partial<SpendItem>) {
    setInput((current) => ({
      ...current,
      items: current.items.map((item) => {
        if (item.id !== id) return item;
        const nextToolId = patch.toolId ?? item.toolId;
        const toolChanged = patch.toolId && patch.toolId !== item.toolId;
        const firstPlan = toolCatalog.find((tool) => tool.id === nextToolId)?.plans[0]?.id ?? item.planId;
        return { ...item, ...patch, planId: (toolChanged ? firstPlan : patch.planId ?? item.planId) as PlanId };
      })
    }));
  }

  function addItem() {
    setInput((current) => ({
      ...current,
      items: [
        ...current.items,
        { id: crypto.randomUUID(), toolId: "github-copilot", planId: "business", monthlySpend: 76, seats: Math.max(1, current.teamSize) }
      ]
    }));
  }

  function removeItem(id: string) {
    setInput((current) => ({ ...current, items: current.items.filter((item) => item.id !== id) }));
  }

  function captureLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!result) return;
    const form = new FormData(event.currentTarget);
    if (form.get("website")) return;
    if (!canSubmitLead()) {
      setLeadStatus("Too many signups in a minute. Please try again shortly.");
      return;
    }
    saveLead({
      email: String(form.get("email")),
      company: String(form.get("company") || ""),
      role: String(form.get("role") || ""),
      teamSize: input.teamSize,
      auditId: result.id,
      createdAt: new Date().toISOString()
    });
    setLeadStatus("Saved. In production this also sends the transactional email.");
    event.currentTarget.reset();
  }

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Free AI spend audit</p>
          <h1>Stop leaking budget to AI tools.</h1>
          <p>
            StackTrim finds plan mismatch, duplicate coverage, retail API spend, and Credex-fit credit opportunities before the
            next invoice lands.
          </p>
        </div>
        <div className="hero-stat" aria-label="Current entered spend">
          <DollarSign size={28} />
          <span>${projectedSpend.toLocaleString()}</span>
          <small>entered monthly spend</small>
        </div>
      </section>

      <section className="workspace">
        <form className="audit-form" onSubmit={runAudit}>
          <div className="section-title">
            <div>
              <p className="eyebrow">Input</p>
              <h2>Your AI stack</h2>
            </div>
            <button type="button" className="icon-button" onClick={addItem} aria-label="Add tool">
              <Plus size={18} />
            </button>
          </div>

          <div className="form-grid">
            <label>
              Team size
              <input
                min="1"
                type="number"
                value={input.teamSize}
                onChange={(event) => setInput({ ...input, teamSize: Number(event.target.value) })}
              />
            </label>
            <label>
              Primary use case
              <select value={input.useCase} onChange={(event) => setInput({ ...input, useCase: event.target.value as UseCase })}>
                {useCases.map((useCase) => (
                  <option key={useCase} value={useCase}>
                    {useCase}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="tool-list">
            {input.items.map((item) => {
              const tool = toolCatalog.find((candidate) => candidate.id === item.toolId) ?? toolCatalog[0];
              return (
                <div className="tool-row" key={item.id}>
                  <label>
                    Tool
                    <select value={item.toolId} onChange={(event) => updateItem(item.id, { toolId: event.target.value as ToolId })}>
                      {toolCatalog.map((candidate) => (
                        <option key={candidate.id} value={candidate.id}>
                          {candidate.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Plan
                    <select value={item.planId} onChange={(event) => updateItem(item.id, { planId: event.target.value as PlanId })}>
                      {tool.plans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Monthly spend
                    <input
                      min="0"
                      type="number"
                      value={item.monthlySpend}
                      onChange={(event) => updateItem(item.id, { monthlySpend: Number(event.target.value) })}
                    />
                  </label>
                  <label>
                    Seats
                    <input min="1" type="number" value={item.seats} onChange={(event) => updateItem(item.id, { seats: Number(event.target.value) })} />
                  </label>
                  <button type="button" className="icon-button danger" onClick={() => removeItem(item.id)} aria-label={`Remove ${tool.name}`}>
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          <button className="primary" type="submit">
            <BarChart3 size={18} />
            Run audit
          </button>
        </form>

        <aside className="result-panel">
          {result ? (
            <>
              <p className="eyebrow">Audit result</p>
              <h2>${Math.round(result.totalMonthlySavings).toLocaleString()} monthly savings</h2>
              <p className="annual">${Math.round(result.totalAnnualSavings).toLocaleString()} annualized</p>
              <p className="summary">{result.summary}</p>
              {result.savingsBand === "high" ? (
                <div className="credex-callout">
                  <CheckCircle2 size={20} />
                  <span>Credex should be prominent here: this audit crosses the $500/month savings threshold.</span>
                </div>
              ) : (
                <div className="steady-callout">
                  <CheckCircle2 size={20} />
                  <span>{result.savingsBand === "optimized" ? "You are spending well." : "Savings exist, but no hard sell needed yet."}</span>
                </div>
              )}
              <div className="recommendations">
                {result.recommendations.map((rec) => (
                  <article key={rec.item.id}>
                    <div>
                      <strong>
                        {rec.toolName} {rec.planName}
                      </strong>
                      <span>
                        ${Math.round(rec.currentSpend).toLocaleString()} to ${Math.round(rec.recommendedSpend).toLocaleString()}
                      </span>
                    </div>
                    <p>{rec.recommendedAction}</p>
                    <small>{rec.reason}</small>
                  </article>
                ))}
              </div>
              <div className="share-row">
                <input readOnly value={shareUrl(result)} aria-label="Shareable audit URL" />
                <button type="button" className="icon-button" onClick={() => navigator.clipboard.writeText(shareUrl(result))} aria-label="Copy share URL">
                  <Clipboard size={18} />
                </button>
              </div>
              <form className="lead-form" onSubmit={captureLead}>
                <h3>Capture the report</h3>
                <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" />
                <input required name="email" type="email" placeholder="work@email.com" />
                <input name="company" placeholder="Company" />
                <input name="role" placeholder="Role" />
                <button className="secondary" type="submit">
                  <Mail size={17} />
                  Email my audit
                </button>
                {leadStatus ? <p className="status">{leadStatus}</p> : null}
              </form>
            </>
          ) : (
            <div className="empty-result">
              <BarChart3 size={36} />
              <h2>Your audit appears here</h2>
              <p>Enter tools, seats, spend, and use case. The form persists on reload and the report gets a unique public URL.</p>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

export default App;
