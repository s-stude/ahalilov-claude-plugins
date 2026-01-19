# Ternary Operator Examples

Before and after examples of converting nested ternary operators to more readable alternatives.

## Example 1: Access Level Determination

### Before
```javascript
const access = isAdmin ? 'full' : (isModerator ? 'moderate' : (isUser ? 'limited' : 'none'));
```

### After (if/else)
```javascript
function determineAccess(isAdmin, isModerator, isUser) {
  if (isAdmin) return 'full';
  if (isModerator) return 'moderate';
  if (isUser) return 'limited';
  return 'none';
}

const access = determineAccess(isAdmin, isModerator, isUser);
```

### After (switch-like object)
```javascript
const ACCESS_LEVELS = {
  admin: 'full',
  moderator: 'moderate',
  user: 'limited',
  guest: 'none'
};

function getUserRole(isAdmin, isModerator, isUser) {
  if (isAdmin) return 'admin';
  if (isModerator) return 'moderator';
  if (isUser) return 'user';
  return 'guest';
}

const role = getUserRole(isAdmin, isModerator, isUser);
const access = ACCESS_LEVELS[role];
```

**Improvements:**
- Nested ternaries eliminated
- Clear hierarchical logic
- Easy to add new access levels
- Self-documenting code

## Example 2: Fee Calculation

### Before
```javascript
const fee = isPremium ? (isEarlyBird ? 0 : (isStandard ? 5 : 10)) : (isEarlyBird ? 10 : (isStandard ? 15 : 20));
```

### After (function with if/else)
```javascript
function calculateFee(isPremium, isEarlyBird, isStandard) {
  if (isPremium) {
    if (isEarlyBird) return 0;
    if (isStandard) return 5;
    return 10;
  }

  if (isEarlyBird) return 10;
  if (isStandard) return 15;
  return 20;
}

const fee = calculateFee(isPremium, isEarlyBird, isStandard);
```

### After (lookup table)
```javascript
const FEE_TABLE = {
  premium: { earlyBird: 0, standard: 5, late: 10 },
  regular: { earlyBird: 10, standard: 15, late: 20 }
};

function getRegistrationType(isEarlyBird, isStandard) {
  if (isEarlyBird) return 'earlyBird';
  if (isStandard) return 'standard';
  return 'late';
}

const tier = isPremium ? 'premium' : 'regular';
const registrationType = getRegistrationType(isEarlyBird, isStandard);
const fee = FEE_TABLE[tier][registrationType];
```

**Improvements:**
- Matrix logic is explicit
- Easy to modify fee structure
- Centralized fee configuration
- Type-safe structure

## Example 3: Status Message

### Before
```javascript
const message = error ? 'Error occurred' : (loading ? 'Loading...' : (data ? 'Success' : 'No data'));
```

### After
```javascript
function getStatusMessage({ error, loading, data }) {
  if (error) return 'Error occurred';
  if (loading) return 'Loading...';
  if (data) return 'Success';
  return 'No data';
}

const message = getStatusMessage({ error, loading, data });
```

**Improvements:**
- Clear priority: error → loading → data → empty
- Object parameter for clarity
- Easy to add new states
- Testable function

## Example 4: Color Selection

### Before
```javascript
const color = isError ? 'red' : (isWarning ? 'yellow' : (isSuccess ? 'green' : (isInfo ? 'blue' : 'gray')));
```

### After (switch statement)
```javascript
function getStatusColor(status) {
  switch (status) {
    case 'error':
      return 'red';
    case 'warning':
      return 'yellow';
    case 'success':
      return 'green';
    case 'info':
      return 'blue';
    default:
      return 'gray';
  }
}

function determineStatus({ isError, isWarning, isSuccess, isInfo }) {
  if (isError) return 'error';
  if (isWarning) return 'warning';
  if (isSuccess) return 'success';
  if (isInfo) return 'info';
  return 'default';
}

const status = determineStatus({ isError, isWarning, isSuccess, isInfo });
const color = getStatusColor(status);
```

### After (object lookup)
```javascript
const STATUS_COLORS = {
  error: 'red',
  warning: 'yellow',
  success: 'green',
  info: 'blue',
  default: 'gray'
};

function determineStatus({ isError, isWarning, isSuccess, isInfo }) {
  if (isError) return 'error';
  if (isWarning) return 'warning';
  if (isSuccess) return 'success';
  if (isInfo) return 'info';
  return 'default';
}

const status = determineStatus({ isError, isWarning, isSuccess, isInfo });
const color = STATUS_COLORS[status];
```

**Improvements:**
- Centralized color mapping
- Easy to modify or extend
- Reusable status determination
- Clear separation of concerns

## Example 5: Price Calculation with Multiple Conditions

### Before
```javascript
const price = quantity > 100 ? (isPremium ? basePrice * 0.7 : basePrice * 0.8) : (quantity > 50 ? (isPremium ? basePrice * 0.8 : basePrice * 0.9) : basePrice);
```

### After
```javascript
function calculatePrice(basePrice, quantity, isPremium) {
  const BULK_THRESHOLD = 100;
  const MEDIUM_THRESHOLD = 50;

  if (quantity > BULK_THRESHOLD) {
    return isPremium ? basePrice * 0.7 : basePrice * 0.8;
  }

  if (quantity > MEDIUM_THRESHOLD) {
    return isPremium ? basePrice * 0.8 : basePrice * 0.9;
  }

  return basePrice;
}

const price = calculatePrice(basePrice, quantity, isPremium);
```

### After (with discount table)
```javascript
const DISCOUNT_RATES = {
  bulk_premium: 0.7,
  bulk_standard: 0.8,
  medium_premium: 0.8,
  medium_standard: 0.9,
  base: 1.0
};

function getDiscountKey(quantity, isPremium) {
  const tier = isPremium ? 'premium' : 'standard';

  if (quantity > 100) return `bulk_${tier}`;
  if (quantity > 50) return `medium_${tier}`;
  return 'base';
}

const discountKey = getDiscountKey(quantity, isPremium);
const price = basePrice * DISCOUNT_RATES[discountKey];
```

**Improvements:**
- Discount rates are centralized
- Named thresholds for clarity
- Easy to add new tiers
- Calculation logic is separated from rate definition

## Example 6: User Role Assignment

### Before
```javascript
const role = age >= 65 ? 'senior' : (age >= 18 ? (isStudent ? 'student' : (isEmployed ? 'professional' : 'adult')) : (age >= 13 ? 'teen' : 'child'));
```

### After
```javascript
function assignRole(age, isStudent, isEmployed) {
  if (age >= 65) return 'senior';

  if (age >= 18) {
    if (isStudent) return 'student';
    if (isEmployed) return 'professional';
    return 'adult';
  }

  if (age >= 13) return 'teen';

  return 'child';
}

const role = assignRole(age, isStudent, isEmployed);
```

**Improvements:**
- Clear age hierarchy
- Nested adult categorization is explicit
- Easy to add new age brackets or categories
- Readable and maintainable

## Example 7: Configuration Selection

### Before
```javascript
const config = env === 'production' ? prodConfig : (env === 'staging' ? stagingConfig : (env === 'development' ? devConfig : defaultConfig));
```

### After (object lookup)
```javascript
const CONFIGS = {
  production: prodConfig,
  staging: stagingConfig,
  development: devConfig
};

const config = CONFIGS[env] || defaultConfig;
```

### After (with validation)
```javascript
const VALID_ENVIRONMENTS = {
  production: prodConfig,
  staging: stagingConfig,
  development: devConfig
};

function getConfig(environment) {
  if (!VALID_ENVIRONMENTS[environment]) {
    console.warn(`Unknown environment: ${environment}, using default`);
    return defaultConfig;
  }

  return VALID_ENVIRONMENTS[environment];
}

const config = getConfig(env);
```

**Improvements:**
- Declarative configuration mapping
- Easy to add new environments
- Validation and warning for unknown environments
- No complex conditionals

## When Simple Ternaries Are OK

Not all ternaries should be eliminated. Simple, non-nested ternaries are perfectly fine:

```javascript
// Good: Simple, single-level ternary
const label = isActive ? 'Active' : 'Inactive';
const icon = hasError ? '❌' : '✅';
const className = isSelected ? 'selected' : 'default';

// Good: Clear conditional assignment
const max = a > b ? a : b;
const greeting = hour < 12 ? 'Good morning' : 'Good afternoon';
```

**Rule of thumb**: If the ternary fits on one line and is immediately clear, keep it. If it requires thought to parse or spans multiple conditions, convert to if/else or lookup table.

## Key Takeaways

1. **Nested ternaries are hard to read**: Always prefer alternatives
2. **Use if/else for sequential logic**: Clear flow with early returns
3. **Use switch for enum-like values**: Good for status, type, category
4. **Use lookup tables for mappings**: Best for configuration, rates, colors
5. **Extract to functions**: Name the logic for clarity
6. **Simple ternaries are fine**: Don't over-engineer simple cases
