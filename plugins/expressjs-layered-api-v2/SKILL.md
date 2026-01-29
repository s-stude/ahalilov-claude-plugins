---
name: Express.js Layered API Development V2
description: This skill should be used when the user asks to "create a module", "add an endpoint", "implement CRUD operations", "set up validation", "add database migration", "create a service", "add a controller", "create an entity", or requests Express.js development following a two-part architecture (routes + entities) with Knex.js, PostgreSQL, Zod validation, and Winston logging.
version: 2.0.0
---

# Express.js Layered API Development V2

Generate Express.js backend code following a two-part modular architecture separating HTTP layer (routes) from business logic (entities), with Knex.js for PostgreSQL, Zod validation, and Winston logging.

## Overview

This skill provides guidance for building Express.js APIs with:
- **Two-Part Architecture**: Routes (HTTP layer) + Entities (business logic)
- **Layered Separation**: Controller → Service → Repository pattern
- **Type Safety**: Zod schemas for runtime validation
- **Database**: Knex.js query builder with PostgreSQL
- **Logging**: Winston with request context
- **Data Mapping**: DTOs for API responses

## Core Principles

### 1. Two-Part Structure

The codebase separates HTTP concerns from business logic:

**Routes Directory** (`src/routes/{module}/`):
- HTTP request handling (controllers)
- Route definitions and middleware
- Maps HTTP requests to entity operations

**Entities Directory** (`src/entities/{entity}/`):
- Business logic (services)
- Database access (repositories)
- Validation schemas (Zod)
- Data Transfer Objects (DTOs)

### 2. Standard Entity Pattern

For entities with straightforward CRUD operations:

```
src/
├── routes/
│   └── {module}/
│       ├── {module}.controller.js   # HTTP handling
│       └── {module}.routes.js       # Route definitions
└── entities/
    └── {entity}/
        ├── {entity}.service.js      # Business logic
        ├── {entity}.repository.js   # Database queries
        ├── {entity}.validators.js   # Zod schemas
        └── {entity}.dtos.js         # Data mapping
```

### 3. Alternative Entity Pattern

For entities with complex operations or many methods, use separate operation files:

```
src/
├── routes/
│   └── {module}/
│       ├── {module}.controller.js
│       └── {module}.routes.js
└── entities/
    └── {entity}/
        ├── index.js                 # Exports all operations
        ├── findOne.js               # Single operation
        ├── findMany.js              # List operation
        ├── findTopX.js              # Specialized query
        └── mapTo.js                 # DTO mapping
```

**When to use alternative pattern:**
- Entity has 5+ service methods
- Operations are complex and benefit from isolation
- Multiple developers working on same entity
- Clear separation of concerns needed

### 4. Layer Responsibilities

**Controller Layer** (`routes/{module}/*.controller.js`):
- Handle HTTP requests and responses
- Parse inputs and invoke validation middleware
- Call entity service methods
- Return DTOs as JSON responses
- Pass errors to `next(err)` for global error handler
- **Never**: Write SQL, business logic, or access database directly

**Service Layer** (`entities/{entity}/*.service.js`):
- Contain core business logic
- Orchestrate operations across repositories
- Map raw database results to DTOs before returning
- Handle transactions using `knex.transaction()`
- **Never**: Access `req` or `res` objects

**Repository Layer** (`entities/{entity}/*.repository.js`):
- Direct database interaction using Knex.js
- Return raw data objects from database
- Use `snake_case` for all database fields
- Use `.returning('*')` on Insert/Update/Delete operations
- **Never**: Include business logic or DTO mapping

### 5. Validation with Zod

Define validation schemas in `*.validators.js`:

```javascript
const { z } = require('zod');

const createSubscriberSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  userAgent: z.string().optional(),
  pageUrl: z.string().optional(),
  referrer: z.string().optional(),
});

const validate = (schema) => (req, res, next) => {
  try {
    if (req.body && Object.keys(req.body).length > 0) {
      req.body = schema.parse(req.body);
    } else if (req.params && Object.keys(req.params).length > 0) {
      req.params = schema.parse(req.params);
    } else if (req.query && Object.keys(req.query).length > 0) {
      req.query = schema.parse(req.query);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { createSubscriberSchema, validate };
```

### 6. Data Transfer Objects (DTOs)

Services must map database results to DTOs:

```javascript
// {entity}.dtos.js
const subscriberDto = (subscriberRecord) => ({
  id: subscriberRecord.id,
  email: subscriberRecord.email,
  createdAt: subscriberRecord.created_at,
});

module.exports = { subscriberDto };
```

**DTO Guidelines:**
- Convert `snake_case` to `camelCase`
- Exclude sensitive fields (passwords, tokens)
- Include only fields needed by API consumers
- Keep DTOs simple and focused

### 7. Database Conventions

- **Field Names**: Always `snake_case` in database
- **IDs**: Use string IDs, generate with `generateShortUID()` (not DB UUIDs)
- **Queries**: Explicitly select columns when needed
- **Async**: Always use `async/await`
- **Transactions**: Handle in service layer when needed
- **Table Names**: Use singular form (e.g., `subscribers` not `subscriber`)
- **Soft Deletes**: Use `is_deleted` boolean flag, filter out deleted records in queries

### 8. Logging

Use Winston logger with request context:

```javascript
// In controllers
const logger = res.locals.logger.child({ module: 'subscribers' });
logger.info('Creating new subscriber', { email });
```

**Logging Guidelines:**
- Use simple string for module name
- Include relevant context (email, id, etc.)
- Log at appropriate levels (info, warn, error)
- Avoid logging sensitive data (passwords, tokens)

## Implementation Workflow

### Creating a New Standard Entity

Follow this sequence to create an entity with CRUD operations:

**1. Create directory structure:**
```bash
mkdir -p src/routes/{module}
mkdir -p src/entities/{entity}
```

**2. Create repository** (`entities/{entity}/{entity}.repository.js`):
- Define database queries
- Use Knex.js for query building
- Return raw database objects
- Use `snake_case` field names

**3. Create DTOs** (`entities/{entity}/{entity}.dtos.js`):
- Define mapping functions from `snake_case` to `camelCase`
- Create DTO for each entity representation
- Exclude sensitive fields

**4. Create service** (`entities/{entity}/{entity}.service.js`):
- Implement business logic
- Call repository methods
- Map results to DTOs before returning
- Handle transactions if needed

**5. Create validators** (`entities/{entity}/{entity}.validators.js`):
- Define Zod schemas for requests
- Create validation middleware
- Export schemas and middleware

**6. Create controller** (`routes/{module}/{module}.controller.js`):
- Handle HTTP requests
- Call entity service methods
- Return JSON responses with DTOs
- Pass errors to error handler

**7. Create routes** (`routes/{module}/{module}.routes.js`):
- Define Express router
- Apply validation middleware
- Map routes to controller methods

**8. Register routes** in `src/app.js`:
- Import module routes
- Mount with prefix (e.g., `/api/v1/subscribers`)

### Creating an Alternative Pattern Entity

For complex entities with many operations:

**1. Create operation files** (`entities/{entity}/findOne.js`, etc.):
- Each file exports a single function
- Include necessary imports (repository, DTOs)
- Implement focused operation logic

**2. Create index.js** (`entities/{entity}/index.js`):
- Import all operation functions
- Export as object with named exports

**3. Create mapTo.js** (`entities/{entity}/mapTo.js`):
- Define DTO mapping functions
- Export mapping utilities

**4. Create controller and routes** as in standard pattern

### Creating Database Migrations

Use Knex migrations for schema changes:

```javascript
// migrations/YYYYMMDDHHMMSS_create_subscribers_table.js
exports.up = function(knex) {
  return knex.schema.createTable('subscribers', (table) => {
    table.string('id').primary();
    table.string('email').unique().notNullable();
    table.string('user_agent');
    table.string('page_url');
    table.string('referrer');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('subscribers');
};
```

### Error Handling

Pass errors to global error handler:

```javascript
// In error-handler.js
const errorHandler = (err, req, res, next) => {
  const requestLogger = res.locals.logger || logger;

  if (err instanceof ZodError) {
    requestLogger.warn('Validation error', { errors: err.errors });
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  requestLogger.error('Internal server error', {
    error: err.message,
    stack: err.stack,
  });

  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal server error',
  });
};
```

## Code Style Conventions

- **Files**: `kebab-case` (e.g., `auth.controller.js`, `user-profile.repository.js`)
- **Directories**: `kebab-case` for multi-word names
- **Variables/Functions**: `camelCase`
- **Database Fields**: `snake_case`
- **Constants**: `UPPER_CASE_SNAKE_CASE`
- **DTOs**: `camelCase` properties
- **No JSDoc**: Rely on Zod schemas and clear code

## Common Patterns

### Repository Pattern

```javascript
const { db } = require('../../config/database');

const TABLE_NAME = 'subscribers';

const createSubscriber = async (subscriberData) => {
  const [subscriber] = await db(TABLE_NAME)
    .insert(subscriberData)
    .returning('*');
  return subscriber;
};

const findSubscriberByEmail = async (email) => {
  return db(TABLE_NAME)
    .where({ email, is_deleted: false })
    .first();
};

const getAllSubscribers = async () => {
  return db(TABLE_NAME)
    .select('*')
    .where({ is_deleted: false })
    .orderBy('created_at', 'desc');
};

const deleteSubscriber = async (id) => {
  // Soft delete: set is_deleted to true
  const [subscriber] = await db(TABLE_NAME)
    .where({ id, is_deleted: false })
    .update({
      is_deleted: true,
      updated_at: new Date(),
    })
    .returning('*');
  return subscriber;
};

module.exports = {
  createSubscriber,
  findSubscriberByEmail,
  getAllSubscribers,
  deleteSubscriber,
};
```

### Service Pattern

```javascript
const subscribersRepository = require('./subscribers.repository');
const { subscriberDto } = require('./subscribers.dtos');
const { generateShortUID } = require('../../utils/id-generator');

const createSubscriber = async (email, userAgent, pageUrl, referrer) => {
  const existingSubscriber = await subscribersRepository.findSubscriberByEmail(email);

  if (existingSubscriber) {
    return subscriberDto(existingSubscriber);
  }

  const subscriberData = {
    id: generateShortUID('sub'),
    email: email.toLowerCase(),
    user_agent: userAgent || null,
    page_url: pageUrl || null,
    referrer: referrer || null,
  };

  const subscriber = await subscribersRepository.createSubscriber(subscriberData);
  return subscriberDto(subscriber);
};

module.exports = {
  createSubscriber,
};
```

### Controller Pattern

```javascript
const subscribersService = require('../../entities/subscribers/subscribers.service');

const createSubscriber = async (req, res, next) => {
  try {
    const logger = res.locals.logger.child({ module: 'subscribers' });
    const { email, userAgent, pageUrl, referrer } = req.body;

    logger.info('Creating new subscriber', { email });

    const subscriber = await subscribersService.createSubscriber(
      email,
      userAgent,
      pageUrl,
      referrer
    );

    logger.info('Subscriber created successfully', { subscriberId: subscriber.id });

    res.status(201).json({
      success: true,
      data: subscriber,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubscriber,
};
```

### Routes Pattern

```javascript
const express = require('express');
const subscribersController = require('./subscribers.controller');
const { createSubscriberSchema, validate } = require('../../entities/subscribers/subscribers.validators');

const router = express.Router();

router.post('/', validate(createSubscriberSchema), subscribersController.createSubscriber);

module.exports = router;
```

## Additional Resources

### Reference Files

For comprehensive details, consult:
- **`references/two-part-architecture.md`** - Complete architecture specification with detailed examples
- **`references/alternative-entity-pattern.md`** - When and how to use separate operation files
- **`references/database-conventions.md`** - Knex.js patterns, migration guides, and PostgreSQL conventions

### Working Examples

Complete working examples in `examples/`:
- **`examples/subscribers-entity/`** - Full standard pattern implementation
- **`examples/job-categories-entity/`** - Alternative pattern with separate operations
- **`examples/migration-create-subscribers.js`** - Database migration example

### Utility Scripts

Helper scripts in `scripts/`:
- **`scripts/create-entity.js`** - Generate standard entity scaffolding
- **`scripts/create-module.js`** - Generate routes module scaffolding
- **`scripts/create-migration.js`** - Generate Knex migration file

## Key Reminders

1. **Always read existing code** before generating modifications
2. **Separate routes from entities** - HTTP layer in routes/, business logic in entities/
3. **Map to DTOs in services** before returning to controllers
4. **Use snake_case** for all database fields
5. **Validate with Zod** for all incoming requests
6. **Use simple string for logging module name** (e.g., 'subscribers')
7. **Handle errors properly** by passing to error handler
8. **Avoid over-engineering** - implement only what's requested
9. **Generate short UIDs** using `generateShortUID()` instead of DB UUIDs
10. **Choose the right pattern** - standard for simple entities, alternative for complex ones

When generating code, ensure all layers are created and properly integrated following these patterns.
