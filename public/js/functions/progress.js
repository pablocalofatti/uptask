import Swal from 'sweetalert2';
export const updateProgress = ()=>{
    //select existent task
    const tasks = document.querySelectorAll('li.task');
    if(tasks.length){
    //select completed task
    const taskCompleted = document.querySelectorAll('i.completo');
    //calculate progress
    const progress = Math.round((taskCompleted.length / tasks.length)*100);
    //show progress
    const percentage =  document.querySelector('#percentage');
    percentage.style.width = progress+'%';
    if(progress === 100){
        Swal.fire(
            'Project Completed!',
            'Congratulations you have finished your task',
            'success'
        );
        }
    }
}