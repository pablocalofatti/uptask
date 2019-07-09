const Projects = require('../models/Projects');
const Tasks = require('../models/Tasks');

exports.addTask =async (req, res, next)=>{
    //get current project
    const project = await Projects.findOne({where:{url: req.params.url}});

    //read input value
    const {task} = req.body;
    //status 0 = incomplet
    const state = 0;
    const TododbId = project.id;
    //Insert in to DB
    const result = await Tasks.create({task, state, TododbId});
    if (!result){
        next();
    }
    //redirect
    res.redirect(`/projects/${req.params.url}`);
}
exports.changeTaskState = async (req, res, next)=>{
    const { id } = req.params;
    const task = await Tasks.findOne({where:{id}});
    
    //change task status
    let state = 0;
    if(task.state === state){
        state = 1;
    }
    task.state=state;
    const result = await task.save();
    if(!result) return next();
    res.status(200).send('updated')
}
exports.deleteTask = async(req,res,next)=>{
    const { id } = req.params;
    const result = await Tasks.destroy({where:{id}});
    if(!result){
        return next();
    }
    res.status(200).send('delete')
}