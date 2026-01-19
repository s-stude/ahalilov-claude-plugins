// Test file for array and loop pattern simplification
// Manual loops should be converted to array methods where appropriate

// Example 1: Filtering with manual loop
function getActiveUsers(users) {
  const active = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].active) {
      active.push(users[i]);
    }
  }
  return active;
}

// Example 2: Mapping with manual loop
function getUserNames(users) {
  const names = [];
  for (let i = 0; i < users.length; i++) {
    names.push(users[i].name);
  }
  return names;
}

// Example 3: Reducing with manual loop
function calculateTotalPrice(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}

// Example 4: Filter and map combined
function getActiveUserEmails(users) {
  const emails = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].active && users[i].verified) {
      emails.push(users[i].email);
    }
  }
  return emails;
}

// Example 5: Finding with manual loop
function findUserById(users, id) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      return users[i];
    }
  }
  return null;
}

// Example 6: Checking existence
function hasAdminUser(users) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].role === 'admin') {
      return true;
    }
  }
  return false;
}

// Example 7: All match condition
function allUsersVerified(users) {
  for (let i = 0; i < users.length; i++) {
    if (!users[i].verified) {
      return false;
    }
  }
  return true;
}

// Example 8: Grouping
function groupUsersByRole(users) {
  const groups = {};
  for (let i = 0; i < users.length; i++) {
    const role = users[i].role;
    if (!groups[role]) {
      groups[role] = [];
    }
    groups[role].push(users[i]);
  }
  return groups;
}

// Expected simplification:
// - Convert manual filter loops to .filter()
// - Convert manual map loops to .map()
// - Convert manual reduce loops to .reduce()
// - Convert combined operations to chained methods
// - Convert find loops to .find()
// - Convert existence checks to .some()
// - Convert all-match checks to .every()
// - Consider .reduce() for grouping
// - Use descriptive arrow function parameters
