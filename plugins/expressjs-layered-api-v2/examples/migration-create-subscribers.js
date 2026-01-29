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

    // Soft delete flag
    table.boolean('is_deleted').defaultTo(false).notNullable();

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
