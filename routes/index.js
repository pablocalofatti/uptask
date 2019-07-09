const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectControllers');
const taskController = require('../controllers/taskController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
//express validator
const {body}= require('express-validator/check');
module.exports = function() {
    //routes 
    router.get('/', 
        //home route
        authController.userOk,
        projectController.projectHome
        );

    router.get('/new-project', 
        authController.userOk,
        projectController.projectForm
        );

    router.post('/new-project', 
        authController.userOk,
        body('name').not().isEmpty().trim().escape(),
        projectController.newProject
    );
    // project list
    router.get('/projects/:url', 
        authController.userOk,
        projectController.projectsByUrl
        );
    //update project
    router.get('/project/edit/:id', 
        authController.userOk,
        projectController.editForm
        );

    router.post('/new-project/:id',
        authController.userOk, 
        body('name').not().isEmpty().trim().escape(),
        projectController.updateProject
    );
    //delete project
    router.delete('/projects/:url', 
        authController.userOk,
        projectController.deleteProject
        );
    //Tasks
    router.post('/projects/:url', 
        authController.userOk,
        taskController.addTask
        );
    //update task
    router.patch('/tasks/:id', 
        authController.userOk,
        taskController.changeTaskState
        );
    //delete task
    router.delete('/tasks/:id', 
        authController.userOk,
        taskController.deleteTask
        );
    //create new account
    router.get('/create-account', userController.formCreateAccount);
    router.post('/create-account', userController.createAccount);
    router.get('/confirm/:mail', userController.confirmAccount);
    //log in
    router.get('/start-session', userController.formStartSession);
    router.post('/start-session', authController.authUser);
    //close session
    router.get('/close-session', authController.closeSession);
    //reestablish password
    router.get('/reestablish', userController.formResetPassword);
    router.post('/reestablish', authController.sendToken);
    router.get('/reestablish/:token', authController.validateToken);
    router.post('/reestablish/:token', authController.updatePassword);
    return router
}