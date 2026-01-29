# Database Conventions with Knex.js and PostgreSQL

## Overview

This guide covers database conventions, Knex.js patterns, migration strategies, and PostgreSQL best practices used in the two-part architecture.

## Database Connection

### Configuration

```javascript
// config/database.js
const knex = require('knex');
const { env } = require('./env');

const db = knex({
  client: 'pg',
  connection: env.DATABASE_URL,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: './src/database/migrations',
    tableName: 'knex_migrations',
  },
});

module.exports = { db };
```

### Environment Variables

```javascript
// config/env.js
const { z } = require('zod');

const envSchema = z.object({
  DATABASE_URL: z.string(),
  // Example: postgresql://user:password@localhost:5432/dbname
});
```

## Naming Conventions

### Table Names

- **Use plural form**: `subscribers`, `users`, `job_posts`
- **Use snake_case**: `job_categories`, `user_profiles`
- **Be descriptive**: Avoid abbreviations unless universally understood

### Column Names

- **Use snake_case**: `first_name`, `created_at`, `is_active`
- **Be explicit**: `user_agent` not `ua`, `page_url` not `url`
- **Boolean prefix**: `is_active`, `has_verified`, `can_edit`
- **Timestamp suffix**: `created_at`, `updated_at`, `deleted_at`

### Primary Keys

- **Use `id` column**: String type with custom ID generation
- **Generate with prefix**: `sub_abc123`, `usr_xyz789`, `pst_def456`
- **Never use database UUIDs**: Use application-generated short UIDs

```javascript
// utils/id-generator.js
const { nanoid } = require('nanoid');

const generateShortUID = (prefix = '') => {
  const id = nanoid(12); // Generates 12-character random string
  return prefix ? `${prefix}_${id}` : id;
};

module.exports = { generateShortUID };
```

### Foreign Keys

- **Reference related table**: `user_id`, `category_id`, `author_id`
- **Use singular form**: `user_id` not `users_id`
- **Match referenced column**: If users table has `id`, use `user_id`

## Migration Patterns

### Creating Migrations

```bash
# Using npm script
npm run migrate:make create_subscribers_table

# Using knex CLI
npx knex migrate:make create_subscribers_table --knexfile src/config/knexfile.js
```

### Migration File Structure

```javascript
// migrations/20260112000001_create_subscribers_table.js

/**
 * Create subscribers table
 * @param {import('knex').Knex} knex
 */
exports.up = function(knex) {
  return knex.schema.createTable('subscribers', (table) => {
    // Primary key
    table.string('id').primary();

    // Required fields
    table.string('email').unique().notNullable();

    // Optional fields
    table.string('user_agent');
    table.string('page_url');
    table.string('referrer');

    // Timestamps (automatically adds created_at and updated_at)
    table.timestamps(true, true);
  });
};

/**
 * Drop subscribers table
 * @param {import('knex').Knex} knex
 */
exports.down = function(knex) {
  return knex.schema.dropTable('subscribers');
};
```

### Adding Columns

```javascript
// migrations/20260112000002_add_page_url_and_referrer_to_subscribers.js

exports.up = function(knex) {
  return knex.schema.table('subscribers', (table) => {
    table.string('page_url');
    table.string('referrer');
  });
};

exports.down = function(knex) {
  return knex.schema.table('subscribers', (table) => {
    table.dropColumn('page_url');
    table.dropColumn('referrer');
  });
};
```

### Migration Best Practices

1. **One change per migration**: Don't combine creating multiple tables
2. **Always provide down migration**: Enable rollback
3. **Test both up and down**: Ensure migrations are reversible
4. **Use descriptive names**: `create_users_table` not `migration_1`
5. **Add comments**: Explain complex migrations

## Repository Patterns

### Basic CRUD Operations

```javascript
// entities/subscribers/subscribers.repository.js
const { db } = require('../../config/database');

const TABLE_NAME = 'subscribers';

// Create
const createSubscriber = async (subscriberData) => {
  const [subscriber] = await db(TABLE_NAME)
    .insert(subscriberData)
    .returning('*');
  return subscriber;
};

// Read One
const findSubscriberById = async (id) => {
  return db(TABLE_NAME)
    .where({ id })
    .first();
};

// Read Many
const getAllSubscribers = async () => {
  return db(TABLE_NAME)
    .select('*')
    .orderBy('created_at', 'desc');
};

// Update
const updateSubscriber = async (id, updates) => {
  const [subscriber] = await db(TABLE_NAME)
    .where({ id })
    .update({
      ...updates,
      updated_at: new Date(),
    })
    .returning('*');
  return subscriber;
};

// Delete
const deleteSubscriber = async (id) => {
  const [subscriber] = await db(TABLE_NAME)
    .where({ id })
    .delete()
    .returning('*');
  return subscriber;
};

module.exports = {
  createSubscriber,
  findSubscriberById,
  getAllSubscribers,
  updateSubscriber,
  deleteSubscriber,
};
```

### Query Patterns

#### Filtering

```javascript
const findSubscribersByFilters = async (filters) => {
  let query = db(TABLE_NAME);

  if (filters.email) {
    query = query.where('email', 'ilike', `%${filters.email}%`);
  }

  if (filters.createdAfter) {
    query = query.where('created_at', '>', filters.createdAfter);
  }

  return query.select('*').orderBy('created_at', 'desc');
};
```

#### Pagination

```javascript
const findSubscribersPaginated = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;

  const subscribers = await db(TABLE_NAME)
    .select('*')
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db(TABLE_NAME).count('id');

  return {
    data: subscribers,
    pagination: {
      page,
      limit,
      total: parseInt(count),
      totalPages: Math.ceil(count / limit),
    },
  };
};
```

#### Joins

```javascript
const findPostsWithCategories = async () => {
  return db('job_posts as p')
    .join('job_categories as c', 'p.category_id', 'c.id')
    .select(
      'p.id',
      'p.title',
      'p.slug',
      'p.content',
      'c.name as category_name',
      'c.slug as category_slug'
    )
    .orderBy('p.created_at', 'desc');
};
```

#### Aggregations

```javascript
const getSubscriberStats = async () => {
  const stats = await db(TABLE_NAME)
    .select(
      db.raw('COUNT(*) as total'),
      db.raw("COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as last_7_days"),
      db.raw("COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as last_30_days")
    )
    .first();

  return {
    total: parseInt(stats.total),
    last7Days: parseInt(stats.last_7_days),
    last30Days: parseInt(stats.last_30_days),
  };
};
```

### Returning Data

**Always use `.returning('*')` for insert/update/delete:**

```javascript
// ✅ Correct - returns inserted data
const [subscriber] = await db(TABLE_NAME)
  .insert(subscriberData)
  .returning('*');

// ❌ Wrong - doesn't return data
const result = await db(TABLE_NAME).insert(subscriberData);
```

## Transactions

### Simple Transaction

```javascript
const createUserWithProfile = async (userData, profileData) => {
  return db.transaction(async (trx) => {
    // Create user
    const [user] = await trx('users')
      .insert(userData)
      .returning('*');

    // Create profile
    const [profile] = await trx('user_profiles')
      .insert({
        ...profileData,
        user_id: user.id,
      })
      .returning('*');

    return { user, profile };
  });
};
```

### Transaction with Error Handling

```javascript
const transferFunds = async (fromUserId, toUserId, amount) => {
  try {
    return await db.transaction(async (trx) => {
      // Debit from account
      const [fromAccount] = await trx('accounts')
        .where({ user_id: fromUserId })
        .decrement('balance', amount)
        .returning('*');

      if (fromAccount.balance < 0) {
        throw new Error('Insufficient funds');
      }

      // Credit to account
      const [toAccount] = await trx('accounts')
        .where({ user_id: toUserId })
        .increment('balance', amount)
        .returning('*');

      // Log transaction
      await trx('transactions').insert({
        id: generateShortUID('txn'),
        from_user_id: fromUserId,
        to_user_id: toUserId,
        amount,
        created_at: new Date(),
      });

      return { fromAccount, toAccount };
    });
  } catch (error) {
    throw new Error(`Transfer failed: ${error.message}`);
  }
};
```

## Data Types

### Common Column Types

```javascript
// String columns
table.string('email', 255);              // VARCHAR(255)
table.text('content');                   // TEXT (unlimited)

// Numeric columns
table.integer('age');                    // INTEGER
table.decimal('price', 10, 2);           // DECIMAL(10,2)
table.float('rating', 2, 1);             // FLOAT

// Boolean columns
table.boolean('is_active').defaultTo(true);

// Date/Time columns
table.timestamp('created_at').defaultTo(knex.fn.now());
table.date('birth_date');

// JSON columns
table.json('metadata');                  // JSON
table.jsonb('settings');                 // JSONB (better for PostgreSQL)

// Enum columns (PostgreSQL specific)
table.enum('status', ['pending', 'active', 'inactive']);
```

### Timestamps

Use built-in timestamp helper:

```javascript
// Adds created_at and updated_at with automatic defaults
table.timestamps(true, true);

// First true: use timestamps
// Second true: default to current timestamp
```

Manual timestamp handling:

```javascript
table.timestamp('created_at').defaultTo(knex.fn.now());
table.timestamp('updated_at').defaultTo(knex.fn.now());
```

## Indexes

### Adding Indexes in Migrations

```javascript
exports.up = function(knex) {
  return knex.schema.table('subscribers', (table) => {
    // Simple index
    table.index('email');

    // Unique index
    table.unique('email');

    // Composite index
    table.index(['category_id', 'created_at']);

    // Named index
    table.index('email', 'idx_subscribers_email');
  });
};
```

### When to Add Indexes

- **Foreign keys**: Always index columns used in joins
- **Lookup columns**: Index columns frequently used in WHERE clauses
- **Sorting columns**: Index columns used in ORDER BY
- **Unique constraints**: Use unique indexes for uniqueness

## Query Optimization

### Select Specific Columns

```javascript
// ✅ Good - explicit columns
const subscribers = await db('subscribers')
  .select('id', 'email', 'created_at');

// ❌ Avoid - selects all columns
const subscribers = await db('subscribers').select('*');
```

### Use `.first()` for Single Results

```javascript
// ✅ Good - returns single object or undefined
const subscriber = await db('subscribers')
  .where({ email })
  .first();

// ❌ Avoid - returns array with one element
const [subscriber] = await db('subscribers').where({ email });
```

### Limit Results

```javascript
// Always use limit for potentially large result sets
const recentSubscribers = await db('subscribers')
  .select('*')
  .orderBy('created_at', 'desc')
  .limit(100);
```

## Common Gotchas

### Snake Case vs Camel Case

Repository returns `snake_case`, service maps to `camelCase`:

```javascript
// Repository returns
{ id: 'sub_123', first_name: 'John', last_name: 'Doe', created_at: '2026-01-17' }

// Service maps to DTO
{ id: 'sub_123', firstName: 'John', lastName: 'Doe', createdAt: '2026-01-17' }
```

### Async/Await Required

```javascript
// ✅ Correct
const subscriber = await db('subscribers').where({ id }).first();

// ❌ Wrong - returns promise, not data
const subscriber = db('subscribers').where({ id }).first();
```

### Boolean Columns

PostgreSQL returns true boolean, some databases return 0/1:

```javascript
// Migration
table.boolean('is_active').defaultTo(true);

// Query
const activeSubscribers = await db('subscribers')
  .where({ is_active: true });  // Use true/false, not 1/0
```

## Soft Deletes

Use soft deletes instead of hard deletes to preserve data for audit and recovery:

### Migration Setup

```javascript
exports.up = function(knex) {
  return knex.schema.createTable('subscribers', (table) => {
    table.string('id').primary();
    table.string('email').unique().notNullable();

    // Soft delete flag
    table.boolean('is_deleted').defaultTo(false).notNullable();

    table.timestamps(true, true);
  });
};
```

### Repository Pattern

Always filter out deleted records in queries:

```javascript
// Find operations
const findSubscriberById = async (id) => {
  return db('subscribers')
    .where({ id, is_deleted: false })
    .first();
};

const getAllSubscribers = async () => {
  return db('subscribers')
    .select('*')
    .where({ is_deleted: false })
    .orderBy('created_at', 'desc');
};

// Update operations
const updateSubscriber = async (id, updates) => {
  const [subscriber] = await db('subscribers')
    .where({ id, is_deleted: false })
    .update({
      ...updates,
      updated_at: new Date(),
    })
    .returning('*');
  return subscriber;
};

// Delete operations (soft delete)
const deleteSubscriber = async (id) => {
  const [subscriber] = await db('subscribers')
    .where({ id, is_deleted: false })
    .update({
      is_deleted: true,
      updated_at: new Date(),
    })
    .returning('*');
  return subscriber;
};
```

### Benefits

1. **Data Preservation**: Deleted records remain in database for audit
2. **Recovery**: Easy to restore accidentally deleted records
3. **Analytics**: Can analyze deleted data
4. **Compliance**: Meet regulatory requirements for data retention
5. **Relationships**: Maintain referential integrity

### Considerations

- **Index Performance**: Add index on `is_deleted` for large tables
- **Unique Constraints**: May need to handle email uniqueness differently
- **Cleanup Jobs**: Periodically hard-delete old soft-deleted records if needed

## Error Handling

### Unique Constraint Violations

```javascript
try {
  await db('subscribers').insert({ id: 'sub_123', email: 'test@example.com' });
} catch (error) {
  if (error.code === '23505') {  // PostgreSQL unique violation code
    throw new Error('Email already exists');
  }
  throw error;
}
```

### Foreign Key Violations

```javascript
try {
  await db('posts').insert({ id: 'pst_123', user_id: 'usr_nonexistent' });
} catch (error) {
  if (error.code === '23503') {  // PostgreSQL foreign key violation
    throw new Error('User does not exist');
  }
  throw error;
}
```

## Testing

### Test Database Setup

```javascript
// config/database.test.js
const knex = require('knex');

const testDb = knex({
  client: 'pg',
  connection: process.env.TEST_DATABASE_URL,
  migrations: {
    directory: './src/database/migrations',
  },
});

module.exports = { testDb };
```

### Repository Tests

```javascript
// entities/subscribers/subscribers.repository.test.js
const { testDb } = require('../../config/database.test');
const subscribersRepository = require('./subscribers.repository');

beforeAll(async () => {
  await testDb.migrate.latest();
});

afterAll(async () => {
  await testDb.destroy();
});

beforeEach(async () => {
  await testDb('subscribers').truncate();
});

describe('createSubscriber', () => {
  it('should create a subscriber', async () => {
    const data = {
      id: 'sub_test123',
      email: 'test@example.com',
    };

    const subscriber = await subscribersRepository.createSubscriber(data);

    expect(subscriber.id).toBe('sub_test123');
    expect(subscriber.email).toBe('test@example.com');
  });
});
```

## Knexfile Configuration

```javascript
// config/knexfile.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, '../database/migrations'),
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: path.join(__dirname, '../database/seeds'),
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.join(__dirname, '../database/migrations'),
      tableName: 'knex_migrations',
    },
  },

  test: {
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, '../database/migrations'),
      tableName: 'knex_migrations',
    },
  },
};
```

## Key Takeaways

1. **Use snake_case** for all database column names
2. **Generate custom IDs** with prefix (e.g., `sub_abc123`)
3. **Always use `.returning('*')`** for insert/update/delete
4. **Create focused migrations** - one change per file
5. **Add indexes** for foreign keys and lookup columns
6. **Use transactions** for multi-step operations
7. **Select specific columns** instead of `SELECT *`
8. **Test with separate database** to avoid affecting development data
9. **Handle database errors** with proper error codes
10. **Keep repositories thin** - only database operations, no business logic
