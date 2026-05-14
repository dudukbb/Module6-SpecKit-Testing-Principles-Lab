# Module5-MCP-Workflows Constitution

## Core Principles

### I. Clean Code First
All production code MUST prioritize readability, maintainability, and low complexity.
- Functions and methods SHOULD be small, single-purpose, and clearly named.
- Duplication MUST be reduced through sensible abstractions.
- Dead code, commented-out blocks, and unclear temporary workarounds are not allowed in merged branches.
- Refactoring is required when complexity obscures intent.

### II. TypeScript Strict Mode (Non-Negotiable)
All TypeScript projects MUST compile with strict type safety enabled.
- `strict: true` is mandatory in `tsconfig.json`.
- `any` is prohibited unless explicitly justified and documented.
- Null/undefined handling MUST be explicit.
- Public APIs MUST use precise types and avoid implicit behavior.

### III. Testing Pyramid Enforcement
Testing strategy MUST follow the Testing Pyramid.
- Unit tests form the base and cover business rules and domain logic.
- Integration tests validate component boundaries, contracts, and data flow.
- End-to-end tests remain focused on critical user journeys only.
- Test distribution SHOULD avoid over-reliance on slow E2E suites.

### IV. Business Logic Coverage Minimum
Business logic MUST maintain at least 80% automated test coverage.
- The 80% threshold applies specifically to domain and service logic, not only global project averages.
- Coverage reports MUST be generated and reviewed in CI or pre-merge checks.
- Pull requests that reduce business-logic coverage below 80% cannot be approved.

### V. JSDoc Documentation Requirement
All code MUST include JSDoc comments sufficient for maintainability and onboarding.
- Exported functions, classes, interfaces, and types require JSDoc.
- Complex internal logic blocks require concise JSDoc or explanatory comments.
- JSDoc MUST describe purpose, parameters, return values, and notable side effects.
- Documentation MUST be updated with behavior changes in the same pull request.

## Testing Principles

### 1. Testing Philosophy
Testing MUST follow Test-Driven Development (TDD) for all new business logic and API behavior.
- Teams MUST apply the **RED-GREEN-REFACTOR** cycle for every feature:
  - **RED:** Write a failing test first, derived from acceptance criteria.
  - **GREEN:** Implement the minimal code required to make the test pass.
  - **REFACTOR:** Improve code structure and clarity without changing behavior.
- Tests MUST be generated from product specifications and acceptance criteria, NOT reverse-engineered from implementation details.
- Test generation tools (including AI-driven tools like `/speckit.implement`) MUST receive the Testing Principles from constitution to generate mutation-resistant tests.
- All expected values (test oracles) for critical logic (authentication, authorization, business rules) MUST be validated by humans before merge.

### 2. Coverage Requirements
Coverage expectations MUST be enforced across frontend and backend business logic.
- **Testing Pyramid distribution** (non-negotiable):
  - ~70% unit tests (services, utilities, business logic, React components).
  - ~20% integration tests (API endpoints, middleware interactions, database persistence).
  - ~10% end-to-end tests (critical user workflows only).
- **Coverage targets (minimum):**
  - Line coverage: **80%**
  - Branch coverage: **75%**
  - Mutation score: **75%**
- Coverage gates MUST be enforced in CI before merge to main branch.
- Mutation testing validates that tests actually catch bugs, not just that code is executed.

### 3. Test Types & Organization
Tests MUST be organized by type with exact folder locations matching the project structure.
- **Backend unit tests:** `backend/tests/unit/**/*.test.ts` (mirror `backend/src/` structure)
- **Backend integration tests:** `backend/tests/integration/**/*.test.ts` (grouped by feature or route)
- **Frontend unit/component tests:** `frontend/src/**/*.test.tsx` (colocated with components)
- **End-to-end tests:** `tests/e2e/**/*.spec.ts` (grouped by user journey)
- One test file per source file (at minimum) for unit tests to ensure discoverability.
- Integration tests MUST focus on route + middleware + PostgreSQL persistence flows for Express.js backend.

### 4. Naming Conventions
Test naming MUST be explicit, behavior-oriented, and unambiguous.
- **Test files:** `ComponentName.test.ts[x]` for unit/integration tests; `user-journey-name.spec.ts` for E2E.
- **Test suites:** `describe('ModuleOrFeatureName', ...)` or `describe('ComponentName', ...)`
- **Test cases:** `it('should <do something specific> when <condition>', ...)`
- Names MUST describe observable outcomes and acceptance criteria, NOT implementation steps.
- Avoid generic names like "test1" or "works". Names MUST be searchable and self-documenting.

### 5. Test Anatomy
All tests MUST follow the **Arrange-Act-Assert (AAA)** pattern with clear independence.
- **Arrange:** Set up test data, mocks, fixtures, and environment state needed for the test.
- **Act:** Execute exactly one behavior being tested (one function call, one user action).
- **Assert:** Verify meaningful expected outcomes with specific assertions.
- Each test MUST be independent and runnable in isolation (no test order dependencies).
- Each test MUST use `beforeEach` (not `beforeAll`) for test-specific setup to prevent shared state.
- Shared or global setup MUST be minimal and explicitly documented; avoid hidden coupling across tests.

### 6. Mocking & Test Data
Mocking MUST be deliberate, limited, and follow a clear strategy.
- **MUST mock:**
  - External services (third-party APIs, payment gateways, email services).
  - Non-deterministic behavior (Date.now(), Math.random(), timers).
  - Database access in unit tests (use fixtures or in-memory substitutes).
- **MUST NOT mock:**
  - Code you own (business logic, services, utilities—test their real behavior).
  - Simple utility functions without external dependencies.
  - Public contract boundaries (test real interactions).
- **JWT authentication tests** MUST include: valid tokens, invalid tokens, missing tokens, expired tokens, and authorization scope violations.
- Reusable test data SHOULD be stored in fixtures: `user.fixture.ts`, `task.fixture.ts`, etc.
- For PostgreSQL integration tests, prefer realistic test database flows with controlled fixtures over excessive mocking.

### 7. Quality Criteria
A test is valid ONLY when it proves observable behavior with clear, non-trivial assertions.

**What makes a good test:**
- Assertions MUST be **specific and meaningful** (`expect(result).toBe(42)`, NOT `expect(result).toBeDefined()`).
- Tests MUST verify **one thing** (single responsibility—single assertion or tightly related assertions).
- Tests MUST be **fast** (unit tests: <100ms each; integration tests: <1 second each).
- Tests MUST be **deterministic** (same input → same result, no timing dependencies, no flaky failures).
- Assertions MUST validate **complete behavior** (check both success and error cases).

**Mandatory anti-patterns to prevent:**
1. **Tautological tests** (always pass):
   - ❌ `expect(calculateDiscount(100, 0.2)).toBeDefined()` — useless, always true.
   - ✅ `expect(calculateDiscount(100, 0.2)).toBe(80)` — specific and meaningful.

2. **Weak or vague assertions:**
   - ❌ `expect(user.isValid).toBeTruthy()` — passes for any truthy value.
   - ✅ `expect(user.isValid).toBe(true); expect(user.error).toBeUndefined();` — exact and complete.

3. **Tests without assertions:**
   - ❌ Tests that execute code but never assert outcome.
   - ✅ Every test MUST end with at least one meaningful assertion.

4. **Testing private methods or internal state:**
   - ❌ `expect(user._hashSalt).toBeDefined()` — testing implementation detail.
   - ✅ `expect(user.authenticate("password")).toBe(true)` — testing public behavior.

5. **Flaky or timing-dependent tests:**
   - ❌ Tests that intermittently fail due to timeouts, async races, or environmental factors.
   - ✅ Tests MUST mock time, use deterministic fixtures, and clean up properly.

6. **Interdependent tests:**
   - ❌ Test order matters; test 2 fails if test 1 didn't run first.
   - ✅ Each test MUST be completely independent and runnable in any order.

7. **Copy-pasted or duplicated test logic:**
   - ❌ Same test logic repeated across multiple test files.
   - ✅ Extract test helpers and fixtures to reduce duplication.

**Mutation-resistant test generation rules:**

- **Rule 1: Boundary testing** — For conditions using `<`, `<=`, `>`, `>=`, `==`, `!=`, MUST test boundary-1, boundary, boundary+1 (e.g., for `age >= 18`, test 17, 18, 19).
- **Rule 2: Boolean logic coverage** — For `&&` and `||`, test all 4 combinations (TT, TF, FT, FF). For `!x`, test both true and false.
- **Rule 3: Exact assertions** — Use `.toBe()` not `.toBeTruthy()`, `.toBe(exact)` not `.toBeGreaterThan()`.
- **Rule 4: Error message validation** — Assert exact error message content, not just `expect(error).toBeDefined()`.
- **Rule 5: Return value validation** — Assert ALL fields in returned objects; verify absence of errors.

### 8. Tools & Frameworks
Testing and quality tooling MUST align with the project stack.

**Static analysis (mandatory):**
- **TypeScript strict mode:** `strict: true` in `tsconfig.json`; `any` prohibited.
- **ESLint:** All rules configured; enforced in pre-commit and CI.

**Testing frameworks:**
- **Jest:** Primary framework for unit and integration tests (both frontend and backend).
- **React Testing Library (optional):** For React component testing with user-centric queries.
- **Playwright (optional):** For end-to-end and behavioral tests.

**Mutation testing:**
- **Stryker (optional):** For Node.js/TypeScript mutation testing to validate test quality.
- **Mutation score target:** 75% minimum (if mutation testing is used).
- **Mutation workflow:** Generate tests → Run mutation → Identify survived mutants → Refine tests → Iterate until target reached.

**Key execution commands (required):**
- `npm run typecheck` — TypeScript strict type checking on all code and tests.
- `npm run lint` — ESLint linting on all files.
- `npm test` — Run all Jest tests (unit + integration).
- `npm run test:coverage` — Generate coverage report (80% line, 75% branch).
- `npm run test:e2e` — Run E2E tests (if present).
- `npm run test:mutation` — Run mutation testing with Stryker (if present).

**Pre-commit requirements (enforced via git hooks):**
- TypeScript type-check MUST pass.
- ESLint linting MUST pass.
- Unit tests MUST pass (backend/tests/unit/**, frontend/src/**/*.test.tsx).
- Changes MUST NOT reduce business-logic coverage below 80%.

**CI/CD pipeline requirements (enforced before merge to main):**
- TypeScript type-check MUST pass.
- ESLint linting MUST pass.
- All unit tests MUST pass.
- All integration tests MUST pass.
- Coverage report MUST show ≥80% line coverage, ≥75% branch coverage.
- Optional (nightly or main branch): Mutation testing MUST achieve ≥75% mutation score.

**Bonus labs — Mutation testing** (optional for core Module6, recommended for mutation testing labs):
- Use Stryker to run mutation testing on generated tests.
- Mutation testing validates that tests actually catch bugs.
- Follow the mutation-resistant test generation rules above to maximize mutation score.
- Use mutation report to identify weak tests and refine iteratively.

## Engineering Standards
- Use ESLint and formatting rules to enforce consistency.
- Keep module boundaries explicit and avoid circular dependencies.
- Prefer deterministic, testable code over implicit runtime behavior.
- Favor simplicity and incremental delivery over speculative architecture.

## Delivery and Quality Gates
- Every pull request MUST pass lint, type-check, and test pipelines.
- Reviewers MUST validate compliance with all constitution principles.
- Features lacking tests, strict typing compliance, or required JSDoc are incomplete.
- Any exception requires documented rationale and explicit reviewer approval.

## Governance
This constitution is the highest-priority engineering standard for this repository.
- In case of conflict, this constitution overrides local coding preferences.
- Amendments require a documented proposal and team approval.
- Version updates MUST include rationale and migration notes for affected teams.

**Version**: 1.0.0 | **Ratified**: 2026-05-14 | **Last Amended**: 2026-05-14
