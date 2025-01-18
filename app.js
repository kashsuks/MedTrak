// Simulated database (for now, we'll just store usernames and passwords in an object)
let usersDB = {
    "JohnDoe": { password: "password123" },
    "JaneSmith": { password: "password456" }
};

// Simulated session (keep track of logged-in user)
let loggedInUser = null;

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (usersDB[username] && usersDB[username].password === password) {
        loggedInUser = username;
        showHomePage();
    } else {
        alert('Invalid login credentials');
    }
});

// Handle signup form submission
document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    if (!usersDB[username]) {
        usersDB[username] = { password: password };
        loggedInUser = username;
        alert('Sign up successful!');
        showHomePage();
    } else {
        alert('Username already exists');
    }
});

// Show the home page and hide login/signup forms
function showHomePage() {
    document.getElementById('login-form-box').style.display = 'none';
    document.getElementById('signup-form-box').style.display = 'none';
    document.getElementById('home-content').style.display = 'block';
    document.getElementById('greeting').innerText = `Hello, ${loggedInUser}!`;
    loadPastData();
}

// Load dummy past data (just for demonstration purposes)
function loadPastData() {
    const pastData = [
        { medication: 'Aspirin', dateTaken: '2025-01-15', dosage: '500mg' },
        { medication: 'Ibuprofen', dateTaken: '2025-01-14', dosage: '200mg' }
    ];

    const dataList = document.getElementById('past-data');
    dataList.innerHTML = '';  // Clear any previous data

    pastData.forEach(item => {
        const dataItem = document.createElement('div');
        dataItem.classList.add('data-item');
        dataItem.innerHTML = `
            <h4>Medication: ${item.medication}</h4>
            <p><strong>Date Taken:</strong> ${item.dateTaken}</p>
            <p><strong>Dosage:</strong> ${item.dosage}</p>
        `;
        dataList.appendChild(dataItem);
    });
}

// Toggle between login and signup forms
document.getElementById('signup-link').addEventListener('click', () => {
    document.getElementById('login-form-box').style.display = 'none';
    document.getElementById('signup-form-box').style.display = 'block';
});

document.getElementById('login-link').addEventListener('click', () => {
    document.getElementById('signup-form-box').style.display = 'none';
    document.getElementById('login-form-box').style.display = 'block';
});

// Handle logout functionality
document.getElementById('logout-btn').addEventListener('click', () => {
    loggedInUser = null;
    alert('You have been logged out');
    window.location.reload(); // Reload the page to reset the state
});
