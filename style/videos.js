document.addEventListener('DOMContentLoaded', function() {
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';

    const addCaptionCheckbox = document.getElementById('add-caption-checkbox');
    const captionControls = document.getElementById('caption-controls');
    const captionText = document.getElementById('caption-text');
    const saveCaptionBtn = document.getElementById('save-caption-btn');
    const editCaptionBtn = document.getElementById('edit-caption-btn');
    const deleteCaptionBtn = document.getElementById('delete-caption-btn');
    const videoCaption = document.getElementById('video-caption');
    const legendContainer = document.getElementById('legend-container');
    const addCaptionLabel = document.getElementById('add-caption-label');

    const youtubeUrlInput = document.getElementById('youtube-url');
    const videoTitleInput = document.getElementById('video-title');
    const addVideoBtn = document.getElementById('adicionar-video-btn');

    let currentVideoUrl = '';

    if (isAuthenticated) {
        document.getElementById('adicionar-video-btn').style.display = 'block';
        document.getElementById('logout-link').style.display = 'inline-block';
        document.getElementById('login-link').style.display = 'none';
        

        addCaptionCheckbox.style.display = 'inline';
        addCaptionLabel.style.display = 'inline';
        youtubeUrlInput.style.display = 'block';
        videoTitleInput.style.display = 'block';
        addVideoBtn.style.display = 'block';

        addCaptionCheckbox.addEventListener('change', function() {
            captionControls.style.display = this.checked ? 'block' : 'none';
        });

        saveCaptionBtn.addEventListener('click', function() {
            const captions = JSON.parse(localStorage.getItem('videoCaptions')) || {};
            captions[currentVideoUrl] = captionText.value;
            localStorage.setItem('videoCaptions', JSON.stringify(captions));
            videoCaption.textContent = captionText.value;
            captionControls.style.display = 'none';
            addCaptionCheckbox.checked = false;
        });

        editCaptionBtn.addEventListener('click', function() {
            const captions = JSON.parse(localStorage.getItem('videoCaptions')) || {};
            captionText.value = captions[currentVideoUrl] || '';
            captionControls.style.display = 'block';
            saveCaptionBtn.style.display = 'inline';
            editCaptionBtn.style.display = 'none';
            deleteCaptionBtn.style.display = 'inline';
        });

        deleteCaptionBtn.addEventListener('click', function() {
            const captions = JSON.parse(localStorage.getItem('videoCaptions')) || {};
            delete captions[currentVideoUrl];
            localStorage.setItem('videoCaptions', JSON.stringify(captions));
            videoCaption.textContent = '';
            captionControls.style.display = 'none';
            addCaptionCheckbox.checked = false;
            saveCaptionBtn.style.display = 'inline';
            editCaptionBtn.style.display = 'none';
            deleteCaptionBtn.style.display = 'none';
        });
    } else {
        document.getElementById('adicionar-video-btn').style.display = 'none';
        document.getElementById('logout-link').style.display = 'none';
        document.getElementById('login-link').style.display = 'inline-block';
    }

    const videoLista = document.getElementById('video-lista');
    const novoVideoInput = document.getElementById('novo-video');
    const currentVideo = document.getElementById('current-video');
    const currentVideoSource = document.getElementById('current-video-source');
    const currentVideoTitle = document.getElementById('current-video-title');
    const youtubePlayer = document.getElementById('youtube-player');

    function adicionarVideo() {
        novoVideoInput.click();
    }

    function adicionarVideoYoutube() {
        const youtubeUrl = youtubeUrlInput.value;
        const youtubeId = extractYouTubeId(youtubeUrl);
        const videoTitle = videoTitleInput.value.trim() || youtubeUrl;

        if (youtubeId) {
            addVideoToList({
                type: 'youtube',
                url: youtubeUrl,
                title: videoTitle
            });
            saveVideoState(); // Save state after adding a YouTube video
        } else {
            alert("URL do YouTube inválida. Por favor, tente novamente.");
        }
    }

    function extractYouTubeId(url) {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    novoVideoInput.addEventListener('change', function() {
        const file = novoVideoInput.files[0];
        const videoTitle = prompt("Digite o título do vídeo:", file.name);
        if (file) {
            addVideoToList({
                type: 'local',
                url: URL.createObjectURL(file),
                title: videoTitle || file.name
            });
            saveVideoState(); // Save state after adding a local video
        }
    });

    function addVideoToList(video) {
        const videoItem = document.createElement('li');
        videoItem.dataset.url = video.url;
        videoItem.dataset.type = video.type;

        const videoTitle = document.createElement('span');
        videoTitle.textContent = video.title;
        videoTitle.classList.add('video-title');
        videoTitle.contentEditable = isAuthenticated;
        videoTitle.addEventListener('blur', function() {
            video.title = videoTitle.textContent;
            saveVideoState();
        });
        videoItem.appendChild(videoTitle);

        const videoLink = document.createElement('span');
        videoLink.textContent = video.url;
        videoItem.appendChild(videoLink);

        const playButton = document.createElement('button');
        playButton.textContent = 'Play';
        playButton.addEventListener('click', function() {
            if (video.type === 'youtube') {
                const youtubeId = extractYouTubeId(video.url);
                youtubePlayer.src = `https://www.youtube.com/embed/${youtubeId}`;
                youtubePlayer.style.display = 'block';
                currentVideo.style.display = 'none';
            } else if (video.type === 'local') {
                currentVideoSource.src = video.url;
                currentVideo.load();
                currentVideo.play();
                youtubePlayer.style.display = 'none';
                currentVideo.style.display = 'block';
            }
            currentVideoTitle.textContent = video.title;
            legendContainer.style.display = 'block';
            currentVideoUrl = video.url;
            loadCaptionState();
            saveVideoState();
        });
        videoItem.appendChild(playButton);

        if (isAuthenticated) {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                videoLista.removeChild(videoItem);
                saveVideoState();
            });
            videoItem.appendChild(deleteButton);
        }

        videoLista.appendChild(videoItem);
    }

    function saveVideoState() {
        const videoItems = Array.from(document.querySelectorAll('#video-lista li'));
        const videos = videoItems.map(item => {
            return {
                title: item.querySelector('.video-title').textContent,
                url: item.dataset.url,
                type: item.dataset.type
            };
        });
        localStorage.setItem('videoList', JSON.stringify(videos));
    }

    function loadVideoState() {
        const videos = JSON.parse(localStorage.getItem('videoList')) || [];
        videos.forEach(video => addVideoToList(video));
    }

    function loadCaptionState() {
        const captions = JSON.parse(localStorage.getItem('videoCaptions')) || {};
        videoCaption.textContent = captions[currentVideoUrl] || '';
    }

    function logout() {
        localStorage.setItem('authenticated', 'false');
        location.reload();
    }

    loadVideoState();
    loadCaptionState();

    window.adicionarVideoYoutube = adicionarVideoYoutube;
    window.logout = logout;
});