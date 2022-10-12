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

async function loginFormHandler(event) {
    event.preventDefault();
  
    const username = document.querySelector('#user-username').value.trim();
    const password = document.querySelector('#user-password').value.trim();

    if (username && password) {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({
          username,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (response.ok) {
        document.location.replace('/');
      } else {
        if(response.statusText){
          displayModal('Invalid credentials');
        }
        
      }
    } else {
      displayModal('Please enter all the required information');
    }

}
  
document.querySelector('#login-form').addEventListener('submit', loginFormHandler);