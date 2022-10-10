async function loginFormHandler(event) {
    event.preventDefault();
  
    const username = document.querySelector('#user-username').value.trim();
    const password = document.querySelector('#user-password').value.trim();
        console.log(username);
        console.log(password);
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
        alert(response.statusText);
      }
    }

}
  
document.querySelector('#login-form').addEventListener('submit', loginFormHandler);