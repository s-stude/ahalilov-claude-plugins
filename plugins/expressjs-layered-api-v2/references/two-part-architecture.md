# Two-Part Architecture: Routes + Entities

## Overview

The two-part architecture separates HTTP concerns from business logic by organizing code into two primary directories:

1. **Routes** (`src/routes/`) - HTTP layer handling requests, responses, and routing
2. **Entities** (`src/entities/`) - Business logic, database access, validation, and data mapping

## Why Two-Part Architecture?

### Separation of Concerns

**Routes directory** focuses on:
- HTTP request/response handling
- Routing and middleware orchestration
- Mapping HTTP calls to business operations
- URL structure and API contract

**Entities directory** focuses on:
- Domain logic and business rules
- Data persistence and retrieval
- Validation and data transformation
- Reusable business operations

### Benefits

1. **Independent Evolution**: HTTP layer can change without affecting business logic
2. **Reusability**: Entities can be used by multiple routes or other consumers (CLI, jobs, etc.)
3. **Testability**: Business logic can be tested without HTTP concerns
4. **Team Collaboration**: Frontend teams work in routes/, backend teams work in entities/
5. **Clear Dependencies**: Routes depend on entities, never the reverse

## Directory Structure

```
src/
├── routes/
│   ├── home/
│   │   ├── home.controller.js
│   │   └── home.routes.js
│   ├── subscribers/
│   │   ├── subscribers.controller.js
│   │   └── subscribers.routes.js
│   ├── health/
│   │   ├── health.controller.js
│   │   └── health.routes.js
│   └── categories/
│       ├── categories.controller.js
│       └── categories.routes.js
├── entities/
│   ├── subscribers/
│   │   ├── subscribers.service.js
│   │   ├── subscribers.repository.js
│   │   ├── subscribers.validators.js
│   │   └── subscribers.dtos.js
│   ├── job-categories/
│   │   ├── index.js
│   │   ├── findOne.js
│   │   ├── findAll.js
│   │   └── mapTo.js
│   └── job-posts/
│       ├── index.js
│       ├── findOne.js
│       ├── findMany.js
│       ├── findTopX.js
│       └── mapTo.js
└── config/
    ├── database.js
    ├── logger.js
    └── env.js
```

## Routes Layer

### Purpose

Handle HTTP-specific concerns:
- Parse request parameters (body, query, params)
- Invoke validation middleware
- Call entity service methods
- Format responses with proper HTTP status codes
- Handle errors by passing to error handler

### Structure

Each route module contains:
- **{module}.controller.js**: Controller functions handling HTTP requests
- **{module}.routes.js**: Express router with route definitions and middleware

### Controller Example

```javascript
// routes/subscribers/subscribers.controller.js
const subscribersService = require('../../entities/subscribers/subscribers.service');

const createSubscriber = async (req, res, next) => {
  try {
    const logger = res.locals.logger.child({ module: 'subscribers' });
    const { email, userAgent, pageUrl, referrer } = req.body;
    const capturedUserAgent = userAgent || req.headers['user-agent'];
    const capturedReferrer = referrer || req.headers['referer'] || req.headers['referrer'];

    logger.info('Creating new subscriber', { email, pageUrl, referrer: capturedReferrer });

    const subscriber = await subscribersService.createSubscriber(
      email,
      capturedUserAgent,
      pageUrl,
      capturedReferrer
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

const getAllSubscribers = async (req, res, next) => {
  try {
    const logger = res.locals.logger.child({ module: 'subscribers' });
    logger.info('Fetching all subscribers');

    const subscribers = await subscribersService.getAllSubscribers();

    res.status(200).json({
      success: true,
      data: subscribers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubscriber,
  getAllSubscribers,
};
```

### Routes Example

```javascript
// routes/subscribers/subscribers.routes.js
const express = require('express');
const subscribersController = require('./subscribers.controller');
const { createSubscriberSchema, validate } = require('../../entities/subscribers/subscribers.validators');

const router = express.Router();

// POST /api/v1/subscribers
router.post('/', validate(createSubscriberSchema), subscribersController.createSubscriber);

// GET /api/v1/subscribers
router.get('/', subscribersController.getAllSubscribers);

module.exports = router;
```

### Controller Guidelines

1. **Extract request data**: Get params, query, body from req object
2. **Create logger child**: Add module context to logger
3. **Call service methods**: Invoke business logic from entity
4. **Return JSON**: Use appropriate HTTP status codes (200, 201, 400, 404, 500)
5. **Handle errors**: Always use try-catch and pass errors to `next(err)`
6. **Keep thin**: No business logic, just HTTP handling

## Entities Layer

### Purpose

Handle business logic and data persistence:
- Implement domain-specific business rules
- Interact with database through repositories
- Validate data using Zod schemas
- Transform data with DTOs
- Provide reusable operations

### Structure

Each entity contains:
- **{entity}.service.js**: Business logic and orchestration
- **{entity}.repository.js**: Database queries and raw data access
- **{entity}.validators.js**: Zod schemas and validation middleware
- **{entity}.dtos.js**: Data Transfer Objects for API responses

### Service Example

```javascript
// entities/subscribers/subscribers.service.js
const subscribersRepository = require('./subscribers.repository');
const { subscriberDto } = require('./subscribers.dtos');
const { generateShortUID } = require('../../utils/id-generator');

const createSubscriber = async (email, userAgent, pageUrl, referrer) => {
  // Business rule: Check for existing subscriber
  const existingSubscriber = await subscribersRepository.findSubscriberByEmail(email);

  if (existingSubscriber) {
    return subscriberDto(existingSubscriber);
  }

  // Business rule: Normalize email to lowercase
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

const getAllSubscribers = async () => {
  const subscribers = await subscribersRepository.getAllSubscribers();
  return subscribers.map(subscriberDto);
};

module.exports = {
  createSubscriber,
  getAllSubscribers,
};
```

### Repository Example

```javascript
// entities/subscribers/subscribers.repository.js
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
    .where({ email })
    .first();
};

const getAllSubscribers = async () => {
  return db(TABLE_NAME)
    .select('*')
    .orderBy('created_at', 'desc');
};

module.exports = {
  createSubscriber,
  findSubscriberByEmail,
  getAllSubscribers,
};
```

### Validators Example

```javascript
// entities/subscribers/subscribers.validators.js
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

### DTOs Example

```javascript
// entities/subscribers/subscribers.dtos.js
const subscriberDto = (subscriberRecord) => ({
  id: subscriberRecord.id,
  email: subscriberRecord.email,
  createdAt: subscriberRecord.created_at,
  // Exclude: user_agent, page_url, referrer (internal use only)
});

module.exports = { subscriberDto };
```

## Data Flow

### Request Flow

```
1. HTTP Request
   ↓
2. Express Router (routes/{module}/{module}.routes.js)
   ↓
3. Validation Middleware (entities/{entity}/{entity}.validators.js)
   ↓
4. Controller (routes/{module}/{module}.controller.js)
   ↓
5. Service (entities/{entity}/{entity}.service.js)
   ↓
6. Repository (entities/{entity}/{entity}.repository.js)
   ↓
7. Database (Knex.js → PostgreSQL)
```

### Response Flow

```
1. Database (Raw data with snake_case)
   ↓
2. Repository (Return raw data)
   ↓
3. Service (Map to DTO with camelCase)
   ↓
4. Controller (Wrap in response object)
   ↓
5. HTTP Response (JSON with status code)
```

## Naming Conventions

### Routes

- **Module name**: Use the route path name (e.g., `subscribers`, `health`, `categories`)
- **Files**: `{module}.controller.js`, `{module}.routes.js`
- **Exports**: Named exports for each controller function

### Entities

- **Entity name**: Use the database table name or domain concept (e.g., `subscribers`, `job-categories`)
- **Files**: `{entity}.service.js`, `{entity}.repository.js`, `{entity}.validators.js`, `{entity}.dtos.js`
- **Exports**: Named exports for each function

### Alignment

Routes and entities may have different names:
- Route: `subscribers` → Entity: `subscribers` (aligned)
- Route: `categories` → Entity: `job-categories` (not aligned, route is simpler)
- Route: `health` → Entity: None (health check has no entity)

## Registration in app.js

```javascript
// src/app.js
const express = require('express');
const { requestLogger } = require('./middleware/request-logger');
const { errorHandler } = require('./middleware/error-handler');
const healthRoutes = require('./routes/health/health.routes');
const subscribersRoutes = require('./routes/subscribers/subscribers.routes');
const categoriesRoutes = require('./routes/categories/categories.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/subscribers', subscribersRoutes);
app.use('/api/v1/categories', categoriesRoutes);

// Error handler (must be last)
app.use(errorHandler);

module.exports = { app };
```

## Common Patterns

### Creating a Resource

1. Define validation schema in entity validators
2. Implement repository method to insert data
3. Implement service method with business logic (ID generation, normalization)
4. Map to DTO before returning
5. Create controller method to handle HTTP POST
6. Define route with validation middleware

### Reading a Resource

1. Implement repository method to query data
2. Implement service method to call repository and map to DTO
3. Create controller method to handle HTTP GET
4. Define route

### Updating a Resource

1. Define validation schema for update payload
2. Implement repository method to update data
3. Implement service method with business logic (existence check, authorization)
4. Map to DTO before returning
5. Create controller method to handle HTTP PUT/PATCH
6. Define route with validation middleware

### Deleting a Resource

1. Implement repository method to delete data
2. Implement service method with business logic (existence check, soft delete)
3. Create controller method to handle HTTP DELETE
4. Define route

## Error Handling

Errors flow from entity to controller to global error handler:

```javascript
// Service throws error
if (!existingUser) {
  throw new Error('User not found');
}

// Controller catches and passes to next
try {
  const user = await usersService.getUser(userId);
  res.json({ data: user });
} catch (error) {
  next(error);
}

// Global error handler formats response
const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal server error',
  });
};
```

## Testing Strategy

### Unit Tests

- **Repositories**: Test database queries with test database
- **Services**: Test business logic with mocked repositories
- **DTOs**: Test data transformation
- **Validators**: Test Zod schemas

### Integration Tests

- **Routes**: Test full request/response cycle
- **Controllers**: Test with mocked services

### Example

```javascript
// entities/subscribers/subscribers.service.test.js
const subscribersService = require('./subscribers.service');
const subscribersRepository = require('./subscribers.repository');

jest.mock('./subscribers.repository');

describe('createSubscriber', () => {
  it('should return existing subscriber if email exists', async () => {
    const existing = { id: 'sub_123', email: 'test@example.com' };
    subscribersRepository.findSubscriberByEmail.mockResolvedValue(existing);

    const result = await subscribersService.createSubscriber('test@example.com');

    expect(result.id).toBe('sub_123');
    expect(subscribersRepository.createSubscriber).not.toHaveBeenCalled();
  });

  it('should create new subscriber if email does not exist', async () => {
    subscribersRepository.findSubscriberByEmail.mockResolvedValue(null);
    subscribersRepository.createSubscriber.mockResolvedValue({
      id: 'sub_456',
      email: 'new@example.com',
      created_at: new Date(),
    });

    const result = await subscribersService.createSubscriber('NEW@example.com');

    expect(result.email).toBe('new@example.com');
    expect(subscribersRepository.createSubscriber).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'new@example.com' })
    );
  });
});
```

## Key Takeaways

1. **Routes handle HTTP**, entities handle business logic
2. **Controllers call services**, services call repositories
3. **Validation happens in entities**, applied in routes
4. **DTOs transform data** from snake_case to camelCase
5. **Errors flow up** from entity → controller → error handler
6. **Dependencies flow down** from routes → entities → database
7. **Names may differ** between routes and entities
8. **Registration is explicit** in app.js
