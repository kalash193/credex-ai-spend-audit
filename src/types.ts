export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type ToolId =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

export type PlanId =
  | "free"
  | "hobby"
  | "pro"
  | "pro-plus"
  | "ultra"
  | "business"
  | "team"
  | "enterprise"
  | "individual"
  | "plus"
  | "max"
  | "api-direct";

export interface ToolPlan {
  id: PlanId;
  name: string;
  monthlyPrice: number;
  perSeat: boolean;
  bestFor: string;
  sourceUrl: string;
}

export interface ToolCatalogItem {
  id: ToolId;
  name: string;
  category: "coding" | "chat" | "api";
  plans: ToolPlan[];
}

export interface SpendItem {
  id: string;
  toolId: ToolId;
  planId: PlanId;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  teamSize: number;
  useCase: UseCase;
  items: SpendItem[];
}

export interface AuditRecommendation {
  item: SpendItem;
  toolName: string;
  planName: string;
  currentSpend: number;
  recommendedAction: string;
  recommendedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
  confidence: "high" | "medium";
}

export interface AuditResult {
  id: string;
  createdAt: string;
  input: AuditInput;
  recommendations: AuditRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  summary: string;
  savingsBand: "high" | "medium" | "low" | "optimized";
}

export interface Lead {
  email: string;
  company?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
  createdAt: string;
}
