# Code Simplification Patterns

Comprehensive catalog of code simplification patterns organized by category.

## Complexity Reduction Patterns

### Pattern: Guard Clauses

**Problem**: Deeply nested conditionals reduce readability

**Solution**: Exit early with guard clauses

```javascript
// Before
function processOrder(order) {
  if (order !== null) {
    if (order.items && order.items.length > 0) {
      if (order.customer && order.customer.active) {
        return calculateTotal(order.items);
      }
    }
  }
  return 0;
}

// After
function processOrder(order) {
  if (!order) return 0;
  if (!order.items || order.items.length === 0) return 0;
  if (!order.customer || !order.customer.active) return 0;
  return calculateTotal(order.items);
}
```

### Pattern: Eliminate Nested Ternaries

**Problem**: Nested ternary operators are hard to parse

**Solution**: Use if/else chains or switch statements

```javascript
// Before
const fee = isPremium ? (isEarly ? 0 : 5) : (isEarly ? 10 : 15);

// After - if/else
function calculateFee(isPremium, isEarly) {
  if (isPremium && isEarly) return 0;
  if (isPremium) return 5;
  if (isEarly) return 10;
  return 15;
}
const fee = calculateFee(isPremium, isEarly);

// After - lookup table (when appropriate)
const FEE_MATRIX = {
  premium_early: 0,
  premium_regular: 5,
  standard_early: 10,
  standard_regular: 15
};
const key = `${isPremium ? 'premium' : 'standard'}_${isEarly ? 'early' : 'regular'}`;
const fee = FEE_MATRIX[key];
```

### Pattern: Flatten Callbacks

**Problem**: Callback nesting creates "pyramid of doom"

**Solution**: Use async/await or Promises

```javascript
// Before
function loadUserData(userId, callback) {
  getUser(userId, (err, user) => {
    if (err) return callback(err);
    getPermissions(user.id, (err, permissions) => {
      if (err) return callback(err);
      getPreferences(user.id, (err, preferences) => {
        if (err) return callback(err);
        callback(null, { user, permissions, preferences });
      });
    });
  });
}

// After
async function loadUserData(userId) {
  const user = await getUser(userId);
  const permissions = await getPermissions(user.id);
  const preferences = await getPreferences(user.id);
  return { user, permissions, preferences };
}
```

### Pattern: Extract Complex Conditionals

**Problem**: Complex boolean expressions are hard to understand

**Solution**: Extract to named variables or functions

```javascript
// Before
if ((user.age >= 18 && user.age < 65 && user.status === 'active') ||
    (user.type === 'premium' && user.verified)) {
  processApplication(user);
}

// After
const isWorkingAge = user.age >= 18 && user.age < 65;
const isActiveUser = user.status === 'active';
const isPremiumVerified = user.type === 'premium' && user.verified;
const isEligible = (isWorkingAge && isActiveUser) || isPremiumVerified;

if (isEligible) {
  processApplication(user);
}

// Or as function
function isEligibleForApplication(user) {
  const isWorkingAge = user.age >= 18 && user.age < 65;
  const isActiveUser = user.status === 'active';
  const isPremiumVerified = user.type === 'premium' && user.verified;
  return (isWorkingAge && isActiveUser) || isPremiumVerified;
}

if (isEligibleForApplication(user)) {
  processApplication(user);
}
```

## Naming Patterns

### Pattern: Intention-Revealing Names

**Problem**: Unclear variable or function names

**Solution**: Use names that reveal purpose and intent

```javascript
// Before
function calc(a, b) {
  return a * b * 0.75;
}
const d = new Date();
const m = d.getMonth();

// After
function calculateDiscountedPrice(originalPrice, quantity) {
  const DISCOUNT_RATE = 0.75;
  return originalPrice * quantity * DISCOUNT_RATE;
}
const currentDate = new Date();
const currentMonth = currentDate.getMonth();
```

### Pattern: Consistent Naming Conventions

**Problem**: Inconsistent naming makes code confusing

**Solution**: Follow standard conventions throughout

```javascript
// Before (inconsistent)
const user_name = 'John';
const UserEmail = 'john@example.com';
const USERPHONE = '555-0100';

// After (consistent camelCase for variables)
const userName = 'John';
const userEmail = 'john@example.com';
const userPhone = '555-0100';
```

### Pattern: Boolean Variable Names

**Problem**: Boolean variables don't indicate true/false nature

**Solution**: Use is/has/can/should prefixes

```javascript
// Before
const admin = true;
const permissions = false;
const visible = checkVisibility();

// After
const isAdmin = true;
const hasPermissions = false;
const isVisible = checkVisibility();
```

## Duplication Elimination Patterns

### Pattern: Extract Repeated Logic

**Problem**: Same logic duplicated multiple times

**Solution**: Extract to shared function

```javascript
// Before
const userName = user && user.profile && user.profile.name || 'Guest';
const userEmail = user && user.profile && user.profile.email || 'unknown@example.com';
const userPhone = user && user.profile && user.profile.phone || 'N/A';

// After
function getUserProperty(user, property, defaultValue) {
  return user?.profile?.[property] || defaultValue;
}

const userName = getUserProperty(user, 'name', 'Guest');
const userEmail = getUserProperty(user, 'email', 'unknown@example.com');
const userPhone = getUserProperty(user, 'phone', 'N/A');
```

### Pattern: Consolidate Similar Functions

**Problem**: Multiple functions with nearly identical logic

**Solution**: Combine with parameters

```javascript
// Before
function validateEmail(email) {
  return email && email.includes('@');
}

function validatePhone(phone) {
  return phone && /^\d{3}-\d{4}$/.test(phone);
}

function validateZipCode(zipCode) {
  return zipCode && /^\d{5}$/.test(zipCode);
}

// After
const VALIDATORS = {
  email: (value) => value && value.includes('@'),
  phone: (value) => value && /^\d{3}-\d{4}$/.test(value),
  zipCode: (value) => value && /^\d{5}$/.test(value)
};

function validate(type, value) {
  const validator = VALIDATORS[type];
  return validator ? validator(value) : false;
}

// Usage
validate('email', 'test@example.com');
validate('phone', '555-0100');
validate('zipCode', '12345');
```

## Magic Number Patterns

### Pattern: Extract to Named Constants

**Problem**: Hardcoded values without explanation

**Solution**: Define named constants

```javascript
// Before
function calculateShipping(weight) {
  if (weight > 50) {
    return weight * 2.5 + 10;
  }
  return weight * 1.5;
}

// After
const HEAVY_PACKAGE_THRESHOLD = 50;
const HEAVY_PACKAGE_RATE = 2.5;
const HEAVY_PACKAGE_BASE_FEE = 10;
const STANDARD_PACKAGE_RATE = 1.5;

function calculateShipping(weight) {
  if (weight > HEAVY_PACKAGE_THRESHOLD) {
    return weight * HEAVY_PACKAGE_RATE + HEAVY_PACKAGE_BASE_FEE;
  }
  return weight * STANDARD_PACKAGE_RATE;
}
```

### Pattern: Configuration Objects

**Problem**: Many related constants scattered throughout code

**Solution**: Group in configuration object

```javascript
// Before
const MAX_LOGIN_ATTEMPTS = 3;
const LOGIN_TIMEOUT_MINUTES = 15;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REQUIRE_SPECIAL = true;

// After
const AUTH_CONFIG = {
  maxLoginAttempts: 3,
  loginTimeoutMinutes: 15,
  password: {
    minLength: 8,
    requireSpecial: true
  }
};

// Usage
if (attempts > AUTH_CONFIG.maxLoginAttempts) {
  lockAccount();
}
```

## Function Length Patterns

### Pattern: Extract Logical Sections

**Problem**: Long functions doing multiple things

**Solution**: Extract sections to named functions

```javascript
// Before
function processOrder(order) {
  // Validate order
  if (!order.items || order.items.length === 0) {
    throw new Error('Order must have items');
  }

  // Calculate totals
  let subtotal = 0;
  for (const item of order.items) {
    subtotal += item.price * item.quantity;
  }
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // Apply discounts
  let discount = 0;
  if (order.customer.isPremium) {
    discount = total * 0.1;
  }

  // Create invoice
  const invoice = {
    items: order.items,
    subtotal,
    tax,
    discount,
    total: total - discount
  };

  return invoice;
}

// After
function processOrder(order) {
  validateOrder(order);
  const subtotal = calculateSubtotal(order.items);
  const tax = calculateTax(subtotal);
  const discount = calculateDiscount(subtotal + tax, order.customer);
  return createInvoice(order.items, subtotal, tax, discount);
}

function validateOrder(order) {
  if (!order.items || order.items.length === 0) {
    throw new Error('Order must have items');
  }
}

function calculateSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateTax(subtotal) {
  const TAX_RATE = 0.08;
  return subtotal * TAX_RATE;
}

function calculateDiscount(total, customer) {
  const PREMIUM_DISCOUNT_RATE = 0.1;
  return customer.isPremium ? total * PREMIUM_DISCOUNT_RATE : 0;
}

function createInvoice(items, subtotal, tax, discount) {
  return {
    items,
    subtotal,
    tax,
    discount,
    total: subtotal + tax - discount
  };
}
```

## Parameter Patterns

### Pattern: Object Parameters

**Problem**: Functions with many parameters

**Solution**: Use object parameter with destructuring

```javascript
// Before
function createUser(name, email, phone, address, city, state, zipCode, country) {
  // Implementation
}

createUser('John', 'john@example.com', '555-0100', '123 Main St', 'Springfield', 'IL', '62701', 'USA');

// After
function createUser({ name, email, phone, address, city, state, zipCode, country }) {
  // Implementation
}

createUser({
  name: 'John',
  email: 'john@example.com',
  phone: '555-0100',
  address: '123 Main St',
  city: 'Springfield',
  state: 'IL',
  zipCode: '62701',
  country: 'USA'
});
```

### Pattern: Default Parameters

**Problem**: Manual default value handling

**Solution**: Use ES6 default parameters

```javascript
// Before
function greet(name) {
  const userName = name || 'Guest';
  console.log(`Hello, ${userName}`);
}

// After
function greet(name = 'Guest') {
  console.log(`Hello, ${name}`);
}
```

## Array and Object Patterns

### Pattern: Modern Iteration Methods

**Problem**: Manual loops for common operations

**Solution**: Use array methods (map, filter, reduce)

```javascript
// Before
const activeUsers = [];
for (let i = 0; i < users.length; i++) {
  if (users[i].active) {
    activeUsers.push(users[i]);
  }
}

const userNames = [];
for (let i = 0; i < activeUsers.length; i++) {
  userNames.push(activeUsers[i].name);
}

// After
const activeUsers = users.filter(user => user.active);
const userNames = activeUsers.map(user => user.name);

// Or chained
const userNames = users
  .filter(user => user.active)
  .map(user => user.name);
```

### Pattern: Destructuring

**Problem**: Verbose object property access

**Solution**: Use destructuring assignment

```javascript
// Before
function displayUser(user) {
  const name = user.name;
  const email = user.email;
  const role = user.role;
  console.log(`${name} (${email}) - ${role}`);
}

// After
function displayUser({ name, email, role }) {
  console.log(`${name} (${email}) - ${role}`);
}

// Or for existing objects
function displayUser(user) {
  const { name, email, role } = user;
  console.log(`${name} (${email}) - ${role}`);
}
```

### Pattern: Spread Operator

**Problem**: Verbose object copying or merging

**Solution**: Use spread operator

```javascript
// Before
const defaultSettings = { theme: 'light', notifications: true };
const userSettings = { theme: 'dark' };
const finalSettings = Object.assign({}, defaultSettings, userSettings);

// After
const defaultSettings = { theme: 'light', notifications: true };
const userSettings = { theme: 'dark' };
const finalSettings = { ...defaultSettings, ...userSettings };
```

## Error Handling Patterns

### Pattern: Early Returns for Error Cases

**Problem**: Try/catch blocks for simple validations

**Solution**: Use early returns with error values

```javascript
// Before
function divide(a, b) {
  try {
    if (b === 0) {
      throw new Error('Division by zero');
    }
    return a / b;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

// After (when appropriate per project standards)
function divide(a, b) {
  if (b === 0) {
    console.error('Division by zero');
    return null;
  }
  return a / b;
}

// Or return error object
function divide(a, b) {
  if (b === 0) {
    return { error: 'Division by zero', value: null };
  }
  return { error: null, value: a / b };
}
```

## Comment Patterns

### Pattern: Remove Obvious Comments

**Problem**: Comments that describe what code does (when it's obvious)

**Solution**: Remove comments, improve code clarity instead

```javascript
// Before
// Loop through all users
for (const user of users) {
  // Check if user is active
  if (user.active) {
    // Send email to user
    sendEmail(user.email);
  }
}

// After (code is self-documenting)
for (const user of users) {
  if (user.active) {
    sendEmail(user.email);
  }
}

// Or more descriptive
const activeUsers = users.filter(user => user.active);
activeUsers.forEach(user => sendEmail(user.email));
```

### Pattern: Keep "Why" Comments

**Problem**: Removing all comments, even helpful ones

**Solution**: Keep comments explaining WHY, remove those explaining WHAT

```javascript
// Good: Keep this comment (explains WHY)
// Use setTimeout to avoid blocking the event loop during heavy computation
setTimeout(() => processLargeDataset(data), 0);

// Bad: Remove this comment (obvious WHAT)
// Add 1 to counter
counter = counter + 1;

// Good: Keep this comment (explains non-obvious WHY)
// Cache miss rate is acceptable because this function is rarely called
const result = expensiveCalculation();

// Bad: Remove this comment (code is self-documenting)
// Return the user's email address
return user.email;
```

## Type Annotation Patterns

### Pattern: Add Explicit Types (TypeScript)

**Problem**: Missing type annotations reduce clarity

**Solution**: Add explicit return types and parameter types

```typescript
// Before
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// After
interface Item {
  price: number;
  quantity: number;
}

function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

## Quick Pattern Reference

| Problem | Pattern | Example |
|---------|---------|---------|
| Deep nesting | Guard clauses | Early returns |
| Nested ternaries | If/else or switch | Multi-branch logic |
| Unclear names | Intention-revealing | `getUserEmail()` not `getUE()` |
| Magic numbers | Named constants | `MAX_RETRIES` not `3` |
| Duplicate logic | Extract function | Shared helper |
| Long functions | Extract sections | Break into smaller functions |
| Many parameters | Object parameter | `{ name, email, ... }` |
| Manual loops | Array methods | `.map()`, `.filter()` |
| Verbose access | Destructuring | `const { name } = user` |
| Callback hell | Async/await | Promise-based flow |
| Obvious comments | Remove | Self-documenting code |

Apply these patterns systematically while preserving functionality and following project standards.
