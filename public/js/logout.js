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

async function logoutClickHandler(){
    const response = await fetch('/api/users/logout', {
        method:'POST',
        headers:{'Content-Type':'application/json'}
    })
    
    if(response.ok){
        document.location.replace('/');
    } else {
        displayModal('Invalid operation');
    }
}

document.querySelector('#logout-btn').addEventListener('click', logoutClickHandler);