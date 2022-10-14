function displayModal(errorString){
    var galleryModal = new bootstrap.Modal(
        document.getElementById("error-handling"),
        {
          keyboard: false,
        }
      );
      
      galleryModal.show();
      
      const errorEl = document.querySelector('#error-text');
      
      errorEl.textContent = errorString;
}

async function editFormHandler (event) {
    event.preventDefault();

    // const title = event.target.querySelector('input[name="post-title"]').value.trim();
    // const idContainer = event.target.querySelector('div[class="card border border-dark"]');
    // const id = idContainer.getAttribute('id');

    const btnClick = event.target;
    
    if (btnClick.matches('#save-button')) {
        
        const response = await fetch (`api/posts/${btnClick.dataset.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                title
            }),
            headers: {
                'Content-Type': 'application/JSON'
            }
        })
    
        if (response.ok) {
            document.location.reload();
        } else {
           if(response.status === 404){
            displayModal('Post not found');
           }

           if(response.status === 500){
            displayModal('Unable to update the post');
           }
        }
    } else if (btnClick.matches('#delete-button')) {
        
        const response = await fetch (`api/posts/${btnClick.dataset.id}`, {
            method: 'DELETE',
        })
    
        if (response.ok) {
            document.location.replace('/dashboard')
        } else {
            if(response.status === 404){
                displayModal('Post not found');
            }
            if(response.status === 500){
                displayModal('Unable to delete post at this time');
            }
        }
    }
    

}

// document.querySelectorAll('.edit-meme-form').forEach(item=>{
//     item.addEventListener('submit', editFormHandler)
// });

document.querySelector('#meme').addEventListener('click', editFormHandler);
