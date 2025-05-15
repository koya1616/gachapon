# Gachapon Project Conventions

This document outlines the coding conventions, project structure, and best practices for the Gachapon project. Use these guidelines when making changes to ensure consistency across the codebase.

## Project Overview

Gachapon is a Next.js application with internationalization support, Storybook for component visualization, and Vitest for testing. The project uses Tailwind CSS for styling and Biome for linting and formatting.

## Technology Stack

- **Framework**: Next.js 15.x
- **Languages**: TypeScript, JavaScript
- **Styling**: Tailwind CSS 4.x
- **Component Documentation**: Storybook 8.x
- **Testing**: Vitest 3.x, Testing Library
- **Linting & Formatting**: Biome 1.9.x
- **Database**: PostgreSQL (via Docker)
- **Package Manager**: pnpm

## Directory Structure

```
/
├── __tests__/                  # Test files mirroring the src structure
│   ├── setup.ts                # Global test setup
│   ├── app/                    # App tests
│   ├── components/             # Component tests
│   └── lib/                    # Library tests
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── [lang]/             # Internationalized routes
│   │   ├── admin/              # Admin section
│   │   └── api/                # API routes
│   ├── components/             # Shared components
│   │   └── Component/          # Component folder (use PascalCase)
│   │       ├── Component.tsx   # Component implementation
│   │       └── Component.stories.tsx # Storybook stories
│   ├── context/                # React context providers
│   ├── const/                  # Constants
│   ├── lib/                    # Utility functions and services
│   └── mocks/                  # Mock data for testing/storybook
```

## Code Style Conventions

### General

- Use TypeScript for type safety
- Use spaces for indentation (2 spaces)
- Maximum line length is 120 characters
- Use double quotes for strings
- Follow Biome recommended rules for linting

### Components

- Use functional components with arrow function syntax
- Each component should be in its own directory with the same name
- Component props should be explicitly typed
- Include Storybook stories for UI components
- Use Tailwind CSS for styling

Example:

```tsx
// Component definition
const ComponentName = ({ prop1, prop2 }: { prop1: string; prop2: number }) => {
  return <div className="tailwind-classes">{/* Component JSX */}</div>;
};

export default ComponentName;

// Story file
import type { Meta, StoryObj } from "@storybook/react";
import ComponentName from "./ComponentName";

const meta = {
  title: "Path/ComponentName",
  component: ComponentName,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    prop1: "example",
    prop2: 42,
  },
};
```

### Testing

- Tests are located in the `__tests__` directory mirroring the src structure
- Use Vitest as the test runner
- Use Testing Library for component testing
- Test files should be named `*.test.tsx` or `*.test.ts`
- Each test suite should have a descriptive name in Japanese
- Write tests for component rendering and interactions

Example:

```tsx
import ComponentName from "@/components/ComponentName";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("ComponentNameコンポーネント", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("コンポーネントが正しくレンダリングされること", () => {
    // Test implementation
  });
});
```

### Internationalization

- Use the `[lang]` directory structure for internationalized routes
- Support for Japanese (ja), English (en), and Chinese (zh)
- Default to Japanese if an unsupported language is requested

### Database

- Use PostgreSQL for data storage
- Use the `pg` package for database queries
- Database schema is defined in `schema.sql`
- Test database is cleaned up between tests via `__tests__/setup.ts`

### Scripts & Commands

- Development: `pnpm dev` (includes Docker setup)
- Build: `pnpm build`
- Test: `pnpm test`
- Linting: `pnpm lint`
- Storybook: `pnpm sb`

## Best Practices

1. **Type Safety**: Always define types for props, state, and function parameters/returns
2. **Component Structure**: Keep components focused and simple, extracting complex logic to hooks or utilities
3. **Testing**: Write tests for all components and critical functionality
4. **Documentation**: Use Storybook for component documentation
5. **Error Handling**: Implement proper error handling for user-facing components
6. **Accessibility**: Ensure components are accessible with proper ARIA attributes and keyboard navigation
7. **Performance**: Be mindful of component re-renders and use memoization when appropriate
8. **Internationalization**: Support all required languages
9. **State Management**: Use React Context for shared state across components
10. **User Interface**: Design components with a focus on user experience and usability, simple, rich.
