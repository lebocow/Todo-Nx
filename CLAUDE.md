# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Nx Monorepo Todo Application** - Full-stack todo management app with Angular frontend, Express.js backend, and shared type-safe data models.

## Key Commands

### Development Setup
```bash
npm start                    # Start both frontend and backend in parallel
npm run serve:todo-app       # Angular frontend only (proxied to :3000)
npm run serve:todo-server    # Express.js backend only (:3000)
npm run build:data-models    # Build shared Zod schemas (required before starting)
```

### Database
```bash
npm run prisma:migrate       # Run database migrations
npm run prisma:generate      # Generate Prisma client
```

### Testing and Quality
```bash
nx test todo-app             # Run Angular unit tests
nx test todo-server          # Run Express.js unit tests  
nx test data-models          # Run shared library tests
nx lint todo-app             # Lint Angular app
nx lint todo-server          # Lint Express.js app
nx build todo-app            # Production build frontend
nx build todo-server         # Production build backend
```

## Architecture

### Monorepo Structure
```
/apps/
  /todo-app/          # Angular 17.3 frontend (standalone components)
  /todo-server/       # Express.js REST API (layered architecture)
/shared/
  /data-models/       # Zod schemas for type-safe contracts
```

### Applications
- **todo-app**: Angular 17.3 frontend with Material Design UI, JWT auth, toastr notifications
- **todo-server**: Express.js REST API with Prisma ORM, PostgreSQL, JWT auth with Passport.js
- **data-models**: Shared Zod validation schemas for type-safe contracts

### Database Schema (Prisma + PostgreSQL)
- **User**: Authentication and authorization (USER/ADMIN roles)
- **Task**: Todo items with title, description, due dates, completion status
- **Category**: User-defined color-coded task categories  
- **Token**: JWT tokens for auth, refresh, password reset

### Frontend Architecture Patterns

#### **Component Structure**
- **Standalone Components**: All components use Angular 17+ standalone architecture
- **Change Detection**: OnPush strategy for performance
- **Dependency Injection**: Prefer `inject()` function over constructor injection

#### **State Management**
- **Signals**: Reactive state with Angular signals
- **Service Singletons**: Centralized state in injectable services
- **Pattern**: `tasks.update((prev) => [...prev, newTask])`

#### **HTTP & Error Handling**
- **JWT Interceptor**: Auto-attaches Bearer tokens to requests
- **Server Error Interceptor**: Handles 401/403 with token refresh
- **Error Pattern**: RxJS `catchError` with toastr notifications

#### **Form Patterns**
- **Reactive Forms**: with Zod validation integration
- **Pattern**: `new FormControl('', zodValidator(CreateTaskSchema.shape.title))`
- **Floating Forms**: Animation-driven with service-controlled visibility

#### **Component Communication**
- **Service-Mediated**: Services manage component state and communication
- **Input/Output**: `readonly task = input.required<ITask>()`

### Backend Architecture Patterns

#### **Layered Design**
```
Controllers → Services → Database (Prisma)
     ↓           ↓           ↓
  Validation  Business   Data Access
  Error Handling Logic   Type Safety
```

#### **Error Handling**
- **ApiError Class**: Standardized error structure
- **Error Middleware**: Converts Prisma/Zod errors to API errors
- **CatchAsync**: Automatic promise error catching for routes

#### **Authentication Flow**
- **Passport.js**: JWT strategy with automatic user extraction
- **Auth Middleware**: Route-level protection
- **Token Management**: Access/refresh token pattern

#### **Database Patterns**
- **Prisma**: Type-safe ORM with selective field queries
- **Relationships**: User → Tasks/Categories (1:N), Category → Tasks (1:N)

### Shared Type System

#### **Zod Schema Composition**
```typescript
// Pattern: Full schema with selective exports
export const FullTaskSchema = z.object({ /* all fields */ });
export const TaskSchema = FullTaskSchema.pick({ /* client fields */ });
export const CreateTaskSchema = FullTaskSchema.pick({ /* creation fields */ });
export type ITask = z.infer<typeof TaskSchema>;
```

#### **Cross-Project Type Safety**
- **Import**: `@myworkspace/data-models` for workspace access
- **Build Dependency**: Both frontend/backend depend on built data-models
- **Validation**: Same schemas for client and server validation

### Data Flow
```
User Action → Component → Service → HTTP → Controller → Service → Prisma
                    ↓              ↗
              Signal Update ← Response Processing ← Database
```

### Key Technologies
- Frontend: Angular 17.3, Angular Material, SCSS, RxJS, Signals
- Backend: Express.js, Prisma ORM, PostgreSQL, Passport.js
- Shared: Zod validation, TypeScript
- Testing: Jest across all projects
- Tooling: Nx workspace, ESLint

### API Structure
- Backend serves REST API on port 3000
- API routes under `/api/v1/` (auth, tasks, categories, users)
- Frontend proxies `/api` requests to backend during development
- JWT-based authentication with interceptors on frontend

### Development Workflow
1. Always build data-models first: `npm run build:data-models`
2. Changes to shared schemas require rebuilding data-models
3. Database changes require migration: `npm run prisma:migrate`
4. Use `npm start` for full-stack development

### Quick Reference Checklists

#### **Creating New Components**
1. Use standalone component with OnPush
2. Inject services with `inject()` function
3. Use signals for reactive state
4. Import required Angular Material modules directly

#### **Adding New API Endpoints**
1. Update Zod schema in data-models
2. Rebuild data-models: `npm run build:data-models`
3. Add route, controller, and service methods
4. Use `catchAsync` wrapper for error handling

#### **Database Schema Changes**
1. Update Prisma schema
2. Run migration: `npm run prisma:migrate`
3. Update corresponding Zod schemas
4. Rebuild data-models

#### **Form Development**
1. Create Zod schema for validation
2. Use `zodValidator` for FormControl validation
3. Handle errors with reactive form state
4. Display errors with Angular Material

## Code Organization Rules

### TypeScript Class Structure
Always organize class properties and methods in this order:
1. Injected services (prefer `inject()` over constructor injection)
2. ViewChild/ContentChild references
3. Signals, properties, and class variables
4. Form controls and reactive forms
5. Constructor and lifecycle methods
6. Public methods
7. Private methods

**Dependency Injection:**
- Always prefer `inject()` function over constructor injection
- Use `readonly` for injected services when they won't be reassigned

**Example:**
```typescript
// ✅ Good - using inject() function
class MyComponent {
  private readonly service = inject(SomeService);
  private readonly httpClient = inject(HttpClient);
  
  elementRef = viewChild<ElementRef>('element');
  
  isLoading = signal(false);
  data = signal<Data[]>([]);
  
  formControl = new FormControl('');
  
  constructor() { /* ... */ }
  
  ngOnInit() { /* ... */ }
  
  onSaveData() { /* ... */ }
  
  private validateData() { /* ... */ }
}

// ❌ Bad - constructor injection and scattered properties
class MyComponent {
  constructor(
    private service: SomeService,
    private httpClient: HttpClient
  ) {}
  
  onSaveData() { /* ... */ }
  
  isLoading = signal(false); // Should be at top
}
```