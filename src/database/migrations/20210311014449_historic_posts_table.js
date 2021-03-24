
exports.up = function (knex) {
  return knex.schema.createTable('post', (table) => {
    table.increments('id').primary();
    table.text('posts');
    table.timestamp('data').defaultTo(knex.fn.now());
  });
}

exports.down = function (knex) {
  return knex.schema.dropTable('post');
};
