const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'lm*73642',
        database: 'empad'
    }
})

module.exports = knex;