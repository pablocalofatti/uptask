import Swal from 'sweetalert2';
import axios from 'axios';

const btnDelete = document.querySelector('#delete-project');

if(btnDelete){
    btnDelete.addEventListener('click', e =>{
        const projectUrl = e.target.dataset.projectUrl;
        Swal.fire({
                title: 'Are you sure to delete this project?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.value) {
                //send petition to axios
                const url = `${location.origin}/projects/${projectUrl}`;
                axios.delete(url, { params: {projectUrl}})
                    .then(function(res){
                        console.log(res)
                        Swal.fire(
                            'Deleted!',
                            res.data,
                            'success'
                        );
                        //redirect
                        setTimeout(()=>{
                        window.location.href= '/';
                        },3000);
                    })
                    .catch(()=>{
                        Swal.fire({
                            type:'error',
                            title: 'Error',
                            text: 'The project could not be deleted'
                        })
                    })
              
                }
          });
         
    })
}
export default btnDelete;