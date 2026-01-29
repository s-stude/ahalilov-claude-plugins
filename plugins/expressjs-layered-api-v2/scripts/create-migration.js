#!/usr/bin/env node

/**
 * Script to generate a Knex migration file
 * Usage: node scripts/create-migration.js <migration-name>
 * Example: node scripts/create-migration.js create_users_table
 */

const { execSync } = require('child_process');

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Error: Migration name is required');
  console.log('Usage: node scripts/create-migration.js <migration-name>');
  console.log('Example: node scripts/create-migration.js create_users_table');
  process.exit(1);
}

try {
  // Run knex migrate:make command
  const command = `npx knex migrate:make ${migrationName} --knexfile src/config/knexfile.js`;
  console.log(`Running: ${command}`);

  execSync(command, { stdio: 'inherit' });

  console.log('\n✅ Migration created successfully');
  console.log('\nNext steps:');
  console.log('  1. Edit the migration file in src/database/migrations/');
  console.log('  2. Run migrations: npm run db:migrate');
} catch (error) {
  console.error('❌ Error creating migration:', error.message);
  process.exit(1);
}
