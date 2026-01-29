#!/usr/bin/env node

/**
 * Script to generate a standard entity with service, repository, validators, and DTOs
 * Usage: node scripts/create-entity.js <entity-name>
 * Example: node scripts/create-entity.js subscribers
 */

const fs = require('fs');
const path = require('path');

const entityName = process.argv[2];

if (!entityName) {
  console.error('Error: Entity name is required');
  console.log('Usage: node scripts/create-entity.js <entity-name>');
  console.log('Example: node scripts/create-entity.js subscribers');
  process.exit(1);
}

const entityDir = path.join(process.cwd(), 'src', 'entities', entityName);

// Check if entity already exists
if (fs.existsSync(entityDir)) {
  console.error(`Error: Entity "${entityName}" already exists at ${entityDir}`);
  process.exit(1);
}

// Create entity directory
fs.mkdirSync(entityDir, { recursive: true });

// Generate file contents
const tableName = entityName;
const capitalizedName = entityName.charAt(0).toUpperCase() + entityName.slice(1);

// Repository file
const repositoryContent = `const { db } = require('../../config/database');

const TABLE_NAME = '${tableName}';

const create${capitalizedName} = async (${entityName}Data) => {
  const [${entityName}] = await db(TABLE_NAME)
    .insert(${entityName}Data)
    .returning('*');
  return ${entityName};
};

const find${capitalizedName}ById = async (id) => {
  return db(TABLE_NAME)
    .where({ id, is_deleted: false })
    .first();
};

const getAll${capitalizedName}s = async () => {
  return db(TABLE_NAME)
    .select('*')
    .where({ is_deleted: false })
    .orderBy('created_at', 'desc');
};

const update${capitalizedName} = async (id, updates) => {
  const [${entityName}] = await db(TABLE_NAME)
    .where({ id, is_deleted: false })
    .update({
      ...updates,
      updated_at: new Date(),
    })
    .returning('*');
  return ${entityName};
};

const delete${capitalizedName} = async (id) => {
  // Soft delete: set is_deleted to true instead of removing from database
  const [${entityName}] = await db(TABLE_NAME)
    .where({ id, is_deleted: false })
    .update({
      is_deleted: true,
      updated_at: new Date(),
    })
    .returning('*');
  return ${entityName};
};

module.exports = {
  create${capitalizedName},
  find${capitalizedName}ById,
  getAll${capitalizedName}s,
  update${capitalizedName},
  delete${capitalizedName},
};
`;

// DTOs file
const dtosContent = `const ${entityName}Dto = (${entityName}Record) => ({
  id: ${entityName}Record.id,
  // TODO: Add other fields with camelCase mapping
  createdAt: ${entityName}Record.created_at,
  updatedAt: ${entityName}Record.updated_at,
});

module.exports = {
  ${entityName}Dto,
};
`;

// Validators file
const validatorsContent = `const { z } = require('zod');

const create${capitalizedName}Schema = z.object({
  // TODO: Add validation rules for your entity
  // Example: name: z.string().min(1, { message: "Name is required" }),
});

const update${capitalizedName}Schema = z.object({
  // TODO: Add validation rules for updates (usually optional fields)
});

const ${entityName}IdSchema = z.object({
  id: z.string().min(1, { message: "${capitalizedName} ID is required" }),
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

module.exports = {
  create${capitalizedName}Schema,
  update${capitalizedName}Schema,
  ${entityName}IdSchema,
  validate,
};
`;

// Service file
const serviceContent = `const ${entityName}Repository = require('./${entityName}.repository');
const { ${entityName}Dto } = require('./${entityName}.dtos');
const { generateShortUID } = require('../../utils/id-generator');

const create${capitalizedName} = async (data) => {
  // TODO: Add business logic here
  // Example: Check for existing record, normalize data, etc.

  const ${entityName}Data = {
    id: generateShortUID('${entityName.substring(0, 3)}'),
    ...data,
  };

  const ${entityName} = await ${entityName}Repository.create${capitalizedName}(${entityName}Data);
  return ${entityName}Dto(${entityName});
};

const get${capitalizedName}ById = async (id) => {
  const ${entityName} = await ${entityName}Repository.find${capitalizedName}ById(id);

  if (!${entityName}) {
    throw new Error('${capitalizedName} not found');
  }

  return ${entityName}Dto(${entityName});
};

const getAll${capitalizedName}s = async () => {
  const ${entityName}s = await ${entityName}Repository.getAll${capitalizedName}s();
  return ${entityName}s.map(${entityName}Dto);
};

const update${capitalizedName} = async (id, updates) => {
  const existing${capitalizedName} = await ${entityName}Repository.find${capitalizedName}ById(id);

  if (!existing${capitalizedName}) {
    throw new Error('${capitalizedName} not found');
  }

  // TODO: Add business logic for updates

  const ${entityName} = await ${entityName}Repository.update${capitalizedName}(id, updates);
  return ${entityName}Dto(${entityName});
};

const delete${capitalizedName} = async (id) => {
  const existing${capitalizedName} = await ${entityName}Repository.find${capitalizedName}ById(id);

  if (!existing${capitalizedName}) {
    throw new Error('${capitalizedName} not found');
  }

  await ${entityName}Repository.delete${capitalizedName}(id);
  return { success: true };
};

module.exports = {
  create${capitalizedName},
  get${capitalizedName}ById,
  getAll${capitalizedName}s,
  update${capitalizedName},
  delete${capitalizedName},
};
`;

// Write files
fs.writeFileSync(path.join(entityDir, `${entityName}.repository.js`), repositoryContent);
fs.writeFileSync(path.join(entityDir, `${entityName}.dtos.js`), dtosContent);
fs.writeFileSync(path.join(entityDir, `${entityName}.validators.js`), validatorsContent);
fs.writeFileSync(path.join(entityDir, `${entityName}.service.js`), serviceContent);

console.log(`✅ Entity "${entityName}" created successfully at ${entityDir}`);
console.log('\nFiles created:');
console.log(`  - ${entityName}.repository.js`);
console.log(`  - ${entityName}.dtos.js`);
console.log(`  - ${entityName}.validators.js`);
console.log(`  - ${entityName}.service.js`);
console.log('\nNext steps:');
console.log(`  1. Create a migration: npm run migrate:make create_${tableName}_table`);
console.log(`  2. Update the DTO mapping in ${entityName}.dtos.js`);
console.log(`  3. Add validation rules in ${entityName}.validators.js`);
console.log(`  4. Implement business logic in ${entityName}.service.js`);
console.log(`  5. Create routes module: node scripts/create-module.js ${entityName}`);
