const knexfile = require('../../knexfile');
const knex = require('knex')(knexfile['production']);

module.exports = knex;