async function editFormHandler (event) {
    event.preventDefault();
    console.log(event)

    console.log(event.target);

    const title = event.target.querySelector('input[name="post-title"]').value.trim();
    const idContainer = event.target.querySelector('div[class="card border border-dark"]');
    const id = idContainer.getAttribute('id');
    
    console.log(title, id)
    if (event.submitter.id === 'save-button') {
        
        const response = await fetch (`api/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                title
            }),
            headers: {
                'Content-Type': 'application/JSON'
            }
        })
    
        if (response.ok) {
            document.location.replace('/dashboard')
        } else {
            alert(response.statusText)
        }
    } else if (event.submitter.id === 'delete-button') {
        
        console.log(id);
        const response = await fetch (`api/posts/${id}`, {
            method: 'DELETE',
        })
    
        if (response.ok) {
            document.location.replace('/dashboard')
        } else {
            alert(response.statusText)
        }
    }
    

}

document.querySelectorAll('.edit-meme-form').forEach(item=>{
    item.addEventListener('submit', editFormHandler)
});

