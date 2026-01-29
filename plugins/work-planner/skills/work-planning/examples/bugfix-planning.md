# Example: Bug Fix Planning - Checkout Flow Error

This example demonstrates the work planning process for investigating and fixing a bug in the checkout flow.

## User Request

"Users are reporting an error during checkout. When they click 'Complete Purchase', sometimes they get an error message 'Payment processing failed' even though their card was charged. Can you investigate and fix this?"

## Step 1: Understand the Request

### Task Type
Bug investigation and fix

### Scope
Checkout flow investigation:
- Payment processing logic
- Error handling
- Transaction state management  
- User communication

### Requirements Analysis

**Explicit Requirements:**
- Fix error where users see failure message despite successful charge
- Investigate root cause

**Implicit Requirements:**
- Prevent duplicate charges
- Ensure transaction state consistency
- Proper error handling
- User experience during errors
- Data integrity

### Success Criteria
- No false error messages
- Correct transaction state
- No duplicate charges
- Users see accurate status
- Edge cases handled properly

## Step 2: Explore the Codebase

### Root Cause Analysis

**Identified Problem:**

The bug occurs when:
1. Payment succeeds (card charged)
2. createOrder() throws database error
3. Error caught in catch block
4. User sees "Payment processing failed" despite successful charge

**Problems Identified:**
1. No atomicity: Payment and order creation aren't atomic
2. No rollback: Successful payment not refunded on failure
3. Poor error handling: All errors return same generic message
4. No idempotency: Retry could cause duplicate charge

## Step 3: Implementation Points

### Files to Modify

- src/api/checkout/process.ts - Better error handling
- src/services/paymentService.ts - Add refund capability
- src/utils/idempotency.ts - Prevent duplicate processing

## Step 4: Ask Clarifying Questions

**Question:** When order creation fails after payment, should I refund automatically or hold for manual resolution?

**Recommendation:** Automatic refund for better user experience.

**User Response:** "Automatic refund makes sense."

## Step 5: Detailed Plan

# Implementation Plan: Fix Checkout Error Handling

## Understanding

Fix bug where users see "Payment processing failed" despite successful charge. Add rollback logic, improve error handling, add idempotency protection.

## Implementation Steps

### Step 1: Add Refund Method

**File:** src/services/paymentService.ts

**Action:** Add refund capability for rollback

**Rationale:** Enable rolling back successful payments when subsequent steps fail

### Step 2: Add Idempotency

**File:** src/utils/idempotency.ts

**Action:** Create idempotency key management

**Rationale:** Prevent duplicate charges on retry

### Step 3: Update Checkout with Rollback

**File:** src/api/checkout/process.ts

**Action:** Add try/catch around order creation with payment refund on failure

**Rationale:** Ensure payment is refunded if order creation fails

### Step 4: Write Regression Tests

**File:** tests/api/checkout.test.ts

**Action:** Test bug scenario - verify refund occurs when order creation fails

**Rationale:** Prevent regression of this bug

## Testing Strategy

- Unit tests for refund logic
- Integration tests for rollback scenarios
- Manual testing in staging
- Monitor production refund rates

## Risks

- Refund API might fail (log for manual resolution)
- Increased Stripe fees from refunds (fix root causes of order creation failures)

This fix ensures users never see false payment failures and are automatically refunded if genuine failures occur.
