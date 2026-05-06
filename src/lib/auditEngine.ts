import { getPlan, getTool, toolCatalog } from "../data/pricing";
import type { AuditInput, AuditRecommendation, AuditResult, SpendItem, ToolId, UseCase } from "../types";

const useCaseAlternatives: Record<UseCase, Partial<Record<ToolId, { toolId: ToolId; planId: string; label: string }>>> = {
  coding: {
    chatgpt: { toolId: "github-copilot", planId: "individual", label: "GitHub Copilot Pro" },
    claude: { toolId: "cursor", planId: "pro", label: "Cursor Pro" },
    gemini: { toolId: "windsurf", planId: "pro", label: "Windsurf Pro" }
  },
  writing: {
    cursor: { toolId: "chatgpt", planId: "plus", label: "ChatGPT Plus" },
    "github-copilot": { toolId: "chatgpt", planId: "plus", label: "ChatGPT Plus" }
  },
  data: {
    cursor: { toolId: "chatgpt", planId: "team", label: "ChatGPT Team" },
    "github-copilot": { toolId: "chatgpt", planId: "team", label: "ChatGPT Team" }
  },
  research: {
    cursor: { toolId: "claude", planId: "pro", label: "Claude Pro" },
    "github-copilot": { toolId: "claude", planId: "pro", label: "Claude Pro" }
  },
  mixed: {}
};

function currency(amount: number) {
  return `$${Math.round(amount).toLocaleString()}`;
}

function planSpend(item: SpendItem) {
  const plan = getPlan(item.toolId, item.planId);
  if (!plan || plan.monthlyPrice === 0) return item.monthlySpend;
  return plan.perSeat ? plan.monthlyPrice * item.seats : item.monthlySpend;
}

function cheaperSameVendor(item: SpendItem, teamSize: number) {
  const tool = getTool(item.toolId);
  const currentPlan = getPlan(item.toolId, item.planId);
  if (!tool || !currentPlan) return null;

  const paidPlans = tool.plans.filter((plan) => plan.monthlyPrice > 0);
  const seatCount = Math.max(1, item.seats);
  const currentSpend = Math.max(item.monthlySpend, planSpend(item));

  if (["enterprise", "team", "business"].includes(currentPlan.id) && teamSize < 5) {
    const soloPlan = paidPlans.find((plan) => ["pro", "plus", "individual"].includes(plan.id));
    if (soloPlan) {
      return {
        label: `${tool.name} ${soloPlan.name}`,
        spend: soloPlan.monthlyPrice * seatCount,
        reason: `${currentPlan.name} adds admin and procurement features that rarely pay back for teams under five.`
      };
    }
  }

  if (["ultra", "max", "pro"].includes(currentPlan.id) && currentSpend > 80 * seatCount) {
    const rightSized = paidPlans.find((plan) => ["pro", "plus"].includes(plan.id) && plan.monthlyPrice < currentPlan.monthlyPrice);
    if (rightSized) {
      return {
        label: `${tool.name} ${rightSized.name}`,
        spend: rightSized.monthlyPrice * seatCount,
        reason: `${currentPlan.name} is priced for heavy power users; the lower paid tier fits unless the team is consistently hitting limits.`
      };
    }
  }

  return null;
}

function cheaperAlternative(item: SpendItem, useCase: UseCase) {
  const alternative = useCaseAlternatives[useCase][item.toolId];
  if (!alternative) return null;
  const plan = getPlan(alternative.toolId, alternative.planId);
  if (!plan) return null;
  return {
    label: alternative.label,
    spend: plan.monthlyPrice * Math.max(1, item.seats),
    reason: `${alternative.label} maps more directly to ${useCase} workflows at this team size.`
  };
}

function creditOpportunity(item: SpendItem, currentSpend: number) {
  if (currentSpend < 250) return null;
  return {
    label: "Credex discounted credits",
    spend: currentSpend * 0.72,
    reason: "High recurring spend is a fit for discounted AI infrastructure credits instead of retail billing."
  };
}

export function auditSpend(input: AuditInput, id: string = crypto.randomUUID()): AuditResult {
  const recommendations = input.items.map((item) => evaluateItem(item, input.teamSize, input.useCase));
  const totalMonthlySavings = recommendations.reduce((sum, rec) => sum + rec.monthlySavings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;
  const savingsBand =
    totalMonthlySavings > 500 ? "high" : totalMonthlySavings >= 100 ? "medium" : totalMonthlySavings > 0 ? "low" : "optimized";

  return {
    id,
    createdAt: new Date().toISOString(),
    input,
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings,
    summary: buildFallbackSummary(totalMonthlySavings, input.useCase, recommendations),
    savingsBand
  };
}

export function evaluateItem(item: SpendItem, teamSize: number, useCase: UseCase): AuditRecommendation {
  const tool = getTool(item.toolId) ?? toolCatalog[0];
  const plan = getPlan(item.toolId, item.planId) ?? tool.plans[0];
  const currentSpend = Math.max(item.monthlySpend, planSpend(item));

  const candidates = [
    cheaperSameVendor(item, teamSize),
    cheaperAlternative(item, useCase),
    creditOpportunity(item, currentSpend)
  ].filter(Boolean) as Array<{ label: string; spend: number; reason: string }>;

  const best = candidates
    .filter((candidate) => candidate.spend < currentSpend)
    .sort((a, b) => a.spend - b.spend)[0];

  if (!best) {
    return {
      item,
      toolName: tool.name,
      planName: plan.name,
      currentSpend,
      recommendedAction: "Keep current setup",
      recommendedSpend: currentSpend,
      monthlySavings: 0,
      annualSavings: 0,
      reason: `${tool.name} ${plan.name} is reasonable for the declared ${useCase} usage and seat count.`,
      confidence: "high"
    };
  }

  const monthlySavings = Math.max(0, currentSpend - best.spend);
  return {
    item,
    toolName: tool.name,
    planName: plan.name,
    currentSpend,
    recommendedAction: `Switch to ${best.label}`,
    recommendedSpend: best.spend,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    reason: `${best.reason} Estimated monthly spend falls from ${currency(currentSpend)} to ${currency(best.spend)}.`,
    confidence: best.label.includes("Credex") ? "medium" : "high"
  };
}

export function buildFallbackSummary(monthlySavings: number, useCase: UseCase, recommendations: AuditRecommendation[]) {
  const activeSavings = recommendations.filter((rec) => rec.monthlySavings > 0);
  if (monthlySavings > 500) {
    return `Your AI stack has a meaningful savings opportunity: ${currency(monthlySavings)} per month, or ${currency(monthlySavings * 12)} annually. The biggest wins come from right-sizing plans and moving high recurring usage away from retail pricing. Because this crosses the high-savings threshold, a Credex consultation is worth surfacing now.`;
  }
  if (activeSavings.length === 0) {
    return `Your AI spend looks disciplined for a ${useCase} workflow. The current stack does not show obvious waste from plan mismatch, seat overbuying, or high retail usage. The best next step is monitoring pricing changes and new credit opportunities rather than forcing a downgrade.`;
  }
  return `This audit found ${currency(monthlySavings)} in monthly savings across ${activeSavings.length} tool${activeSavings.length === 1 ? "" : "s"}. The recommendations focus on practical plan fit first, then cheaper alternatives where the use case still matches.`;
}
