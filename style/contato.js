document.addEventListener('DOMContentLoaded', function() {
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';
    if (isAuthenticated) {
        document.getElementById('logout-link').style.display = 'inline-block';
        document.getElementById('login-link').style.display = 'none';
    } else {
        document.getElementById('logout-link').style.display = 'none';
        document.getElementById('login-link').style.display = 'inline-block';
    }
});



function logout() {
    localStorage.removeItem('authenticated');
    window.location.href = 'login.html';
}
