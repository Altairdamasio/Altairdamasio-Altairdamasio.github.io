document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (email === 'altairdamasiod@gmail.com' && senha === '22562208Altair') {
        localStorage.setItem('authenticated', 'true');
        window.location.href = '../index.html';
    } else {
        alert('Credenciais inválidas');
    };

    if (isAuthenticated) {
        document.getElementById('logout-link').style.display = 'inline-block';
        document.getElementById('login-link').style.display = 'none';
    } else {
        document.getElementById('logout-link').style.display = 'none';
        document.getElementById('login-link').style.display = 'inline-block';
    }
});
