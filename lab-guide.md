# Module 07: Lab Guide - Testing Principles & Test Generation

**Duration:** 60 minutes
**Goal**: Configure Testing Principles in constitution, then generate tests to validate configuration

---

## Overview

This lab demonstrates the complete Configure → Generate → Validate cycle.

**Phase 1: Configure Testing Principles (30 min)**
1. Use `/speckit.constitution` agent to add Testing Principles to constitution
2. Configure eight key sections interactively (agent handles formatting)
3. Make principles project-specific

**Phase 2: Generate & Validate Tests (30 min)**
4. Run `/speckit.tasks` to generate test tasks from a story
5. Run `/speckit.implement` to generate tests following your principles
6. Observe TDD workflow (Red-Green-Refactor)
7. Validate that tests follow your Testing Principles from constitution

**Pro Tip**: Use `/speckit.constitution` to activate a constitution-aware agent that can help you configure testing principles with proper formatting and context awareness.

---

## Prerequisites Checklist

Before starting, confirm you have:
- [ ] SpecKit configured from Module 06 with constitution.md
- [ ] ADRs from Module 04-ADR (you'll reference these)
- [ ] At least 2-3 Stories from Module 02 (for test generation)
- [ ] Understanding of your project's tech stack
- [ ] SpecKit slash commands available (`/speckit.constitution`, `/speckit.tasks`, `/speckit.implement`)

---

## Lab Exercises

---

## Phase 1: Configure Testing Principles (30 min)

### Exercise 1: Activate Agent & Configure Sections 1-2 (10 min)

#### Step 1.1: Activate `/speckit.constitution` Agent

Run the constitution-aware agent:

```
/speckit.constitution
```

This activates an agent that understands your constitution structure and can help you configure Testing Principles with proper formatting.

#### Step 1.2: Configure Section 1 (Testing Philosophy) and Section 2 (Coverage Requirements)

Ask the agent to add the first two sections:

```
I want to add Testing Principles to my constitution with 8 comprehensive sections.

Start with:

Section 1 - Testing Philosophy:
- Test-Driven Development (TDD) approach
- RED-GREEN-REFACTOR cycle
- Write tests FIRST before implementation
- Generate tests from specifications, not implementation

Section 2 - Coverage Requirements:
- Testing Pyramid distribution: ~70% unit, ~20% integration, ~10% E2E
- Unit tests: services, utilities, business logic
- Integration tests: API endpoints, database operations
- E2E tests: critical user workflows only
- Static analysis: [my type checker] strict + [my linter]
- Coverage targets: 80% line, 75% branch, 75% mutation score

Customize for my project's tech stack: [describe your stack]
```

**The agent will:**
- Add proper markdown formatting
- Create the Testing Principles section header
- Configure sections 1-2 with precise rules
- Customize for your tech stack based on ADRs

#### Step 1.3: Review Agent's Output

Check that the agent added:
- [ ] Testing Principles header with clear title
- [ ] Section 1: Testing Philosophy with TDD workflow
- [ ] Section 2: Coverage Requirements with Pyramid distribution (70/20/10)
- [ ] Project-specific customizations (tech stack, tools)

#### Checkpoint 1 (10 min mark)
- [ ] `/speckit.constitution` agent activated
- [ ] Sections 1-2 configured in constitution
- [ ] Distribution percentages defined (70/20/10)
- [ ] Customized for your project (tech stack, tools)

---

### Exercise 2: Configure Sections 3-8 (15 min)

Now configure the remaining 6 sections using the `/speckit.constitution` agent.

#### Step 2.1: Add Sections 3-5 (Organization, Naming, Anatomy)

Continue with the agent:

```
Add the next three sections:

Section 3 - Test Types & Organization:
- Unit tests: tests/unit/**/*.test.[ext] (mirror src/ structure)
- Integration tests: tests/integration/**/*.test.[ext] (group by feature)
- E2E tests: tests/e2e/**/*.spec.[ext] (group by user journey)
- One test file per source file (unit tests)

Section 4 - Naming Conventions:
- Test files: ComponentName.test.[ext] for unit/integration
- E2E files: user-journey-name.spec.[ext]
- Test suites: describe('ComponentName', ...)
- Test cases: it('should do X when Y', ...)

Section 5 - Test Anatomy:
- Primary pattern: Arrange-Act-Assert (AAA)
- Use beforeEach for test-specific setup (NOT beforeAll)
- Each test must be independent (can run alone)
- No shared global state

Customize file extensions and paths for my project structure.
```

**The agent will customize:**
- File extensions (`.ts`, `.py`, `.java`, `.go`)
- Directory paths matching your `src/` structure
- Naming patterns for your language conventions

#### Step 2.2: Add Sections 6-7 (Mocking, Quality Criteria)

**Section 7 (Quality Criteria) is the most critical section** - it prevents AI-generated test issues.

```
Add the next two sections, with special focus on Section 7:

Section 6 - Mocking & Test Data:
- Mock: External services (email, payment, third-party APIs)
- Stub: Time-dependent functions (Date.now(), timers)
- Fake: In-memory database for unit tests
- Use test fixtures for complex data
- Extract helpers: createTestUser(), setupMockAPI()
- Do NOT mock: code you own, simple utilities

Section 7 - Quality Criteria (CRITICAL):
What makes a good test:
- Tests observable behavior (not implementation details)
- Has meaningful assertions (not tautological: expect(x).toBe(x))
- Tests one thing (single responsibility)
- Is fast (<1s for unit, <5s for integration)
- Is deterministic (same result every run)

Quality gates:
- Mutation score: 75% minimum (use Stryker/mutmut/Pitest)
- No always-true assertions (tautological tests)
- All expected values (oracles) validated by human
- Coverage: 80% line, 75% branch

Anti-patterns to avoid:
- Testing private methods/internal state
- Interdependent tests (test order matters)
- Brittle tests (break on refactoring)
- Flaky tests (intermittent failures)
- Tests without assertions
- Copy-pasted test logic (extract helpers)

Add mutation testing tool for my language.
```

**Why Section 7 is Critical:**
- Prevents oracle hallucination (AI generating wrong expected values)
- Prevents tautological tests (tests that always pass)
- Defines quality gates for mutation testing
- Establishes anti-patterns to avoid

#### Step 2.3: Add Section 8 (Tools & Frameworks)

Complete with the final section:

```
Add the final section:

Section 8 - Tools & Frameworks:
Static analysis:
- [my type checker] strict mode
- [my linter] with [config]

Unit/Integration testing:
- Framework: [my test framework] [version]
- Assertion: [assertion library]
- Mocking: [mocking library]

E2E testing:
- Framework: [my E2E framework] [version]
- Optional: Stagehand for AI-native browser automation

Coverage & Quality:
- Coverage tool: [my coverage tool] (80% minimum)
- Mutation testing: [my mutation tool] (75% score minimum)

Execution commands:
- Type check: [command]
- Lint: [command]
- Run all tests: [command]
- Run unit tests: [command]
- Run integration tests: [command]
- Run E2E tests: [command]
- Generate coverage: [command]
- Run mutation testing: [command]

Pre-commit hook: typecheck + lint + unit tests
CI/CD pipeline: All checks + all tests + coverage + mutation (main branch)

Customize for my tech stack and package manager.
```

**Common Framework Choices:**
- **JavaScript/TypeScript**: Jest 29.x, Playwright 1.40+, TypeScript strict, ESLint, Stryker
- **Python**: Pytest 7.x, Playwright, mypy strict, pylint, mutmut
- **Java**: JUnit 5, Selenium, Checkstyle, Pitest
- **Go**: testing package, Testify, golangci-lint, go-mutesting

#### Checkpoint 2 (25 min mark)
- [ ] Sections 3-5 configured (Organization, Naming, Anatomy)
- [ ] Section 6 configured (Mocking & Test Data)
- [ ] Section 7 configured (Quality Criteria with anti-patterns)
- [ ] Section 8 configured (Tools with specific versions)
- [ ] All sections customized for your tech stack

---

### Exercise 3: Review and Commit (5 min)

#### Step 3.1: Review All 8 Sections

Use `/speckit.constitution` to review what was configured:

```
/speckit.constitution

Show me the complete Testing Principles section. Verify all 8 sections are present and properly formatted.
```

**Check for completeness:**
- [ ] Section 1: Testing Philosophy (TDD approach)
- [ ] Section 2: Coverage Requirements (70/20/10 pyramid)
- [ ] Section 3: Test Types & Organization (file locations)
- [ ] Section 4: Naming Conventions (test files, suites, cases)
- [ ] Section 5: Test Anatomy (AAA pattern)
- [ ] Section 6: Mocking & Test Data (mock strategy)
- [ ] Section 7: Quality Criteria (good tests, anti-patterns, mutation)
- [ ] Section 8: Tools & Frameworks (specific versions, commands)

#### Step 3.2: Commit Constitution

Save your configuration:

```bash
git add .specify/memory/constitution.md
git commit -m "feat(testing): add Testing Principles to constitution (8 sections)

- Testing Philosophy: TDD approach with RED-GREEN-REFACTOR
- Coverage Requirements: Testing Pyramid (70/20/10)
- Organization: file locations and structure
- Naming: test files, suites, cases
- Anatomy: AAA pattern
- Mocking: mock strategy and test data
- Quality Criteria: anti-patterns, mutation testing (75% target)
- Tools: [your frameworks] with execution commands
"
```

#### Checkpoint 3 (30 min mark)
- [ ] All 8 sections present and configured
- [ ] Constitution customized for your project
- [ ] Constitution committed to git
- [ ] Ready for test generation phase

---

## Phase 2: Generate & Validate Tests (30 min)

Now we'll validate your Testing Principles by generating tests for real stories.

### Exercise 4: Verify or Generate Test Tasks (5 min)

> **⚠️ NOTE**: You may have already run `/speckit.tasks` in Module 06 Exercise 7. If `tasks.md` already exists with test tasks, you can skip Step 4.2 and go directly to Step 4.3 for review.

#### Step 4.1: Check if tasks.md Already Exists

Navigate to your feature directory and check:

```bash
# Check if tasks.md exists from Module 06
ls specs/___-feature-name/tasks.md

# If it exists, preview it
cat specs/___-feature-name/tasks.md | head -30
```

**If tasks.md exists with test tasks** (look for entries like "Unit test:", "Integration test:", "E2E test:"):
- ✅ Skip Step 4.2 - you already have test tasks from Module 06
- ✅ Go directly to Step 4.3 to review the existing tasks

**If tasks.md doesn't exist OR has only implementation tasks** (no test tasks):
- ⏭️ Continue to Step 4.2 to generate test tasks

#### Step 4.2: Generate Test Tasks (if needed)

If you need to generate test tasks, run `/speckit.tasks`:

**Selected Feature:** `specs/___-feature-name/spec.md` (e.g., `specs/001-user-auth/spec.md`)

```
/speckit.tasks

Feature: specs/___-feature-name/spec.md

Generate test tasks following the Testing Principles from constitution.
```

**What `/speckit.tasks` does:**
- Reads your Testing Principles from constitution
- Analyzes acceptance criteria
- Creates test tasks ordered by Testing Pyramid (unit → integration → E2E)
- Generates specific, actionable test tasks

#### Step 4.3: Review Generated Test Tasks

Check that tasks follow your configuration:
- [ ] Tasks ordered by pyramid (unit tests first, then integration, then E2E)
- [ ] Unit test tasks: ~70% of total test tasks
- [ ] Integration test tasks: ~20% of total test tasks
- [ ] E2E test tasks: ~10% of total test tasks
- [ ] Each task references correct file locations from Section 3

**Example task output:**
```
Test Tasks (Ordered by Testing Pyramid):

UNIT TESTS (70%):
- [ ] Unit test: Validate user input in UserService (tests/unit/services/user.test.ts)
- [ ] Unit test: Calculate discount logic (tests/unit/utils/discount.test.ts)
- [ ] Unit test: Format output data (tests/unit/formatters/output.test.ts)

INTEGRATION TESTS (20%):
- [ ] Integration test: POST /api/users endpoint (tests/integration/api/users.test.ts)
- [ ] Integration test: Database user creation (tests/integration/database/users.test.ts)

E2E TESTS (10%):
- [ ] E2E test: User registration flow (tests/e2e/user-registration.spec.ts)
```

#### Checkpoint 4 (35 min mark)
- [ ] `/speckit.tasks` generated test tasks
- [ ] Tasks ordered by Testing Pyramid (unit → integration → E2E)
- [ ] Distribution matches ~70/20/10
- [ ] File locations match Section 3 of Testing Principles

---

### Exercise 5: Run `/speckit.implement` for 2-3 Stories (20 min)

Now generate actual tests using `/speckit.implement`.

#### Step 5.1: Generate Tests for First Feature

Run `/speckit.implement` - it will automatically read tasks.md and execute ALL test tasks sequentially:

```
/speckit.implement
```

**What `/speckit.implement` does automatically:**
1. **Reads tasks.md** - Gets the ordered list of test tasks from Exercise 4
2. **Reads constitution** - Follows all 8 Testing Principles sections
3. **Executes tasks sequentially** - Works through tasks one by one (Task 1/6, 2/6, 3/6...)
4. **For EACH task**, follows TDD workflow (because Section 1 says "Test-First Development"):
   - **RED**: Generate failing test first
   - **GREEN**: Generate minimum code to make test pass
   - **REFACTOR**: Improve code while keeping tests passing
5. **Marks tasks complete** - Checks off `[X]` in tasks.md as each completes
6. **Runs autonomously** - Continues through all tasks without stopping (default mode)

#### Step 5.2: Observe TDD Workflow (RED-GREEN-REFACTOR)

Watch for the TDD cycle:

**RED Phase:**
```
1. AI creates test file: tests/unit/services/user.test.ts
2. AI writes test cases with specific assertions
3. AI shows: "Test fails - UserService not implemented yet"
```

**GREEN Phase:**
```
4. AI creates: src/services/user.ts
5. AI implements minimal code to pass tests
6. AI shows: "All tests passing ✓"
```

**REFACTOR Phase (optional):**
```
7. AI improves code structure
8. AI re-runs tests to ensure they still pass
```

#### Step 5.3: Validate Tests Follow Your Principles

Check generated tests against your Testing Principles:

**From Section 3 (Organization):**
- [ ] Tests in correct file locations (`tests/unit/`, `tests/integration/`, `tests/e2e/`)
- [ ] File structure mirrors `src/` directory

**From Section 4 (Naming):**
- [ ] Test files named correctly (e.g., `ComponentName.test.ts`)
- [ ] Test cases use descriptive names (`should do X when Y`)

**From Section 5 (Anatomy):**
- [ ] Tests use AAA pattern (Arrange-Act-Assert)
- [ ] Each test is independent (can run alone)

**From Section 7 (Quality Criteria - CRITICAL):**
- [ ] No tautological assertions (e.g., `expect(x).toBe(x)`)
- [ ] Tests observable behavior (not implementation details)
- [ ] Meaningful assertions (not always-true tests)
- [ ] Edge cases covered

**From Section 8 (Tools):**
- [ ] Uses correct framework (e.g., Jest, Pytest)
- [ ] Uses correct execution commands

#### Step 5.4: Run Tests to Verify

Execute the test commands from Section 8:

```bash
# Run unit tests
[your unit test command from Section 8]

# Run all tests
[your test command from Section 8]

# Check coverage
[your coverage command from Section 8]
```

**Expected result:** All tests pass ✓

#### Step 5.5: Generate Tests for 2-3 More Features (Optional)

If time allows, repeat the workflow for additional features:

**Feature 2:** `specs/___-feature-name/spec.md`
**Feature 3:** `specs/___-feature-name/spec.md`

**For each additional feature, run the complete workflow:**

1. **Generate test tasks**: `/speckit.tasks` on the new feature → creates tasks.md
2. **Implement tests**: `/speckit.implement` → executes all tasks from tasks.md
3. **Validate**: Check tests follow Testing Principles
4. **Run tests**: Verify all pass

**Note**: Each feature needs its own `/speckit.tasks` run to generate the task list, then `/speckit.implement` executes those tasks.

#### Checkpoint 5 (55 min mark)
- [ ] Tests generated for 2-3 stories using `/speckit.implement`
- [ ] Observed TDD workflow (RED → GREEN → REFACTOR) at least once
- [ ] Tests follow Testing Principles from constitution
- [ ] All tests passing when executed
- [ ] Coverage measured (if time allows)

---

### Exercise 6: Quality Validation (5 min)

Final quality check of generated tests.

#### Step 6.1: Review Section 7 Compliance (Quality Criteria)

This is the most critical validation - ensuring AI didn't generate bad tests.

**Check for anti-patterns from Section 7:**
- [ ] No tautological tests (tests that always pass)
- [ ] No testing of private methods/internal state
- [ ] No interdependent tests (tests can run in any order)
- [ ] No brittle tests (tests don't break on refactoring)
- [ ] No tests without assertions
- [ ] No copy-pasted test logic (helpers extracted if needed)

**Example of GOOD test (follows Section 7):**
```typescript
test('should return 10 when calculating 10% discount on $100', () => {
  // Arrange
  const price = 100;
  const discountPercent = 10;

  // Act
  const result = calculateDiscount(price, discountPercent);

  // Assert
  expect(result).toBe(10); // Specific, meaningful assertion
});
```

**Example of BAD test (violates Section 7):**
```typescript
test('discount calculation works', () => {
  const result = calculateDiscount(100, 10);
  expect(result).toBe(result); // Tautological! Always passes
});
```

#### Step 6.2: Spot Check Expected Values (Oracles)

From Section 7: "All expected values (oracles) validated by human"

Review 2-3 tests and verify expected values are correct:
- [ ] Assertions have correct expected values (not hallucinated)
- [ ] Edge cases have correct expected behavior
- [ ] Error cases expect correct error messages

**If you find oracle hallucination:** Refine the test manually or ask AI to regenerate with more specific requirements.

#### Step 6.3: Document Coverage (If Time Allows)

Quick coverage check:

```bash
[your coverage command from Section 8]
```

**Current Coverage:** ___%
**Target from Section 2:** 80% line, 75% branch

#### Checkpoint 6 (60 min mark - End of Lab)
- [ ] Reviewed tests for Section 7 anti-patterns
- [ ] Validated expected values (oracles) are correct
- [ ] No tautological tests found
- [ ] Coverage measured (optional)
- [ ] Understanding of Configure → Generate → Validate cycle

---

### Bonus Exercise: Explore Alternative Testing Strategies (optional, 10-15 min)

**Goal**: See how different testing strategies (Trophy, Diamond) would be configured in your constitution using the constitution-aware agent.

#### Why This Exercise?

Testing Pyramid isn't the only strategy. By exploring alternatives, you'll:
- Understand WHY we chose Testing Pyramid for this course
- See how constitution configuration changes with different strategies
- Learn when Trophy or Diamond might be better for certain projects

#### Step 1: Create a Comparison Branch (optional)

```bash
# Create a branch to experiment without affecting your main constitution
git checkout -b testing-strategy-comparison
```

#### Step 2: Ask Agent to Configure Testing Trophy

```
/speckit.constitution

I want to see how Testing Trophy strategy would be configured in my constitution.

Testing Trophy principles:
- Focus on integration tests (largest layer)
- Unit tests for utilities only
- E2E tests for critical flows
- Distribution: ~20% unit, ~60% integration, ~20% E2E

Update my testing principles section to follow Testing Trophy instead of Testing Pyramid.
```

**Observe what the agent generates:**
- How does distribution change? (~20% unit, ~60% integration, ~20% E2E)
- Does file location structure change?
- Are different frameworks emphasized?
- How do execution commands differ?

#### Step 3: Ask Agent to Configure Testing Diamond

```
/speckit.constitution

Now show me how Testing Diamond strategy would be configured.

Testing Diamond principles:
- Large integration layer (widest part)
- Moderate unit and E2E layers
- Focus on API contract testing
- Distribution: ~30% unit, ~50% integration, ~20% E2E

Update my testing principles to follow Testing Diamond approach.
```

**Observe what the agent generates:**
- How does this differ from Pyramid and Trophy?
- What frameworks might be recommended for API contract testing?
- How does the integration layer change?

#### Step 4: Compare All Three Strategies

Create a comparison table:

| Aspect | Pyramid (Our Choice) | Trophy | Diamond |
|--------|---------------------|--------|---------|
| Distribution | 70/20/10 | 20/60/20 | 30/50/20 |
| Focus | Unit tests | Integration tests | Integration + API contracts |
| Best For | TDD workflow, any stack | JS/TS projects, API-heavy | Microservices, API-first |
| Speed | Fastest (70% unit) | Medium | Medium-slow |
| Maintenance | Easiest | Medium | Medium |

#### Step 5: Return to Testing Pyramid (if on comparison branch)

```bash
# Return to your main branch with Testing Pyramid configuration
git checkout [your-main-branch]
```

#### Key Learnings

**Testing Pyramid (What We Use):**
- ✅ Works with any tech stack
- ✅ TDD-friendly (write unit tests first)
- ✅ Fast feedback (70% unit tests run in milliseconds)
- ✅ Industry standard

**Testing Trophy:**
- Good for JavaScript/TypeScript projects
- Integration tests catch more real-world issues
- Slower than Pyramid (more integration tests)

**Testing Diamond:**
- Best for microservices architecture
- API contract testing prevents integration issues
- Requires more sophisticated tooling

**Why We Chose Pyramid for This Course:**
- Language-agnostic (works with any stack)
- TDD workflow aligns with `/speckit.implement`
- Fast CI/CD pipelines
- Easy to understand and maintain

---

## Lab Completion Checklist

### Phase 1: Configuration (Required)
- [ ] Testing Principles section added to constitution (all 8 sections)
- [ ] Section 1: Testing Philosophy configured
- [ ] Section 2: Coverage Requirements with Pyramid (70/20/10)
- [ ] Section 3: Test Types & Organization (file locations)
- [ ] Section 4: Naming Conventions
- [ ] Section 5: Test Anatomy (AAA pattern)
- [ ] Section 6: Mocking & Test Data
- [ ] Section 7: Quality Criteria (anti-patterns, mutation testing)
- [ ] Section 8: Tools & Frameworks (specific versions, commands)
- [ ] Constitution committed to git

### Phase 2: Test Generation (Required)
- [ ] Ran `/speckit.tasks` on at least 1 story
- [ ] Generated tests for 2-3 stories using `/speckit.implement`
- [ ] Observed TDD workflow (RED → GREEN → REFACTOR)
- [ ] Tests follow Testing Principles from constitution
- [ ] All tests passing when executed
- [ ] Validated tests against Section 7 (Quality Criteria)

### Bonus (If Time Allows)
- [ ] Coverage measured (80%+ target)
- [ ] Mutation testing configured
- [ ] Explored alternative testing strategies (Trophy, Diamond)
- [ ] Generated tests for additional stories

---

## Constitution Testing Principles Template

Here's a complete 8-section template you can copy and customize:

```markdown
---

### Testing Principles: Test-First Development

**NON-NEGOTIABLE: All implementation MUST follow Test-Driven Development.**

---

#### 1. Testing Philosophy

**Approach**: Test-Driven Development (TDD)
- Write test FIRST (RED)
- Implement to pass test (GREEN)
- Refactor with confidence (REFACTOR)

**Test Generation**:
- Generate tests from specifications, NOT implementation
- Human validates expected values (oracles) - prevent hallucination
- AI generates comprehensive test cases

---

#### 2. Coverage Requirements

**Test Distribution (Pyramid Shape)**:
- Unit tests: ~70% (fast, focused, many)
  - Services, utilities, business logic
- Integration tests: ~20% (API routes, database)
  - API endpoints, database operations
- E2E tests: ~10% (critical user journeys only)
  - Login flow, checkout process, core workflows

**Static Analysis (Fastest Feedback)**:
- TypeScript strict mode [or your type checker]
- ESLint with Airbnb config [or your linter]
- Run BEFORE tests in CI/CD

**Coverage Targets**:
- Line coverage: 80% minimum
- Branch coverage: 75% minimum
- Mutation score: 75% minimum (quality gate)

---

#### 3. Test Types & Organization

**File Locations**:
- Unit tests: `tests/unit/**/*.test.ts`
  - Mirror src/ structure: `tests/unit/services/` for `src/services/`
- Integration tests: `tests/integration/**/*.test.ts`
  - Group by feature: `tests/integration/api/`, `tests/integration/database/`
- E2E tests: `tests/e2e/**/*.spec.ts`
  - Group by user journey: `tests/e2e/checkout/`, `tests/e2e/onboarding/`

**Test Organization**:
- One test file per source file (unit tests)
- One test file per feature (integration tests)
- One test file per user journey (E2E tests)

---

#### 4. Naming Conventions

**Test Files**:
- Unit/Integration: `ComponentName.test.ts`
- E2E: `user-journey-name.spec.ts`

**Test Suites**:
- `describe('ComponentName', ...)`
- `describe('FeatureName', ...)`

**Test Cases**:
- `it('should do X when Y', ...)` or `test('should do X when Y', ...)`
- Use descriptive names that explain expected behavior
- Examples:
  - `it('should return 10 when calculating 10% discount on $100', ...)`
  - `it('should throw error when email format is invalid', ...)`

---

#### 5. Test Anatomy

**Primary Pattern: Arrange-Act-Assert (AAA)**:
```typescript
test('user can create task with valid data', () => {
  // Arrange: Set up test data and conditions
  const userData = { name: 'Test User', email: 'test@example.com' };
  const taskData = { title: 'New Task', priority: 'high' };

  // Act: Execute the action being tested
  const result = createTask(userData, taskData);

  // Assert: Verify the outcome
  expect(result.success).toBe(true);
  expect(result.task.title).toBe('New Task');
  expect(result.task.assignee).toBe(userData.email);
});
```

**Alternative: Given-When-Then (BDD)**:
- Given: Initial context
- When: Action performed
- Then: Expected outcome

**Test Structure**:
- Use `beforeEach` for test-specific setup (NOT `beforeAll`)
- Each test must be independent (can run alone)
- No shared global state

---

#### 6. Mocking & Test Data

**Mocking Strategy**:
- **Mock**: External services (email, payment, third-party APIs)
- **Stub**: Time-dependent functions (Date.now(), timers)
- **Fake**: In-memory database for unit tests

**Test Data**:
- Use test fixtures for complex data
- Extract to helper functions: `createTestUser()`, `setupMockAPI()`
- Avoid hardcoded magic values - use constants

**What NOT to mock**:
- Code you own (test real implementation)
- Simple utilities (actual implementation is faster)

---

#### 7. Quality Criteria

**What Makes a Good Test**:
- ✅ Tests observable behavior (not implementation details)
- ✅ Has meaningful assertions (not tautological: `expect(x).toBe(x)`)
- ✅ Tests one thing (single responsibility)
- ✅ Is fast (<1s for unit, <5s for integration)
- ✅ Is deterministic (same result every run)

**Quality Gates**:
- Mutation score: 75% minimum (use Stryker/mutmut/Pitest)
- No always-true assertions (tautological tests)
- All expected values (oracles) validated by human
- Coverage: 80% line, 75% branch

**Anti-Patterns to Avoid**:
- ❌ Testing private methods/internal state
- ❌ Interdependent tests (test order matters)
- ❌ Brittle tests (break on refactoring)
- ❌ Flaky tests (intermittent failures)
- ❌ Tests without assertions
- ❌ Copy-pasted test logic (extract helpers)

---

#### 8. Tools & Frameworks

**Static Analysis**:
- TypeScript strict mode
- ESLint with Airbnb config

**Unit/Integration Testing**:
- Framework: Jest 29.x with ts-jest
- Assertion: expect() API from Jest
- Mocking: Jest mocks + MSW (Mock Service Worker)

**E2E Testing**:
- Framework: Playwright 1.40+ (Chromium primary)
- Self-healing: Stagehand for AI-native browser automation

**Coverage & Quality**:
- Coverage: Jest built-in coverage (80% minimum)
- Mutation testing: Stryker (75% mutation score minimum)

**Execution Commands**:
- `npm run typecheck` - TypeScript check (fastest feedback)
- `npm run lint` - ESLint check
- `npm test` - Run all tests
- `npm run test:unit` - Unit tests only
- `npm run test:integration` - Integration tests only
- `npm run test:e2e` - E2E tests only
- `npm run test:coverage` - Generate coverage report
- `npm run test:mutation` - Run mutation testing (nightly/main branch)

**Pre-commit Hook**: typecheck + lint + unit tests
**CI/CD Pipeline**: All checks + all tests + coverage + mutation testing (main branch)
```

---

## Troubleshooting

### "I'm not sure how to format my testing principles"
- Use `/speckit.constitution` to activate the constitution-aware agent
- The agent understands constitution structure and will help format correctly
- Tell the agent what you want to configure, it will add proper markdown formatting

### "AI isn't writing tests first"
- Check constitution syntax - is the TDD requirement clear?
- Add: "**RED-GREEN-REFACTOR: Always write failing test first**"
- Emphasize with "NON-NEGOTIABLE" or "MUST"
- Try using `/speckit.constitution` to refine the TDD requirement

### "AI uses wrong file locations"
- Be more specific: `tests/unit/services/` not `tests/unit/`
- Give examples: "For `src/auth.ts`, test goes in `tests/unit/auth.test.ts`"
- Check file extensions match your language

### "AI uses wrong framework"
- Specify exact version: "Jest 29.x" not "Jest"
- Check if framework is installed in your project
- Add framework to package.json/requirements.txt if missing

### "Where should testing principles go in constitution?"
- At the end of constitution.md (after existing sections)
- Use clear header: "### Testing Principles: Test-First Development"
- Separate from other sections with `---`

---

## Quick Reference: Eight Sections

| Section | What to Define | Example |
|---------|----------------|---------|
| **1. Testing Philosophy** | TDD/BDD approach | Test-First Development, RED-GREEN-REFACTOR |
| **2. Coverage Requirements** | Pyramid distribution | ~70% unit, ~20% integration, ~10% E2E |
| **3. Test Types & Organization** | File structure | `tests/unit/**/*.test.ts` mirrors `src/` |
| **4. Naming Conventions** | Test/file names | `ComponentName.test.ts`, `should do X when Y` |
| **5. Test Anatomy** | Test structure | AAA pattern (Arrange-Act-Assert) |
| **6. Mocking & Test Data** | Mock strategy | Mock external services, use test fixtures |
| **7. Quality Criteria** | What makes good tests | No tautological tests, mutation score 75%+ |
| **8. Tools & Frameworks** | Specific tools | Jest 29.x, Playwright 1.40+, Stryker |

---

## Next Steps

Your testing principles and generated tests will be used in:
- **Module 08 (Project Sprint)**: Apply SpecKit TDD workflow extensively using these principles
- **Real Projects**: Use `/speckit.implement` for all feature development following TDD

**Key Insights from This Module:**
1. **Constitution is the source of truth** - AI reads Testing Principles from constitution
2. **Precise rules = consistent behavior** - Vague rules lead to inconsistent tests
3. **Configure → Generate → Validate** - Complete cycle demonstrated in this module
4. **Section 7 (Quality Criteria) prevents AI issues** - Tautological tests, oracle hallucination
5. **TDD workflow works with AI** - RED → GREEN → REFACTOR is observable

---

**Document Version**: 1.0
**Last Updated**: 2025-11-30
**Module**: 07 - Testing Principles & Test Generation
