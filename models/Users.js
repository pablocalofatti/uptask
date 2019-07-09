const Sequelize = require('sequelize');
const db= require('../config/db');
const Projects = require('../models/Projects');
const bcrypt = require('bcrypt-nodejs');

const Users = db.define('Usersdb',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: { 
        type: Sequelize.STRING(60)
    },
    lastname: { 
        type: Sequelize.STRING(60)
    },
    email:{
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Add a valid E-mail'
            },
            notEmpty: {
                msg: 'the e-mail can not go empty'
            }
        },
        unique: {
            args: true,
            msg: 'User already registered'
        }
    },
    password:{
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'the password can not go empty'
            }
        }
    },
    active:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token:Sequelize.STRING,
    expiration: Sequelize.DATE
},{
    hooks: {
        beforeCreate(user){
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
        }
    }
});
Users.prototype.verifyPassword =function(password){
    return bcrypt.compareSync(password, this.password);
}
Users.hasMany(Projects);
module.exports = Users;