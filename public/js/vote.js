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
                document.location.replace(`/post/${btnClick.dataset.id}`);
            }
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('#meme-card').addEventListener('click', voteClickHandler);