# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `pnpm dev` - Start development server with Docker services (Turbopack enabled)
- `pnpm build` - Build production application
- `pnpm start` - Start production server with Docker services
- `pnpm preview` - Build and start production server

### Code Quality
- `pnpm lint` - Run Biome linter and TypeScript compiler
- `pnpm biome-check` - Run Biome checks only
- TypeScript config uses strict mode with path resolution

### Testing
- `pnpm test` - Run tests with Docker services (includes database setup)
- `pnpm ci` - Run tests for CI (without Docker auto-start)
- Uses Vitest with jsdom environment
- Test database: `postgresql://postgres:password@localhost:5432/test_db`
- Global test setup in `__tests__/setup.ts`

### Storybook
- `pnpm sb` - Start Storybook development server (port 6006)
- `pnpm build-storybook` - Build static Storybook
- `pnpm chromatic` - Deploy to Chromatic for visual testing

## Architecture Overview

### Multi-Language E-Commerce Application
This is a Next.js 15 application with App Router featuring both customer and admin interfaces for a gachapon/lottery e-commerce system.

**Supported Languages:** Japanese (ja), English (en), Chinese (zh)
**Default Language:** Japanese (/ja)

### Application Structure

#### Customer Interface (`/src/app/[lang]/`)
- Multi-language storefront with dynamic routing
- Product catalog, shopping cart, checkout, and user accounts
- Lottery entries and auction participation

#### Admin Interface (`/src/app/admin/`)
- Japanese-only admin panel
- Product, lottery, and auction management
- Payment and shipment tracking

### Component Organization Pattern
```
page/
├── _components/
│   ├── ComponentName/
│   │   ├── ComponentName.tsx
│   │   ├── ComponentName.stories.tsx
│   │   └── index.ts
│   └── PageView/ (page-level components)
└── page.tsx
```

### Database Layer (`/src/lib/db/`)
- Raw PostgreSQL with `pg` client (no ORM)
- Domain-organized modules: `products/`, `auctions/`, `lotteryEvents/`, etc.
- Pattern: `query.ts` for CRUD, `transaction.ts` for complex operations
- Connection per query with proper cleanup
- Type-safe query execution with generics

### Key Business Domains
- **Products:** Standard e-commerce catalog with inventory
- **Lotteries:** Time-based lottery events with entry management
- **Auctions:** Open and sealed-bid auction system
- **Payments:** PayPay integration with order tracking
- **Shipping:** Comprehensive shipment status management

### State Management
- **Server:** Next.js Server Components and Server Actions
- **Client:** React Context for cart, session storage for persistence
- **Logic/View Separation:** Logic components handle state, View components handle presentation

### Authentication
- JWT-based authentication with HTTP-only cookies
- Admin authentication requires separate admin codes
- Token verification utility in `/src/lib/jwt.ts`

### External Services
- **Database:** PostgreSQL (Docker: postgres:17.4)
- **Storage:** MinIO S3-compatible storage (Docker)
- **Payments:** PayPay API integration

### Development Tools
- **Linting:** Biome (replaces ESLint/Prettier)
- **Styling:** TailwindCSS 4
- **Testing:** Vitest + Testing Library + Storybook
- **Type Checking:** TypeScript with strict configuration

## Testing Patterns
- Tests mirror `src/` directory structure in `__tests__/`
- Factory pattern for test data generation (`__tests__/factory/`)
- Mock external dependencies (database, Next.js APIs)
- Component testing with React Testing Library
- Database queries tested with real test database

## File Conventions
- Central type definitions in `/src/types.ts`
- Translations in `/src/lib/translations.ts`
- Constants organized by domain in `/src/const/`
- Database schema in `schema.sql`
- Docker services defined in `compose.yaml`