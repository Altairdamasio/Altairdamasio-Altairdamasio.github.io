// style/musicas.js

let db;
const request = indexedDB.open('musicasDB', 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore('musicas', { keyPath: 'name' });
};

request.onsuccess = function(event) {
    db = event.target.result;
    loadMusicas();
};

request.onerror = function(event) {
    console.error('Erro ao abrir o IndexedDB:', event);
};

document.addEventListener('DOMContentLoaded', function() {
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';

    if (isAuthenticated) {
        document.getElementById('upload-form').style.display = 'block';
        document.getElementById('logout-link').style.display = 'inline-block';
        document.getElementById('login-link').style.display = 'none';
        document.getElementById('nova-musica').addEventListener('change', handleFileSelect);
        document.getElementById('upload-form').addEventListener('submit', uploadMusica);
    } else { 
        document.getElementById('logout-link').style.display = 'none';
        document.getElementById('login-link').style.display = 'inline-block';
    }
});

function loadMusicas() {
    const transaction = db.transaction(['musicas'], 'readonly');
    const objectStore = transaction.objectStore('musicas');
    const request = objectStore.getAll();

    request.onsuccess = function(event) {
        const musicas = event.target.result;
        const musicaLista = document.getElementById('musica-lista');

        musicas.forEach(musica => {
            const li = document.createElement('li');
            li.innerHTML = `
                <b>${musica.name}</b>
                <audio controls>
                    <source src="${musica.url}" type="${musica.type}">
                    Seu navegador não suporta o elemento de áudio.
                </audio>
                ${localStorage.getItem('authenticated') === 'true' ? '<button onclick="removerMusica(this)">Excluir</button>' : ''}
            `;
            musicaLista.appendChild(li);
        });
    };
}

function saveMusica(musica) {
    const transaction = db.transaction(['musicas'], 'readwrite');
    const objectStore = transaction.objectStore('musicas');
    const request = objectStore.add(musica);

    request.onsuccess = function() {
        console.log('Música salva com sucesso no IndexedDB.');
    };

    request.onerror = function() {
        console.error('Erro ao salvar a música no IndexedDB:', request.error);
    };
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const newMusica = {
                name: file.name,
                url: e.target.result,
                type: file.type
            };
            saveMusica(newMusica);
            const musicaLista = document.getElementById('musica-lista');
            const li = document.createElement('li');
            li.innerHTML = `
                <b>${file.name}</b>
                <audio controls>
                    <source src="${e.target.result}" type="${file.type}">
                    Seu navegador não suporta o elemento de áudio.
                </audio>
                <button onclick="removerMusica(this)">Excluir</button>
            `;
            musicaLista.appendChild(li);
        };
        reader.readAsDataURL(file);
    }
}

function uploadMusica(event) {
    event.preventDefault();
    const fileInput = document.getElementById('nova-musica');
    const file = fileInput.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        fetch('upload.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.url) {
                const newMusica = {
                    name: data.name,
                    url: data.url,
                    type: 'audio/mp3'
                };
                saveMusica(newMusica);
                const musicaLista = document.getElementById('musica-lista');
                const li = document.createElement('li');
                li.innerHTML = `
                    <b>${data.name}</b>
                    <audio controls>
                        <source src="${data.url}" type="audio/mp3">
                        Seu navegador não suporta o elemento de áudio.
                    </audio>
                    <button onclick="removerMusica(this)">Excluir</button>
                `;
                musicaLista.appendChild(li);
            } else {
                console.error('Erro ao fazer upload da música:', data.error);
            }
        })
        .catch(error => console.error('Erro ao fazer upload da música:', error));
    }
}

function removerMusica(button) {
    const li = button.parentElement;
    const musicaName = li.querySelector('b').textContent;
    li.remove();

    const transaction = db.transaction(['musicas'], 'readwrite');
    const objectStore = transaction.objectStore('musicas');
    const request = objectStore.delete(musicaName);

    request.onsuccess = function() {
        console.log('Música removida com sucesso do IndexedDB.');
    };

    request.onerror = function() {
        console.error('Erro ao remover a música do IndexedDB:', request.error);
    };
}

function logout() {
    localStorage.removeItem('authenticated');
    location.reload();
}
