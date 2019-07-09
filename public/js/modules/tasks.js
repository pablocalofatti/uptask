import axios from 'axios';
import Swal from 'sweetalert2';
import {updateProgress} from '../functions/progress';

const tasks = document.querySelector('.listado-pendientes');

if(tasks){

    tasks.addEventListener('click', e =>{
        if(e.target.classList.contains('fa-check-circle')){
            const icon = e.target;
            const idTask = icon.parentElement.parentElement.dataset.task;
            //request to /tasks/:id
            const url = `${location.origin}/tasks/${idTask}`;
            console.log(`id state${idTask} url state${url}`)
            axios.patch(url, {idTask})
                .then((res)=>{
                    if(res.status === 200){
                    icon.classList.toggle('completo');
                    updateProgress();
                    }
                })
                .catch(err=>{
                    console.log(err);
                })
        }
        if(e.target.classList.contains('fa-trash')){
            const taskHTML= e.target.parentElement.parentElement,
                    idTask = taskHTML.dataset.task;
                    console.log(taskHTML)
                    console.log(idTask)
                    
                Swal.fire({
                    title: 'Are you sure to delete this task?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
              }).then((result) => {
                if (result.value) {
                    const url = `${location.origin}/tasks/${idTask}`; 
                    //send delete by axios
                    console.log(url)
                    //send petition to axios
                
                axios.delete(url, { params: {idTask}})
                .then(function(res){
                    console.log(res)
                    if(res.status ===200){
                        //delete node
                        taskHTML.parentElement.removeChild(taskHTML);
                        //opcional alert
                        Swal.fire(
                            'Task Deleted!',
                            res.data,
                            'success'
                        );
                        updateProgress();
                    }
                   
                        })
                        .catch(()=>{
                            Swal.fire({
                                type:'error',
                                title: 'Error',
                                text: 'The task could not be deleted'
                            })
                        })
                }
            })
        }
    });
}
export default tasks;