# Example: Feature Planning - User Authentication

This example demonstrates the work planning process for adding user authentication to an existing web application.

## User Request

"Add user authentication to the application. Users should be able to sign up, log in, and log out. Protect the dashboard routes so only authenticated users can access them."

## Step 1: Understand the Request

### Task Type
Feature addition - Adding authentication system

### Scope
System-wide changes:
- New authentication pages (signup, login)
- API endpoints for auth operations
- Protected route middleware
- Session/token management
- User model and database schema

### Requirements Analysis

**Explicit Requirements:**
- User signup functionality
- User login functionality
- User logout functionality
- Protected dashboard routes

**Implicit Requirements:**
- Password storage (must be secure/hashed)
- Session or token management
- Authentication state persistence
- Error handling (invalid credentials, duplicate users)
- Form validation
- Redirect logic (after login/logout)

**Questions to Clarify:**
- Should passwords be hashed with bcrypt?
- JWT tokens or session-based auth?
- Remember me functionality?
- Password reset flow needed now?
- Email verification required?
- Social login (OAuth) needed?

### Success Criteria
- Users can create accounts
- Users can log in with credentials
- Users can log out
- Dashboard routes reject unauthenticated users
- Passwords stored securely
- Auth state persists across page refreshes

## Step 2: Explore the Codebase

### Project Structure Discovery

**Search for existing auth:**
```bash
# Search for auth-related files
glob: **/*auth*
glob: **/*login*
glob: **/*session*

# Result: No existing auth files found
```

**Project structure:**
```
src/
├── components/
│   ├── Dashboard.tsx
│   ├── Home.tsx
│   └── Navbar.tsx
├── pages/
│   ├── dashboard.tsx
│   └── index.tsx
├── api/
│   └── users.ts
├── lib/
│   ├── db.ts
│   └── types.ts
└── utils/
    └── validation.ts
```

**Stack identified:**
- Next.js (React framework)
- TypeScript
- Prisma (ORM, found in db.ts)
- React Hook Form (found in existing forms)
- Tailwind CSS (styling)

### Pattern Discovery

**Existing API patterns:**
```typescript
// Found in api/users.ts
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const users = await prisma.user.findMany();
    res.json(users);
  }
}
```

**Existing form patterns:**
```typescript
// Found in components
const form = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

**Database patterns:**
```typescript
// Found in lib/db.ts
import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
```

**Styling patterns:**
- Tailwind utility classes
- Responsive design with mobile-first approach
- Consistent color scheme using theme colors

### Similar Implementations
No authentication exists in codebase. This will be a greenfield implementation following existing patterns.

## Step 3: Identify Implementation Points

### Critical Files to Modify

**Existing files to modify:**
- `prisma/schema.prisma` - Add User model with auth fields
- `src/lib/types.ts` - Add auth-related types
- `src/utils/validation.ts` - Add auth validation schemas
- `src/components/Navbar.tsx` - Add login/logout buttons
- `src/pages/dashboard.tsx` - Add auth protection

**New files to create:**
- `src/pages/api/auth/signup.ts` - Signup endpoint
- `src/pages/api/auth/login.ts` - Login endpoint
- `src/pages/api/auth/logout.ts` - Logout endpoint
- `src/pages/api/auth/me.ts` - Get current user endpoint
- `src/pages/signup.tsx` - Signup page
- `src/pages/login.tsx` - Login page
- `src/lib/auth.ts` - Auth utility functions
- `src/lib/session.ts` - Session management
- `src/middleware.ts` - Route protection middleware
- `src/hooks/useAuth.tsx` - Auth React hook
- `src/components/AuthGuard.tsx` - Client-side auth guard

### Dependencies Needed
- `bcryptjs` - Password hashing (v2.4.3)
- `jsonwebtoken` - JWT token generation/validation (v9.0.0)
- `@types/bcryptjs` - TypeScript types
- `@types/jsonwebtoken` - TypeScript types
- `iron-session` - Secure session management (v8.0.1)

## Step 4: Ask Clarifying Questions

### Question 1: Authentication Method

**Question:** Should I use JWT tokens or session-based authentication?

**Context:** The app needs to maintain authentication state. The choice affects implementation complexity and security model.

**Option 1: JWT Tokens**
- Description: Store JWT token in httpOnly cookie, validate on each request
- Pros: Stateless, scalable, works well with API-first architecture
- Cons: Harder to invalidate tokens, slightly more complex setup

**Option 2: Session-based (iron-session)**
- Description: Store session ID in encrypted cookie, maintain session state
- Pros: Easy to invalidate, simpler implementation, built-in CSRF protection
- Cons: Requires session storage, slightly less scalable

**Recommendation:** I recommend iron-session because it's simpler to implement, provides built-in security features, and is well-suited for Next.js applications. For a single-server app, the session storage overhead is negligible.

### Question 2: Additional Features

**Question:** Should I implement password reset and email verification now?

**Context:** Full authentication usually includes these features, but they add complexity.

**Option 1: Include now**
- Scope: Add password reset and email verification flows
- Benefits: Complete auth system from the start
- Effort: Additional 40% implementation time

**Option 2: Defer to later**
- Scope: Basic signup/login/logout only
- Benefits: Faster initial implementation, can gather feedback
- Effort: Focus on core functionality

**Recommendation:** Defer to later. Start with core authentication and add password reset/email verification in a follow-up iteration based on user feedback.

**User Response:** "Let's start with basic auth for now. We can add password reset later."

## Step 5: Propose Detailed Plan

# Implementation Plan: User Authentication

## Understanding

Implement user authentication system with signup, login, and logout functionality. Protect dashboard routes to require authentication. Use iron-session for session management and bcrypt for password hashing.

## Context

**Codebase patterns discovered:**
- Next.js API routes pattern: async handlers with req/res parameters
- Form handling: React Hook Form with Zod validation
- Database access: Prisma ORM with TypeScript types
- Styling: Tailwind CSS utility classes
- No existing authentication system

**Project conventions:**
- TypeScript strict mode enabled
- API routes in `pages/api/` directory
- React components use functional components with hooks
- Validation schemas use Zod

## Approach

Use **iron-session** for secure, encrypted session cookies combined with **bcrypt** for password hashing. This approach provides:
- Secure session management with built-in CSRF protection
- Easy session invalidation for logout
- Simpler implementation than JWT
- Automatic session refresh

Authentication flow:
1. User submits signup/login form
2. API validates credentials
3. On success, create encrypted session cookie
4. Middleware checks session on protected routes
5. React hook provides auth state to components

## Critical Files

**Database:**
- `prisma/schema.prisma` - Add User model

**API Routes:**
- `src/pages/api/auth/signup.ts` - Create user account
- `src/pages/api/auth/login.ts` - Authenticate user
- `src/pages/api/auth/logout.ts` - Clear session
- `src/pages/api/auth/me.ts` - Get current user

**Pages:**
- `src/pages/signup.tsx` - Signup form page
- `src/pages/login.tsx` - Login form page
- `src/pages/dashboard.tsx` - Protected dashboard (modified)

**Libraries:**
- `src/lib/auth.ts` - Password hashing utilities
- `src/lib/session.ts` - Session configuration and helpers

**Middleware:**
- `src/middleware.ts` - Route protection logic

**Components:**
- `src/components/AuthGuard.tsx` - Client-side auth guard
- `src/components/Navbar.tsx` - Add auth buttons (modified)

**Hooks:**
- `src/hooks/useAuth.tsx` - Auth state management hook

**Types & Validation:**
- `src/lib/types.ts` - Auth-related types (modified)
- `src/utils/validation.ts` - Auth validation schemas (modified)

## Implementation Steps

### Step 1: Install Dependencies

**Files:** `package.json`

**Action:**
```bash
npm install iron-session bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken
```

**Rationale:** Install required authentication libraries for session management and password hashing.

### Step 2: Update Database Schema

**File:** `prisma/schema.prisma`

**Action:** Add User model with authentication fields:
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Run migration: `npx prisma migrate dev --name add_user_auth`

**Rationale:** User model needs id, email, hashed password, and timestamps. Email must be unique for login.

### Step 3: Create Session Configuration

**File:** `src/lib/session.ts`

**Action:** Configure iron-session with secure settings:
```typescript
import { SessionOptions } from 'iron-session';

export interface SessionData {
  userId: string;
  email: string;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'app_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};
```

**Rationale:** Centralize session configuration. Use environment variable for secret. Set secure defaults for cookie options.

**Dependencies:** Requires SESSION_SECRET in .env file

### Step 4: Create Auth Utilities

**File:** `src/lib/auth.ts`

**Action:** Create password hashing and validation functions:
```typescript
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
```

**Rationale:** Encapsulate bcrypt logic. Use 10 salt rounds (secure and performant). Reusable across auth endpoints.

### Step 5: Add Auth Types and Validation

**File:** `src/lib/types.ts`

**Action:** Add auth-related TypeScript types:
```typescript
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SignupInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
```

**File:** `src/utils/validation.ts`

**Action:** Add Zod validation schemas:
```typescript
import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
```

**Rationale:** Type safety and runtime validation. Follow existing Zod validation pattern.

### Step 6: Create Signup API Endpoint

**File:** `src/pages/api/auth/signup.ts`

**Action:** Implement user registration:
```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { signupSchema } from '@/utils/validation';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = signupSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await hashPassword(body.password);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name,
      },
    });

    const session = await getIronSession(req, res, sessionOptions);
    session.userId = user.id;
    session.email = user.email;
    await session.save();

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

**Rationale:** Validate input, check for duplicate email, hash password, create user, establish session. Never return password in response.

### Step 7: Create Login API Endpoint

**File:** `src/pages/api/auth/login.ts`

**Action:** Implement user login with credential verification and session creation. Similar structure to signup but verify existing user and password instead of creating new user.

**Rationale:** Authenticate existing users. Verify password with bcrypt. Create session on success.

### Step 8: Create Logout API Endpoint

**File:** `src/pages/api/auth/logout.ts`

**Action:** Destroy session:
```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getIronSession(req, res, sessionOptions);
  session.destroy();

  res.status(200).json({ success: true });
}
```

**Rationale:** Clear session data and cookie. Simple and secure.

### Step 9: Create Current User Endpoint

**File:** `src/pages/api/auth/me.ts`

**Action:** Return current authenticated user from session. Check session, fetch user from database, return user data.

**Rationale:** Allow client to check auth state and get user info.

### Step 10: Create Auth Hook

**File:** `src/hooks/useAuth.tsx`

**Action:** Create React hook for auth state management:
```typescript
import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } finally {
      setLoading(false);
    }
  }

  // Implement login, signup, logout functions...

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

**Rationale:** Centralize auth state. Provide convenient hooks for components. Follow React context pattern.

### Step 11: Create Signup Page

**File:** `src/pages/signup.tsx`

**Action:** Create signup form using React Hook Form and useAuth hook. Match existing form styling with Tailwind CSS.

**Rationale:** User-facing signup interface. Use existing form patterns.

### Step 12: Create Login Page

**File:** `src/pages/login.tsx`

**Action:** Create login form similar to signup page but with email and password fields only.

**Rationale:** User-facing login interface.

### Step 13: Create Middleware for Route Protection

**File:** `src/middleware.ts`

**Action:** Create Next.js middleware to protect routes:
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const session = await getIronSession(request, response, sessionOptions);

  if (!session.userId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

**Rationale:** Server-side route protection. Redirect unauthenticated users to login.

### Step 14: Update Navbar

**File:** `src/components/Navbar.tsx`

**Action:** Add conditional rendering for login/logout buttons based on auth state from useAuth hook.

**Rationale:** Show appropriate auth actions based on user state.

### Step 15: Wrap App with Auth Provider

**File:** `src/pages/_app.tsx`

**Action:** Wrap app with AuthProvider:
```typescript
import { AuthProvider } from '@/hooks/useAuth';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
```

**Rationale:** Make auth state available to all components.

### Step 16: Add Environment Variable

**File:** `.env.local`

**Action:** Add SESSION_SECRET:
```
SESSION_SECRET=your-secret-key-at-least-32-characters-long
```

**Rationale:** Required for iron-session encryption. Must be secure random string.

## Dependencies

- `iron-session@8.0.1` - Secure session management
- `bcryptjs@2.4.3` - Password hashing
- `@types/bcryptjs@2.4.2` - TypeScript types

## Testing Strategy

**Manual Testing:**
1. Test signup flow: Create new account, verify session created
2. Test login flow: Log in with created account
3. Test logout flow: Log out, verify session cleared
4. Test route protection: Access /dashboard without auth (should redirect)
5. Test route protection: Access /dashboard with auth (should allow)
6. Test validation: Try invalid email, short password
7. Test error handling: Try duplicate email signup

**Edge Cases:**
- Invalid credentials
- Duplicate email registration
- Malformed input
- Session expiration
- Direct URL access to protected routes

**No automated tests yet:** Focus on implementation first. Can add tests in follow-up.

## Risks

**Risk 1: Session Secret Security**
- Issue: SESSION_SECRET must be secure random string
- Mitigation: Document requirement, provide generation command
- Command: `openssl rand -base64 32`

**Risk 2: Password Policy**
- Issue: Minimum 8 characters may not be enough
- Mitigation: Current implementation allows strengthening later without breaking changes

**Risk 3: Rate Limiting**
- Issue: No rate limiting on auth endpoints
- Mitigation: Accept for MVP, add rate limiting in follow-up

**Risk 4: HTTPS Requirement**
- Issue: Secure cookies require HTTPS in production
- Mitigation: Document deployment requirement

## Alternatives Considered

**Alternative 1: JWT Tokens**
- Not chosen because: More complex setup, harder to invalidate, no significant benefit for single-server deployment

**Alternative 2: NextAuth.js**
- Not chosen because: Heavy dependency, more opinionated, overkill for simple auth requirements

**Alternative 3: Firebase Auth**
- Not chosen because: External dependency, vendor lock-in, requires Firebase account

## Next Steps

After core auth is implemented and tested:
1. Add password reset flow
2. Add email verification
3. Add rate limiting to auth endpoints
4. Add automated tests
5. Consider OAuth providers (Google, GitHub)
