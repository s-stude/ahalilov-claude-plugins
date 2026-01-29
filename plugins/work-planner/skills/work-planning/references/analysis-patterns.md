# Codebase Analysis Patterns

This document provides comprehensive techniques for exploring and understanding codebases during the planning phase.

## Overview

Effective planning requires thorough codebase understanding. This guide covers systematic approaches for discovering files, understanding architecture, recognizing patterns, and mapping dependencies.

## File Discovery Patterns

### Glob Pattern Strategies

Use glob patterns to find files efficiently:

**Feature-Based Discovery:**
```
# Find authentication-related files
**/*auth*
**/*login*
**/*session*

# Find user management files
**/*user*
**/users/**/*

# Find payment processing files
**/*payment*
**/*billing*
**/*checkout*
```

**Component Discovery:**
```
# React components
**/components/**/*.{tsx,jsx}
**/src/**/*Component.{ts,js}

# Vue components
**/components/**/*.vue
**/src/**/*.vue

# Angular components
**/*.component.ts
```

**Test Discovery:**
```
# Jest/Vitest tests
**/*.test.{js,ts,jsx,tsx}
**/*.spec.{js,ts,jsx,tsx}
**/__tests__/**/*

# Pytest tests
**/test_*.py
**/*_test.py

# Go tests
**/*_test.go
```

**Configuration Discovery:**
```
# Build configs
**/*.config.{js,ts}
**/webpack.config.*
**/vite.config.*
**/rollup.config.*

# Framework configs
**/next.config.*
**/nuxt.config.*
**/vue.config.*

# Environment files
**/.env*
**/config/**/*.{json,yaml,yml}
```

### Directory Structure Patterns

Common project structures to recognize:

**Frontend Frameworks:**
```
src/
├── components/     # Reusable UI components
├── pages/          # Page components (Next.js, Nuxt)
├── views/          # Page components (Vue)
├── routes/         # Route definitions
├── hooks/          # React hooks
├── composables/    # Vue composables
├── stores/         # State management
├── utils/          # Utility functions
├── services/       # API services
├── types/          # TypeScript types
└── assets/         # Static assets
```

**Backend Frameworks:**
```
src/
├── controllers/    # Request handlers
├── routes/         # Route definitions
├── models/         # Data models
├── services/       # Business logic
├── middleware/     # Middleware functions
├── utils/          # Utility functions
├── config/         # Configuration
└── database/       # Database migrations/seeds
```

**Full-Stack Monorepo:**
```
packages/
├── frontend/       # Frontend app
├── backend/        # Backend API
├── shared/         # Shared code
├── common/         # Common utilities
└── types/          # Shared types
```

### Search Strategies

Progressive search from broad to specific:

**1. High-Level Search:**
- Start with top-level directory listing
- Identify main modules
- Find entry points (main.ts, app.ts, index.ts)
- Locate configuration files

**2. Module-Level Search:**
- Search within relevant modules
- Find related files by naming patterns
- Identify module boundaries
- Check module dependencies

**3. Specific Search:**
- Search for exact function names
- Find specific class definitions
- Locate specific component usage
- Find specific API endpoints

## Content Search Patterns

### Grep Pattern Strategies

Use grep/search to find code patterns:

**Function and Class Discovery:**
```
# Find function definitions
pattern: "^(export\s+)?(async\s+)?function\s+\w+"

# Find class definitions
pattern: "^(export\s+)?class\s+\w+"

# Find React component definitions
pattern: "(function|const)\s+\w+.*=.*React"

# Find interface/type definitions
pattern: "^(export\s+)?(interface|type)\s+\w+"
```

**API and Route Discovery:**
```
# Express routes
pattern: "app\.(get|post|put|delete|patch)"
pattern: "router\.(get|post|put|delete|patch)"

# Fetch/HTTP calls
pattern: "fetch\("
pattern: "axios\."
pattern: "http\.(get|post|put|delete)"

# GraphQL queries
pattern: "useQuery|useMutation"
pattern: "gql`"
```

**State Management Discovery:**
```
# Redux
pattern: "createSlice|createReducer"
pattern: "useSelector|useDispatch"

# React Context
pattern: "createContext|useContext"

# Vue/Pinia
pattern: "defineStore"
pattern: "useState|useGetters"
```

**Database Query Discovery:**
```
# SQL queries
pattern: "SELECT|INSERT|UPDATE|DELETE"

# ORM queries
pattern: "Model\.(find|create|update|delete)"
pattern: "\.(where|select|join)"

# MongoDB
pattern: "db\.collection|find|insert|update"
```

**Error Handling Discovery:**
```
# Try/catch blocks
pattern: "try\s*\{"
pattern: "catch\s*\("

# Error returns
pattern: "return.*error|throw new"

# Error middleware
pattern: "errorHandler|catchAsync"
```

### Context Search Techniques

Use context lines to understand surrounding code:

**Using -A, -B, -C flags:**
```
# Show 3 lines after match
grep -A 3 "pattern"

# Show 3 lines before match
grep -B 3 "pattern"

# Show 3 lines before and after
grep -C 3 "pattern"
```

**Common context scenarios:**
- Function signatures: See parameters and return types
- Import statements: Understand dependencies
- Variable usage: See how variables are used
- Error handling: See error handling context

## Architecture Understanding

### Identifying Architecture Patterns

Recognize common patterns in codebases:

**MVC (Model-View-Controller):**
- Models: Data structures and business logic
- Views: Presentation layer
- Controllers: Request handlers

**Service Layer:**
- Controllers handle HTTP requests
- Services contain business logic
- Repositories handle data access

**Repository Pattern:**
- Repositories abstract data access
- Services use repositories
- Models define data structures

**Microservices:**
- Multiple independent services
- Inter-service communication via APIs
- Shared libraries or packages

**Layered Architecture:**
- Presentation layer (UI)
- Application layer (business logic)
- Domain layer (core business)
- Infrastructure layer (database, external services)

### Dependency Flow Analysis

Map how data and control flow through the system:

**Request Flow:**
1. Entry point (route, handler)
2. Middleware (auth, validation)
3. Controller (request processing)
4. Service (business logic)
5. Repository (data access)
6. Database/external service
7. Response construction
8. Return to client

**Data Flow:**
1. Data enters (API, form, file)
2. Validation
3. Transformation
4. Business logic processing
5. Persistence
6. Retrieval
7. Serialization
8. Presentation

**Event Flow:**
1. Event trigger
2. Event handler
3. Side effects
4. State updates
5. UI updates (if applicable)

### Module Boundary Identification

Understand module responsibilities:

**Clear Boundaries:**
- Each module has single responsibility
- Minimal coupling between modules
- Well-defined interfaces
- Clear dependency direction

**Boundary Indicators:**
- Separate directories
- Index files exporting public API
- Interface definitions
- Documentation comments

**Cross-Module Communication:**
- Direct imports
- Event systems
- Dependency injection
- Service locators

## Pattern Recognition

### Naming Convention Analysis

Learn project naming patterns:

**File Naming:**
```
# Common patterns
ComponentName.tsx         # PascalCase for components
service-name.ts          # kebab-case for services
ServiceName.service.ts   # Suffix pattern
user.model.ts            # Prefix pattern
useCustomHook.ts         # camelCase with 'use' prefix
```

**Variable Naming:**
```
# Common patterns
const userName = ...           # camelCase for variables
const USER_ROLE = ...          # SCREAMING_SNAKE for constants
class UserManager { ... }      # PascalCase for classes
interface IUser { ... }        # 'I' prefix for interfaces (older)
type TUser = ...               # 'T' prefix for types (older)
```

**Function Naming:**
```
# Common patterns
function getUserById() { ... }    # camelCase, verb prefix
async function fetchUser() { ... } # async with 'fetch' prefix
function handleClick() { ... }     # 'handle' for event handlers
const isValid = () => ...          # 'is/has/can' for booleans
```

### Code Organization Patterns

Recognize how code is structured:

**Feature-Based Organization:**
```
features/
├── authentication/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
└── user-profile/
    ├── components/
    ├── hooks/
    └── services/
```

**Type-Based Organization:**
```
src/
├── components/
│   ├── Auth/
│   └── Profile/
├── services/
│   ├── authService.ts
│   └── userService.ts
└── types/
    ├── auth.ts
    └── user.ts
```

**Domain-Driven Organization:**
```
src/
├── domain/
│   ├── user/
│   │   ├── entity.ts
│   │   ├── repository.ts
│   │   └── service.ts
│   └── order/
│       ├── entity.ts
│       ├── repository.ts
│       └── service.ts
└── infrastructure/
```

### Design Pattern Detection

Identify common design patterns:

**Singleton Pattern:**
```typescript
// Look for
class Singleton {
  private static instance: Singleton;
  private constructor() {}
  static getInstance() { ... }
}
```

**Factory Pattern:**
```typescript
// Look for
function createUser(type) {
  switch (type) {
    case 'admin': return new Admin();
    case 'user': return new User();
  }
}
```

**Observer Pattern:**
```typescript
// Look for
class EventEmitter {
  on(event, callback) { ... }
  emit(event, data) { ... }
}
```

**Repository Pattern:**
```typescript
// Look for
class UserRepository {
  async findById(id) { ... }
  async save(user) { ... }
  async delete(id) { ... }
}
```

**Dependency Injection:**
```typescript
// Look for
constructor(
  private userService: UserService,
  private logger: Logger
) {}
```

## Framework-Specific Patterns

### React Patterns

**Component Patterns:**
```typescript
// Functional component with hooks
function Component() {
  const [state, setState] = useState();
  useEffect(() => { ... });
  return <div>...</div>;
}

// Custom hooks
function useCustomHook() {
  const [state, setState] = useState();
  return { state, setState };
}

// Context usage
const value = useContext(MyContext);
```

**State Management Patterns:**
```typescript
// Redux
const dispatch = useDispatch();
const state = useSelector(selector);

// React Query
const { data, isLoading } = useQuery(key, fetcher);
```

### Vue Patterns

**Component Patterns:**
```typescript
// Composition API
const count = ref(0);
const doubled = computed(() => count.value * 2);
watchEffect(() => { ... });

// Composables
function useComposable() {
  const state = ref(null);
  return { state };
}
```

**State Management Patterns:**
```typescript
// Pinia
const store = useStore();
store.action();
```

### Express Patterns

**Route Patterns:**
```typescript
// Router setup
const router = express.Router();
router.get('/users/:id', controller.getUser);

// Middleware
app.use(authMiddleware);
app.use('/api', apiRouter);

// Error handling
app.use((err, req, res, next) => { ... });
```

## Common Codebase Structures

### Monorepo Structure

```
root/
├── packages/
│   ├── app/
│   ├── api/
│   └── shared/
├── package.json
└── pnpm-workspace.yaml
```

### Microservices Structure

```
services/
├── user-service/
│   ├── src/
│   └── package.json
├── order-service/
│   ├── src/
│   └── package.json
└── shared-libs/
```

### Plugin/Extension Structure

```
plugins/
├── plugin-name/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── skills/
│   ├── agents/
│   └── README.md
```

## Analysis Checklist

Before finalizing exploration:

- [ ] Identified project structure and patterns
- [ ] Found similar implementations
- [ ] Understood naming conventions
- [ ] Mapped key dependencies
- [ ] Located relevant tests
- [ ] Reviewed configuration files
- [ ] Understood framework patterns
- [ ] Identified design patterns in use
- [ ] Mapped data and control flows
- [ ] Found entry points and boundaries

## Tips for Effective Analysis

1. **Start broad, go narrow**: Begin with high-level structure, drill into specifics
2. **Follow imports**: Imports reveal dependencies and relationships
3. **Read tests**: Tests show expected behavior and usage examples
4. **Check git history**: Recent changes reveal active areas
5. **Look for README**: Documentation explains architecture
6. **Find examples**: Existing code provides patterns to follow
7. **Identify boundaries**: Module boundaries guide where to make changes
8. **Map data flows**: Understanding data flow reveals integration points

Use these patterns to systematically explore any codebase and gather the context needed for effective planning.
