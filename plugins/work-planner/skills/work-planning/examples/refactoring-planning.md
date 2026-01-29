# Example: Refactoring Planning - Payment Processing Module

This example demonstrates the work planning process for refactoring a payment processing module that has grown complex and difficult to maintain.

## User Request

"The payment processing module has become hard to maintain. Can you refactor it to make it cleaner and easier to extend with new payment providers?"

## Step 1: Understand the Request

### Task Type
Refactoring - Improving code structure without changing behavior

### Scope
Module-level refactoring:
- Payment processing logic
- Provider integrations
- Error handling
- Testing infrastructure

### Requirements Analysis

**Explicit Requirements:**
- Improve maintainability
- Make it easier to add new payment providers
- Keep existing functionality working

**Implicit Requirements:**
- No breaking API changes
- Preserve all existing behavior
- Maintain test coverage
- Handle edge cases the same way
- Keep performance characteristics

**Constraints:**
- Cannot break existing integrations
- Must maintain backward compatibility
- Cannot change public API
- Must complete without disrupting active development

### Success Criteria
- Code is more maintainable
- New providers can be added easily
- All existing tests pass
- No behavior changes
- Improved code organization
- Better separation of concerns

## Step 2: Explore the Codebase

### Current Structure Discovery

**Find payment-related files:**
```bash
glob: **/*payment*
glob: **/*stripe*
glob: **/*paypal*

Results:
- src/services/paymentService.ts (450 lines)
- src/services/stripeService.ts (200 lines)
- src/services/paypalService.ts (180 lines)
- src/types/payment.ts (50 lines)
- src/utils/paymentHelpers.ts (120 lines)
- tests/payment.test.ts (300 lines)
```

**Read main payment service:**
```typescript
// src/services/paymentService.ts (simplified)
export class PaymentService {
  async processPayment(orderId: string, amount: number, provider: string) {
    // Validate amount
    if (amount <= 0) throw new Error('Invalid amount');

    // Different logic for each provider
    if (provider === 'stripe') {
      const stripe = require('stripe')(process.env.STRIPE_KEY);
      try {
        const intent = await stripe.paymentIntents.create({
          amount: amount * 100,
          currency: 'usd',
        });
        await this.logTransaction(orderId, intent.id, 'stripe');
        return { success: true, transactionId: intent.id };
      } catch (error) {
        await this.logError(orderId, error, 'stripe');
        throw new Error('Stripe payment failed');
      }
    } else if (provider === 'paypal') {
      const paypal = require('@paypal/checkout-server-sdk');
      // 50+ lines of PayPal-specific logic
      // ...
    } else if (provider === 'square') {
      // 50+ lines of Square-specific logic
      // ...
    } else {
      throw new Error('Unsupported provider');
    }
  }

  async refundPayment(transactionId: string, provider: string) {
    // More if/else provider logic
    // ...
  }

  async getPaymentStatus(transactionId: string, provider: string) {
    // More if/else provider logic
    // ...
  }

  private async logTransaction(...) { /* ... */ }
  private async logError(...) { /* ... */ }
}
```

### Problems Identified

**Code Smells:**
1. **Long method**: processPayment() is 150+ lines
2. **Repeated if/else**: Same provider checking pattern in every method
3. **Mixed concerns**: API integration, logging, validation, error handling all mixed
4. **Hard to extend**: Adding new provider requires modifying multiple methods
5. **Tight coupling**: Provider-specific code embedded in main service
6. **Poor testability**: Hard to mock provider interactions
7. **Duplication**: Similar error handling and logging across providers

**Architectural Issues:**
- No abstraction for payment providers
- No clear separation between business logic and integration logic
- Provider-specific code not isolated
- No consistent error handling strategy

### Test Coverage Analysis

**Current tests:**
```typescript
// tests/payment.test.ts
describe('PaymentService', () => {
  it('processes stripe payment', async () => {
    // Mocks entire stripe SDK
    // ...
  });

  it('processes paypal payment', async () => {
    // Mocks entire paypal SDK
    // ...
  });

  // 20+ more tests with heavy mocking
});
```

**Test issues:**
- Tests are brittle due to deep mocking
- Hard to add tests for new providers
- Tests know too much about implementation details

## Step 3: Identify Implementation Points

### Target Architecture

**Strategy Pattern:** Abstract payment providers behind common interface

```
New Structure:
src/
├── services/
│   └── paymentService.ts          # Orchestrator (reduced to ~100 lines)
├── payment/
│   ├── providers/
│   │   ├── PaymentProvider.ts     # Abstract interface
│   │   ├── StripeProvider.ts      # Stripe implementation
│   │   ├── PaypalProvider.ts      # PayPal implementation
│   │   └── SquareProvider.ts      # Square implementation
│   ├── PaymentProcessor.ts        # Business logic
│   ├── TransactionLogger.ts       # Logging concern
│   └── PaymentValidator.ts        # Validation concern
├── types/
│   └── payment.ts                 # Types (expanded)
└── tests/
    ├── payment.test.ts            # Integration tests
    └── payment/providers/         # Provider unit tests
```

### Files to Modify

**Existing files:**
- `src/services/paymentService.ts` - Simplify to orchestration only
- `src/types/payment.ts` - Expand with provider interface
- `tests/payment.test.ts` - Refactor tests

**New files to create:**
- `src/payment/providers/PaymentProvider.ts` - Abstract interface
- `src/payment/providers/StripeProvider.ts` - Extract Stripe logic
- `src/payment/providers/PaypalProvider.ts` - Extract PayPal logic
- `src/payment/providers/SquareProvider.ts` - Extract Square logic
- `src/payment/PaymentProcessor.ts` - Extract business logic
- `src/payment/TransactionLogger.ts` - Extract logging
- `src/payment/PaymentValidator.ts` - Extract validation
- `tests/payment/providers/StripeProvider.test.ts` - Unit tests
- `tests/payment/providers/PaypalProvider.test.ts` - Unit tests
- `tests/payment/providers/SquareProvider.test.ts` - Unit tests

### Migration Considerations

**Backward Compatibility:**
- Keep existing `PaymentService` public API unchanged
- Internal implementation changes only
- No changes to function signatures
- Same return types and error messages

**Risk Mitigation:**
- Refactor incrementally, one provider at a time
- Keep old code until new code is tested
- Run full test suite after each provider migration
- Deploy behind feature flag if possible

## Step 4: Ask Clarifying Questions

### Question 1: Provider Addition Frequency

**Question:** How often do you expect to add new payment providers?

**Context:** This affects how much abstraction to introduce. More frequent additions justify more upfront abstraction work.

**Option 1: Rarely (once per year or less)**
- Approach: Simpler refactoring, less abstraction
- Benefits: Less code to maintain, faster refactoring
- Trade-offs: Each addition still requires some effort

**Option 2: Frequently (multiple times per year)**
- Approach: Comprehensive provider abstraction with plugin system
- Benefits: Very easy to add providers, minimal main code changes
- Trade-offs: More upfront work, more abstraction

**Recommendation:** Based on codebase having 3 providers already, I recommend comprehensive abstraction. The pattern is already emerging and worth formalizing.

**User Response:** "We're looking to add 2-3 more providers this year, so let's do the comprehensive approach."

### Question 2: Migration Strategy

**Question:** Should I migrate all providers at once or incrementally?

**Context:** All-at-once is cleaner but riskier. Incremental is safer but means mixed patterns temporarily.

**Option 1: All at once (big bang)**
- Approach: Refactor all providers in one PR
- Pros: Clean cutover, no mixed patterns, easier to review architectural consistency
- Cons: Larger PR, higher risk, harder to isolate issues

**Option 2: Incremental (one provider at a time)**
- Approach: Migrate Stripe first, then PayPal, then Square
- Pros: Lower risk, easier to review, can validate each step
- Cons: Mixed patterns temporarily, more PRs

**Recommendation:** Incremental migration. Start with Stripe (most commonly used based on code comments), validate, then migrate others.

**User Response:** "Incremental sounds safer. Let's do that."

## Step 5: Propose Detailed Plan

# Implementation Plan: Payment Module Refactoring

## Understanding

Refactor payment processing module to use Strategy pattern with provider abstraction. This will make it easier to add new payment providers and improve maintainability by separating concerns. Migrate incrementally (Stripe, then PayPal, then Square) to reduce risk.

## Context

**Current State:**
- 450-line PaymentService with embedded provider logic
- Provider-specific code mixed with business logic
- Difficult to test due to tight coupling
- Hard to extend with new providers
- Three providers currently supported: Stripe, PayPal, Square

**Patterns Discovered:**
- TypeScript with strict mode
- Async/await for async operations
- Class-based services with dependency injection
- Jest for testing with mocks
- Environment variables for API keys

**Target State:**
- Provider abstraction with common interface
- Separated concerns (validation, logging, business logic)
- Easy to add new providers
- Improved testability
- Same public API (backward compatible)

## Approach

Use **Strategy Pattern** with provider abstraction:

1. Define `PaymentProvider` interface with standard methods
2. Implement interface for each provider
3. Extract cross-cutting concerns (logging, validation)
4. Simplify `PaymentService` to orchestrate providers
5. Migrate incrementally: Stripe → PayPal → Square

**Key Principles:**
- Preserve all existing behavior
- Maintain backward compatibility
- Keep public API unchanged
- Improve testability
- Separate concerns clearly

## Critical Files

**New Abstractions:**
- `src/payment/providers/PaymentProvider.ts` - Provider interface
- `src/payment/PaymentProcessor.ts` - Business logic orchestration
- `src/payment/TransactionLogger.ts` - Transaction logging
- `src/payment/PaymentValidator.ts` - Input validation

**Provider Implementations:**
- `src/payment/providers/StripeProvider.ts` - Stripe integration
- `src/payment/providers/PaypalProvider.ts` - PayPal integration
- `src/payment/providers/SquareProvider.ts` - Square integration

**Modified Files:**
- `src/services/paymentService.ts` - Simplify to facade
- `src/types/payment.ts` - Add provider types

**Test Files:**
- `tests/payment/providers/StripeProvider.test.ts` - Stripe tests
- `tests/payment/providers/PaypalProvider.test.ts` - PayPal tests
- `tests/payment/providers/SquareProvider.test.ts` - Square tests
- `tests/payment.test.ts` - Updated integration tests

## Implementation Steps

### Phase 1: Create Abstractions

### Step 1: Define Provider Interface

**File:** `src/payment/providers/PaymentProvider.ts`

**Action:** Create abstract provider interface:
```typescript
export interface PaymentResult {
  success: boolean;
  transactionId: string;
  error?: string;
}

export interface RefundResult {
  success: boolean;
  refundId: string;
  error?: string;
}

export interface PaymentStatus {
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  transactionId: string;
}

export abstract class PaymentProvider {
  abstract readonly name: string;

  abstract processPayment(
    amount: number,
    currency: string,
    metadata?: Record<string, any>
  ): Promise<PaymentResult>;

  abstract refundPayment(
    transactionId: string,
    amount?: number
  ): Promise<RefundResult>;

  abstract getPaymentStatus(
    transactionId: string
  ): Promise<PaymentStatus>;
}
```

**Rationale:** Common interface allows polymorphic provider usage. Abstract class provides type safety and forces implementation of required methods.

### Step 2: Extract Validation Logic

**File:** `src/payment/PaymentValidator.ts`

**Action:** Extract validation concerns:
```typescript
export class PaymentValidator {
  validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    if (!Number.isFinite(amount)) {
      throw new Error('Amount must be a valid number');
    }
  }

  validateCurrency(currency: string): void {
    const validCurrencies = ['usd', 'eur', 'gbp'];
    if (!validCurrencies.includes(currency.toLowerCase())) {
      throw new Error(`Unsupported currency: ${currency}`);
    }
  }
}
```

**Rationale:** Single Responsibility Principle. Validation logic is reusable and testable independently.

### Step 3: Extract Logging Logic

**File:** `src/payment/TransactionLogger.ts`

**Action:** Extract logging concerns:
```typescript
export class TransactionLogger {
  async logTransaction(
    orderId: string,
    transactionId: string,
    provider: string,
    amount: number
  ): Promise<void> {
    // Existing logging implementation
  }

  async logError(
    orderId: string,
    error: Error,
    provider: string
  ): Promise<void> {
    // Existing error logging implementation
  }
}
```

**Rationale:** Separate logging concern from business logic. Makes it easier to change logging strategy.

### Phase 2: Implement Stripe Provider (First Migration)

### Step 4: Implement Stripe Provider

**File:** `src/payment/providers/StripeProvider.ts`

**Action:** Extract Stripe-specific logic into provider:
```typescript
import Stripe from 'stripe';
import { PaymentProvider, PaymentResult, RefundResult, PaymentStatus } from './PaymentProvider';

export class StripeProvider extends PaymentProvider {
  readonly name = 'stripe';
  private stripe: Stripe;

  constructor(apiKey: string) {
    super();
    this.stripe = new Stripe(apiKey, { apiVersion: '2023-10-16' });
  }

  async processPayment(
    amount: number,
    currency: string,
    metadata?: Record<string, any>
  ): Promise<PaymentResult> {
    try {
      const intent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata,
      });

      return {
        success: true,
        transactionId: intent.id,
      };
    } catch (error) {
      return {
        success: false,
        transactionId: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async refundPayment(
    transactionId: string,
    amount?: number
  ): Promise<RefundResult> {
    // Implement refund logic
  }

  async getPaymentStatus(
    transactionId: string
  ): Promise<PaymentStatus> {
    // Implement status check logic
  }
}
```

**Rationale:** Encapsulate Stripe-specific logic. Provider handles its own error handling and data transformation. Easy to test in isolation.

### Step 5: Create Payment Processor

**File:** `src/payment/PaymentProcessor.ts`

**Action:** Create orchestrator for payment operations:
```typescript
import { PaymentProvider } from './providers/PaymentProvider';
import { PaymentValidator } from './PaymentValidator';
import { TransactionLogger } from './TransactionLogger';

export class PaymentProcessor {
  private providers: Map<string, PaymentProvider> = new Map();
  private validator: PaymentValidator;
  private logger: TransactionLogger;

  constructor(
    validator: PaymentValidator,
    logger: TransactionLogger
  ) {
    this.validator = validator;
    this.logger = logger;
  }

  registerProvider(provider: PaymentProvider): void {
    this.providers.set(provider.name, provider);
  }

  async processPayment(
    orderId: string,
    amount: number,
    currency: string,
    providerName: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; transactionId: string }> {
    this.validator.validateAmount(amount);
    this.validator.validateCurrency(currency);

    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Unsupported provider: ${providerName}`);
    }

    const result = await provider.processPayment(amount, currency, metadata);

    if (result.success) {
      await this.logger.logTransaction(orderId, result.transactionId, providerName, amount);
    } else {
      await this.logger.logError(orderId, new Error(result.error), providerName);
    }

    return result;
  }

  // Implement refund and status methods similarly
}
```

**Rationale:** Orchestrates validation, provider selection, and logging. Single place to add cross-cutting concerns.

### Step 6: Update PaymentService (Stripe Only)

**File:** `src/services/paymentService.ts`

**Action:** Refactor to use new architecture for Stripe, keep old code for PayPal and Square:
```typescript
import { PaymentProcessor } from '../payment/PaymentProcessor';
import { StripeProvider } from '../payment/providers/StripeProvider';
import { PaymentValidator } from '../payment/PaymentValidator';
import { TransactionLogger } from '../payment/TransactionLogger';

export class PaymentService {
  private processor: PaymentProcessor;

  constructor() {
    const validator = new PaymentValidator();
    const logger = new TransactionLogger();
    this.processor = new PaymentProcessor(validator, logger);

    // Register Stripe provider
    const stripeProvider = new StripeProvider(process.env.STRIPE_KEY!);
    this.processor.registerProvider(stripeProvider);
  }

  async processPayment(orderId: string, amount: number, provider: string) {
    if (provider === 'stripe') {
      // Use new architecture
      return this.processor.processPayment(orderId, amount, 'usd', provider);
    } else if (provider === 'paypal') {
      // Keep old implementation temporarily
      // ... existing PayPal code ...
    } else if (provider === 'square') {
      // Keep old implementation temporarily
      // ... existing Square code ...
    }
  }

  // Same pattern for refund and status methods
}
```

**Rationale:** Incremental migration reduces risk. Stripe migrated first, others follow. Public API unchanged.

**Dependencies:** Requires previous steps completed

### Step 7: Test Stripe Migration

**File:** `tests/payment/providers/StripeProvider.test.ts`

**Action:** Create focused provider tests:
```typescript
import { StripeProvider } from '@/payment/providers/StripeProvider';

describe('StripeProvider', () => {
  let provider: StripeProvider;

  beforeEach(() => {
    provider = new StripeProvider('test_key');
  });

  it('processes payment successfully', async () => {
    // Mock Stripe SDK
    // Test provider directly
  });

  // More focused tests
});
```

**Rationale:** Unit tests for provider in isolation. Easier to maintain than integration tests with deep mocks.

### Step 8: Verify Stripe Migration

**Action:** Run full test suite and manual testing for Stripe payments

**Verification:**
- [ ] All existing Stripe tests pass
- [ ] New provider tests pass
- [ ] Manual test: Process Stripe payment in dev environment
- [ ] Manual test: Refund Stripe payment
- [ ] Manual test: Check payment status
- [ ] Verify logs still work
- [ ] Check error handling

**Rationale:** Validate first migration before proceeding to others.

### Phase 3: Migrate PayPal (Second Provider)

### Step 9: Implement PayPal Provider

**File:** `src/payment/providers/PaypalProvider.ts`

**Action:** Extract PayPal logic into provider (similar structure to StripeProvider)

**Rationale:** Apply proven pattern from Stripe migration.

### Step 10: Update PaymentService (Add PayPal)

**File:** `src/services/paymentService.ts`

**Action:** Register PayPal provider, use new architecture for both Stripe and PayPal

**Rationale:** Progress incremental migration.

### Step 11: Test PayPal Migration

**File:** `tests/payment/providers/PaypalProvider.test.ts`

**Action:** Create PayPal provider tests

**Verification:** Same checklist as Stripe migration

### Phase 4: Migrate Square (Final Provider)

### Step 12: Implement Square Provider

**File:** `src/payment/providers/SquareProvider.ts`

**Action:** Extract Square logic into provider

### Step 13: Complete PaymentService Migration

**File:** `src/services/paymentService.ts`

**Action:** Remove all old provider logic, fully use new architecture:
```typescript
export class PaymentService {
  private processor: PaymentProcessor;

  constructor() {
    const validator = new PaymentValidator();
    const logger = new TransactionLogger();
    this.processor = new PaymentProcessor(validator, logger);

    // Register all providers
    this.processor.registerProvider(new StripeProvider(process.env.STRIPE_KEY!));
    this.processor.registerProvider(new PaypalProvider(process.env.PAYPAL_CLIENT_ID!));
    this.processor.registerProvider(new SquareProvider(process.env.SQUARE_ACCESS_TOKEN!));
  }

  async processPayment(orderId: string, amount: number, provider: string) {
    return this.processor.processPayment(orderId, amount, 'usd', provider);
  }

  async refundPayment(transactionId: string, provider: string, amount?: number) {
    return this.processor.refundPayment(transactionId, provider, amount);
  }

  async getPaymentStatus(transactionId: string, provider: string) {
    return this.processor.getPaymentStatus(transactionId, provider);
  }
}
```

**Rationale:** Clean, simple service that delegates to processor. All providers use consistent pattern.

### Step 14: Final Testing

**Action:** Comprehensive testing of all providers

**Verification:**
- [ ] All provider tests pass
- [ ] All integration tests pass
- [ ] Manual test each provider's payment flow
- [ ] Check error handling for all providers
- [ ] Verify logging works for all providers
- [ ] Performance is same or better

## Dependencies

No new external dependencies. Refactoring uses existing libraries.

## Testing Strategy

**Unit Tests:**
- Test each provider in isolation
- Test validator independently
- Test logger independently
- Mock external SDKs

**Integration Tests:**
- Test PaymentProcessor with real providers
- Test PaymentService end-to-end
- Keep existing integration tests working

**Manual Testing:**
- Test each provider after migration
- Verify in staging environment
- Check production monitoring

## Risks

**Risk 1: Behavior Change**
- Issue: Refactoring might accidentally change behavior
- Mitigation: Incremental migration, thorough testing, behavior verification at each step

**Risk 2: Performance Regression**
- Issue: Additional abstraction might impact performance
- Mitigation: Benchmark before and after, abstraction is lightweight

**Risk 3: Breaking Changes**
- Issue: Public API might accidentally change
- Mitigation: Keep PaymentService interface identical, add tests for API contract

**Risk 4: Mixed Patterns Temporarily**
- Issue: During migration, codebase has old and new patterns
- Mitigation: Acceptable temporary state, document migration status

## Alternatives Considered

**Alternative 1: Big Bang Migration**
- Not chosen because: Higher risk, harder to isolate issues, difficult to roll back

**Alternative 2: Factory Pattern Instead of Strategy**
- Not chosen because: Strategy pattern more flexible for runtime provider selection

**Alternative 3: Keep Current Structure**
- Not chosen because: Maintainability problems will worsen as more providers added

## Benefits

**After Refactoring:**
- Adding new provider requires only creating new provider class
- Each provider independently testable
- Clear separation of concerns
- Easier to understand and maintain
- Better code organization
- Improved testability

**Example: Adding New Provider**
```typescript
// Only need to create provider class
class BraintreeProvider extends PaymentProvider {
  // Implement interface
}

// Register it
processor.registerProvider(new BraintreeProvider(apiKey));
```

No changes to PaymentService, validator, logger, or other providers needed.
