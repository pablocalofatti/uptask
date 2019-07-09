const Projects = require('../models/Projects')
const Tasks = require('../models/Tasks');

exports.projectHome = async (req, res) => {
    //console.log(res.locals.user);
    const UsersdbId =res.locals.user.id
    const projects = await Projects.findAll({where:{UsersdbId}});
    res.render('index', {
        pageName: 'Dashboard',
        projects
    })
}
exports.projectForm = async(req, res) => {
    const UsersdbId =res.locals.user.id
    const projects = await Projects.findAll({where:{UsersdbId}});
    res.render('newProject', {
        pageName: 'New Project',
        projects
    })
}
exports.newProject = async (req, res) => {
    const UsersdbId =res.locals.user.id
    const projects = await Projects.findAll({where:{UsersdbId}});
    
    //if are somthing in the input 
    const { name } = req.body;
    let errors = [];
    if (!name) {
        errors.push({ 'text': 'add a name to your project' })
    }
    // if errors its true
    if (errors.length > 0) {
        res.render('newProject', {
            pageName: 'new-project',
            errors,
            projects
        })
    } else {
        //insert into db
        const UsersdbId =res.locals.user.id
        await Projects.create({ name, UsersdbId });
        res.redirect('/'); 
    }
}
exports.projectsByUrl = async (req, res, next) =>{
    const UsersdbId =res.locals.user.id
    const projectsPromise =  Projects.findAll({where:{UsersdbId}});
    const projectPromise =  Projects.findOne({
        where:{
            url: req.params.url,
            UsersdbId
        }
    });
    const [projects, project] = await Promise.all([projectsPromise, projectPromise]);
    //consult task of the current project
    const tasks = await Tasks.findAll({
        where: {
            TododbId:  project.id
        } 
    })
    
    if(!project) return next();
    // render to the view
    res.render('task', {
        pageName: 'Project Task',
        project,
        projects,
        tasks
    })
}
exports.editForm =async(req, res) =>{
    const UsersdbId =res.locals.user.id
    const projectsPromise =  Projects.findAll({where:{UsersdbId}});
    const projectPromise =  Projects.findOne({
        where:{
            id: req.params.id,
            UsersdbId
        }
    });
    const [projects, project] = await Promise.all([projectsPromise, projectPromise])
    //render the view
    res.render('newProject', {
        pageName: 'Edit Project',
        projects,
        project
    })
}
exports.updateProject = async (req, res) => {
    const UsersdbId =res.locals.user.id
    const projects = await Projects.findAll({where:{UsersdbId}});
    //send to the console usr write
    //console.log(req.body)
    //if are somthing in the input 
    const { name } = req.body;
    let errors = [];
    if (!name) {
        errors.push({ 'text': 'add a name to your project' })
    }
    // if errors its true
    if (errors.length > 0) {
        res.render('newProject', {
            pageName: 'new-project',
            errors,
            projects
        })
    } else {
        //insert into db
        await Projects.update(
            { name: name },
            {where: {id: req.params.id}}
            );
        res.redirect('/'); 
    }
}
exports.deleteProject = async(req, res, next)=>{
    const {projectUrl} = req.query;
    const result = await Projects.destroy({where: {url:projectUrl}});
    if(!result){
        return next();
    }
    res.status(200).send('the project has been delete');
}