// Test file for magic number extraction
// Hardcoded numbers should be extracted to named constants

function calculateShipping(weight) {
  if (weight > 50) {
    return weight * 2.5 + 10;
  }
  return weight * 1.5;
}

function validateAge(age) {
  if (age >= 18 && age < 65) {
    return true;
  }
  return false;
}

function calculateDiscount(totalAmount, quantity) {
  if (quantity >= 100) {
    return totalAmount * 0.15;
  }
  if (quantity >= 50) {
    return totalAmount * 0.10;
  }
  if (quantity >= 10) {
    return totalAmount * 0.05;
  }
  return 0;
}

function processPayment(amount) {
  const processingFee = amount * 0.029 + 0.30;
  const maxFee = 5.00;

  if (processingFee > maxFee) {
    return maxFee;
  }
  return processingFee;
}

function validatePassword(password) {
  if (password.length < 8) {
    return { valid: false, error: 'Password too short' };
  }
  if (password.length > 128) {
    return { valid: false, error: 'Password too long' };
  }
  return { valid: true };
}

function calculateTimeout(retryCount) {
  return Math.min(1000 * Math.pow(2, retryCount), 30000);
}

function isBusinessHours(hour) {
  return hour >= 9 && hour < 17;
}

// Expected simplification:
// - Extract 50, 2.5, 10, 1.5 to named constants (e.g., HEAVY_WEIGHT_THRESHOLD, HEAVY_RATE)
// - Extract 18, 65 to WORKING_AGE_MIN, WORKING_AGE_MAX
// - Extract discount rates and thresholds to constants
// - Extract 0.029, 0.30, 5.00 to payment processing constants
// - Extract 8, 128 to PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH
// - Extract 1000, 2, 30000 to retry constants
// - Extract 9, 17 to BUSINESS_HOURS_START, BUSINESS_HOURS_END
