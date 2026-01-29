#!/usr/bin/env node

/**
 * Script to generate a routes module with controller and routes files
 * Usage: node scripts/create-module.js <module-name> [entity-name]
 * Example: node scripts/create-module.js subscribers
 * Example: node scripts/create-module.js categories job-categories
 */

const fs = require('fs');
const path = require('path');

const moduleName = process.argv[2];
const entityName = process.argv[3] || moduleName;

if (!moduleName) {
  console.error('Error: Module name is required');
  console.log('Usage: node scripts/create-module.js <module-name> [entity-name]');
  console.log('Example: node scripts/create-module.js subscribers');
  console.log('Example: node scripts/create-module.js categories job-categories');
  process.exit(1);
}

const moduleDir = path.join(process.cwd(), 'src', 'routes', moduleName);

// Check if module already exists
if (fs.existsSync(moduleDir)) {
  console.error(`Error: Module "${moduleName}" already exists at ${moduleDir}`);
  process.exit(1);
}

// Create module directory
fs.mkdirSync(moduleDir, { recursive: true });

// Generate file contents
const capitalizedModule = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
const capitalizedEntity = entityName.charAt(0).toUpperCase() + entityName.slice(1);

// Controller file
const controllerContent = `const ${entityName}Service = require('../../entities/${entityName}/${entityName}.service');

const create${capitalizedEntity} = async (req, res, next) => {
  try {
    const logger = res.locals.logger.child({ module: '${moduleName}' });
    const data = req.body;

    logger.info('Creating ${entityName}', { data });

    const ${entityName} = await ${entityName}Service.create${capitalizedEntity}(data);

    logger.info('${capitalizedEntity} created successfully', { id: ${entityName}.id });

    res.status(201).json({
      success: true,
      data: ${entityName},
    });
  } catch (error) {
    next(error);
  }
};

const get${capitalizedEntity} = async (req, res, next) => {
  try {
    const logger = res.locals.logger.child({ module: '${moduleName}' });
    const { id } = req.params;

    logger.info('Fetching ${entityName}', { id });

    const ${entityName} = await ${entityName}Service.get${capitalizedEntity}ById(id);

    res.status(200).json({
      success: true,
      data: ${entityName},
    });
  } catch (error) {
    next(error);
  }
};

const getAll${capitalizedEntity}s = async (req, res, next) => {
  try {
    const logger = res.locals.logger.child({ module: '${moduleName}' });
    logger.info('Fetching all ${entityName}s');

    const ${entityName}s = await ${entityName}Service.getAll${capitalizedEntity}s();

    res.status(200).json({
      success: true,
      data: ${entityName}s,
    });
  } catch (error) {
    next(error);
  }
};

const update${capitalizedEntity} = async (req, res, next) => {
  try {
    const logger = res.locals.logger.child({ module: '${moduleName}' });
    const { id } = req.params;
    const updates = req.body;

    logger.info('Updating ${entityName}', { id, updates });

    const ${entityName} = await ${entityName}Service.update${capitalizedEntity}(id, updates);

    logger.info('${capitalizedEntity} updated successfully', { id: ${entityName}.id });

    res.status(200).json({
      success: true,
      data: ${entityName},
    });
  } catch (error) {
    next(error);
  }
};

const delete${capitalizedEntity} = async (req, res, next) => {
  try {
    const logger = res.locals.logger.child({ module: '${moduleName}' });
    const { id } = req.params;

    logger.info('Deleting ${entityName}', { id });

    const result = await ${entityName}Service.delete${capitalizedEntity}(id);

    logger.info('${capitalizedEntity} deleted successfully', { id });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create${capitalizedEntity},
  get${capitalizedEntity},
  getAll${capitalizedEntity}s,
  update${capitalizedEntity},
  delete${capitalizedEntity},
};
`;

// Routes file
const routesContent = `const express = require('express');
const ${moduleName}Controller = require('./${moduleName}.controller');
const {
  create${capitalizedEntity}Schema,
  update${capitalizedEntity}Schema,
  ${entityName}IdSchema,
  validate,
} = require('../../entities/${entityName}/${entityName}.validators');

const router = express.Router();

// POST /api/v1/${moduleName}
router.post(
  '/',
  validate(create${capitalizedEntity}Schema),
  ${moduleName}Controller.create${capitalizedEntity}
);

// GET /api/v1/${moduleName}
router.get('/', ${moduleName}Controller.getAll${capitalizedEntity}s);

// GET /api/v1/${moduleName}/:id
router.get(
  '/:id',
  validate(${entityName}IdSchema),
  ${moduleName}Controller.get${capitalizedEntity}
);

// PATCH /api/v1/${moduleName}/:id
router.patch(
  '/:id',
  validate(${entityName}IdSchema),
  validate(update${capitalizedEntity}Schema),
  ${moduleName}Controller.update${capitalizedEntity}
);

// DELETE /api/v1/${moduleName}/:id
router.delete(
  '/:id',
  validate(${entityName}IdSchema),
  ${moduleName}Controller.delete${capitalizedEntity}
);

module.exports = router;
`;

// Write files
fs.writeFileSync(path.join(moduleDir, `${moduleName}.controller.js`), controllerContent);
fs.writeFileSync(path.join(moduleDir, `${moduleName}.routes.js`), routesContent);

console.log(`✅ Module "${moduleName}" created successfully at ${moduleDir}`);
console.log('\nFiles created:');
console.log(`  - ${moduleName}.controller.js`);
console.log(`  - ${moduleName}.routes.js`);
console.log('\nNext steps:');
console.log(`  1. Register routes in src/app.js:`);
console.log(`     const ${moduleName}Routes = require('./routes/${moduleName}/${moduleName}.routes');`);
console.log(`     app.use('/api/v1/${moduleName}', ${moduleName}Routes);`);
console.log(`  2. Test your endpoints`);
