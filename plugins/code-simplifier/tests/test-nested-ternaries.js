// Test file for nested ternary simplification
// These should be converted to if/else chains or switch statements

// Example 1: Access level determination
const access = isAdmin ? 'full' : (isModerator ? 'moderate' : (isUser ? 'limited' : 'none'));

// Example 2: Fee calculation with multiple conditions
const fee = isPremium ? (isEarlyBird ? 0 : (isStandard ? 5 : 10)) : (isEarlyBird ? 10 : (isStandard ? 15 : 20));

// Example 3: Status message
const message = error ? 'Error occurred' : (loading ? 'Loading...' : (data ? 'Success' : 'No data'));

// Example 4: Color selection
const color = isError ? 'red' : (isWarning ? 'yellow' : (isSuccess ? 'green' : (isInfo ? 'blue' : 'gray')));

// Example 5: Price calculation
const price = quantity > 100 ? (isPremium ? basePrice * 0.7 : basePrice * 0.8) : (quantity > 50 ? (isPremium ? basePrice * 0.8 : basePrice * 0.9) : basePrice);

// Example 6: User role assignment
const role = age >= 65 ? 'senior' : (age >= 18 ? (isStudent ? 'student' : (isEmployed ? 'professional' : 'adult')) : (age >= 13 ? 'teen' : 'child'));

// Example 7: Configuration selection
const config = env === 'production' ? prodConfig : (env === 'staging' ? stagingConfig : (env === 'development' ? devConfig : defaultConfig));

// Expected simplification:
// - Convert nested ternaries to if/else chains or functions
// - Extract to named functions where appropriate
// - Use switch statements for enum-like values
// - Use lookup tables for mappings
// - Improve readability dramatically
