const Sequelize = require('sequelize');
const slug = require('slug');
const shortid = require('shortid');
//conect db
const db = require('../config/db');

const Projects = db.define('Tododb', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
       
    },
    name: Sequelize.STRING,
    url: Sequelize.STRING
    }, 
    {
        hooks: {
            beforeCreate(project){
            const url= slug(project.name).toLowerCase();
            project.url=`${url}-${shortid.generate()}`;
        }
    }
});
module.exports = Projects;