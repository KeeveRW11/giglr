let post_id 

async function commentFormHandler(event) {
    event.preventDefault();
  
    const comment_text = document.querySelector('input[name="comment-text"]').value.trim();
  
    if (comment_text) {
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({
                comment_text,  
                post_id                              
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            post_id = ''
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }

    }
}

async function commentClickHandler(event) {
    const commentButton = event.target

    if (commentButton.matches('#comment-btn')) {
        post_id = commentButton.dataset.id
    }
    
}  

document.querySelector('#add-comment-form').addEventListener('submit', commentFormHandler);
document.querySelector('.edit-meme-form').addEventListener('click', commentClickHandler)