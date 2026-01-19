// Test file for nested conditional simplification
// This file should be simplified using guard clauses

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

// Expected simplification:
// - Convert to guard clauses with early returns
// - Reduce nesting from 5-7 levels to 1 level
// - Preserve exact functionality
// - Each condition should be isolated and clear
