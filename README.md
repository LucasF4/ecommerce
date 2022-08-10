# ecommerce
Ecommerce test

//Connection Server
{
    "type": "postgres",
    "host": "",
    "port": "",
    "username": "",
    "password": "",
    "database": "",
    "synchronize": false,
    "extra": {
        "ssl": {
            "require": true,
            "rejectUnauthorized": false,
        }
    },
    "entities": [
        "src/app/models/*.js"
    ],
    "migrations": [
        "src/database/migrations/*.js"
    ],
    "cli": {
        "migrationsDir": "src/database/migrations"
    }
}