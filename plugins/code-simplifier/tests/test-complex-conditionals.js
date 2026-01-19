// Test file for complex boolean expression simplification
// These should be extracted to named variables or functions

function canApproveApplication(user, application) {
  if ((user.age >= 18 && user.age < 65 && user.status === 'active') ||
      (user.type === 'premium' && user.verified)) {
    return true;
  }
  return false;
}

function isEligibleForDiscount(customer, order) {
  if ((customer.isPremium && order.total > 100) ||
      (customer.purchaseCount > 10 && order.total > 50) ||
      (customer.referralCode && order.isFirstPurchase)) {
    return true;
  }
  return false;
}

function shouldSendNotification(user, event) {
  if (user.notifications.enabled &&
      !user.notifications.muted &&
      (event.priority === 'high' || event.category === 'security') &&
      (user.preferences.email || user.preferences.sms)) {
    return true;
  }
  return false;
}

function hasPermission(user, action, resource) {
  if ((user.role === 'admin') ||
      (user.role === 'moderator' && action !== 'delete') ||
      (resource.ownerId === user.id && action === 'read') ||
      (user.permissions && user.permissions.includes(`${action}:${resource.type}`))) {
    return true;
  }
  return false;
}

function isValidRequest(request) {
  if (request.method === 'POST' &&
      request.headers['content-type'] === 'application/json' &&
      request.body &&
      request.body.data &&
      request.body.data.length > 0 &&
      request.authenticated &&
      request.rateLimit.remaining > 0) {
    return true;
  }
  return false;
}

// Expected simplification:
// - Extract complex conditions to named variables
// - Break down compound conditions into logical parts
// - Use descriptive names for boolean expressions
// - Improve readability significantly
// Example:
//   const isWorkingAge = user.age >= 18 && user.age < 65;
//   const isActiveUser = user.status === 'active';
//   const isPremiumVerified = user.type === 'premium' && user.verified;
//   return (isWorkingAge && isActiveUser) || isPremiumVerified;
