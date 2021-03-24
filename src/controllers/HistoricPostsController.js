const knex = require('../database');

module.exports = {
  async index(req, res, next) {
    try {
      const countObject = knex('post').count();
      const {page} = req.query;
      const query = knex('post')
      .limit(5)
      .offset((page || 0) * 5);

      const [count] = await countObject;
      res.header('X-Total-Count', count["count"], );

      const results = await query;

      return res.json(results);
    } catch (error) {
      next(error);
    }
  }
}