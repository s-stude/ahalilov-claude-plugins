# Function Extraction Examples

Before and after examples of eliminating duplication through function extraction.

## Example 1: Duplicate Property Access

### Before
```javascript
const userName = user && user.profile && user.profile.name || 'Guest';
const userEmail = user && user.profile && user.profile.email || 'unknown@example.com';
const userPhone = user && user.profile && user.profile.phone || 'N/A';
const userAddress = user && user.profile && user.profile.address || 'No address';
```

### After
```javascript
function getUserProperty(user, property, defaultValue) {
  return user?.profile?.[property] || defaultValue;
}

const userName = getUserProperty(user, 'name', 'Guest');
const userEmail = getUserProperty(user, 'email', 'unknown@example.com');
const userPhone = getUserProperty(user, 'phone', 'N/A');
const userAddress = getUserProperty(user, 'address', 'No address');
```

**Improvements:**
- Centralized null-checking logic
- Uses optional chaining
- Consistent default value handling
- Reusable across codebase

## Example 2: Duplicate Validation Logic

### Before
```javascript
function validateUser(user) {
  if (!user.email || user.email.trim() === '') {
    return { valid: false, error: 'Email is required' };
  }

  if (!user.name || user.name.trim() === '') {
    return { valid: false, error: 'Name is required' };
  }

  if (!user.phone || user.phone.trim() === '') {
    return { valid: false, error: 'Phone is required' };
  }

  return { valid: true };
}
```

### After
```javascript
function validateRequired(value, fieldName) {
  if (!value || value.trim() === '') {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true };
}

function validateUser(user) {
  const emailValidation = validateRequired(user.email, 'Email');
  if (!emailValidation.valid) return emailValidation;

  const nameValidation = validateRequired(user.name, 'Name');
  if (!nameValidation.valid) return nameValidation;

  const phoneValidation = validateRequired(user.phone, 'Phone');
  if (!phoneValidation.valid) return phoneValidation;

  return { valid: true };
}
```

### After (alternative with array)
```javascript
function validateRequired(value, fieldName) {
  if (!value || value.trim() === '') {
    return { valid: false, error: `${fieldName} is required` };
  }
  return null; // null means no error
}

function validateUser(user) {
  const requiredFields = [
    { value: user.email, name: 'Email' },
    { value: user.name, name: 'Name' },
    { value: user.phone, name: 'Phone' }
  ];

  for (const field of requiredFields) {
    const error = validateRequired(field.value, field.name);
    if (error) return error;
  }

  return { valid: true };
}
```

**Improvements:**
- Single source of truth for required field validation
- Easy to add new validation rules
- Consistent error messages
- More testable

## Example 3: Duplicate Formatting Logic

### Before
```javascript
function formatUserCard(user) {
  const name = user.name.toUpperCase();
  const email = user.email.toLowerCase();
  const joined = new Date(user.joinedAt).toLocaleDateString();

  return `${name} | ${email} | Joined: ${joined}`;
}

function formatAdminCard(admin) {
  const name = admin.name.toUpperCase();
  const email = admin.email.toLowerCase();
  const joined = new Date(admin.joinedAt).toLocaleDateString();

  return `ADMIN: ${name} | ${email} | Joined: ${joined}`;
}

function formatModeratorCard(moderator) {
  const name = moderator.name.toUpperCase();
  const email = moderator.email.toLowerCase();
  const joined = new Date(moderator.joinedAt).toLocaleDateString();

  return `MOD: ${name} | ${email} | Joined: ${joined}`;
}
```

### After
```javascript
function formatPersonData(person) {
  return {
    name: person.name.toUpperCase(),
    email: person.email.toLowerCase(),
    joined: new Date(person.joinedAt).toLocaleDateString()
  };
}

function formatUserCard(user) {
  const { name, email, joined } = formatPersonData(user);
  return `${name} | ${email} | Joined: ${joined}`;
}

function formatAdminCard(admin) {
  const { name, email, joined } = formatPersonData(admin);
  return `ADMIN: ${name} | ${email} | Joined: ${joined}`;
}

function formatModeratorCard(moderator) {
  const { name, email, joined } = formatPersonData(moderator);
  return `MOD: ${name} | ${email} | Joined: ${joined}`;
}
```

### After (alternative with role parameter)
```javascript
function formatPersonData(person) {
  return {
    name: person.name.toUpperCase(),
    email: person.email.toLowerCase(),
    joined: new Date(person.joinedAt).toLocaleDateString()
  };
}

function formatCard(person, rolePrefix = '') {
  const { name, email, joined } = formatPersonData(person);
  const prefix = rolePrefix ? `${rolePrefix}: ` : '';
  return `${prefix}${name} | ${email} | Joined: ${joined}`;
}

function formatUserCard(user) {
  return formatCard(user);
}

function formatAdminCard(admin) {
  return formatCard(admin, 'ADMIN');
}

function formatModeratorCard(moderator) {
  return formatCard(moderator, 'MOD');
}
```

**Improvements:**
- Centralized formatting logic
- Consistent data transformation
- Easy to modify format rules
- Optional: further consolidation with role parameter

## Example 4: Duplicate API Call Patterns

### Before
```javascript
async function getUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

async function getProduct(id) {
  try {
    const response = await fetch(`/api/products/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

async function getOrder(id) {
  try {
    const response = await fetch(`/api/orders/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}
```

### After
```javascript
async function apiGet(endpoint) {
  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

async function getUser(id) {
  return apiGet(`/api/users/${id}`);
}

async function getProduct(id) {
  return apiGet(`/api/products/${id}`);
}

async function getOrder(id) {
  return apiGet(`/api/orders/${id}`);
}
```

**Improvements:**
- Single error handling pattern
- Consistent response structure
- Easy to add logging, caching, or retry logic
- Reduced code duplication by 70%

## Example 5: Duplicate Calculation Logic

### Before
```javascript
function calculateUserScore(user) {
  let score = 0;

  if (user.posts > 0) {
    score += user.posts * 10;
  }

  if (user.comments > 0) {
    score += user.comments * 5;
  }

  if (user.likes > 0) {
    score += user.likes * 2;
  }

  return score;
}

function calculateTeamScore(team) {
  let score = 0;

  if (team.projects > 0) {
    score += team.projects * 100;
  }

  if (team.meetings > 0) {
    score += team.meetings * 50;
  }

  if (team.reviews > 0) {
    score += team.reviews * 25;
  }

  return score;
}
```

### After
```javascript
function calculateWeightedScore(metrics, weights) {
  return Object.keys(weights).reduce((score, key) => {
    const value = metrics[key] || 0;
    const weight = weights[key];
    return score + (value * weight);
  }, 0);
}

const USER_SCORE_WEIGHTS = {
  posts: 10,
  comments: 5,
  likes: 2
};

const TEAM_SCORE_WEIGHTS = {
  projects: 100,
  meetings: 50,
  reviews: 25
};

function calculateUserScore(user) {
  return calculateWeightedScore(user, USER_SCORE_WEIGHTS);
}

function calculateTeamScore(team) {
  return calculateWeightedScore(team, TEAM_SCORE_WEIGHTS);
}
```

**Improvements:**
- Centralized weighted scoring algorithm
- Configuration separated from logic
- Easy to modify weights
- Reusable for any weighted calculation

## Example 6: Duplicate State Update Logic

### Before
```javascript
function updateUserStatus(userId, status) {
  const user = users.find(u => u.id === userId);
  if (!user) {
    console.error(`User ${userId} not found`);
    return false;
  }

  user.status = status;
  user.updatedAt = Date.now();
  notifyObservers('user', userId);
  return true;
}

function updateProductStatus(productId, status) {
  const product = products.find(p => p.id === productId);
  if (!product) {
    console.error(`Product ${productId} not found`);
    return false;
  }

  product.status = status;
  product.updatedAt = Date.now();
  notifyObservers('product', productId);
  return true;
}

function updateOrderStatus(orderId, status) {
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    console.error(`Order ${orderId} not found`);
    return false;
  }

  order.status = status;
  order.updatedAt = Date.now();
  notifyObservers('order', orderId);
  return true;
}
```

### After
```javascript
function updateEntityStatus(collection, entityType, entityId, status) {
  const entity = collection.find(item => item.id === entityId);

  if (!entity) {
    console.error(`${entityType} ${entityId} not found`);
    return false;
  }

  entity.status = status;
  entity.updatedAt = Date.now();
  notifyObservers(entityType, entityId);
  return true;
}

function updateUserStatus(userId, status) {
  return updateEntityStatus(users, 'User', userId, status);
}

function updateProductStatus(productId, status) {
  return updateEntityStatus(products, 'Product', productId, status);
}

function updateOrderStatus(orderId, status) {
  return updateEntityStatus(orders, 'Order', orderId, status);
}
```

**Improvements:**
- Centralized update logic
- Consistent error handling and logging
- Automatic timestamp updates
- Single place to add logging, validation, etc.

## Example 7: Duplicate Array Processing

### Before
```javascript
const activeUsers = [];
for (const user of users) {
  if (user.active && user.verified) {
    activeUsers.push(user);
  }
}

const activeProducts = [];
for (const product of products) {
  if (product.active && product.verified) {
    activeProducts.push(product);
  }
}

const activeOrders = [];
for (const order of orders) {
  if (order.active && order.verified) {
    activeOrders.push(order);
  }
}
```

### After
```javascript
function filterActiveAndVerified(items) {
  return items.filter(item => item.active && item.verified);
}

const activeUsers = filterActiveAndVerified(users);
const activeProducts = filterActiveAndVerified(products);
const activeOrders = filterActiveAndVerified(orders);
```

### After (more flexible)
```javascript
function filterByProperties(items, conditions) {
  return items.filter(item => {
    return Object.keys(conditions).every(key => item[key] === conditions[key]);
  });
}

const activeAndVerifiedConditions = { active: true, verified: true };

const activeUsers = filterByProperties(users, activeAndVerifiedConditions);
const activeProducts = filterByProperties(products, activeAndVerifiedConditions);
const activeOrders = filterByProperties(orders, activeAndVerifiedConditions);
```

**Improvements:**
- Eliminates manual loops
- Centralized filtering logic
- Flexible condition matching
- Declarative filtering

## When NOT to Extract

Not all duplication warrants extraction. Avoid extraction when:

### 1. The duplication is coincidental

```javascript
// These look similar but serve different purposes
function calculateTax(amount) {
  return amount * 0.08;
}

function calculateDiscount(amount) {
  return amount * 0.08;
}

// Don't extract: The 0.08 values represent different things
// If tax rate changes, discount shouldn't change
```

### 2. Extraction adds more complexity

```javascript
// Before (clear)
const firstName = user.firstName || 'John';
const lastName = user.lastName || 'Doe';

// After (over-engineered)
function getWithDefault(value, defaultValue) {
  return value || defaultValue;
}

const firstName = getWithDefault(user.firstName, 'John');
const lastName = getWithDefault(user.lastName, 'Doe');

// The extraction doesn't add value for such simple cases
```

### 3. The duplication is in tests

```javascript
// Test duplication is often acceptable and aids clarity
test('validates email', () => {
  expect(validateEmail('test@example.com')).toBe(true);
});

test('rejects invalid email', () => {
  expect(validateEmail('invalid')).toBe(false);
});

// Each test is clear and independent
```

## Key Takeaways

1. **Extract when logic is identical**: Same pattern repeated 3+ times
2. **Centralize for maintainability**: Single source of truth
3. **Name extracted functions well**: Reveal intent clearly
4. **Consider configuration**: Separate data from logic
5. **Don't over-extract**: Balance DRY with clarity
6. **Test extracted functions**: Make them independently testable
