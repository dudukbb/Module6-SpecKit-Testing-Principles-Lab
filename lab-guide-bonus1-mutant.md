# Bonus Lab: Mutation Testing Hands-On

**Status:** Optional - Self-Paced Learning
**Prerequisites:** Completed Module 07 main lab
**Estimated Time:** 1-2 hours (work at your own pace)
**Tech Stack:** Node.js + Jest (adapt for your language)

---

## Purpose

Experience mutation testing firsthand by:
1. Starting with weak tests (low mutation score)
2. Improving tests systematically
3. Achieving 75%+ mutation score target
4. Understanding what makes tests strong vs weak

**This is NOT graded or timed** - it's a playground for deepening your understanding.

---

## Prerequisites

Before starting this lab:

- ✅ Completed Module 07 main lab (Testing Principles configuration)
- ✅ Have a working project with tests (Jest or similar)
- ✅ Node.js 16+ installed
- ✅ 1-2 hours of uninterrupted time

**If you need mutation testing setup instructions:**
- See `instructor/solutions/mutation-testing-setup-guide.md` for complete Stryker setup

---

## Learning Objectives

By the end of this lab, you will:
1. Install and configure Stryker mutation testing
2. Read and interpret mutation testing reports
3. Identify weak tests from mutation results
4. Write stronger tests that kill mutants
5. Achieve 75%+ mutation score
6. Understand the relationship between edge cases and mutation testing

---

## Setup (15 minutes)

### Step 1: Choose a Module to Test

Pick a small, self-contained module from your project:

**Good choices:**
- Utility functions (validators, formatters, calculators)
- Business logic (pricing, discounts, rules)
- Data transformers (parsers, serializers)

**Avoid for first attempt:**
- UI components (too complex)
- Database code (needs integration setup)
- Large modules (takes too long)

**Example:** A simple password validator
```javascript
// src/validators/passwordValidator.js
export function validatePassword(password) {
  if (password.length < 8) {
    return { valid: false, error: 'Too short' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Needs uppercase' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Needs number' };
  }
  return { valid: true };
}
```

### Step 2: Install Stryker

```bash
# Install Stryker CLI globally
npm install -g stryker-cli

# Initialize in your project
cd /path/to/your/project
npx stryker init

# Answer wizard questions:
# - Test runner: Jest
# - Test framework: Jest
# - Reporters: html, clear-text, progress
# - Package manager: npm
# - Install now: Yes
```

### Step 3: Configure Stryker

Edit `stryker.conf.mjs`:

```javascript
const config = {
  mutate: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ],
  testRunner: 'jest',
  reporters: ['html', 'clear-text', 'progress'],
  coverageAnalysis: 'perTest',
  htmlReporter: {
    outputFolder: 'reports/mutation'
  }
};
export default config;
```

### Step 4: Add NPM Script

Edit `package.json`:

```json
{
  "scripts": {
    "test:mutation": "stryker run"
  }
}
```

**✅ Setup complete!** You're ready to run mutation testing.

---

## Exercise 1: Establish Baseline (20 minutes)

**Goal:** Experience the "aha moment" of discovering weak tests through mutation testing.

**⚠️ IMPORTANT NOTE:**
In this exercise, you will **intentionally write weak tests**. This is NOT how you should write tests in production! The purpose is to:
- Show how "passing tests" ≠ "good tests"
- Demonstrate what mutation testing reveals about test quality
- Create a dramatic before/after comparison

Even with perfect specifications and AI assistance, tests can still be weak if they don't cover edge cases. Mutation testing catches this problem - whether tests are written by humans or AI.

---

### Task 1.1: Write Basic Tests (Intentionally Weak)

**Why we're doing this:**
These tests will PASS your regular test runner but have a LOW mutation score. This demonstrates the gap between "tests that pass" and "tests that catch bugs".

**This simulates a common problem:** Even when you give AI perfect requirements, it may generate tests that pass but don't catch bugs. Mutation testing reveals this weakness.

Write simple tests that pass but don't cover edge cases:

```javascript
// tests/validators/passwordValidator.test.js
import { validatePassword } from '../../src/validators/passwordValidator';

describe('Password Validator', () => {
  it('accepts valid password', () => {
    const result = validatePassword('MyPass123');
    expect(result.valid).toBe(true);
  });

  it('rejects invalid password', () => {
    const result = validatePassword('weak');
    expect(result.valid).toBe(false);
  });
});
```

**What's weak about these tests:**
1. ❌ Only test happy path ('MyPass123' is clearly valid)
2. ❌ Only test obvious failure ('weak' is clearly invalid)
3. ❌ Don't test boundaries (exactly 8 chars, exactly 7 chars)
4. ❌ Don't test individual validation rules
5. ❌ Don't verify error messages

**But they WILL pass!** That's the problem.

### Task 1.2: Run Regular Tests

```bash
npm test
```

**Expected:** Tests pass ✅

### Task 1.3: Run Mutation Testing

```bash
npm run test:mutation
```

**Watch the output:**
```
Mutation testing...
[████████████████████] 100% | Tested 15/15 mutants

Mutation score: 35%
  Killed: 5
  Survived: 10
  No coverage: 0
```

### Task 1.4: View HTML Report

```bash
# macOS
open reports/mutation/index.html

# Linux
xdg-open reports/mutation/index.html

# Windows
start reports/mutation/index.html
```

### Task 1.5: Identify Survived Mutants

In the HTML report, look for **red-highlighted code**. Each red line represents a mutant that SURVIVED.

**Example survived mutants:**
```javascript
// Original: password.length < 8
// Mutant: password.length <= 8  ← SURVIVED ❌
// Why it survived: Test used 'MyPass123' (length 9)
//   - Original code: 9 < 8 → false → valid
//   - Mutant code:   9 <= 8 → false → valid
//   - Same result! Test passed with mutant = SURVIVED
// FIX: Add test with exactly 8 characters

// Original: /[A-Z]/.test(password)
// Mutant: /[A-z]/.test(password)  ← SURVIVED ❌
// Why it survived: /[A-z]/ matches more than /[A-Z]/ (includes [ \ ] ^ _ `)
//   - Test 'MyPass123' has uppercase M
//   - Both regexes match → Same result → SURVIVED
// FIX: Test with password containing only lowercase

// Original: if (!result) { return { valid: false, error: 'Too short' }; }
// Mutant: if (result) { ... }  ← SURVIVED ❌
// Why it survived: Test didn't check error message content
//   - Test only checked result.valid === false
//   - Mutant returned wrong error but test didn't verify
// FIX: Assert error message content
```

**Understanding the Pattern:**

```
Survived Mutant = Test Case Didn't Distinguish Original from Mutant

Original Code → Test Input → Output A
Mutant Code   → Same Test Input → Output A (same!)
                                ↑
                                Test passed = Bad!
```

**What Stryker is telling you:**
> "Your test with input 'MyPass123' can't tell the difference between `<` and `<=`.
> Add a test with exactly 8 characters to catch this bug!"

**❓ Reflection Question 1:**
> Look at each survived mutant. Can you explain in your own words WHY the test couldn't catch it?
>
> Example answer format:
> "The mutant changed X to Y. My test used input Z. When I run Z through both versions,
> I get the same result because [reason]. To catch this, I need to test [edge case]."

---

## Exercise 2: Improve Tests - Target 75% (30 minutes)

**Goal:** Systematically add tests that kill survived mutants by targeting edge cases.

### Understanding Mutation Types (5 minutes - READ THIS FIRST)

Before writing tests, understand what Stryker mutates:

**Type 1: Arithmetic Operators**
```javascript
Original: a + b
Mutants:  a - b, a * b, a / b, a % b
Kill strategy: Test specific expected values (not just "truthy")
```

**Type 2: Relational Operators**
```javascript
Original: x < 10
Mutants:  x <= 10, x > 10, x >= 10, x == 10, x != 10
Kill strategy: Test boundary values (9, 10, 11)
```

**Type 3: Equality Operators**
```javascript
Original: x === y
Mutants:  x !== y, x == y, x != y
Kill strategy: Test both equal and not-equal cases
```

**Type 4: Logical Operators**
```javascript
Original: a && b
Mutants:  a || b
Kill strategy: Test all combinations (true/true, true/false, false/true, false/false)
```

**Type 5: Unary Operators**
```javascript
Original: !condition
Mutants:  condition (removes the !)
Kill strategy: Test both true and false cases
```

**Type 6: String Literals**
```javascript
Original: return "success"
Mutants:  return ""
Kill strategy: Assert exact string content
```

**Type 7: Boolean Literals**
```javascript
Original: return true
Mutants:  return false
Kill strategy: Assert exact boolean value (not just truthy/falsy)
```

**Type 8: Conditional Boundaries**
```javascript
Original: if (x)
Mutants:  if (true), if (false)
Kill strategy: Test both branches (condition true and false)
```

---

### Task 2.1: Add Edge Case Tests - Step by Step

**Strategy:** For each survived mutant, follow this 3-step process:

**Step 1: Identify the mutation**
- What did Stryker change? (`<` to `<=`?)

**Step 2: Understand why it survived**
- What input value would produce DIFFERENT results?

**Step 3: Write test with that input**
- Add test case with the boundary value

**Let's work through an example:**

```
Survived Mutant Report says:
  Line 15: password.length < 8 → password.length <= 8 (SURVIVED)

Step 1: Mutation is < to <=
Step 2: Input that produces different results:
  - length=9: Both return valid ✓ (same)
  - length=8: Original=valid, Mutant=invalid ✗ (DIFFERENT!)
  - length=7: Both return invalid ✓ (same)
Step 3: Write test with length=8
```

Now add edge case tests:

```javascript
describe('Password Validator - Edge Cases', () => {
  it('rejects password with exactly 7 characters', () => {
    const result = validatePassword('Pass12!');  // Exactly 7
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Too short');
  });

  it('accepts password with exactly 8 characters', () => {
    const result = validatePassword('Pass123!');  // Exactly 8
    expect(result.valid).toBe(true);
  });

  it('rejects password without uppercase letter', () => {
    const result = validatePassword('password123');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Needs uppercase');
  });

  it('rejects password without number', () => {
    const result = validatePassword('Password');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Needs number');
  });

  it('accepts password with multiple uppercase and numbers', () => {
    const result = validatePassword('MyP@ssw0rd123');
    expect(result.valid).toBe(true);
  });
});
```

### Task 2.2: Run Mutation Testing Again

```bash
npm run test:mutation
```

**Expected improvement:**
```
Mutation score: 67%  ← Up from 35%!
  Killed: 10
  Survived: 5
  No coverage: 0
```

### Task 2.3: View Report, Find Remaining Survivors

Open HTML report again. Look for **boundary conditions**:

**Common survivors at this stage:**
```javascript
// Original: if (condition1 && condition2)
// Mutant: if (condition1 || condition2)  ← SURVIVED

// Original: return { valid: true }
// Mutant: return { valid: false }  ← Check if test validates BOTH fields
```

### Task 2.4: Add More Targeted Tests

```javascript
describe('Password Validator - Combinations', () => {
  it('rejects when only missing uppercase', () => {
    const result = validatePassword('password123');
    expect(result.valid).toBe(false);
  });

  it('rejects when only missing number', () => {
    const result = validatePassword('Password');
    expect(result.valid).toBe(false);
  });

  it('rejects when only missing length', () => {
    const result = validatePassword('Pass1');
    expect(result.valid).toBe(false);
  });
});
```

### Task 2.5: Run Mutation Testing - Target 75%+

```bash
npm run test:mutation
```

**Target achieved:**
```
Mutation score: 78%  ← Target met! ✅
  Killed: 12
  Survived: 3
  No coverage: 0
```

**❓ Reflection Question 2:**
> What patterns do you notice in the mutants you killed? What makes a test strong?

---

## Exercise 3: Analyze Remaining Survivors (15 minutes)

### Task 3.1: Investigate Stubborn Survivors

Some mutants are **equivalent mutants** (can't be killed):

```javascript
// Original
if (x > 0) { return true; }
return false;

// Mutant (equivalent - produces same behavior)
if (x >= 1) { return true; }
return false;
```

### Task 3.2: Decide: Kill or Accept?

For each remaining survivor:

**Option 1: Add test if possible**
```javascript
// If mutant changes boundary
it('handles exact boundary value', () => { ... });
```

**Option 2: Accept if equivalent**
- Document why mutant can't be killed
- Ensure it's truly equivalent (not just hard to test)

### Task 3.3: Document Your Final Score

```bash
npm run test:mutation > mutation-results.txt
```

**✅ Success Criteria:**
- Mutation score ≥ 75%
- No "No Coverage" mutants
- Documented reason for any remaining survivors

---

## Challenge Exercises (Optional - 30 minutes)

### Challenge 1: Achieve 90%+ Score

Can you get to 90% mutation score?

**Hint:** Look for:
- Boundary conditions (>=, >, ===)
- Boolean logic (&&, ||)
- Return value variations

### Challenge 2: Test Complex Logic

Choose a more complex function with nested conditions:

```javascript
function calculateDiscount(price, quantity, membershipLevel) {
  let discount = 0;

  if (quantity >= 10) {
    discount = 0.1;
  }

  if (membershipLevel === 'gold' && price > 100) {
    discount += 0.15;
  } else if (membershipLevel === 'silver') {
    discount += 0.05;
  }

  return price * (1 - discount);
}
```

**Goal:** Achieve 80%+ mutation score

### Challenge 3: Mutation Testing in Your Constitution

Add mutation testing to your Testing Principles (Section 7 - Quality Criteria):

```markdown
### Section 7: Quality Criteria

**Quality Gates:**
- Mutation testing score: 75% minimum (enforced with Stryker)
- Run: `npm run test:mutation`
- Check before committing tests
- HTML report: `reports/mutation/index.html`

**Mutation Testing Workflow:**
1. Write tests
2. Run `npm run test:mutation`
3. If score < 75%, add edge case tests
4. Repeat until target met
```

**Task:** Commit this to your constitution and validate with `/speckit.constitution`

---

## Reflection Questions

After completing the lab, reflect on:

**Question 1: Test Quality**
> How does mutation testing change your definition of "good test coverage"?
> (Think: 100% line coverage vs 75% mutation score)

**Question 2: Edge Cases**
> What edge cases did mutation testing reveal that you wouldn't have thought of?

**Question 3: Time Investment**
> Is the time spent achieving 75%+ mutation score worth it? For which types of code?

**Question 4: Section 7 (Quality Criteria)**
> How would mutation testing have prevented issues in your past projects?

**Question 5: AI Test Generation**
> If you used AI to generate tests, how would mutation testing help validate AI output?

---

## Common Patterns You Discovered

**Important Note About Test Count:**

The patterns below show multiple test cases (e.g., "test 3 boundary values"). This does NOT mean you need to create 3 separate test functions! You can:

- ✅ **Put multiple assertions in one test** (shown in examples below)
- ✅ **Use table-driven/parameterized tests** (1 test, multiple data rows)
- ✅ **Create separate tests** (when it improves readability)

**The goal is THOROUGH COVERAGE, not high test count.** Mutation testing measures test effectiveness, not test quantity.

---

### Pattern 1: Boundary Conditions

**What you learned:**
Boundary conditions are where bugs hide. Test the exact threshold, not just nearby values.

```javascript
// Original: x >= 10

// ❌ Weak: Only test x=11 (clearly above)
it('validates threshold', () => {
  expect(isValid(11)).toBe(true);
});

// ✅ Strong: Test 3 boundary cases IN ONE TEST (not 3 separate tests!)
it('validates threshold including boundary', () => {
  expect(isValid(9)).toBe(false);   // Just below → should fail
  expect(isValid(10)).toBe(true);   // Exact boundary → should pass
  expect(isValid(11)).toBe(true);   // Just above → should pass
});

// ✅ Alternative: Table-driven (if your framework supports it)
it.each([
  [9, false],  // Below boundary
  [10, true],  // Exact boundary
  [11, true],  // Above boundary
])('validates threshold with value %i', (value, expected) => {
  expect(isValid(value)).toBe(expected);
});
```

**Why this matters:**
- Most bugs occur at boundaries (off-by-one errors)
- Mutation testing catches when you test x=11 but not x=10
- Real-world example: Age verification (17 vs 18 years old)

**Key point:** You need 3 TEST CASES (boundary-1, boundary, boundary+1), but they can be:
- 3 assertions in 1 test (shown above)
- 1 table-driven test with 3 rows (shown above)
- NOT 3 separate test functions (that inflates test count unnecessarily)

**Rule of thumb:** For any condition with <, <=, >, >=, test THREE cases:
1. Boundary - 1
2. Boundary exactly
3. Boundary + 1

---

### Pattern 2: Boolean Logic (AND/OR combinations)

**What you learned:**
When you have `a && b`, test ALL four combinations to catch `&&` → `||` mutations.

```javascript
// Original: if (hasUppercase && hasNumber) { return valid; }

// ❌ Weak: Only test happy path (1 test, 1 assertion)
it('validates password', () => {
  expect(validate('Pass123')).toBe(true);  // both=true
});

// ✅ Strong: Test all 4 combinations (1 test, 4 assertions)
it('validates password requires BOTH uppercase AND number', () => {
  expect(validate('Pass123')).toBe(true);   // hasUppercase=true, hasNumber=true  → valid
  expect(validate('password')).toBe(false); // hasUppercase=false, hasNumber=false → invalid
  expect(validate('PASSWORD')).toBe(false); // hasUppercase=true, hasNumber=false  → invalid
  expect(validate('pass123')).toBe(false);  // hasUppercase=false, hasNumber=true  → invalid
});

// ✅ Alternative: Separate tests for clarity (4 tests total - this is acceptable)
describe('Password validation - uppercase AND number', () => {
  it('accepts when both conditions met', () => { ... });
  it('rejects when both conditions missing', () => { ... });
  it('rejects when only uppercase present', () => { ... });
  it('rejects when only number present', () => { ... });
});
```

**Why this matters:**
- Stryker changes `&&` to `||`
- If you only test (true, true), both `&&` and `||` return true
- Truth table coverage catches this:

```
A     B     A && B    A || B
true  true  true      true   ← Same! (weak test)
true  false false     true   ← Different! (strong test)
false true  false     true   ← Different! (strong test)
false false false     false  ← Same! (weak test)
```

**Key point:** You need to TEST 4 combinations, but you can:
- Put all 4 assertions in 1 test (shown above)
- Create 4 separate tests for readability (also shown above)
- Use table-driven tests

**Rule of thumb:** For `a && b`, test at least 3 cases:
1. Both true
2. First true, second false
3. First false, second true

**Note:** The goal is COVERAGE OF COMBINATIONS, not minimizing test count. Both approaches (1 test with 4 assertions OR 4 separate tests) are valid.

---

### Pattern 3: Return Values - Specific Assertions

**What you learned:**
Assert EXACT values, not just "truthy" or "defined".

```javascript
// Original: return { valid: true }

// ❌ Weak: Tautological (always passes)
const result = validate('Pass123');
expect(result).toBeDefined();  // Will pass even if result = { valid: false }
expect(result.valid).toBeTruthy();  // Will pass if valid = 1, "yes", etc.

// ✅ Strong: Exact assertion
const result = validate('Pass123');
expect(result.valid).toBe(true);  // Only passes if exactly true
expect(result.error).toBeUndefined();  // Verify no error present
```

**Why this matters:**
- Mutation changes `true` → `false`
- `expect(result.valid).toBeTruthy()` passes for `1`, `"yes"`, `{}`, etc.
- `expect(result.valid).toBe(true)` ONLY passes for `true`

**Rule of thumb:**
- Use `.toBe()` for primitives (true, false, numbers, strings)
- Use `.toEqual()` for objects/arrays
- Avoid `.toBeDefined()`, `.toBeTruthy()`, `.toBeFalsy()` without value checks

---

### Pattern 4: Error Messages - Content Validation

**What you learned:**
Verify error message CONTENT, not just existence.

```javascript
// Original: return { error: 'Password too short' }

// ❌ Weak: Only checks error exists
const result = validate('weak');
expect(result.error).toBeDefined();  // Passes for ANY error message

// ✅ Strong: Checks exact error message
const result = validate('weak');
expect(result.error).toBe('Password too short');  // Must match exactly
```

**Why this matters:**
- User experience depends on correct error messages
- Mutation can return wrong error ("Needs uppercase" instead of "Too short")
- Weak test passes but user sees wrong message

**Real-world impact:**
```javascript
// Code bug (wrong error returned)
if (password.length < 8) {
  return { error: 'Needs uppercase' };  // ← Wrong error!
}

// Weak test (passes despite bug)
expect(result.error).toBeDefined();  // ✅ Passes (but wrong message shown to user!)

// Strong test (catches bug)
expect(result.error).toBe('Password too short');  // ❌ Fails! Bug caught!
```

**Rule of thumb:** For error handling:
1. Assert error message content
2. Assert error code/type if applicable
3. Test ALL error scenarios (not just one)

---

### Pattern 5: Nested Conditions - Order Matters

**What you learned:**
Test conditions in isolation AND combination.

```javascript
// Original
if (length < 8) {
  return { error: 'Too short' };
}
if (!hasUppercase) {
  return { error: 'Needs uppercase' };
}
return { valid: true };

// ❌ Weak: Only test one failure at a time
expect(validate('weak')).toHaveError('Too short');  // Fails first check
expect(validate('password12')).toHaveError('Needs uppercase');  // Fails second check

// ✅ Strong: Test priority order
expect(validate('weak')).toHaveError('Too short');  // Length fails FIRST
expect(validate('weakpas')).toHaveError('Too short');  // Still length (no uppercase either, but length checked first)
expect(validate('weakpass')).toHaveError('Needs uppercase');  // Length OK, uppercase fails

// ✅ Strong: Test multiple failures
expect(validate('weak1')).toHaveError('Too short');  // Length fails (has number, no uppercase)
```

**Why this matters:**
- Mutation can change condition order
- Error priority affects user experience
- Must test that FIRST failing condition is reported

**Rule of thumb:** For sequential checks:
1. Test each check in isolation
2. Test that order is preserved (first failure wins)
3. Test combinations (multiple failures)

---

## Common Mistakes & How to Fix Them

### Mistake 1: "My mutation score is stuck at 50%"

**Symptom:**
```bash
Mutation score: 52%
Killed: 15
Survived: 14  ← Still high!
```

**Root cause:** Testing happy paths only

**Diagnosis:**
```javascript
// You probably have tests like:
it('works with valid input', () => { ... });
it('rejects invalid input', () => { ... });
```

**Fix:** Add edge cases systematically
```javascript
// Add these:
it('handles exact boundary value', () => { ... });
it('handles just below boundary', () => { ... });
it('handles just above boundary', () => { ... });
it('validates each rule independently', () => { ... });
it('checks error message content', () => { ... });
```

---

### Mistake 2: "I added tests but score didn't improve"

**Symptom:**
```bash
Before: 45%
After:  47%  ← Only 2% improvement!
```

**Root cause:** New tests are also weak (similar to existing tests)

**Diagnosis:**
You added tests but used same input ranges:
```javascript
// Original test
it('accepts valid password', () => {
  expect(validate('MyPass123')).toBe(true);
});

// New test (but still weak!)
it('accepts another valid password', () => {
  expect(validate('AnotherPass456')).toBe(true);  // Same pattern!
});
```

**Fix:** Target specific survived mutants
```javascript
// Look at HTML report → find RED lines → write test for THAT specific mutation
// Example: Report shows "password.length < 8 → <= 8 (SURVIVED)"
it('accepts password with exactly 8 characters', () => {
  expect(validate('Pass123!')).toBe(true);  // Exactly 8 chars
});
```

---

### Mistake 3: "Mutation testing takes forever"

**Symptom:**
```bash
Mutation testing... (30 minutes and still running)
```

**Root cause:** Testing too much code at once

**Fix:** Reduce scope in `stryker.conf.mjs`
```javascript
// Before (tests everything)
mutate: ['src/**/*.js']

// After (tests one module)
mutate: ['src/validators/passwordValidator.js']
```

**Also reduce concurrency:**
```javascript
concurrency: 2  // Reduce from 4
```

---

### Mistake 4: "All my tests pass but score is 0%"

**Symptom:**
```bash
Mutation score: 0%
All mutants: No coverage
```

**Root cause:** Stryker can't find your source code

**Fix:** Check `mutate` paths match your project structure
```javascript
// Your code is in 'lib/', not 'src/'
mutate: [
  'lib/**/*.js',  // ← Change from 'src/'
  '!lib/**/*.test.js'
]
```

Run a single test first:
```bash
npx stryker run --mutate src/validators/passwordValidator.js
```

---

### Mistake 5: "I got 100% but it feels wrong"

**Symptom:**
```bash
Mutation score: 100%
Killed: 50
Survived: 0
```

**Diagnosis:** Check if code is trivial or tests are tautological

**Example of false 100%:**
```javascript
// Trivial code (no mutations possible)
function getTrue() {
  return true;
}

// Or tautological test
it('returns something', () => {
  const result = calculate(5, 10);
  expect(result).toBe(result);  // Always passes!
});
```

**Fix:**
1. Check HTML report - verify mutants were actually created
2. Review tests for tautologies
3. Make sure you're testing meaningful logic

---

## Learning Checkpoints

After each exercise, verify your understanding:

### Checkpoint 1 (After Exercise 1)
- [ ] I can explain what a "survived mutant" means
- [ ] I can read the HTML report and find survived mutants
- [ ] I understand why my initial tests were weak
- [ ] I can identify at least 3 edge cases from the report

### Checkpoint 2 (After Exercise 2)
- [ ] I can systematically add tests to kill specific mutants
- [ ] I understand the 8 mutation types Stryker creates
- [ ] I improved my mutation score by at least 20%
- [ ] I can explain the relationship between edge cases and boundary testing

### Checkpoint 3 (After Exercise 3)
- [ ] I achieved 75%+ mutation score
- [ ] I can identify equivalent mutants
- [ ] I understand when to stop adding tests
- [ ] I can articulate testing strategy for future code

---

## What You've Learned

**✅ Key Takeaways:**

1. **Mutation testing reveals weak tests**
   - 100% line coverage ≠ strong tests
   - Edge cases matter

2. **Boundary conditions are critical**
   - Test exact thresholds (x=8, not just x=9)
   - Test both sides of boundaries

3. **Specific assertions are stronger**
   - `expect(result).toBe(true)` > `expect(result).toBeTruthy()`
   - Check error messages, not just error existence

4. **75%+ is a quality bar**
   - Below 50%: Very weak tests
   - 50-74%: Weak tests
   - 75%+: Good quality
   - 90%+: Excellent (diminishing returns)

5. **AI needs validation**
   - Mutation testing validates AI-generated tests
   - Section 7 (Quality Criteria) prevents weak AI output

---

## Next Steps

### Continue Learning

**Practice on real code:**
1. Choose a module from your project
2. Run mutation testing
3. Improve to 75%+
4. Document learnings

**Integrate into workflow:**
1. Add mutation testing to CI/CD
2. Set 75% as quality gate
3. Review mutation reports in code reviews

**Share with team:**
1. Demo mutation testing to teammates
2. Establish team standards (target score)
3. Add to team's Testing Principles

### Resources

**Stryker Documentation:**
- https://stryker-mutator.io/docs/

**Mutation Testing Theory:**
- "Mutation Testing: A Comprehensive Survey" (IEEE)
- Martin Fowler on Mutation Testing

**Tool Alternatives:**
- **Python:** mutmut, Cosmic Ray
- **Java:** Pitest
- **Go:** go-mutesting, gremlins
- **C#:** Stryker.NET

---

## Troubleshooting

### Issue: Mutation testing takes too long

**Solution:** Reduce scope
```javascript
// In stryker.conf.mjs
mutate: [
  'src/validators/**/*.js',  // Just one module
]
```

### Issue: Out of memory

**Solution:** Reduce concurrency
```javascript
concurrency: 2  // Reduce from 4 to 2
```

### Issue: Tests timing out

**Solution:** Increase timeout
```javascript
timeoutMS: 120000  // Increase from 60000
```

### Issue: Can't understand HTML report

**Solution:** Focus on these columns:
- **Red highlight:** Survived mutants (fix these)
- **Green highlight:** Killed mutants (good)
- **Status:** Killed/Survived/No coverage

---

## Share Your Results

**Optional:** Share your mutation testing journey on internal channels:

**Template:**
```
Mutation Testing Lab Results 🧬

Module tested: [module name]
Initial score: [%]
Final score: [%]
Time spent: [hours]

Key learnings:
- [What surprised you]
- [Edge cases discovered]
- [Pattern you learned]

Recommendation: [Worth it? For what code?]
```

---

## Appendix A: Deep Dive - How Mutation Testing Works

**For detailed setup instructions, see:** `instructor/solutions/mutation-testing-setup-guide.md`

### A.1: The Mutation Testing Process

Mutation testing works by introducing **deliberate bugs** (mutants) into your code, then checking if your tests catch them.

**Step-by-Step Process:**

```
1. Parse Source Code
   ├─ Stryker reads: src/calculator.js
   ├─ Builds Abstract Syntax Tree (AST)
   └─ Identifies mutation points: operators, conditions, literals

2. Generate Mutants (In Memory Only)
   ├─ Original: return a + b;
   ├─ Mutant 1: return a - b;  (ArithmeticOperator)
   ├─ Mutant 2: return a * b;  (ArithmeticOperator)
   └─ Mutant 3: return a / b;  (ArithmeticOperator)

3. Run Tests Against Each Mutant
   For mutant in mutants:
     ├─ Inject mutant into runtime (temporary, in-memory)
     ├─ Run test suite
     ├─ Record result: Killed (test failed) or Survived (test passed)
     └─ Discard mutant, move to next

4. Generate Report
   └─ HTML report at reports/mutation/index.html
```

**CRITICAL: Your source files are NEVER modified on disk!**

All mutations happen in memory. Think of it like:
```javascript
const originalCode = readFile('src/calculator.js');

for (let mutant of generateMutants(originalCode)) {
  // Mutant exists ONLY in this loop iteration
  const result = runTests(mutant);
  recordResult(result);
  // Mutant is discarded here - original code unchanged
}
```

---

### A.2: Types of Mutations Stryker Creates

**1. Arithmetic Operators**
```javascript
Original: x + y
Mutants:  x - y, x * y, x / y, x % y
```

**2. Relational Operators**
```javascript
Original: x < 10
Mutants:  x <= 10, x > 10, x >= 10, x == 10, x != 10
```

**3. Equality Operators**
```javascript
Original: x === y
Mutants:  x !== y, x == y, x != y
```

**4. Logical Operators**
```javascript
Original: a && b
Mutants:  a || b
```

**5. Unary Operators**
```javascript
Original: !condition
Mutants:  condition  (removes !)
```

**6. Conditional Expressions**
```javascript
Original: condition ? a : b
Mutants:  true ? a : b, false ? a : b
```

**7. String/Number Literals**
```javascript
Original: return "success"
Mutants:  return ""

Original: return 42
Mutants:  return 0, return 1
```

**8. Boolean Literals**
```javascript
Original: return true
Mutants:  return false
```

**9. Block Statements**
```javascript
Original: { statement1; statement2; }
Mutants:  { } (removes statements)
```

**10. Array Declarations**
```javascript
Original: const arr = [1, 2, 3]
Mutants:  const arr = []
```

---

### A.3: Understanding Mutation Score

**Formula:**
```
Mutation Score = (Killed Mutants / Total Mutants) × 100%
```

**Example Calculation:**
```
Total mutants: 20
Killed: 15
Survived: 5
No coverage: 0

Mutation Score = (15 / 20) × 100% = 75%
```

**Interpreting Scores:**

| Score | Quality | Meaning | Action |
|-------|---------|---------|--------|
| **90%+** | Excellent | Very strong tests | Diminishing returns - focus elsewhere |
| **75-89%** | Good | Strong tests with good edge case coverage | Investigate remaining survivors |
| **60-74%** | Adequate | Tests catch most bugs but miss edge cases | Add boundary tests |
| **40-59%** | Weak | Tests miss many bugs | Systematic improvement needed |
| **< 40%** | Very Weak | Tests provide false confidence | Rebuild test suite |

**Why 75% is the target:**
- Industry standard for production code
- Balances thoroughness with effort
- Catches most real-world bugs
- Above this, diminishing returns (equivalent mutants increase)

---

### A.4: Equivalent Mutants Explained

Some mutants are **impossible to kill** because they produce identical behavior:

**Example 1: Loop Boundaries**
```javascript
// Original
for (let i = 0; i < arr.length; i++) {
  sum += arr[i];
}

// Mutant (equivalent - produces same result)
for (let i = 0; i <= arr.length - 1; i++) {
  sum += arr[i];
}
```
Both loop exactly `arr.length` times - equivalent behavior.

**Example 2: Mathematical Equivalence**
```javascript
// Original
return x * 2;

// Mutant (equivalent)
return x + x;
```
Mathematically identical.

**Example 3: Boolean Simplification**
```javascript
// Original
return x > 0;

// Mutant (equivalent for integers)
return x >= 1;
```
For integer values, these are equivalent.

**How to handle:**
1. Verify it's truly equivalent (test with multiple inputs)
2. Document why it can't be killed
3. Accept if mutation score is already 75%+
4. Don't waste time trying to kill truly equivalent mutants

---

## Appendix B: Mutation Testing for AI-Generated Code

### B.1: The AI Test Generation Problem

**What happens when you ask AI to "write tests":**

```javascript
// Code
function divide(a, b) {
  return a / b;
}

// AI-generated test (weak!)
it('should divide numbers', () => {
  const result = divide(10, 2);
  expect(result).toBe(5);  // Tautological - AI calculated 10/2=5 itself!
});
```

**The Problem:**
- AI generates BOTH code and expected values
- If AI makes same mistake in both, test passes but bug exists
- Called **"Oracle Hallucination"** or **"Expected Result Hallucination"**

**Real example from research (Wukong, 2025):**
```java
// Code (buggy)
public int factorial(int n) {
  if (n <= 1) return 1;
  return n * factorial(n - 2);  // BUG: should be n-1
}

// AI-generated test (weak - didn't catch bug!)
@Test
public void testFactorial() {
  assertEquals(6, factorial(3));  // AI calculated wrong factorial!
}
// Both code and test have same bug → test passes → bug shipped!
```

---

### B.2: How Mutation Testing Validates AI Tests

**Mutation testing reveals weak AI-generated tests by:**

**1. Detecting Tautological Tests**
```javascript
// AI-generated (weak)
it('validates password', () => {
  const result = validatePassword('MyPass123');
  expect(result).toBeDefined();  // Always true!
});

// Mutation testing result: 0% score
// Mutant: return undefined → SURVIVED (test doesn't check value)
```

**2. Detecting Oracle Hallucination**
```javascript
// AI-generated (weak - hallucinated oracle)
it('calculates total', () => {
  const result = calculateDiscount(100, 0.2);
  expect(result).toBe(80);  // AI made same calculation error as code!
});

// Mutation testing result: Low score
// Mutant: return price * (1 + discount) → SURVIVED
```

**3. Detecting Missing Edge Cases**
```javascript
// AI-generated (incomplete)
it('validates email', () => {
  expect(isValidEmail('user@example.com')).toBe(true);
});

// Mutation testing reveals:
// Mutant: @ → # → SURVIVED (no test for @ requirement)
// Mutant: .com → .co → SURVIVED (no test for TLD requirement)
```

**4. Forcing Specific Assertions**
```javascript
// AI-generated (vague)
it('returns user', () => {
  const user = getUser(123);
  expect(user).toBeTruthy();  // Too vague!
});

// Mutation testing forces improvement:
// Mutant: return { id: 999 } → SURVIVED
// Fix: expect(user.id).toBe(123);  // Specific assertion
```

---

### B.3: Research Findings (2024-2025)

**Study 1: Meta's ACH (Automated Compliance Hardening)**
- **Source:** Meta Engineering Blog (2024)
- **Scale:** Facebook, Instagram, WhatsApp, wearables (Oct-Dec 2024)
- **Results:** 73% acceptance rate for AI-generated tests validated by mutation testing
- **Key Finding:** Mutation-guided test generation produced 571 additional unit tests from 4,660 candidate mutants

**Study 2: MuTAP (Mutation Test Augmented Prompt)**
- **Source:** Information and Software Technology (2024)
- **Method:** Augment AI prompts with surviving mutants to improve test quality
- **Results:** 93.57% average mutation score (vs. 70-80% for standard AI tests)
- **Key Innovation:** Feed surviving mutants back to LLM to generate better tests

**Study 3: Wukong (Large-Scale LLM Mutation Study)**
- **Source:** University of Michigan (2025)
- **Scale:** 6 LLMs, 851 real bugs, two Java benchmarks
- **Results:** LLM-generated mutants detected 19% more faults than traditional tools (93% vs. 74%)
- **Key Finding:** LLMs create mutations that resemble real-world bugs better than rule-based tools

**Study 4: LLMorpheus (LLM-Based Mutation Testing)**
- **Source:** arXiv:2404.09952 (2024)
- **Innovation:** Uses LLMs to generate mutants (not just tests)
- **Results:** Produces mutants that resemble real bugs that Stryker cannot create
- **Application:** JavaScript mutation testing with 40%+ improvement in bug-like mutants

---

### B.4: The Mutation Testing + AI Feedback Loop

**Best Practice Workflow:**

```
1. Write Specification (Human)
   └─ "Password must be 8+ characters with uppercase and number"

2. Generate Tests with AI (AI)
   └─ Prompt: "Generate tests from this specification"

3. Run Mutation Testing (Tool)
   └─ Stryker identifies weak tests (survived mutants)

4. Augment Prompt with Mutants (Human + AI)
   └─ "These mutants survived: [list]. Generate tests to kill them."

5. AI Generates Targeted Tests (AI)
   └─ Tests specifically targeting boundary conditions

6. Repeat Until 75%+ (Iterative)
   └─ Loop until mutation score target met
```

**Example Iteration:**

```javascript
// Iteration 1: Initial AI-generated test
it('validates password', () => {
  expect(validatePassword('MyPass123')).toBe(true);
});
// Mutation score: 35%

// Iteration 2: After mutation feedback
Prompt: "Mutant 'length < 8 → length <= 8' survived. Add test."
AI generates:
it('rejects password with exactly 7 characters', () => {
  expect(validatePassword('Pass12!')).toBe(false);
});
// Mutation score: 58%

// Iteration 3: After more mutation feedback
Prompt: "Mutant '/[A-Z]/ → /[A-z]/' survived. Add test."
AI generates:
it('rejects password without uppercase letter', () => {
  expect(validatePassword('password123')).toBe(false);
});
// Mutation score: 76% ✅
```

---

### B.5: Section 7 (Quality Criteria) + Mutation Testing

**How Section 7 prevents AI test issues:**

**Your Constitution Section 7:**
```markdown
### Section 7: Quality Criteria

**Anti-patterns to prevent:**
- ❌ Tautological tests (expect(x).toBe(x))
- ❌ Testing implementation details
- ❌ Weak assertions (toBeTruthy instead of toBe)

**Quality gates:**
- Mutation testing score: 75% minimum (enforced with Stryker)
- All expected values (oracles) validated by human
- No always-true assertions
```

**When AI reads this:**
```
AI Prompt: "Generate tests following Section 7 Quality Criteria"

AI generates:
✅ expect(result.valid).toBe(true)  // Specific (Section 7)
❌ expect(result).toBeDefined()     // Blocked by Section 7

✅ expect(result.error).toBe('Too short')  // Validates oracle (Section 7)
❌ expect(result.error).toBeTruthy()       // Blocked by Section 7
```

**Then mutation testing validates AI followed Section 7:**
```bash
npm run test:mutation
# Mutation score: 78%  ← Confirms Section 7 worked!
```

---

### B.6: Practical Strategies

**Strategy 1: Mutation-First Test Generation**
```
1. Run Stryker on code with NO tests
2. See all mutants generated
3. Use mutant list as test case specification
4. Prompt AI: "Generate tests that kill these mutants: [list]"
```

**Strategy 2: Iterative Refinement**
```
1. AI generates initial tests
2. Run mutation testing → 45% score
3. Identify survived mutants
4. Prompt: "Add tests for: [survived mutant types]"
5. Repeat until 75%+
```

**Strategy 3: Mutation-Augmented Prompts (MuTAP approach)**
```javascript
// Initial prompt
"Generate tests for this password validator"

// After first mutation run (35% score)
"These mutants survived:
- length < 8 → <= 8
- /[A-Z]/ → /[A-z]/
- return true → return false

Generate additional tests to kill these mutants."

// Result: 78% score ✅
```

**Strategy 4: Human-in-the-Loop Validation**
```
1. AI generates tests
2. Human reviews expected values (oracles)
3. Run mutation testing
4. If score < 75%, human identifies pattern
5. Prompt AI with pattern: "Add boundary tests for all conditions"
```

---

### B.7: Case Study - Real Example

**Scenario:** AI-generated tests for authentication service

**Initial AI Output (Zero-Shot):**
```javascript
describe('Authentication', () => {
  it('authenticates user', () => {
    const result = authenticate('user', 'pass');
    expect(result).toBeDefined();
  });
});

// Mutation score: 12% ❌
```

**After Section 7 Constitution:**
```javascript
describe('Authentication', () => {
  it('returns token with valid credentials', () => {
    const result = authenticate('user', 'pass');
    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
  });

  it('rejects invalid credentials', () => {
    const result = authenticate('user', 'wrong');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid credentials');
  });
});

// Mutation score: 54% (Better but not there yet)
```

**After Mutation-Guided Refinement:**
```javascript
describe('Authentication', () => {
  // ... previous tests ...

  it('validates token expiry exactly at threshold', () => {
    const token = generateToken({ expiresIn: 3600 });
    expect(isTokenValid(token, Date.now() + 3600000)).toBe(true);  // Exactly at expiry
    expect(isTokenValid(token, Date.now() + 3600001)).toBe(false); // 1ms after
  });

  it('handles empty password', () => {
    const result = authenticate('user', '');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Password required');
  });

  it('handles SQL injection attempt', () => {
    const result = authenticate("'; DROP TABLE users--", 'pass');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid credentials');
  });
});

// Mutation score: 81% ✅
```

**Key improvements from mutation feedback:**
1. Boundary test for exact expiry time (killed `>` → `>=` mutant)
2. Empty string test (killed empty string literal mutant)
3. SQL injection test (killed string substitution mutant)

---

## Appendix C: Additional Readings & Resources

### Academic Research Papers (2024-2025)

**1. Mutation-Guided LLM-based Test Generation**
- **Authors:** Meta Research Team
- **Year:** 2024
- **URL:** https://engineering.fb.com/2025/09/30/security/llms-are-the-key-to-mutation-testing-and-better-compliance/
- **Key Contribution:** ACH (Automated Compliance Hardening) system deployed at Meta scale
- **Practical Value:** Real-world mutation-guided AI test generation with 73% acceptance rate

**2. MuTAP: Mutation Test case generation using Augmented Prompt**
- **Authors:** Arghyadeep Sen et al.
- **Year:** 2024
- **DOI:** 10.1016/j.infsof.2024.107468
- **URL:** https://www.sciencedirect.com/science/article/abs/pii/S0950584924000739
- **Key Contribution:** Augmenting prompts with surviving mutants
- **Results:** 93.57% average mutation score
- **Practical Value:** Template for iterative AI test improvement

**3. LLMorpheus: Mutation Testing using Large Language Models**
- **Authors:** Frank Tip et al.
- **Year:** 2024
- **arXiv:** 2404.09952
- **URL:** https://arxiv.org/abs/2404.09952
- **Key Contribution:** Using LLMs to generate mutants (not just tests)
- **Results:** Produces bug-like mutants that Stryker cannot create
- **Practical Value:** Next-gen mutation testing approach

**4. Wukong: On the Use of Large Language Models in Mutation Testing**
- **Authors:** University of Michigan team
- **Year:** 2025
- **URL:** https://web.eecs.umich.edu/~movaghar/Mutation%20Testing%20LLM%202025.pdf
- **Scale:** 6 LLMs, 851 real bugs
- **Results:** 19% higher fault detection (93% vs. 74%)
- **Practical Value:** Evidence that LLM mutants resemble real bugs

**5. Mutation-based Consistency Testing for Evaluating Code Understanding of LLMs**
- **Authors:** IEEE/ACM Conference
- **Year:** 2024
- **DOI:** 10.1145/3644815.3644946
- **URL:** https://dl.acm.org/doi/10.1145/3644815.3644946
- **Key Contribution:** Using mutation testing to evaluate how well LLMs understand code
- **Practical Value:** Framework for assessing AI code comprehension

---

### Industry Resources

**6. Stryker Mutator Official Documentation**
- **URL:** https://stryker-mutator.io/docs/
- **Coverage:** JavaScript, TypeScript, C#, Scala
- **Practical Value:** Complete setup guide and best practices

**7. Microsoft Learn: Mutation Testing for .NET**
- **URL:** https://learn.microsoft.com/en-us/dotnet/core/testing/mutation-testing
- **Focus:** Stryker.NET
- **Practical Value:** Enterprise-grade .NET mutation testing

**8. GitHub: LLM4SoftwareTesting Repository**
- **URL:** https://github.com/LLM-Testing/LLM4SoftwareTesting
- **Content:** Curated list of LLM testing research
- **Practical Value:** Stay current with latest research

---

### Online Courses & Tutorials

**9. Mutation Testing with Stryker (Sparkbox)**
- **URL:** https://sparkbox.com/foundry/mutation_testing_with_stryker
- **Level:** Beginner
- **Practical Value:** Hands-on tutorial

**10. AI-Powered Test-Driven Development Guide 2025**
- **URL:** https://www.nopaccelerate.com/test-driven-development-guide-2025/
- **Focus:** AI + TDD best practices
- **Practical Value:** Modern TDD with AI assistance

---

### Tools & Frameworks

**11. Stryker-JS GitHub Repository**
- **URL:** https://github.com/stryker-mutator/stryker-js
- **Language:** JavaScript/TypeScript
- **Stars:** 4.5k+
- **Practical Value:** Active community, frequent updates

**12. Pitest (Java Mutation Testing)**
- **URL:** https://pitest.org/
- **Language:** Java
- **Practical Value:** Industry standard for Java

**13. mutmut (Python Mutation Testing)**
- **URL:** https://mutmut.readthedocs.io/
- **Language:** Python
- **Practical Value:** Simple, fast Python mutation testing

**14. Stryker.NET**
- **URL:** https://stryker-mutator.io/docs/stryker-net/introduction/
- **Language:** C# / .NET
- **Practical Value:** Enterprise .NET support

---

### Blogs & Case Studies

**15. The Mutating Company**
- **URL:** https://mutating.tech/
- **Focus:** Mutation testing for AI-written tests
- **Practical Value:** Real-world experiences and tips

**16. Making AI-Powered Mutation Testing Reliable and Fair**
- **URL:** https://hackernoon.com/making-ai-powered-mutation-testing-reliable-and-fair
- **Year:** 2024
- **Practical Value:** Bias and fairness in AI-generated mutants

---

### Conference Proceedings

**17. Mutation 2025 Workshop (ICST 2025)**
- **URL:** https://conf.researchr.org/home/icst-2025/mutation-2025
- **Date:** April 2025
- **Practical Value:** Latest mutation testing research

---

### Recommended Reading Order

**For Beginners:**
1. Start with Stryker Official Docs (#6)
2. Read Sparkbox Tutorial (#9)
3. Try this lab guide
4. Review Meta's ACH case study (#1)

**For Intermediate:**
1. Read MuTAP paper (#2) - mutation-augmented prompts
2. Study Wukong results (#4) - LLM mutation effectiveness
3. Implement mutation-guided AI test generation
4. Review GitHub LLM4SoftwareTesting (#8)

**For Advanced:**
1. Read LLMorpheus (#3) - LLM-generated mutants
2. Study mutation-based consistency testing (#5)
3. Implement custom mutation operators
4. Contribute to research/tools

---

### Key Takeaways from Research

**Finding 1: Mutation Score > Code Coverage**
- Code coverage can be 100% with weak tests
- Mutation score reveals test effectiveness
- Target: 75%+ mutation score for production code

**Finding 2: AI Tests Need Validation**
- AI-generated tests suffer from oracle hallucination
- Mutation testing catches weak AI tests
- Mutation-guided prompts improve AI test quality by 20-30%

**Finding 3: Iterative Refinement Works**
- First iteration: 30-50% mutation score
- After mutation feedback: 70-90% mutation score
- Feedback loop is essential for quality

**Finding 4: LLMs Generate Better Mutants**
- LLM mutants resemble real bugs (19% better fault detection)
- Traditional tools create rule-based mutants
- Future: LLM-generated mutants + LLM-generated tests

**Finding 5: Section 7 (Quality Criteria) is Critical**
- Explicit anti-patterns in constitution → better AI output
- Mutation testing validates constitution effectiveness
- Combined approach: Constitution + Mutation = High quality

---

**Document Version:** 1.1
**Last Updated:** 2025-11-30
**Module:** 07 - Testing Principles & Test Generation
**Status:** Optional Bonus Lab - Self-Paced
