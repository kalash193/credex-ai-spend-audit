# Prompts

## Personalized Audit Summary Prompt

The current app uses a deterministic fallback summary until an LLM endpoint is wired. Production should call an API route that keeps provider keys server-side and falls back to the local template on any timeout, 429, or malformed response.

```text
You are writing a concise AI spend audit summary for a startup founder or engineering manager.

Input:
- Primary use case: {{useCase}}
- Team size: {{teamSize}}
- Total monthly AI spend: {{currentSpend}}
- Estimated monthly savings: {{monthlySavings}}
- Estimated annual savings: {{annualSavings}}
- Recommendations: {{recommendationsJson}}

Write about 100 words. Be specific, finance-literate, and honest. Do not invent savings. If monthly savings are above $500, mention that discounted AI infrastructure credits may be worth discussing with Credex. If savings are below $100, say the stack is already reasonably optimized and suggest monitoring future pricing changes.
```

## Why This Shape

The prompt gives the model only computed facts from the audit engine and asks it to explain, not calculate. This keeps the financial logic testable and avoids LLM hallucinated math.

## Tried And Rejected

- Asking the model to choose the recommendation: rejected because the same input could produce inconsistent financial advice.
- Asking for a long report: rejected because the results page needs a screenshot-friendly summary.
