/// single post page and dashboard. If logged in you can comment from single post page
// will need to check were we are looking for click in the modal
let post_id 

async function commentFormHandler(event) {
    event.preventDefault();
  
    const comment_text = document.querySelector('input[name="comment-text"]').value.trim();
    console.log(comment_text);
    // //const post_id = window.location.toString().split('/')[
    //   window.location.toString().split('/').length - 1
    // ];
  
    if (comment_text) {
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({
                comment_text,
                //user_id: 1,  
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
        console.log(post_id);
    }
    
}  

document.querySelector('#add-comment-form').addEventListener('submit', commentFormHandler);
document.querySelector('.edit-meme-form').addEventListener('click', commentClickHandler)