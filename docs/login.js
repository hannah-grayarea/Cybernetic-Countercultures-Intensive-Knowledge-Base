function checkPassword() {
    const password = document.getElementById('password').value;
    const correctPassword = 'Heinz24'; // Replace with your desired password

    if (password === correctPassword) {
        localStorage.setItem('isAuthenticated', 'true');
        window.location.href = 'index.html';
    } else {
        alert('Incorrect password. Please try again.');
    }
}

// Redirect to login page if not authenticated
if (!localStorage.getItem('isAuthenticated')) {
    window.location.href = 'login.html';
}
