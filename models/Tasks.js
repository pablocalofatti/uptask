const Sequelize = require('sequelize');
const db= require('../config/db');
const Projects = require('./Projects');

const Tasks =db.define('Todotasksdb', {
    id:{
        type: Sequelize.INTEGER(100),
        primaryKey: true,
        autoIncrement: true
    },
    task: Sequelize.STRING(100),
    state:Sequelize.INTEGER
});
Tasks.belongsTo(Projects);

module.exports = Tasks;