# Metrics

The North Star metric is qualified savings discovered per week: the sum of monthly savings from completed audits where the user provides an email and the audit shows at least $500/month in opportunity. This matches the business better than DAU because the product is not a daily habit; it is a periodic audit that should produce qualified Credex conversations.

Three input metrics drive it. First, audit completion rate from landing page visitor to results view. Second, post-result email capture rate, segmented by savings band. Third, high-savings consultation click or booking rate. If those move together, the tool is both useful and commercially relevant.

I would instrument landing view, first tool row completed, audit submitted, result viewed, email captured, share URL copied, public report viewed, and consultation CTA clicked. Each event should include savings band, team size band, use case, and tool count, but not raw email or company identity.

A pivot trigger: if 300 completed audits produce fewer than 15 high-savings leads or fewer than 3 consultation bookings, the positioning is probably wrong. The next experiment would narrow to one pain wedge, such as "OpenAI and Claude API bill audit" for startups with real infrastructure spend.
