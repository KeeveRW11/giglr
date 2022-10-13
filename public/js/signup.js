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

async function signupFormHandler(event) {
    event.preventDefault();

    const username = document.querySelector('#user-username').value.trim();
    const password = document.querySelector('#user-password').value.trim();

    if (username  && password) {
        const response = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        
     if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      displayModal(`A user by the username ${username} already exists`);
    }
  } else {
    displayModal('Please enter all the required information');
  }
}

document.querySelector('#signup-form').addEventListener('submit', signupFormHandler);