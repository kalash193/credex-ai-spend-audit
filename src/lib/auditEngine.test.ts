import { describe, expect, it } from "vitest";
import { auditSpend, evaluateItem } from "./auditEngine";
import type { AuditInput, SpendItem } from "../types";

const item = (overrides: Partial<SpendItem>): SpendItem => ({
  id: "one",
  toolId: "cursor",
  planId: "team",
  monthlySpend: 80,
  seats: 2,
  ...overrides
});

describe("audit engine", () => {
  it("right-sizes team plans for teams under five", () => {
    const rec = evaluateItem(item({ toolId: "cursor", planId: "team", monthlySpend: 80, seats: 2 }), 2, "coding");
    expect(rec.monthlySavings).toBe(40);
    expect(rec.recommendedAction).toContain("Cursor Pro");
  });

  it("does not manufacture savings for reasonable spend", () => {
    const rec = evaluateItem(item({ toolId: "github-copilot", planId: "individual", monthlySpend: 10, seats: 1 }), 1, "coding");
    expect(rec.monthlySavings).toBe(0);
    expect(rec.recommendedAction).toBe("Keep current setup");
  });

  it("surfaces cheaper use-case alternatives", () => {
    const rec = evaluateItem(item({ toolId: "chatgpt", planId: "team", monthlySpend: 180, seats: 6 }), 6, "coding");
    expect(rec.recommendedAction).toContain("GitHub Copilot Pro");
    expect(rec.monthlySavings).toBeGreaterThan(0);
  });

  it("surfaces Credex for high recurring API spend", () => {
    const rec = evaluateItem(item({ toolId: "openai-api", planId: "api-direct", monthlySpend: 1000, seats: 1 }), 12, "mixed");
    expect(rec.recommendedAction).toContain("Credex");
    expect(rec.monthlySavings).toBe(280);
  });

  it("rolls up monthly and annual savings", () => {
    const input: AuditInput = {
      teamSize: 2,
      useCase: "coding",
      items: [
        item({ id: "cursor", toolId: "cursor", planId: "team", monthlySpend: 80, seats: 2 }),
        item({ id: "api", toolId: "openai-api", planId: "api-direct", monthlySpend: 1000, seats: 1 })
      ]
    };
    const result = auditSpend(input, "audit-test");
    expect(result.totalMonthlySavings).toBe(320);
    expect(result.totalAnnualSavings).toBe(3840);
    expect(result.recommendations).toHaveLength(2);
  });
});
