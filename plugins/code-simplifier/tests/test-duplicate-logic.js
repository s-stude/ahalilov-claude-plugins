// Test file for duplicate logic extraction
// Repeated patterns should be extracted to shared functions

// Example 1: Duplicate property access with null checking
const userName = user && user.profile && user.profile.name || 'Guest';
const userEmail = user && user.profile && user.profile.email || 'unknown@example.com';
const userPhone = user && user.profile && user.profile.phone || 'N/A';
const userAddress = user && user.profile && user.profile.address || 'No address';

// Example 2: Duplicate validation logic
function validateEmail(email) {
  if (!email || email.trim() === '') {
    return { valid: false, error: 'Email is required' };
  }
  return { valid: true };
}

function validateName(name) {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'Name is required' };
  }
  return { valid: true };
}

function validatePhone(phone) {
  if (!phone || phone.trim() === '') {
    return { valid: false, error: 'Phone is required' };
  }
  return { valid: true };
}

// Example 3: Duplicate formatting
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

// Example 4: Duplicate state updates
function updateUserStatus(userId, status) {
  const user = users.find(u => u.id === userId);
  if (!user) {
    console.error(`User ${userId} not found`);
    return false;
  }
  user.status = status;
  user.updatedAt = Date.now();
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
  return true;
}

// Example 5: Duplicate array filtering
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

// Expected simplification:
// - Extract getUserProperty helper with optional chaining
// - Extract validateRequired helper for field validation
// - Extract formatPersonData helper for common formatting
// - Extract updateEntityStatus helper for state updates
// - Convert array filtering to .filter() method
// - Reduce code duplication by 50-70%
