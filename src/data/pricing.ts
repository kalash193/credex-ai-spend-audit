import type { ToolCatalogItem } from "../types";

export const PRICING_VERIFIED_AT = "2026-05-06";

export const toolCatalog: ToolCatalogItem[] = [
  {
    id: "cursor",
    name: "Cursor",
    category: "coding",
    plans: [
      { id: "hobby", name: "Hobby", monthlyPrice: 0, perSeat: true, bestFor: "Trying the editor", sourceUrl: "https://cursor.com/en-US/pricing" },
      { id: "pro", name: "Pro", monthlyPrice: 20, perSeat: true, bestFor: "Individual builders", sourceUrl: "https://cursor.com/en-US/pricing" },
      { id: "pro-plus", name: "Pro+", monthlyPrice: 60, perSeat: true, bestFor: "Heavy agent usage", sourceUrl: "https://cursor.com/en-US/pricing" },
      { id: "ultra", name: "Ultra", monthlyPrice: 200, perSeat: true, bestFor: "Very high model usage", sourceUrl: "https://cursor.com/en-US/pricing" },
      { id: "team", name: "Teams", monthlyPrice: 40, perSeat: true, bestFor: "Managed team billing and controls", sourceUrl: "https://cursor.com/en-US/pricing" },
      { id: "enterprise", name: "Enterprise", monthlyPrice: 0, perSeat: true, bestFor: "Custom security and procurement", sourceUrl: "https://cursor.com/en-US/pricing" }
    ]
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    category: "coding",
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, perSeat: true, bestFor: "Limited individual usage", sourceUrl: "https://github.com/features/copilot/plans" },
      { id: "individual", name: "Pro", monthlyPrice: 10, perSeat: true, bestFor: "Individual coding assistance", sourceUrl: "https://github.com/features/copilot/plans" },
      { id: "business", name: "Business", monthlyPrice: 19, perSeat: true, bestFor: "Organizations needing policy controls", sourceUrl: "https://github.com/features/copilot/plans" },
      { id: "enterprise", name: "Enterprise", monthlyPrice: 39, perSeat: true, bestFor: "GitHub-native enterprise workflows", sourceUrl: "https://github.com/features/copilot/plans" }
    ]
  },
  {
    id: "claude",
    name: "Claude",
    category: "chat",
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, perSeat: true, bestFor: "Light usage", sourceUrl: "https://claude.com/pricing" },
      { id: "pro", name: "Pro", monthlyPrice: 20, perSeat: true, bestFor: "Solo daily use", sourceUrl: "https://claude.com/pricing" },
      { id: "max", name: "Max", monthlyPrice: 100, perSeat: true, bestFor: "Power users hitting Pro limits", sourceUrl: "https://claude.com/pricing" },
      { id: "team", name: "Team", monthlyPrice: 30, perSeat: true, bestFor: "Teams of five or more", sourceUrl: "https://claude.com/pricing" },
      { id: "enterprise", name: "Enterprise", monthlyPrice: 0, perSeat: true, bestFor: "Custom security and usage", sourceUrl: "https://claude.com/pricing" },
      { id: "api-direct", name: "API direct", monthlyPrice: 0, perSeat: false, bestFor: "Usage-based product integration", sourceUrl: "https://docs.anthropic.com/en/docs/about-claude/pricing" }
    ]
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "chat",
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, perSeat: true, bestFor: "Light usage", sourceUrl: "https://openai.com/chatgpt/pricing/" },
      { id: "plus", name: "Plus", monthlyPrice: 20, perSeat: true, bestFor: "Solo knowledge work", sourceUrl: "https://openai.com/chatgpt/pricing/" },
      { id: "pro", name: "Pro", monthlyPrice: 200, perSeat: true, bestFor: "High-limit individual usage", sourceUrl: "https://openai.com/chatgpt/pricing/" },
      { id: "team", name: "Team", monthlyPrice: 30, perSeat: true, bestFor: "Business workspace controls", sourceUrl: "https://openai.com/chatgpt/pricing/" },
      { id: "enterprise", name: "Enterprise", monthlyPrice: 0, perSeat: true, bestFor: "Custom enterprise controls", sourceUrl: "https://openai.com/chatgpt/pricing/" },
      { id: "api-direct", name: "API direct", monthlyPrice: 0, perSeat: false, bestFor: "Usage-based product integration", sourceUrl: "https://platform.openai.com/docs/pricing" }
    ]
  },
  {
    id: "anthropic-api",
    name: "Anthropic API",
    category: "api",
    plans: [
      { id: "api-direct", name: "API direct", monthlyPrice: 0, perSeat: false, bestFor: "Token-based Claude usage", sourceUrl: "https://docs.anthropic.com/en/docs/about-claude/pricing" }
    ]
  },
  {
    id: "openai-api",
    name: "OpenAI API",
    category: "api",
    plans: [
      { id: "api-direct", name: "API direct", monthlyPrice: 0, perSeat: false, bestFor: "Token-based GPT usage", sourceUrl: "https://platform.openai.com/docs/pricing" }
    ]
  },
  {
    id: "gemini",
    name: "Gemini",
    category: "chat",
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, perSeat: true, bestFor: "Trial usage", sourceUrl: "https://ai.google.dev/pricing" },
      { id: "pro", name: "Pro", monthlyPrice: 20, perSeat: true, bestFor: "Google AI Pro workspace use", sourceUrl: "https://one.google.com/about/google-ai-plans/" },
      { id: "ultra", name: "Ultra", monthlyPrice: 250, perSeat: true, bestFor: "Highest access consumer plan", sourceUrl: "https://one.google.com/about/google-ai-plans/" },
      { id: "api-direct", name: "API", monthlyPrice: 0, perSeat: false, bestFor: "Gemini Developer API usage", sourceUrl: "https://ai.google.dev/pricing" }
    ]
  },
  {
    id: "windsurf",
    name: "Windsurf",
    category: "coding",
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, perSeat: true, bestFor: "Trial coding assistant usage", sourceUrl: "https://windsurf.com/pricing" },
      { id: "pro", name: "Pro", monthlyPrice: 15, perSeat: true, bestFor: "Individual coding assistant usage", sourceUrl: "https://windsurf.com/pricing" },
      { id: "team", name: "Teams", monthlyPrice: 30, perSeat: true, bestFor: "Admin controls and shared billing", sourceUrl: "https://windsurf.com/pricing" },
      { id: "enterprise", name: "Enterprise", monthlyPrice: 0, perSeat: true, bestFor: "Custom enterprise controls", sourceUrl: "https://windsurf.com/pricing" }
    ]
  }
];

export function getTool(toolId: string) {
  return toolCatalog.find((tool) => tool.id === toolId);
}

export function getPlan(toolId: string, planId: string) {
  return getTool(toolId)?.plans.find((plan) => plan.id === planId);
}
