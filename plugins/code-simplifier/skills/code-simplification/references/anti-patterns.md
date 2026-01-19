# Code Simplification Anti-Patterns

Common mistakes to avoid when simplifying code. Each anti-pattern includes why it's problematic and the correct approach.

## Over-Simplification Anti-Patterns

### Anti-Pattern: Removing Helpful Abstractions

**Problem**: Eliminating abstractions that improve code organization

```javascript
// Before (good abstraction)
class UserValidator {
  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  validateAge(age) {
    return age >= 18 && age <= 120;
  }

  validateUsername(username) {
    return username.length >= 3 && username.length <= 20;
  }
}

// After (over-simplified - BAD)
function validateUser(user) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) &&
         user.age >= 18 && user.age <= 120 &&
         user.username.length >= 3 && user.username.length <= 20;
}
```

**Why it's bad**: Loses reusability, harder to test individual validations, combines too many concerns

**Correct approach**: Keep helpful abstractions that improve organization and reusability

### Anti-Pattern: Over-DRYing Code

**Problem**: Creating premature abstractions for minimal duplication

```javascript
// Before (acceptable duplication)
function createAdmin(name, email) {
  return {
    name,
    email,
    role: 'admin',
    permissions: ['read', 'write', 'delete']
  };
}

function createUser(name, email) {
  return {
    name,
    email,
    role: 'user',
    permissions: ['read']
  };
}

// After (over-DRY - BAD)
function createPerson(name, email, config) {
  return {
    name,
    email,
    role: config.role,
    permissions: config.permissions
  };
}

// Usage requires passing complex config
const admin = createPerson('John', 'john@example.com', {
  role: 'admin',
  permissions: ['read', 'write', 'delete']
});
```

**Why it's bad**: Premature abstraction makes simple cases more complex, unclear intent

**Correct approach**: Accept some duplication when abstraction adds more complexity than value

### Anti-Pattern: Excessive One-Liners

**Problem**: Prioritizing brevity over clarity

```javascript
// Over-simplified (BAD)
const r = d.filter(x => x.a && x.b > 5).map(x => ({ ...x, c: x.b * 2 })).sort((a, b) => b.c - a.c);

// Better (clear and maintainable)
const activeItems = data.filter(item => item.active && item.score > 5);
const itemsWithDoubledScore = activeItems.map(item => ({
  ...item,
  doubledScore: item.score * 2
}));
const sortedItems = itemsWithDoubledScore.sort((a, b) => b.doubledScore - a.doubledScore);

// Or with descriptive intermediate values
const MIN_SCORE = 5;
const activeHighScoreItems = data.filter(item => {
  return item.active && item.score > MIN_SCORE;
});

const results = activeHighScoreItems
  .map(item => ({ ...item, doubledScore: item.score * 2 }))
  .sort((a, b) => b.doubledScore - a.doubledScore);
```

**Why it's bad**: Hard to debug, unclear intent, difficult to modify

**Correct approach**: Prefer explicit, clear code over compact one-liners

### Anti-Pattern: Combining Unrelated Concerns

**Problem**: Merging functions that do different things

```javascript
// Over-simplified (BAD)
function processAndSave(user, data) {
  // Validate user
  if (!user.email) throw new Error('Invalid email');

  // Process data
  const processed = data.map(item => item.value * 2);

  // Save to database
  database.save(processed);

  // Send notification
  emailService.notify(user.email, 'Data processed');

  return processed;
}

// Better (separation of concerns)
function validateUser(user) {
  if (!user.email) throw new Error('Invalid email');
}

function processData(data) {
  return data.map(item => item.value * 2);
}

function saveData(data) {
  return database.save(data);
}

function notifyUser(email, message) {
  emailService.notify(email, message);
}

function processAndSave(user, data) {
  validateUser(user);
  const processed = processData(data);
  saveData(processed);
  notifyUser(user.email, 'Data processed');
  return processed;
}
```

**Why it's bad**: Violates single responsibility, hard to test, poor reusability

**Correct approach**: Keep functions focused on single concerns

## Functionality-Breaking Anti-Patterns

### Anti-Pattern: Changing Logic While Simplifying

**Problem**: Altering behavior while attempting to improve clarity

```javascript
// Original
function calculateDiscount(price, isPremium) {
  if (isPremium) {
    return price * 0.2;
  } else {
    return price * 0.1;
  }
}

// Simplified incorrectly (BREAKS FUNCTIONALITY)
function calculateDiscount(price, isPremium) {
  const discountRate = isPremium ? 0.1 : 0.2; // WRONG: Rates reversed
  return price * discountRate;
}

// Correct simplification
function calculateDiscount(price, isPremium) {
  const discountRate = isPremium ? 0.2 : 0.1;
  return price * discountRate;
}
```

**Why it's bad**: Changes what code does, breaks existing functionality

**Correct approach**: Verify logic remains identical after simplification

### Anti-Pattern: Removing Error Handling

**Problem**: Eliminating error checks during simplification

```javascript
// Original
function divide(a, b) {
  if (b === 0) {
    return null;
  }
  return a / b;
}

// Simplified incorrectly (BAD)
function divide(a, b) {
  return a / b; // Missing zero check - returns Infinity
}

// Correct (preserve error handling)
function divide(a, b) {
  if (b === 0) return null;
  return a / b;
}
```

**Why it's bad**: Removes safety checks, introduces bugs

**Correct approach**: Preserve all error handling logic

### Anti-Pattern: Changing Edge Case Behavior

**Problem**: Altering how edge cases are handled

```javascript
// Original
function getFirstItem(array) {
  if (!array || array.length === 0) {
    return undefined;
  }
  return array[0];
}

// Simplified incorrectly (BAD)
function getFirstItem(array) {
  return array[0]; // Crashes if array is null
}

// Correct
function getFirstItem(array) {
  if (!array || array.length === 0) return undefined;
  return array[0];
}

// Or with optional chaining
function getFirstItem(array) {
  return array?.[0];
}
```

**Why it's bad**: Introduces null/undefined errors, changes behavior

**Correct approach**: Maintain edge case handling

## Project Standard Violation Anti-Patterns

### Anti-Pattern: Ignoring CLAUDE.md Standards

**Problem**: Applying generic patterns that conflict with project standards

```javascript
// CLAUDE.md says: "Prefer function keyword over arrow functions"

// Simplified incorrectly (violates standard)
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// Correct (follows project standard)
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**Why it's bad**: Creates inconsistency with project conventions

**Correct approach**: Always follow CLAUDE.md patterns over generic best practices

### Anti-Pattern: Inconsistent Style

**Problem**: Using different patterns for similar code

```javascript
// Inconsistent (BAD)
function getUserName(user) {
  return user?.name;
}

const getUserEmail = (user) => {
  if (!user) return null;
  return user.email;
};

function getUserPhone(user) {
  return user && user.phone || null;
}

// Consistent (GOOD)
function getUserName(user) {
  return user?.name ?? null;
}

function getUserEmail(user) {
  return user?.email ?? null;
}

function getUserPhone(user) {
  return user?.phone ?? null;
}
```

**Why it's bad**: Creates confusion, reduces maintainability

**Correct approach**: Use consistent patterns throughout the codebase

## Naming Anti-Patterns

### Anti-Pattern: Over-Abbreviating

**Problem**: Making names too short to be clear

```javascript
// Over-abbreviated (BAD)
function calcUsrAcSts(u) {
  const sts = u.sub.type;
  return sts === 'prm' || sts === 'ent';
}

// Clear (GOOD)
function calculateUserAccountStatus(user) {
  const subscriptionType = user.subscription.type;
  return subscriptionType === 'premium' || subscriptionType === 'enterprise';
}
```

**Why it's bad**: Requires mental decoding, reduces clarity

**Correct approach**: Use full descriptive names

### Anti-Pattern: Overly Generic Names

**Problem**: Names that don't convey purpose

```javascript
// Generic (BAD)
function process(data) {
  return data.map(item => item * 2);
}

function handle(value) {
  return value.toUpperCase();
}

// Specific (GOOD)
function doubleValues(numbers) {
  return numbers.map(number => number * 2);
}

function normalizeToUppercase(text) {
  return text.toUpperCase();
}
```

**Why it's bad**: Doesn't reveal intent or purpose

**Correct approach**: Use intention-revealing names

## Comment Anti-Patterns

### Anti-Pattern: Removing "Why" Comments

**Problem**: Deleting comments that explain non-obvious reasoning

```javascript
// Original (has important context)
// Using setTimeout(0) to defer execution until after
// the DOM has updated. Direct execution causes race condition
// where the element hasn't rendered yet.
setTimeout(() => {
  element.focus();
}, 0);

// Over-simplified (BAD - loses important context)
setTimeout(() => {
  element.focus();
}, 0);

// Correct (keep the why comment)
// Using setTimeout(0) to defer execution until after DOM update
setTimeout(() => {
  element.focus();
}, 0);
```

**Why it's bad**: Loses important context about non-obvious decisions

**Correct approach**: Keep comments explaining WHY, remove comments explaining WHAT

### Anti-Pattern: Replacing Clear Code with Comments

**Problem**: Using comments instead of improving code clarity

```javascript
// Using comments instead of clear code (BAD)
function process(x) {
  // Multiply by conversion factor
  const y = x * 2.54;
  // Check if within acceptable range
  if (y > 10 && y < 100) {
    return y;
  }
  return null;
}

// Self-documenting code (GOOD)
function convertInchesToCentimeters(inches) {
  const INCHES_TO_CM = 2.54;
  const centimeters = inches * INCHES_TO_CM;

  const MIN_VALID_CM = 10;
  const MAX_VALID_CM = 100;
  const isWithinRange = centimeters > MIN_VALID_CM && centimeters < MAX_VALID_CM;

  return isWithinRange ? centimeters : null;
}
```

**Why it's bad**: Comments are a bandaid for unclear code

**Correct approach**: Make code self-documenting, then remove obvious comments

## Balance Anti-Patterns

### Anti-Pattern: Premature Optimization

**Problem**: Making code complex to optimize prematurely

```javascript
// Over-optimized (BAD - unless profiled need)
const cache = new Map();
function fibonacci(n) {
  if (cache.has(n)) return cache.get(n);
  if (n <= 1) return n;
  const result = fibonacci(n - 1) + fibonacci(n - 2);
  cache.set(n, result);
  return result;
}

// Simple and clear (GOOD - start here)
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Add optimization only if profiling shows it's needed
```

**Why it's bad**: Adds complexity without proven benefit

**Correct approach**: Start simple, optimize only when profiling proves necessary

### Anti-Pattern: Clever Code

**Problem**: Writing "clever" solutions that are hard to understand

```javascript
// Clever (BAD)
const isEven = n => !(n & 1);
const swap = (a, b) => [a, b] = [b, a];
const max = (a, b) => a > b ? a : b;

// Clear (GOOD)
function isEven(number) {
  return number % 2 === 0;
}

function swap(array, indexA, indexB) {
  const temp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = temp;
}

function max(a, b) {
  if (a > b) return a;
  return b;
}
```

**Why it's bad**: Sacrifices readability for cleverness

**Correct approach**: Prefer clarity over cleverness

## File Organization Anti-Patterns

### Anti-Pattern: Touching Excluded Files

**Problem**: Simplifying files that should be skipped

```javascript
// BAD: Simplifying test files when excludePatterns includes "**/*.test.js"
// BAD: Simplifying files in node_modules/
// BAD: Simplifying legacy code marked for exclusion
```

**Why it's bad**: Violates user preferences, may break third-party code

**Correct approach**: Always check exclusion patterns before processing

### Anti-Pattern: Processing Non-Code Files

**Problem**: Attempting to simplify config files, documentation, etc.

```javascript
// BAD: Trying to simplify package.json
// BAD: Trying to simplify .md files
// BAD: Trying to simplify .yaml configs
```

**Why it's bad**: Config files have specific formats that shouldn't be changed

**Correct approach**: Only process source code files

## Quick Anti-Pattern Reference

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Removing abstractions | Loses organization | Keep helpful abstractions |
| Over-DRYing | Premature abstraction | Accept some duplication |
| Excessive one-liners | Hard to debug | Prefer clarity |
| Combining concerns | Poor separation | Single responsibility |
| Changing logic | Breaks functionality | Verify behavior preserved |
| Removing error handling | Introduces bugs | Preserve all checks |
| Ignoring standards | Inconsistency | Follow CLAUDE.md |
| Over-abbreviating | Unclear names | Use full names |
| Removing "why" comments | Loses context | Keep reasoning |
| Clever code | Hard to understand | Prefer clarity |
| Touching excluded files | Violates settings | Check exclusions |

## Validation Checklist

Before applying any simplification, verify:

- [ ] Functionality is preserved (behavior unchanged)
- [ ] Error handling remains intact
- [ ] Edge cases still handled correctly
- [ ] Follows project standards from CLAUDE.md
- [ ] Doesn't violate exclusion patterns
- [ ] Is a source code file (not config/docs)
- [ ] Improves clarity (not just brevity)
- [ ] Maintains helpful abstractions
- [ ] Uses consistent patterns
- [ ] Keeps important "why" comments

Avoiding these anti-patterns ensures safe, effective code simplification that enhances quality without introducing problems.
