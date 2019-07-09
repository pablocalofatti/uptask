const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
const db = new Sequelize('todolistnode', 'your user', 'your pass', {
    host: 'localhost',
    dialect: 'mysql',
    port: '3306',
    operatorAliases: false,
    dfine: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
module.exports = db;
