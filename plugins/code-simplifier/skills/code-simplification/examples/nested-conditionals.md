# Nested Conditionals Examples

Before and after examples of simplifying nested conditional statements using guard clauses.

## Example 1: User Validation

### Before
```javascript
function validateUser(user) {
  if (user) {
    if (user.email) {
      if (user.email.includes('@')) {
        if (user.age) {
          if (user.age >= 18) {
            return { valid: true };
          } else {
            return { valid: false, error: 'User must be 18 or older' };
          }
        } else {
          return { valid: false, error: 'Age is required' };
        }
      } else {
        return { valid: false, error: 'Invalid email format' };
      }
    } else {
      return { valid: false, error: 'Email is required' };
    }
  } else {
    return { valid: false, error: 'User object is required' };
  }
}
```

### After
```javascript
function validateUser(user) {
  if (!user) {
    return { valid: false, error: 'User object is required' };
  }

  if (!user.email) {
    return { valid: false, error: 'Email is required' };
  }

  if (!user.email.includes('@')) {
    return { valid: false, error: 'Invalid email format' };
  }

  if (!user.age) {
    return { valid: false, error: 'Age is required' };
  }

  if (user.age < 18) {
    return { valid: false, error: 'User must be 18 or older' };
  }

  return { valid: true };
}
```

**Improvements:**
- Reduced nesting from 6 levels to 1 level
- Each validation is clear and isolated
- Easy to add new validations
- Easier to test individual conditions

## Example 2: Order Processing

### Before
```javascript
function processOrder(order) {
  if (order) {
    if (order.items && order.items.length > 0) {
      if (order.customer) {
        if (order.customer.active) {
          if (order.paymentMethod) {
            if (order.shippingAddress) {
              return submitOrder(order);
            }
          }
        }
      }
    }
  }
  return null;
}
```

### After
```javascript
function processOrder(order) {
  if (!order) return null;
  if (!order.items || order.items.length === 0) return null;
  if (!order.customer) return null;
  if (!order.customer.active) return null;
  if (!order.paymentMethod) return null;
  if (!order.shippingAddress) return null;

  return submitOrder(order);
}
```

**Improvements:**
- Reduced from 7 levels of nesting to 1 level
- Happy path is at the end, clearly visible
- Each precondition is explicit
- Easy to modify or add conditions

## Example 3: Permission Check

### Before
```javascript
function checkAccess(user, resource) {
  if (user) {
    if (user.authenticated) {
      if (user.roles) {
        if (user.roles.includes('admin')) {
          return true;
        } else {
          if (resource.ownerId === user.id) {
            return true;
          } else {
            if (user.permissions) {
              if (user.permissions.includes(`read:${resource.type}`)) {
                return true;
              }
            }
          }
        }
      }
    }
  }
  return false;
}
```

### After
```javascript
function checkAccess(user, resource) {
  if (!user || !user.authenticated) return false;

  // Admin has full access
  if (user.roles?.includes('admin')) return true;

  // Owner has access
  if (resource.ownerId === user.id) return true;

  // Check specific permission
  const hasPermission = user.permissions?.includes(`read:${resource.type}`);
  return hasPermission || false;
}
```

**Improvements:**
- Reduced nesting significantly
- Logical flow is clear (admin → owner → permission)
- Used optional chaining for cleaner checks
- Comments explain each access level

## Example 4: Data Processing

### Before
```javascript
function getData(id) {
  if (id) {
    const cached = cache.get(id);
    if (cached) {
      if (cached.timestamp > Date.now() - 3600000) {
        return cached.data;
      } else {
        cache.delete(id);
        const fresh = fetch(id);
        if (fresh) {
          cache.set(id, { data: fresh, timestamp: Date.now() });
          return fresh;
        }
      }
    } else {
      const fresh = fetch(id);
      if (fresh) {
        cache.set(id, { data: fresh, timestamp: Date.now() });
        return fresh;
      }
    }
  }
  return null;
}
```

### After
```javascript
function getData(id) {
  if (!id) return null;

  const cached = cache.get(id);
  if (cached) {
    const ONE_HOUR = 3600000;
    const isCacheValid = cached.timestamp > Date.now() - ONE_HOUR;

    if (isCacheValid) {
      return cached.data;
    }

    cache.delete(id);
  }

  const fresh = fetch(id);
  if (!fresh) return null;

  cache.set(id, {
    data: fresh,
    timestamp: Date.now()
  });

  return fresh;
}
```

**Improvements:**
- Eliminated duplicate cache setting logic
- Named magic number (ONE_HOUR)
- Clear cache validation logic
- Removed unnecessary nesting

## Example 5: Form Validation

### Before
```javascript
function validateForm(formData) {
  if (formData.username) {
    if (formData.username.length >= 3) {
      if (formData.email) {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          if (formData.password) {
            if (formData.password.length >= 8) {
              if (formData.password === formData.confirmPassword) {
                return { valid: true };
              } else {
                return { valid: false, field: 'confirmPassword', error: 'Passwords do not match' };
              }
            } else {
              return { valid: false, field: 'password', error: 'Password must be at least 8 characters' };
            }
          } else {
            return { valid: false, field: 'password', error: 'Password is required' };
          }
        } else {
          return { valid: false, field: 'email', error: 'Invalid email format' };
        }
      } else {
        return { valid: false, field: 'email', error: 'Email is required' };
      }
    } else {
      return { valid: false, field: 'username', error: 'Username must be at least 3 characters' };
    }
  } else {
    return { valid: false, field: 'username', error: 'Username is required' };
  }
}
```

### After
```javascript
function validateForm(formData) {
  const MIN_USERNAME_LENGTH = 3;
  const MIN_PASSWORD_LENGTH = 8;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formData.username) {
    return { valid: false, field: 'username', error: 'Username is required' };
  }

  if (formData.username.length < MIN_USERNAME_LENGTH) {
    return { valid: false, field: 'username', error: 'Username must be at least 3 characters' };
  }

  if (!formData.email) {
    return { valid: false, field: 'email', error: 'Email is required' };
  }

  if (!EMAIL_REGEX.test(formData.email)) {
    return { valid: false, field: 'email', error: 'Invalid email format' };
  }

  if (!formData.password) {
    return { valid: false, field: 'password', error: 'Password is required' };
  }

  if (formData.password.length < MIN_PASSWORD_LENGTH) {
    return { valid: false, field: 'password', error: 'Password must be at least 8 characters' };
  }

  if (formData.password !== formData.confirmPassword) {
    return { valid: false, field: 'confirmPassword', error: 'Passwords do not match' };
  }

  return { valid: true };
}
```

**Improvements:**
- Extracted magic numbers to constants
- Extracted regex to named constant
- Each validation is isolated and clear
- Easy to reorder or modify validations
- Consistent error structure

## Key Takeaways

1. **Exit early**: Check error conditions first and return immediately
2. **Reduce nesting**: Each level of nesting increases cognitive load
3. **One condition per check**: Don't combine multiple checks in one if statement
4. **Name magic values**: Extract constants for clarity
5. **Consistent structure**: Use same pattern throughout
