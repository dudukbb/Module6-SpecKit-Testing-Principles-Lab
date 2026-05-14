# Module6 — SpecKit Testing Principles & Test Generation Lab

![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict-blue)
![Jest](https://img.shields.io/badge/Tested%20with-Jest-C21325)
![Stryker Mutation Testing](https://img.shields.io/badge/Mutation-Stryker-orange)
![Coverage 94.62%](https://img.shields.io/badge/Coverage-94.62%25-brightgreen)

## Overview

This repository contains the complete work for **Module6: Testing Principles & Test Generation Lab** from the EPAM AI Tech Bootcamp.

The project extends the previous SpecKit-based workflow by focusing on:

- Testing-first engineering practices
- Test-Driven Development (TDD)
- Mutation-aware testing
- Validation-driven development
- Coverage enforcement
- SpecKit-assisted test generation
- Quality gates and CI-oriented validation

Unlike a traditional implementation-only assignment, this module emphasizes how specifications, constitutions, testing rules, and validation artifacts can drive reliable software engineering workflows.

The project is based on a **Personal Task Board** application previously created in Module5 and enhanced here with a comprehensive testing infrastructure.

---

# Module Information

| Item | Details |
|---|---|
| Bootcamp | EPAM AI Tech Bootcamp |
| Module | Module6 |
| Topic | Testing Principles & Test Generation |
| Workflow | SpecKit + GitHub Copilot |
| Development Style | Spec-Driven Development |
| Focus Area | Testing Architecture & Validation |
| Repository Type | Educational / Laboratory Project |

---

# Main Objectives

The primary goal of this module was to practice professional testing workflows using SpecKit and AI-assisted engineering tools.

The lab focused on:

- Creating constitution-level testing principles
- Applying TDD and RED-GREEN-REFACTOR workflows
- Generating and validating tests
- Improving test quality with mutation testing
- Enforcing coverage and quality gates
- Building repeatable validation workflows
- Practicing AI-assisted test generation using GitHub Copilot

---

# Project Context

This project continues the Personal Task Board application developed in previous modules.

The original application includes:

- Task management features
- Task creation and deletion
- Status-based organization
- Authentication workflows
- Backend API routes
- Validation middleware
- Business logic services

For Module6, the focus shifted from feature implementation to:

- Test quality
- Coverage quality
- Mutation resistance
- Specification-driven validation
- Testing infrastructure

---

# SpecKit Workflow

The project follows the SpecKit engineering lifecycle:

```text
constitution → specify → clarify → checklist → plan → tasks → implement → validate
```

The testing-focused extension of the workflow includes:

```text
Testing Principles → Test Generation → Coverage Validation → Mutation Testing → Hardening
```

---

# SpecKit Artifacts

## Constitution

The constitution defines mandatory engineering and testing principles.

### Generated Artifact

```text
.specify/memory/constitution.md
```

### Main Areas Covered

- TypeScript strictness
- Testing philosophy
- Testing pyramid
- Coverage thresholds
- Mutation testing principles
- TDD workflow
- Mocking rules
- Validation requirements
- CI/CD quality gates
- Anti-pattern prevention

---

## Feature Specification

### Artifact

```text
specs/001-personal-task-board/spec.md
```

Defines:

- User stories
- Functional requirements
- Acceptance criteria
- Scope boundaries
- Expected behaviors

---

## Technical Planning

### Artifacts

```text
specs/001-personal-task-board/plan.md
specs/001-personal-task-board/research.md
specs/001-personal-task-board/tasks.md
```

These files include:

- Architecture planning
- Backend strategy
- Validation rules
- Testing considerations
- Implementation tasks
- Research decisions

---

# Testing Principles Implemented

The constitution was extended with a comprehensive Testing Principles section.

## Key Principles

### 1. Test-Driven Development (TDD)

The project follows:

```text
RED → GREEN → REFACTOR
```

Workflow:

1. Write failing test
2. Implement minimal solution
3. Refactor safely
4. Re-run validation

---

### 2. Testing Pyramid

The repository follows the testing pyramid:

| Test Type | Target |
|---|---|
| Unit Tests | 70% |
| Integration Tests | 20% |
| E2E Tests | 10% |

---

### 3. Coverage Rules

Minimum targets defined in constitution:

| Metric | Target |
|---|---|
| Line Coverage | 80% |
| Branch Coverage | 75% |
| Mutation Score | 75% (Bonus Target) |

---

### 4. Mutation-Resistant Testing

Tests were designed to avoid:

- Weak assertions
- Tautological tests
- Empty assertions
- Flaky tests
- Shared-state tests
- Over-mocking

Additional boundary and boolean logic tests were introduced to improve mutation resistance.

---

# Testing Infrastructure

## Backend Test Structure

```text
backend/tests/
├── integration/
│   ├── auth-routes.test.ts
│   └── tasks-routes.test.ts
└── unit/
    └── services/
        ├── auth-service.test.ts
        └── task-service.test.ts
```

---

## Mutation Testing

### Tool

```text
Stryker
```

### Configuration

```text
backend/stryker.conf.json
```

Mutation testing was used to identify weak assertions and untested logic branches.

---

# Technologies Used

| Technology | Purpose |
|---|---|
| TypeScript | Type-safe backend development |
| Node.js | Runtime environment |
| Express.js | Backend API framework |
| Jest | Unit and integration testing |
| Supertest | API integration testing |
| Stryker | Mutation testing |
| ESLint | Linting and code quality |
| GitHub Copilot | AI-assisted development |
| SpecKit | Specification-driven workflow |

---

# Validation Results

## Type Checking

```text
PASSED
```

## Unit & Integration Tests

```text
PASSED
```

- Total Test Suites: 4
- Total Tests: 21+

## Coverage Results

| Metric | Result |
|---|---|
| Statements | 94.62% |
| Branches | 87.5% |
| Functions | 100% |
| Lines | 94.62% |

All required coverage thresholds were exceeded.

---

## Mutation Testing Results

Mutation testing executed successfully.

### Initial Mutation Score

```text
37.97%
```

### Improved Mutation Score

```text
40.51%
```

Additional boundary and edge-case tests were added to improve mutation resistance.

The 75% mutation target remains documented as a future hardening goal.

---

# Reports & Evidence

## Reports Folder

```text
reports/
├── mutation/
├── testing-principles-validation.md
```

Includes:

- Mutation summaries
- Validation evidence
- Coverage notes
- Testing observations

---

## Test Result Artifacts

```text
test-results/
├── coverage/
└── mutation/
```

---

## Screenshots

```text
screenshots/
```

Contains evidence placeholders and validation references for lab submission.

---

# Commands Used

## Install Dependencies

```bash
npm install
```

## Run Tests

```bash
npm test
```

## Coverage

```bash
npm run test:coverage
```

## Type Checking

```bash
npm run typecheck
```

## Mutation Testing

```bash
npm run test:mutation
```

---

# Key Learning Outcomes

This module demonstrated how testing can become a first-class engineering activity rather than a final validation step.

Main takeaways:

- Specifications improve test quality
- TDD improves implementation reliability
- Mutation testing exposes weak assertions
- Coverage alone is insufficient for quality
- AI-assisted workflows benefit from strong constitutions
- Spec-driven engineering improves traceability
- Validation artifacts improve maintainability

---

# Bonus Lab Coverage

The repository also includes preparation for:

- Bonus Mutation Testing Lab
- SpecKit + Mutation Testing integration workflows
- Mutation-aware hardening iterations

Mutation infrastructure and reporting were fully configured.

---

# Repository Structure

```text
Module6/
├── .specify/
├── backend/
├── reports/
├── screenshots/
├── specs/
├── test-results/
├── tests/
└── README.md
```

---

# Notes

This project focuses primarily on:

- Testing quality
- Validation workflows
- Spec-driven engineering
- Mutation-aware improvement

The goal is not UI deployment or production release, but rather demonstrating professional engineering validation practices using SpecKit and GitHub Copilot.

---
