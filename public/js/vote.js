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

async function voteClickHandler(event){
    const btnClick = event.target;
    if(btnClick.matches('#vote-btn')){
        const response = await fetch('/api/posts/upvote', {
            method:'PUT',
            body:JSON.stringify({
                post_id:btnClick.dataset.id
            }),
            headers:{
                'Content-Type':'application/json'
            }
        })

        if(response.ok){
            if(btnClick.dataset.page === 'single-post'){
                document.location.reload();
            }
            if(btnClick.dataset.page === 'dashboard'){
                document.location.reload();
            }
        } else {
            displayModal('You have already upvoted the post');
        }
    }
}

document.querySelector('#meme').addEventListener('click', voteClickHandler);