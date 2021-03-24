module.exports = {  
  development: {
    client: 'pg',
    connection:{
      database: 'trends',
      user: 'postgres',
      port: '5432',
      password: '1234',
    },
    migrations: {
      tablename: 'knex_migrations',
      directory: `${__dirname}/src/database/migrations`,
    },
    seeds: {
      directory: `${__dirname}/src/database/seeds`
    }
  },
  production: {
    client: 'pg',
    connection:{
      host: process.env.DBHOST,
      database: process.env.DB,
      user: process.env.DBUSER,
      port: process.env.DBPORT,
      password: process.env.DBPASSWORD,
      ssl: {
        rejectUnauthorized: false
      },
    },
    migrations: {
      tablename: 'knex_migrations',
      directory: `${__dirname}/src/database/migrations`,
    },
    seeds: {
      directory: `${__dirname}/src/database/seeds`
    }
  }
};