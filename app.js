// Handle the display toggling between login and signup forms
document.getElementById('signup-link').addEventListener('click', () => {
    document.getElementById('login-form-box').style.display = 'none';
    document.getElementById('signup-form-box').style.display = 'block';
});

document.getElementById('login-link').addEventListener('click', () => {
    document.getElementById('signup-form-box').style.display = 'none';
    document.getElementById('login-form-box').style.display = 'block';
});

// Handle Signup
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
        alert('Signup successful!');
        document.getElementById('signup-form-box').style.display = 'none';
        document.getElementById('login-form-box').style.display = 'block'; // Switch to login form
    } else {
        alert('Error: ' + data.message);
    }
});

// Handle Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
        alert('Login successful!');
        // Redirect to the actual login page or dashboard
        window.location.href = "/dashboard";  // Example redirection, adjust as needed
    } else {
        alert('Error: ' + data.message);
    }
});
