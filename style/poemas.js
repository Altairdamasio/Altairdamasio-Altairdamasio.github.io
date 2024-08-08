document.addEventListener('DOMContentLoaded', function() {
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';

    if (isAuthenticated) {
        document.getElementById('novo-poema').style.display = 'block';
        document.getElementById('negrito-titulo-label').style.display = 'block';
        document.getElementById('adicionar-poema-btn').style.display = 'block';
        document.getElementById('excluir-todos-label').style.display = 'block';
        document.getElementById('excluir-todos-btn').style.display = 'block';
        document.getElementById('logout-link').style.display = 'inline-block';
        document.getElementById('login-link').style.display = 'none';
    } else { 
        document.getElementById('logout-link').style.display = 'none';
        document.getElementById('login-link').style.display = 'inline-block';
    
    }

    const poemaLista = document.getElementById('poema-lista');
    if (poemaLista) {
        poemaLista.addEventListener('click', function(event) {
            if (event.target.tagName === 'LI') {
                const poemaTexto = JSON.parse(event.target.getAttribute('data-poema'));
                const titulo = poemaTexto.negritoTitulo ? `<strong>${poemaTexto.titulo}</strong>` : poemaTexto.titulo;
                const conteudo = poemaTexto.conteudo.replace(/\n/g, '<br>');
                document.getElementById('poema-conteudo').innerHTML = `<div>${titulo}</div><div>${conteudo}</div>`;
                
                if (isAuthenticated) {
                    document.getElementById('editar-poema-btn').style.display = 'block';
                    document.getElementById('excluir-poema-btn').style.display = 'block';
                } else {
                    document.getElementById('editar-poema-btn').style.display = 'none';
                    document.getElementById('excluir-poema-btn').style.display = 'none';
                }

                document.getElementById('editar-poema-btn').setAttribute('data-index', event.target.getAttribute('data-index'));
                document.getElementById('excluir-poema-btn').setAttribute('data-index', event.target.getAttribute('data-index'));
            }
        });
        carregarPoemas();
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Simulação de autenticação
            if (email === 'altairdamasio@gmail.com' && password === 'admin') {
                localStorage.setItem('authenticated', 'true');
                window.location.href = 'poemas.html';
            } else {
                alert('Credenciais inválidas!');
            }
        });
    }
});

function adicionarPoema() {
    const poemaInput = document.getElementById('novo-poema');
    const poema = poemaInput.value;
    const negritoTitulo = document.getElementById('negrito-titulo').checked;
    

    if (poema.trim()) {
        const poemaLista = document.getElementById('poema-lista');
        const li = document.createElement('li');
        const titulo = poema.split('\n')[0];
        const conteudo = poema.substring(titulo.length).trim();
        li.innerHTML = negritoTitulo ? `<strong>${titulo}</strong>` : titulo;
        const poemaObj = {
            titulo: titulo,
            conteudo: conteudo,
            negritoTitulo: negritoTitulo
        };
        li.setAttribute('data-poema', JSON.stringify(poemaObj));
        li.setAttribute('data-index', poemaLista.childElementCount);
        poemaLista.appendChild(li);
        poemaInput.value = '';

        salvarPoema(poemaObj);
    }
    else {
        alert('O poema não pode ser vazio.');
    }
}

function carregarPoemas() {
    const poemas = JSON.parse(localStorage.getItem('poemas')) || [];
    const poemaLista = document.getElementById('poema-lista');

    poemas.forEach((poemaObj, index) => {
        const li = document.createElement('li');
        const { titulo, conteudo, negritoTitulo } = poemaObj;
        li.innerHTML = negritoTitulo ? `<strong>${titulo}</strong>` : titulo;
        li.setAttribute('data-poema', JSON.stringify(poemaObj));
        li.setAttribute('data-index', index);
        poemaLista.appendChild(li);
    });
}

function salvarPoema(poemaObj) {
    const poemas = JSON.parse(localStorage.getItem('poemas')) || [];
    poemas.push(poemaObj);
    localStorage.setItem('poemas', JSON.stringify(poemas));
}

function editarPoema() {
    const index = document.getElementById('editar-poema-btn').getAttribute('data-index');
    const poemas = JSON.parse(localStorage.getItem('poemas')) || [];
    const poemaObj = poemas[index];

    const novoPoema = prompt('Edite o poema:', `${poemaObj.titulo}\n${poemaObj.conteudo}`);
    const negritoTitulo = confirm('O título deve estar em negrito?');

    if (novoPoema !== null) {
        const titulo = novoPoema.split('\n')[0];
        const conteudo = novoPoema.substring(titulo.length).trim();
        poemas[index] = { titulo: titulo, conteudo: conteudo, negritoTitulo: negritoTitulo };
        localStorage.setItem('poemas', JSON.stringify(poemas));
        window.location.reload();
    }
}

function excluirPoema() {
    const index = document.getElementById('excluir-poema-btn').getAttribute('data-index');
    const poemas = JSON.parse(localStorage.getItem('poemas')) || [];
    poemas.splice(index, 1);
    localStorage.setItem('poemas', JSON.stringify(poemas));
    window.location.reload();
}

function excluirTodos() {
    const excluirTodosCheckbox = document.getElementById('excluir-todos');
    if (excluirTodosCheckbox.checked) {
        const confirmacao = confirm('Tem certeza de que deseja excluir todos os poemas?');
        if (confirmacao) {
            localStorage.removeItem('poemas');
            window.location.reload();
        }
    } else {
        alert('Marque a checkbox para confirmar a exclusão de todos os poemas.');
    }
}

function logout() {
    localStorage.removeItem('authenticated');
    window.location.href = 'login.html';
}
