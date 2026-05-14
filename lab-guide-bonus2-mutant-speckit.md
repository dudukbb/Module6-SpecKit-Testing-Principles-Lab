# Bonus Lab 2: Mutation Testing with SpecKit + Constitution

**Status:** Optional - Self-Paced Learning
**Prerequisites:** Completed Bonus Lab 1 (Mutation Testing Hands-On)
**Estimated Time:** 1-2 hours (work at your own pace)
**Tech Stack:** Node.js + Jest + Stryker + SpecKit

---

## Purpose

Apply mutation testing to your real project using SpecKit + Constitution workflow:

1. Configure Section 7 (Quality Criteria) with mutation testing rules
2. Use `/speckit.implement` to generate mutation-resistant tests
3. Run mutation testing and refine iteratively
4. Achieve 75%+ mutation score on a real feature
5. Document workflow for team adoption

**This is NOT graded or timed** - it's practical application of Bonus Lab 1 to your project.

---

## Prerequisites

Before starting this lab:

- ✅ Completed **Bonus Lab 1** (Mutation Testing Hands-On)
- ✅ Completed **Module 07 main lab** (Constitution with Section 7)
- ✅ Have Stryker mutation testing configured (see Bonus Lab 1 setup)
- ✅ Have a feature spec ready to implement
- ✅ Node.js 16+ and Jest installed
- ✅ 1-2 hours of uninterrupted time

**If you haven't done Bonus Lab 1 yet:**
→ Start with `lab-guide-bonus1-mutant.md` to learn mutation testing fundamentals first.

---

## Learning Objectives

By the end of this lab, you will:

1. Configure Section 7 (Quality Criteria) with mutation-resistant test rules
2. Use `/speckit.implement` to generate tests from specs + constitution
3. Interpret mutation reports to identify weak tests
4. Use mutation feedback to refine AI prompts
5. Achieve 75%+ mutation score on a real feature
6. Document a repeatable workflow for your team

---

## The Problem This Lab Solves

**Without Section 7 mutation testing rules:**

```bash
# You write a spec
/speckit.implement user-authentication.md

# AI generates tests
✅ Tests created: tests/userAuthentication.test.js

# Tests pass!
npm test
✅ 10 tests passed

# But mutation testing reveals weakness:
npm run test:mutation
Mutation score: 38% ❌
```

**The issue:** AI generated tests that PASS but don't catch bugs.

**With Section 7 mutation testing rules:**

```bash
# Same spec, but constitution has mutation rules
/speckit.implement user-authentication.md

# AI reads Section 7 rules and generates stronger tests
npm run test:mutation
Mutation score: 72% ✅ (much better!)

# One iteration of refinement
/speckit.implement user-authentication.md
"Context: These mutants survived [paste list]"

npm run test:mutation
Mutation score: 81% ✅ (target exceeded!)
```

---

## Exercise 1: Configure Section 7 for Mutation Testing (20 minutes)

### Task 1.1: Open Your Constitution

Locate your project's `CONSTITUTION.md` (or similar file) that you created in Module 07.

**Check if you have Section 7:**

```bash
# Search for Section 7
grep -n "Section 7" CONSTITUTION.md
```

If you don't have Section 7 yet, create it following the template below.

---

### Task 1.2: Add Mutation Testing Rules to Section 7

**Replace or enhance your Section 7 with this template:**

```markdown
### Section 7: Quality Criteria

**Test Generation Philosophy:**
- **Test-First Approach:** Generate tests from specs BEFORE implementation (TDD-style)
- Generate tests from acceptance criteria, NOT from implementation code
- All expected values (oracles) must be validated by human before approval
- Mutation testing validates test strength (not just code coverage)
- Target: 75% minimum mutation score

**TDD-Style Test Generation Workflow:**
1. Read acceptance criteria from spec.md
2. Generate tests that verify each acceptance criterion
3. Tests should FAIL initially (no implementation yet)
4. Implement code to make tests pass
5. Run mutation testing to validate test quality
6. Refactor code while keeping tests green

**Anti-patterns to Prevent:**

1. **Tautological Tests (Always Pass):**
   ```javascript
   // ❌ BAD - always true
   const result = calculateDiscount(100, 0.2);
   expect(result).toBeDefined();  // Meaningless!

   // ✅ GOOD - specific assertion
   const result = calculateDiscount(100, 0.2);
   expect(result).toBe(80);  // Must be exactly 80
   ```

2. **Weak Assertions:**
   ```javascript
   // ❌ BAD - too vague
   expect(user.isValid).toBeTruthy();  // Passes for any truthy value

   // ✅ GOOD - exact assertion
   expect(user.isValid).toBe(true);  // Only passes for true
   expect(user.error).toBeUndefined();  // Verify no error
   ```

3. **Missing Boundary Tests:**
   ```javascript
   // ❌ BAD - only test x=20 (clearly above threshold)
   expect(isAdult(20)).toBe(true);

   // ✅ GOOD - test boundary-1, boundary, boundary+1
   expect(isAdult(17)).toBe(false);  // Below
   expect(isAdult(18)).toBe(true);   // Exact boundary
   expect(isAdult(19)).toBe(true);   // Above
   ```

4. **Vague Error Checking:**
   ```javascript
   // ❌ BAD - only checks error exists
   const result = validatePassword("weak");
   expect(result.error).toBeDefined();  // Passes for ANY error!

   // ✅ GOOD - check exact error message
   const result = validatePassword("weak");
   expect(result.error).toBe("Password too short");  // Exact message
   ```

5. **Testing Implementation Details:**
   ```javascript
   // ❌ BAD - tests private fields
   expect(user._hashSalt).toBeDefined();

   // ✅ GOOD - tests public behavior
   expect(user.authenticate("password")).toBe(true);
   ```

**Quality Gates (Non-Negotiable):**

- Mutation testing score: **75% minimum**
- Tool: Stryker (JavaScript/TypeScript)
- Run mutation testing BEFORE committing tests
- Command: `npm run test:mutation`
- HTML report location: `reports/mutation/index.html`
- All tests must pass regular test suite AND mutation testing

**Mutation-Resistant Test Generation Rules:**

**Rule 1: Boundary Testing (for <, <=, >, >=, ==, !=):**
- Test boundary-1, boundary exactly, boundary+1
- Example: For `age >= 18`, MUST test age=17, 18, 19

**Rule 2: Boolean Logic Coverage (for &&, ||, !):**
- For `a && b`: Test all 4 combinations (TT, TF, FT, FF)
- For `a || b`: Test all 4 combinations
- For `!condition`: Test both true and false

**Rule 3: Exact Assertions:**
- Use `expect(x).toBe(true)` (not `expect(x).toBeTruthy()`)
- Use `expect(result).toBe(42)` (not `expect(result).toBeGreaterThan(0)`)
- Use `expect(error).toBe("Exact message")` (not `expect(error).toBeDefined()`)

**Rule 4: Error Message Validation:**
- Assert exact error message content
- Assert error codes/types if applicable
- Test ALL error scenarios (not just one)

**Rule 5: Return Value Validation:**
- Assert ALL fields in returned objects
- Don't just check `expect(result).toBeDefined()`
- Verify absence of errors (`expect(error).toBeUndefined()`)

**Mutation Testing Workflow:**

1. Generate tests with `/speckit.implement [spec-file.md]`
2. Run mutation testing: `npm run test:mutation` (or equivalent)
3. Check mutation score in report
4. If score < 75%:
   a. Open HTML report
   b. Identify survived mutants (red-highlighted code)
   c. Augment prompt with mutation feedback
   d. Re-run `/speckit.implement` with context
5. Repeat until score ≥ 75%
6. Commit tests + mutation report

**Example Prompt Structure for SpecKit:**

```
Generate tests from [spec-file.md] following Section 7 (Quality Criteria).

Additional context:
- [Any domain-specific requirements]
- [Mutation testing feedback if iterating]

Requirements from Section 7:
- Test boundary values for all conditions
- Assert exact error messages
- Use exact assertions (.toBe() not .toBeTruthy())
- Test all boolean logic combinations
```
```

---

### Task 1.3: Validate Your Constitution

```bash
# Validate configuration with SpecKit
/speckit.constitution

# Expected output should confirm:
# ✅ Section 7 (Quality Criteria) found
# ✅ Mutation testing rules detected
# ✅ Quality gates defined
```

**If validation fails:**
- Check Section 7 is numbered correctly
- Ensure "Quality Gates" section exists
- Verify mutation testing workflow is documented

---

### Task 1.4: Commit Constitution Changes

```bash
git add CONSTITUTION.md
git commit -m "feat: add mutation testing rules to Section 7 (Quality Criteria)"
git push
```

**✅ Checkpoint 1:**
- [ ] Section 7 includes mutation testing rules
- [ ] `/speckit.constitution` validates successfully
- [ ] Constitution committed to repository

---

## Exercise 2: Generate Mutation-Resistant Tests with SpecKit (30 minutes)

### Task 2.1: Choose a Feature Spec

Select a feature from your project that has a **`spec.md`** file (created by `/speckit.specify` in Module 06).

**Where is `spec.md`?**

SpecKit creates `spec.md` when you run `/speckit.specify`:

```bash
# Example SpecKit workflow from Module 06:
/speckit.specify "Add password validation"

# SpecKit creates:
specs/001-password-validation/
  ├── spec.md        # ← Acceptance criteria go here!
  ├── plan.md        # Created by /speckit.plan
  └── tasks.md       # Created by /speckit.tasks
```

**Note:** This password validation example is for **demonstration purposes only**. Normally, you would NOT create a full SpecKit spec for such a small, isolated requirement. Use SpecKit for:
- Complete features (e.g., "User Authentication System")
- Multi-step workflows (e.g., "Checkout Process")
- Features with 3+ acceptance criteria

For this lab, use a **real feature from your own project** that already has a `spec.md` file from Module 06.

**Good choices for first attempt:**
- Authentication flow (login, logout, token validation)
- Input validation (email, password, form validation)
- Business logic (pricing, discounts, permissions)
- Data transformation (parsing, formatting, conversion)

**Avoid for first attempt:**
- Complex UI components
- Multi-service integrations
- Large features with 10+ acceptance criteria

**Example `spec.md` structure** (SpecKit generates this automatically):

**⚠️ PEDAGOGICAL NOTE - INTENTIONALLY WEAK REQUIREMENTS:**

In the example below, notice **AC1 uses `< 8 characters`** instead of specifying exact test values (e.g., "test with 7, 8, 9 characters").

**This is INTENTIONAL for this lab's learning objectives:**
- Normally, you would write **complete, precise requirements** with explicit test scenarios
- However, we **cannot guarantee AI will make mistakes** even with good requirements
- So this example uses **deliberately vague acceptance criteria** to ensure weak tests are generated
- This guarantees you'll have surviving mutants to learn from

**In production:** You would write AC1 like this instead:
```
### AC1: Minimum Length Requirement
- GIVEN password with 7 characters THEN reject with error "Password must be at least 8 characters"
- GIVEN password with 8 characters THEN accept (boundary)
- GIVEN password with 9 characters THEN accept
```

**For this lab:** We use the weaker version below to create the learning scenario.

---

```markdown
# Feature: Password Validation

## User Story
As a user
I want my password validated during registration
So that my account is secure

## Acceptance Criteria

### AC1: Minimum Length Requirement
- GIVEN user enters password during registration
- WHEN password length < 8 characters
- THEN show error "Password must be at least 8 characters"
- AND prevent form submission

### AC2: Uppercase Letter Requirement
- GIVEN user enters password
- WHEN password has no uppercase letter (A-Z)
- THEN show error "Password must contain an uppercase letter"

### AC3: Number Requirement
- GIVEN user enters password
- WHEN password has no number (0-9)
- THEN show error "Password must contain a number"

### AC4: Valid Password
- GIVEN user enters "MyPass123"
- WHEN validation runs
- THEN return valid=true with no errors
- AND allow form submission

## Edge Cases
- Empty password
- Password with only spaces
- Very long password (>128 characters)

## Error Scenarios
- Multiple validation failures at once
- Special characters (should be allowed)
```

**If you don't have a `spec.md` yet:**

```bash
# Run SpecKit to create one
/speckit.specify "Add password validation"

# Answer AI's clarifying questions
# SpecKit will create specs/001-password-validation/spec.md
```

---

### Task 2.2: Generate Tests with SpecKit (First Iteration)

**⚠️ IMPORTANT NOTE:**
In this lab's first iteration, you will observe that **even with Section 7 (Quality Criteria) configured, AI may still generate tests with gaps**. This is NOT a failure - it's the point!

**Why we do this:**
- Demonstrates that constitution rules are guidance, not guarantees
- Shows mutation testing catches weaknesses even when specs and constitution are perfect
- Simulates real-world scenario: AI assistance + good configuration still needs validation
- Creates learning opportunity: mutation feedback → refined tests

**Key insight:** Whether tests are written by humans or AI, mutation testing reveals weaknesses that passing tests alone cannot detect. This lab teaches you to use mutation feedback to iteratively strengthen tests.

---

**Run SpecKit with your spec:**

```bash
# Use the spec.md file path
/speckit.implement specs/001-password-validation/spec.md
```

**What SpecKit does:**
1. Reads your spec (acceptance criteria)
2. Reads `CONSTITUTION.md` Section 7 (Quality Criteria)
3. Generates tests following mutation-resistant rules
4. Creates test file(s)

**Expected output:**

```
✅ Tests generated: tests/passwordValidation.test.js
✅ Following Section 7 (Quality Criteria) rules:
   - Boundary testing for length >= 8
   - Exact error message assertions
   - Boolean logic coverage for multiple conditions
```

---

### Task 2.3: Review Generated Tests

**Open the generated test file and look for Section 7 patterns:**

**✅ Good signs (AI followed Section 7):**
```javascript
// ✅ Boundary testing (Rule 1)
describe('Password Validator - Boundary Tests', () => {
  it('validates password length boundaries', () => {
    expect(validatePassword("Pass12!").valid).toBe(false);  // 7 chars
    expect(validatePassword("Pass12!").error).toBe("Password must be at least 8 characters");

    expect(validatePassword("Pass123!").valid).toBe(true);   // 8 chars
    expect(validatePassword("Pass1234!").valid).toBe(true);  // 9 chars
  });
});

// ✅ Exact error messages (Rule 4)
it('returns exact error message for short password', () => {
  const result = validatePassword("weak");
  expect(result.error).toBe("Password must be at least 8 characters");  // Exact match
});

// ✅ Exact assertions (Rule 3)
it('validates correct password with exact assertions', () => {
  const result = validatePassword("MyPass123");
  expect(result.valid).toBe(true);  // Not .toBeTruthy()
  expect(result.error).toBeUndefined();  // Verify no error
});
```

**❌ Red flags (AI didn't follow Section 7):**
```javascript
// ❌ Weak assertion
it('validates password', () => {
  const result = validatePassword("MyPass123");
  expect(result).toBeDefined();  // Too vague!
});

// ❌ Missing boundary test
it('accepts long password', () => {
  expect(validatePassword("LongPassword123").valid).toBe(true);  // Only length=16, not 7, 8, 9
});

// ❌ Vague error check
it('rejects invalid password', () => {
  const result = validatePassword("weak");
  expect(result.error).toBeDefined();  // Doesn't check exact message!
});
```

**If you see red flags:**
- Refine your prompt in next iteration (Task 2.5)
- Or manually fix tests before running mutation testing

---

### Task 2.4: Run Mutation Testing (First Iteration)

```bash
npm run test:mutation
```

**Expected first-iteration score:**

If Section 7 is well-configured: **60-75%** (good!)
If Section 7 is missing rules: **30-50%** (needs work)

**View the report:**

```bash
# macOS
open reports/mutation/index.html

# Linux
xdg-open reports/mutation/index.html

# Windows
start reports/mutation/index.html
```

---

### Task 2.5: Identify Survived Mutants

**Open the HTML report and look for RED-highlighted code.**

**Example survived mutants:**

```javascript
// Original code
if (password.length >= 8) {
  return { valid: true };
}

// Mutant (SURVIVED) - Stryker changed >= to >
if (password.length > 8) {
  return { valid: true };
}

// Why it survived:
// Test used password with length=10
// Original: 10 >= 8 → true
// Mutant:   10 > 8  → true
// Same result! Test didn't catch it.

// FIX: Add test with exactly 8 characters (boundary test!)
```

**Document survived mutants:**

```markdown
## Survived Mutants (Iteration 1)

1. Line 15: `password.length >= 8` → `password.length > 8` (SURVIVED)
   - Missing test: password with exactly 8 characters

2. Line 22: `return "Password must be at least 8 characters"` → `return ""` (SURVIVED)
   - Missing test: assertion of exact error message

3. Line 35: `hasUppercase && hasNumber` → `hasUppercase || hasNumber` (SURVIVED)
   - Missing tests: truth table combinations (T,F), (F,T)
```

---

### Task 2.6: Refine with Mutation Feedback (Second Iteration)

**Re-run SpecKit with mutation feedback:**

```bash
/speckit.implement specs/001-password-validation/spec.md

# Add this context in the prompt:
"Additional context from mutation testing (Iteration 1):

Survived mutants:
1. Line 15: password.length >= 8 → password.length > 8 (SURVIVED)
2. Line 22: return 'error message' → return '' (SURVIVED)
3. Line 35: hasUppercase && hasNumber → hasUppercase || hasNumber (SURVIVED)

Following Section 7 (Quality Criteria), generate additional tests to kill these mutants:
- Test password with exactly 7, 8, 9 characters (Rule 1: Boundary testing)
- Assert exact error message content (Rule 4: Error message validation)
- Test all 4 combinations of uppercase/number (Rule 2: Boolean logic coverage)
"
```

**SpecKit will:**
1. Read your mutation feedback
2. Apply Section 7 rules
3. Generate targeted tests

---

### Task 2.7: Run Mutation Testing Again

```bash
# Run mutation testing (iteration 2)
npm run test:mutation
```

**Expected improvement:**

```
Iteration 1: 67%
Iteration 2: 78% ✅ (target met!)
```

If still < 75%, repeat Task 2.6 with new survived mutants.

---

### Task 2.8: Review Final Test Quality

**Check that generated tests cover all 5 mutation-resistant patterns:**

- ✅ **Boundary tests** (Rule 1): Tests x=7, x=8, x=9 for `>= 8` condition
- ✅ **Boolean logic** (Rule 2): Tests all combinations of `uppercase && number`
- ✅ **Exact assertions** (Rule 3): Uses `.toBe(true)`, not `.toBeTruthy()`
- ✅ **Error messages** (Rule 4): Asserts exact error message strings
- ✅ **Return values** (Rule 5): Validates all fields in response

**✅ Checkpoint 2:**
- [ ] Generated tests with `/speckit.implement`
- [ ] Ran mutation testing (1st iteration)
- [ ] Identified survived mutants
- [ ] Refined prompt with mutation feedback
- [ ] Achieved 75%+ mutation score

---

## Exercise 3: Document Your Workflow (15 minutes)

### Task 3.1: Create Workflow Documentation

Create a file `docs/mutation-testing-workflow.md` in your project:

```markdown
# Mutation Testing Workflow with SpecKit

**Target:** 75% minimum mutation score for all new features

**Last Updated:** [date]

---

## 1. Prerequisites

- [ ] Section 7 (Quality Criteria) configured in CONSTITUTION.md
- [ ] Stryker mutation testing installed (see Bonus Lab 1)
- [ ] Feature spec (spec.md) created via `/speckit.specify`

---

## 2. Workflow Steps

### Step 1: Generate Tests from Spec

```bash
/speckit.implement specs/[feature-name].md
```

SpecKit reads:
- Your feature spec (acceptance criteria)
- CONSTITUTION.md Section 7 (Quality Criteria)

Generates:
- Test file with mutation-resistant patterns
- Boundary tests, exact assertions, error message validation

### Step 2: Run Mutation Testing (First Iteration)

```bash
npm run test:mutation
```

Check report:
```bash
open reports/mutation/index.html
```

Expected first-iteration score: **60-75%**

### Step 3: Identify Survived Mutants

Open HTML report → Look for RED-highlighted code.

Document survived mutants:
```
Line X: [original] → [mutant] (SURVIVED)
Reason: [why test didn't catch it]
Fix: [what test is needed]
```

### Step 4: Refine with Mutation Feedback

```bash
/speckit.implement specs/[feature-name].md

"Context: Mutation testing revealed survived mutants:
- [List mutants from Step 3]

Following Section 7 rules, add tests to kill these mutants."
```

### Step 5: Verify Target Met

```bash
npm run test:mutation
```

**Target:** ≥ 75%

If < 75%, repeat Step 3-4.

### Step 6: Commit Tests + Report

```bash
git add tests/ reports/mutation/
git commit -m "test: add mutation-tested tests for [feature] (score: 78%)"
git push
```

---

## 3. Section 7 Quick Reference

**Rule 1: Boundary Testing**
- For `x >= 8`: Test x=7, 8, 9

**Rule 2: Boolean Logic Coverage**
- For `a && b`: Test (TT, TF, FT, FF)

**Rule 3: Exact Assertions**
- Use `expect(x).toBe(true)` (not `expect(x).toBeTruthy()`)

**Rule 4: Error Message Validation**
- Assert exact message: `expect(error).toBe("Exact message")`

**Rule 5: Return Value Validation**
- Validate ALL fields in response

---

## 4. Common Mutation Patterns

### Pattern 1: Boundary Operators
```
Original: x >= 8
Mutants:  x > 8, x <= 8, x < 8, x == 8
Kill: Test x=7, 8, 9
```

### Pattern 2: Boolean Logic
```
Original: a && b
Mutants:  a || b
Kill: Test (T,F), (F,T) combinations
```

### Pattern 3: Return Values
```javascript
Original: return true
Mutants:  return false
Kill: expect(result).toBe(true)  // Exact assertion
```

### Pattern 4: String Literals
```javascript
Original: return "error message"
Mutants:  return ""
Kill: expect(result.error).toBe("error message")  // Exact string
```

---

## 5. Troubleshooting

**Issue: Score stuck at 40-60%**
- Check Section 7 is properly configured
- Verify SpecKit is reading constitution
- Add mutation feedback to prompt

**Issue: Tests too slow**
- Reduce mutation scope in config
- Run mutation testing on changed files only

**Issue: False positives (equivalent mutants)**
- Document why mutant can't be killed
- Accept if score already ≥ 75%

---

## 6. Team Standards

**When to run mutation testing:**
- [ ] Before committing new tests
- [ ] During code review (reviewer checks score)
- [ ] In CI/CD (quality gate: ≥ 75%)

**When NOT to run:**
- Integration tests (too slow)
- E2E tests (too slow)
- Tests for UI components (low ROI)

**Focus mutation testing on:**
- Business logic
- Validation logic
- Security-critical code
- Data transformations
```

---

### Task 3.2: Share Workflow with Team

**Create a PR or team announcement:**

```markdown
**Subject:** New Mutation Testing Workflow for SpecKit

Hi team,

I've documented our mutation testing workflow with SpecKit:
📄 See: docs/mutation-testing-workflow.md

**Key changes:**
- Section 7 (Quality Criteria) now includes mutation testing rules
- Target: 75% minimum mutation score
- Workflow: Spec → SpecKit → Mutation Testing → Refine

**Example results:**
- Feature: Password Validation
- Initial AI-generated tests: 67%
- After mutation refinement: 81% ✅

**Benefits:**
- Catches weak AI-generated tests
- Forces boundary testing
- Validates error messages
- Improves test quality automatically

**Try it:** Pick a feature spec, run `/speckit.implement`, then mutation testing.

Questions? Let's discuss in #engineering-practices
```

---

### Task 3.3: Add Mutation Testing to CI/CD (Optional)

**GitHub Actions example:**

```yaml
# .github/workflows/mutation-testing.yml
name: Mutation Testing

on:
  pull_request:
    paths:
      - 'src/**'
      - 'tests/**'

jobs:
  mutation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run mutation testing
        run: npm run test:mutation

      - name: Check mutation score
        run: |
          SCORE=$(grep -oP 'Mutation score: \K[0-9.]+' mutation-report.txt)
          if (( $(echo "$SCORE < 75" | bc -l) )); then
            echo "❌ Mutation score $SCORE% < 75%"
            exit 1
          fi
          echo "✅ Mutation score $SCORE% ≥ 75%"

      - name: Upload mutation report
        uses: actions/upload-artifact@v3
        with:
          name: mutation-report
          path: reports/mutation/
```

---

**✅ Checkpoint 3:**
- [ ] Created workflow documentation
- [ ] Shared with team
- [ ] (Optional) Added to CI/CD

---

## Exercise 4: Apply to Your Own Project Feature (30 minutes)

### Task 4.1: Choose a Feature from Your Project

Select a feature from **your own project** to apply this workflow.

**Recommended features:**
- User authentication/authorization
- Input validation (forms, API requests)
- Business logic (calculations, rules)
- Data transformation (parsing, formatting)

---

### Task 4.2: Write Feature Spec (if not already written)

Create a spec file with acceptance criteria:

```markdown
# Feature: [Feature Name]

## User Story
As a [user type]
I want to [action]
So that [benefit]

## Acceptance Criteria

### AC1: [Scenario name]
- GIVEN [precondition]
- WHEN [action]
- THEN [expected outcome]

### AC2: [Scenario name]
...

## Edge Cases
- [Edge case 1]
- [Edge case 2]

## Error Scenarios
- [Error scenario 1]
- [Error scenario 2]
```

---

### Task 4.3: Run Complete Workflow

Follow the 6-step workflow from Task 3.1:

```bash
# Step 1: Generate tests
/speckit.implement specs/[your-feature].md

# Step 2: Run mutation testing
npm run test:mutation

# Step 3: Check report
open reports/mutation/index.html

# Steps 4-5: Refine if needed
# Step 6: Commit
git add tests/ reports/
git commit -m "test: add mutation-tested tests for [feature] (score: [X]%)"
```

---

### Task 4.4: Track Your Progress

**Document your journey:**

```markdown
## Mutation Testing - [Feature Name]

**Date:** [date]
**Feature:** [name]
**Spec file:** specs/[file].md

### Iteration 1
- Mutation score: [%]
- Survived mutants: [count]
- Key issues: [brief description]

### Iteration 2
- Mutation score: [%]
- Survived mutants: [count]
- Changes made: [brief description]

### Final Results
- ✅ Mutation score: [%]
- ✅ Total iterations: [count]
- ✅ Test count: [count]
- ✅ Time spent: [hours]

### Learnings
- [What worked well]
- [What was challenging]
- [Would you recommend this for your team?]

### Section 7 Rules That Helped Most
1. [Rule name]: [impact]
2. [Rule name]: [impact]
```

---

**✅ Checkpoint 4:**
- [ ] Selected feature from your own project
- [ ] Used existing spec.md from Module 06
- [ ] Ran complete workflow
- [ ] Achieved 75%+ mutation score
- [ ] Documented results

---

## Reflection Questions

### Question 1: SpecKit + Constitution Integration
> How did Section 7 (Quality Criteria) change the tests SpecKit generated?
> Compare first iteration (with Section 7) vs what you'd get without it.

### Question 2: Mutation Feedback Loop
> How many iterations did it take to reach 75%?
> What pattern did you notice in the survived mutants?

### Question 3: ROI Analysis
> Was the time spent worth the quality improvement?
> For which types of features would you recommend this workflow?

### Question 4: Team Adoption
> What barriers would your team face adopting this workflow?
> How would you address them?

### Question 5: Constitution Evolution
> What mutation testing rules would you add to Section 7 based on your experience?

---

## Common Challenges & Solutions

### Challenge 1: "SpecKit isn't following Section 7 rules"

**Diagnosis:**
```bash
/speckit.constitution
# Check if Section 7 is detected
```

**Solutions:**
1. Ensure Section 7 is numbered correctly
2. Verify mutation testing rules are clearly documented
3. Add explicit prompt instruction: "Following Section 7 (Quality Criteria)..."

---

### Challenge 2: "Mutation score stuck at 60-70%"

**Diagnosis:**
Look at HTML report for patterns:
- Many boundary mutations? → Need more boundary tests
- Many boolean logic mutations? → Need truth table coverage
- Many string literal mutations? → Need exact assertions

**Solutions:**
1. Augment prompt with specific mutant types:
   ```
   "Add boundary tests for ALL conditions (Rule 1)"
   "Add truth table tests for ALL boolean logic (Rule 2)"
   ```

2. Manually add 2-3 example tests showing pattern
3. Re-run SpecKit with examples

---

### Challenge 3: "Too many equivalent mutants"

**Example:**
```javascript
// Original
for (let i = 0; i < items.length; i++) {
  process(items[i]);
}

// Mutant (equivalent - produces same result)
for (let i = 0; i <= items.length - 1; i++) {
  process(items[i]);
}
```

**Solution:**
1. Verify it's truly equivalent (test with multiple inputs)
2. Document in comments why it can't be killed
3. Accept if score already ≥ 75%

---

### Challenge 4: "Mutation testing is too slow"

**Solutions:**

1. **Reduce scope** (only mutate changed files):
   ```javascript
   // stryker.conf.mjs
   export default {
     mutate: [
       'src/features/password-validation/**/*.js'  // Not all of src/
     ],
     testRunner: 'jest',
     reporters: ['html', 'clear-text', 'progress']
   };
   ```

2. **Run incrementally**:
   ```bash
   # Only run on files changed in this PR
   npx stryker run --mutate src/validators/passwordValidator.js
   ```

3. **Use in CI for critical code only**:
   ```javascript
   // stryker.conf.mjs
   export default {
     mutate: [
       'src/validators/**/*.js',
       'src/business-logic/**/*.js'
     ],
     testRunner: 'jest'
   };
   ```

---

## Next Steps

### Continue Learning

**Apply to More Features:**
1. Choose 2-3 more features from your own project
2. Run complete workflow for each
3. Document patterns and learnings

**Optimize Section 7:**
1. Track which rules catch most mutants
2. Add language-specific patterns
3. Share findings with team

**Integrate with CI/CD:**
1. Add mutation testing to PR checks
2. Set 75% as quality gate
3. Generate mutation reports for code reviews

---

### Resources

**SpecKit Documentation:**
- `/speckit.help` - SpecKit command reference
- Module 06 materials - SpecKit framework guide

**Mutation Testing Tools:**
- Stryker.JS Documentation: https://stryker-mutator.io/docs/stryker-js/introduction/
- Stryker Configuration: https://stryker-mutator.io/docs/stryker-js/configuration/
- Stryker Mutators: https://stryker-mutator.io/docs/mutation-testing-elements/mutators/

**Research Papers:**
- MuTAP: Mutation-augmented prompts (see Bonus Lab 1 Appendix C)
- Meta ACH: Mutation-guided test generation at scale
- Wukong: LLM mutation testing study

---

## Troubleshooting

### Issue: `/speckit.implement` doesn't read Section 7

**Check:**
```bash
# Verify constitution path
/speckit.constitution

# Ensure file is in project root
ls -la CONSTITUTION.md
```

**Fix:**
1. Ensure `CONSTITUTION.md` is in project root (or `.claude/` directory)
2. Check Section 7 heading is exactly: `### Section 7: Quality Criteria`
3. Re-run `/speckit.constitution` to verify

---

### Issue: Generated tests still weak despite Section 7

**Check:**
1. Read generated tests - do they follow patterns?
2. Check if AI acknowledged Section 7 in response

**Fix:**
Add explicit instruction to prompt:
```
"IMPORTANT: Follow ALL rules in Section 7 (Quality Criteria):
- Rule 1: Boundary testing for all conditions
- Rule 2: Boolean logic truth table coverage
- Rule 3: Exact assertions (== not just truthy)
- Rule 4: Exact error message validation
- Rule 5: Validate all return fields
"
```

---

### Issue: Can't achieve 75% despite multiple iterations

**Check:**
1. Are there many equivalent mutants? (Document and accept)
2. Is code too complex? (Refactor before testing)
3. Is mutation tool configured correctly?

**Fix:**
1. Focus on highest-impact mutants first
2. Break complex functions into smaller, testable units
3. Document workflow challenges for team discussion

---

## Share Your Results

**Optional:** Share your workflow results with the course community:

**Template:**
```markdown
## Mutation Testing + SpecKit Results

**Feature:** [name]
**Project type:** [React app, Python API, etc.]

**Iteration 1:**
- Generated with: `/speckit.implement`
- Mutation score: [%]
- Time: [minutes]

**Final Results:**
- Mutation score: [%]
- Iterations: [count]
- Total time: [hours]

**Section 7 Rules - Impact Ranking:**
1. [Rule that helped most]: [why]
2. [Second most helpful]: [why]
3. [Third most helpful]: [why]

**Key Learnings:**
- [Learning 1]
- [Learning 2]

**Recommendation:**
[Would you use this workflow in production? Why/why not?]
```

---

**Document Version:** 1.0
**Last Updated:** 2025-11-30
**Module:** 07 - Testing Principles & Test Generation
**Status:** Optional Bonus Lab 2 - Self-Paced
**Prerequisites:** Bonus Lab 1 (Mutation Testing Hands-On)
