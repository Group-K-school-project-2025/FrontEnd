const form = document.getElementById('loginForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('https://backend-7hqy.onrender.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (result.success) {
      alert('Welcome to AMi web design!');
      localStorage.setItem('username', username); // Store the username in local storage
      // for example, redirect to a dashboard page
      window.location.href = 'Dashboard.html'; //go to dashboard page
    } else {
      alert('Login failed: ' + result.message);
    }
  });