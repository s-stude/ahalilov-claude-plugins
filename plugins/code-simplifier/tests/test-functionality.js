// Test file for functionality preservation
// After simplification, run this file to verify behavior is unchanged
// Usage: node test-functionality.js

// Test 1: Nested conditionals (should be simplified to guard clauses)
function calculateDiscount(user, amount) {
  if (user) {
    if (user.isPremium) {
      if (amount > 100) {
        return amount * 0.2;
      } else {
        return amount * 0.1;
      }
    } else {
      if (amount > 100) {
        return amount * 0.05;
      }
    }
  }
  return 0;
}

// Test 2: Nested ternary (should be simplified to if/else)
function getAccessLevel(isAdmin, isModerator) {
  return isAdmin ? 'full' : (isModerator ? 'moderate' : 'limited');
}

// Test 3: Magic numbers (should extract to constants)
function isValidAge(age) {
  return age >= 18 && age <= 120;
}

// Test assertions
function assert(condition, message) {
  if (!condition) {
    console.error('❌ FAILED:', message);
    process.exit(1);
  } else {
    console.log('✅ PASSED:', message);
  }
}

// Run tests
console.log('Running functionality tests...\n');

// Test calculateDiscount
assert(calculateDiscount(null, 100) === 0, 'Null user returns 0');
assert(calculateDiscount({}, 100) === 0, 'Non-premium user with amount ≤ 100 returns 0');
assert(calculateDiscount({ isPremium: false }, 150) === 7.5, 'Non-premium user with amount > 100 returns 5% discount');
assert(calculateDiscount({ isPremium: true }, 50) === 5, 'Premium user with amount ≤ 100 returns 10% discount');
assert(calculateDiscount({ isPremium: true }, 150) === 30, 'Premium user with amount > 100 returns 20% discount');

// Test getAccessLevel
assert(getAccessLevel(true, false) === 'full', 'Admin gets full access');
assert(getAccessLevel(false, true) === 'moderate', 'Moderator gets moderate access');
assert(getAccessLevel(false, false) === 'limited', 'Regular user gets limited access');

// Test isValidAge
assert(isValidAge(17) === false, 'Age 17 is invalid');
assert(isValidAge(18) === true, 'Age 18 is valid');
assert(isValidAge(65) === true, 'Age 65 is valid');
assert(isValidAge(120) === true, 'Age 120 is valid');
assert(isValidAge(121) === false, 'Age 121 is invalid');

console.log('\n✅ All tests passed! Functionality preserved after simplification.');
