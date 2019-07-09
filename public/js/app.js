import projects from './modules/project';
import tasks from './modules/tasks';
import {updateProgress} from './functions/progress';
document.addEventListener('DOMContentLoaded',()=>{
    updateProgress();
})