/// single post page and dashboard. If logged in you can comment from single post page
// will need to check were we are looking for click in the modal

async function commentFormHandler(event) {
    event.preventDefault();
  
    const comment_text = document.querySelector('textarea[name="comment-text"]').value.trim();
  
    const post_id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
  
    if (comment_text) {
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({
                post_id,
                comment_text
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.reload();
        } else {
            alert(response.statusText);
        }
    }
}
  
document.querySelector('.modal-footer').addEventListener('submit', commentFormHandler);