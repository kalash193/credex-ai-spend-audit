# Tests

Run all tests:

```bash
npm test
```

## Automated Tests

- `src/lib/auditEngine.test.ts`: right-sizes team plans for teams under five.
- `src/lib/auditEngine.test.ts`: avoids fake savings when current spend is already reasonable.
- `src/lib/auditEngine.test.ts`: recommends cheaper use-case alternatives where appropriate.
- `src/lib/auditEngine.test.ts`: surfaces Credex credit savings for high recurring API spend.
- `src/lib/auditEngine.test.ts`: rolls up monthly and annual savings correctly.
