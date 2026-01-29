# Alternative Entity Pattern: Separate Operation Files

## Overview

For complex entities with many operations, instead of having all service methods in a single `{entity}.service.js` file, split each operation into its own file and use an `index.js` to export them all.

## When to Use

**Use alternative pattern when:**
- Entity has 5+ service methods
- Operations are complex (50+ lines each)
- Multiple developers working on same entity
- Operations have distinct dependencies
- Clear separation benefits readability

**Use standard pattern when:**
- Entity has 1-4 simple operations
- Operations are straightforward CRUD
- Single developer maintaining entity
- Operations share significant logic
- Simplicity is preferred

## Structure Comparison

### Standard Pattern

```
entities/
└── subscribers/
    ├── subscribers.service.js      # All service methods
    ├── subscribers.repository.js
    ├── subscribers.validators.js
    └── subscribers.dtos.js
```

### Alternative Pattern

```
entities/
└── job-categories/
    ├── index.js                    # Exports all operations
    ├── findOne.js                  # Single operation
    ├── findMany.js                 # Single operation
    ├── mapTo.js                    # DTO mapping
    └── (no repository or validators if using filesystem)
```

## Alternative Pattern Structure

### index.js

The main entry point that exports all operations:

```javascript
// entities/job-categories/index.js
const { findOne } = require('./findOne');
const { findMany } = require('./findMany');

module.exports = {
  findOne,
  findMany,
};
```

**Purpose:**
- Central export point for all entity operations
- Simplifies imports in controllers
- Provides overview of available operations
- Allows for future reorganization

### Operation Files

Each operation in its own file:

```javascript
// entities/job-categories/findOne.js
const { mapToJobCategory } = require('./mapTo');
const filesystemProvider = require('../filesystem-provider');

const findOne = async (slug) => {
  const categories = await filesystemProvider.readJobCategories();
  const category = categories.find(c => c.slug === slug);

  if (!category) {
    throw new Error('Category not found');
  }

  return mapToJobCategory(category);
};

module.exports = { findOne };
```

```javascript
// entities/job-categories/findMany.js
const { mapToJobCategory } = require('./mapTo');
const filesystemProvider = require('../filesystem-provider');

const findMany = async () => {
  const categories = await filesystemProvider.readJobCategories();
  return categories.map(mapToJobCategory);
};

module.exports = { findMany };
```

### Mapping File

Separate file for DTO mappings:

```javascript
// entities/job-categories/mapTo.js
const mapToJobCategory = (category) => ({
  slug: category.slug,
  name: category.name,
  description: category.description,
  jobCount: category.jobs ? category.jobs.length : 0,
});

module.exports = { mapToJobCategory };
```

## Complete Example: job-posts Entity

### File Structure

```
entities/job-posts/
├── index.js
├── findOne.js
├── findMany.js
├── findTopX.js
└── mapTo.js
```

### index.js

```javascript
const { findOne } = require('./findOne');
const { findMany } = require('./findMany');
const { findTopX } = require('./findTopX');

module.exports = {
  findOne,
  findMany,
  findTopX,
};
```

### findOne.js

```javascript
const { mapToJobPost } = require('./mapTo');
const filesystemProvider = require('../filesystem-provider');

const findOne = async (slug) => {
  const posts = await filesystemProvider.readJobPosts();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    throw new Error('Job post not found');
  }

  return mapToJobPost(post);
};

module.exports = { findOne };
```

### findMany.js

```javascript
const { mapToJobPost } = require('./mapTo');
const filesystemProvider = require('../filesystem-provider');

const findMany = async (filters = {}) => {
  let posts = await filesystemProvider.readJobPosts();

  // Apply filters
  if (filters.category) {
    posts = posts.filter(p => p.category === filters.category);
  }

  if (filters.branch) {
    posts = posts.filter(p => p.branch === filters.branch);
  }

  // Sort by date
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return posts.map(mapToJobPost);
};

module.exports = { findMany };
```

### findTopX.js

```javascript
const { mapToJobPost } = require('./mapTo');
const filesystemProvider = require('../filesystem-provider');

const findTopX = async (limit = 10) => {
  const posts = await filesystemProvider.readJobPosts();

  // Sort by date and take top X
  const sorted = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  const topPosts = sorted.slice(0, limit);

  return topPosts.map(mapToJobPost);
};

module.exports = { findTopX };
```

### mapTo.js

```javascript
const mapToJobPost = (post) => ({
  slug: post.slug,
  title: post.title,
  description: post.description,
  category: post.category,
  branch: post.branch,
  date: post.date,
  content: post.content,
});

const mapToJobPostSummary = (post) => ({
  slug: post.slug,
  title: post.title,
  description: post.description,
  category: post.category,
  branch: post.branch,
  date: post.date,
  // Exclude content for summaries
});

module.exports = {
  mapToJobPost,
  mapToJobPostSummary,
};
```

## Controller Usage

Controllers import from the entity's index.js:

```javascript
// routes/categories/categories.controller.js
const jobCategories = require('../../entities/job-categories');

const getCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await jobCategories.findOne(slug);

    res.json({ data: category });
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await jobCategories.findMany();

    res.json({ data: categories });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategory,
  getAllCategories,
};
```

## Advantages

1. **Focused Files**: Each file has single responsibility
2. **Easier Navigation**: Find specific operation quickly
3. **Parallel Development**: Multiple developers can work without conflicts
4. **Clear Dependencies**: Each operation's dependencies are explicit
5. **Easier Testing**: Test individual operations in isolation
6. **Better Git History**: Changes to one operation don't affect others

## Disadvantages

1. **More Files**: More files to manage and navigate
2. **Import Overhead**: More imports needed
3. **Shared Logic**: Harder to share logic between operations
4. **Discovery**: Harder to see all operations at once

## Best Practices

### File Naming

Use descriptive operation names:
- `findOne.js`, `findMany.js` - Read operations
- `create.js`, `update.js`, `remove.js` - Write operations
- `findTopX.js`, `findByCategory.js` - Specialized queries
- `mapTo.js` - DTO mappings
- `helpers.js` - Shared utilities (if needed)

### Shared Logic

When operations share logic, extract to helper file:

```javascript
// entities/job-posts/helpers.js
const applyFilters = (posts, filters) => {
  let filtered = posts;

  if (filters.category) {
    filtered = filtered.filter(p => p.category === filters.category);
  }

  if (filters.branch) {
    filtered = filtered.filter(p => p.branch === filters.branch);
  }

  return filtered;
};

const sortByDate = (posts, order = 'desc') => {
  return posts.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};

module.exports = { applyFilters, sortByDate };
```

Then use in operations:

```javascript
// entities/job-posts/findMany.js
const { mapToJobPost } = require('./mapTo');
const { applyFilters, sortByDate } = require('./helpers');
const filesystemProvider = require('../filesystem-provider');

const findMany = async (filters = {}) => {
  let posts = await filesystemProvider.readJobPosts();

  posts = applyFilters(posts, filters);
  posts = sortByDate(posts, 'desc');

  return posts.map(mapToJobPost);
};

module.exports = { findMany };
```

### Consistency

If using alternative pattern for one entity, consider using it for similar entities:
- **job-categories**: Alternative pattern with 2 operations
- **job-posts**: Alternative pattern with 3 operations
- **subscribers**: Standard pattern with 2 operations (database-backed)

Choose based on complexity, not just for consistency.

## Migration from Standard to Alternative

When entity grows beyond 4-5 operations:

1. Create operation files for each method
2. Create index.js to export all operations
3. Update controller imports (should work without changes if using `require('./index')`)
4. Remove old service file
5. Test thoroughly

**Before:**

```javascript
// entities/products/products.service.js (150 lines)
const create = async (data) => { ... };
const findOne = async (id) => { ... };
const findAll = async (filters) => { ... };
const update = async (id, data) => { ... };
const remove = async (id) => { ... };

module.exports = { create, findOne, findAll, update, remove };
```

**After:**

```
entities/products/
├── index.js (10 lines)
├── create.js (30 lines)
├── findOne.js (25 lines)
├── findAll.js (35 lines)
├── update.js (30 lines)
└── remove.js (20 lines)
```

## Filesystem vs Database Entities

### Filesystem Entities

Often use alternative pattern:
- Data loaded from JSON/markdown files
- No repository layer needed
- Operations involve file parsing and filtering
- Example: `job-categories`, `job-posts`

### Database Entities

Often use standard pattern:
- Data from PostgreSQL via Knex
- Repository layer needed
- Operations are straightforward CRUD
- Example: `subscribers`

## Real-World Example: job-categories

The `job-categories` entity uses alternative pattern even with only 2 operations because:
1. Clear separation of concerns (find one vs find all)
2. Different return types (single vs array)
3. Consistent with `job-posts` entity
4. Room for growth (may add more operations later)

```javascript
// Controller usage
const jobCategories = require('../../entities/job-categories');

// Clear what operation is being called
const category = await jobCategories.findOne(slug);
const categories = await jobCategories.findAll();
```

## Decision Tree

```
How many operations does entity have?
├─ 1-4 simple operations
│  └─ Use standard pattern (single service file)
│
└─ 5+ operations OR complex operations
   └─ Are operations related and share logic?
      ├─ Yes
      │  └─ Use standard pattern with helper functions
      │
      └─ No
         └─ Use alternative pattern (separate files)
```

## Key Takeaways

1. **Alternative pattern is for complex entities** with many operations
2. **Use index.js** to export all operations
3. **Each operation file** should be focused and self-contained
4. **Extract shared logic** to helpers.js
5. **Choose based on complexity**, not just consistency
6. **Migration is straightforward** when entity grows
7. **Controller imports remain simple** with index.js pattern
8. **Filesystem entities** often benefit from alternative pattern
