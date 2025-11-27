// Global variables
let songs = [];
let currentAudio = new Audio();
let currentSongIndex = 0;
let isPlaying = false;
let progressInterval;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let recentlyPlayed = JSON.parse(localStorage.getItem('recentlyPlayed')) || [];

// DOM elements
const albumCover = document.getElementById('album-cover');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const currentTime = document.getElementById('current-time');
const totalTime = document.getElementById('total-time');
const progressBar = document.getElementById('progress-bar');
const progressBarWrapper = document.getElementById('progress-bar-wrapper');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const tracksContainer = document.getElementById('tracks-container');
const favoritesContainer = document.getElementById('favorites-container');
const recentlyPlayedContainer = document.getElementById('recently-played-container');
const searchInput = document.getElementById('search-input');

// Fetch songs from Deezer API with 30-second previews
async function fetchSongsFromDeezer(query = "pop") {
    try {
        // Show loading state
        tracksContainer.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading songs...</p></div>';
        
        const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(`https://api.deezer.com/search?q=${query}&limit=25`)}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        if (!data.data || data.data.length === 0) {
            throw new Error('No songs found');
        }
        
        songs = data.data.map(track => ({
            id: track.id,
            title: track.title,
            artist: track.artist.name,
            albumCover: track.album.cover_medium,
            audioUrl: track.preview,
            duration: "0:30" // Deezer previews are 30 seconds
        }));
        
        return songs;
    } catch (error) {
        console.error("Error fetching songs from Deezer:", error);
        // Fallback to default songs if API fails
        return getDefaultSongs();
    }
}

// Default songs as fallback
function getDefaultSongs() {
    return [
        {
            id: 1,
            title: "Midnight Dreams",
            artist: "Luna Echo",
            albumCover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            audioUrl: "https://cdn.pixabay.com/download/audio/2022/02/22/audio_d17187f944.mp3?filename=chill-abstract-intention-12099.mp3",
            duration: "0:30"
        },
        {
            id: 2,
            title: "Electric Feel",
            artist: "MGMT",
            albumCover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
            audioUrl: "https://cdn.pixabay.com/download/audio/2021/11/25/audio_c2ee62d824.mp3?filename=slow-motion-121841.mp3",
            duration: "0:30"
        },
        {
            id: 3,
            title: "Blinding Lights",
            artist: "The Weeknd",
            albumCover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
            audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_1d7e398d2c.mp3?filename=cinematic-trailer-11223.mp3",
            duration: "0:30"
        },
        {
            id: 4,
            title: "Dance Monkey",
            artist: "Tones and I",
            albumCover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop",
            audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_30665e89a0.mp3?filename=epic-cinematic-trailer-11222.mp3",
            duration: "0:30"
        },
        {
            id: 5,
            title: "Summer Vibes",
            artist: "Ocean Waves",
            albumCover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
            audioUrl: "https://cdn.pixabay.com/download/audio/2022/02/22/audio_d17187f944.mp3?filename=chill-abstract-intention-12099.mp3",
            duration: "0:30"
        },
        {
            id: 6,
            title: "Neon Lights",
            artist: "Synth City",
            albumCover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop",
            audioUrl: "https://cdn.pixabay.com/download/audio/2021/11/25/audio_c2ee62d824.mp3?filename=slow-motion-121841.mp3",
            duration: "0:30"
        }
    ];
}

// Format time in mm:ss
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Initialize the player
async function initPlayer() {
    // Fetch initial songs from Deezer
    await fetchSongsFromDeezer("popular");
    
    if (songs.length > 0) {
        loadSong(currentSongIndex);
        renderTopTracks();
        renderFavorites();
        renderRecentlyPlayed();
        setupEventListeners();
    }
}

// Load a song
function loadSong(index) {
    if (songs.length === 0) return;
    
    const song = songs[index];
    
    // Update UI
    albumCover.src = song.albumCover;
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    totalTime.textContent = song.duration;
    
    // Stop current audio
    currentAudio.pause();
    isPlaying = false;
    updatePlayPauseButton();
    stopProgressAnimation();
    
    // Load new audio
    currentAudio = new Audio(song.audioUrl);
    
    // Set up audio event listeners for the new audio element
    setupAudioEventListeners();
    
    // Reset progress
    currentTime.textContent = "0:00";
    progressBar.style.width = "0%";
    
    // Add to recently played
    addToRecentlyPlayed(song);
    
    // Render tracks to update active state
    renderTopTracks();
}

// Set up audio event listeners
function setupAudioEventListeners() {
    // Remove existing event listeners by cloning the audio element
    const newAudio = currentAudio.cloneNode();
    currentAudio = newAudio;
    
    currentAudio.addEventListener('loadedmetadata', () => {
        if (currentAudio.duration && !isNaN(currentAudio.duration)) {
            totalTime.textContent = formatTime(currentAudio.duration);
        }
    });
    
    currentAudio.addEventListener('ended', () => {
        isPlaying = false;
        updatePlayPauseButton();
        stopProgressAnimation();
        progressBar.style.width = "0%";
        currentTime.textContent = "0:00";
        
        // Auto-play next song
        setTimeout(playNext, 1000);
    });
    
    currentAudio.addEventListener('timeupdate', () => {
        if (currentAudio.duration && !isNaN(currentAudio.duration)) {
            const progressPercent = (currentAudio.currentTime / currentAudio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            currentTime.textContent = formatTime(currentAudio.currentTime);
        }
    });
    
    currentAudio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        isPlaying = false;
        updatePlayPauseButton();
        stopProgressAnimation();
    });
}

// Add song to recently played
function addToRecentlyPlayed(song) {
    // Remove if already exists
    recentlyPlayed = recentlyPlayed.filter(item => item.id !== song.id);
    
    // Add to beginning
    recentlyPlayed.unshift(song);
    
    // Keep only last 5
    if (recentlyPlayed.length > 5) {
        recentlyPlayed = recentlyPlayed.slice(0, 5);
    }
    
    // Save to localStorage
    localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
    
    // Update UI
    renderRecentlyPlayed();
}

// Toggle favorite
function toggleFavorite(songId) {
    const index = favorites.findIndex(song => song.id === songId);
    
    if (index === -1) {
        // Add to favorites
        const song = songs.find(s => s.id === songId);
        if (song) {
            favorites.push(song);
        }
    } else {
        // Remove from favorites
        favorites.splice(index, 1);
    }
    
    // Save to localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Update UI
    renderFavorites();
    renderTopTracks();
}

// Check if song is favorite
function isFavorite(songId) {
    return favorites.some(song => song.id === songId);
}

// Render top tracks
function renderTopTracks(filteredSongs = null) {
    const tracksToRender = filteredSongs || songs;
    
    if (tracksToRender.length === 0) {
        tracksContainer.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.5); padding: 40px;">No songs found. Try a different search.</p>';
        return;
    }
    
    tracksContainer.innerHTML = tracksToRender.map((song, index) => `
        <div class="track-item ${index === currentSongIndex ? 'active' : ''}" data-id="${song.id}" data-index="${index}">
            <img src="${song.albumCover}" alt="${song.title}" class="track-cover" />
            <div class="track-info">
                <h4 class="track-title">${song.title}</h4>
                <p class="track-artist">${song.artist}</p>
            </div>
            <button class="favorite-btn ${isFavorite(song.id) ? 'active' : ''}" data-id="${song.id}">
                <i class="fas fa-heart"></i>
            </button>
            <span class="track-duration">${song.duration}</span>
        </div>
    `).join('');
}

// Render favorites
function renderFavorites() {
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.5); padding: 20px;">No favorites yet. Click the heart icon to add songs to favorites.</p>';
        return;
    }
    
    favoritesContainer.innerHTML = favorites.map((song, index) => `
        <div class="track-item" data-id="${song.id}">
            <img src="${song.albumCover}" alt="${song.title}" class="track-cover" />
            <div class="track-info">
                <h4 class="track-title">${song.title}</h4>
                <p class="track-artist">${song.artist}</p>
            </div>
            <button class="favorite-btn active" data-id="${song.id}">
                <i class="fas fa-heart"></i>
            </button>
            <span class="track-duration">${song.duration}</span>
        </div>
    `).join('');
}

// Render recently played
function renderRecentlyPlayed() {
    if (recentlyPlayed.length === 0) {
        recentlyPlayedContainer.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.5); padding: 20px;">No recently played songs</p>';
        return;
    }
    
    recentlyPlayedContainer.innerHTML = recentlyPlayed.map(song => `
        <div class="recent-item" data-id="${song.id}">
            <img src="${song.albumCover}" alt="${song.title}" class="recent-cover" />
            <div class="track-info">
                <h4 class="track-title">${song.title}</h4>
                <p class="track-artist">${song.artist}</p>
            </div>
            <span class="track-duration">${song.duration}</span>
        </div>
    `).join('');
}

// Update play/pause button
function updatePlayPauseButton() {
    const icon = playPauseBtn.querySelector('i');
    if (isPlaying) {
        icon.className = 'fas fa-pause';
    } else {
        icon.className = 'fas fa-play';
    }
}

// Start progress bar animation
function startProgressAnimation() {
    stopProgressAnimation();
    
    progressInterval = setInterval(() => {
        if (currentAudio.duration && !isNaN(currentAudio.duration)) {
            const progressPercent = (currentAudio.currentTime / currentAudio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            
            // Update current time
            currentTime.textContent = formatTime(currentAudio.currentTime);
        }
    }, 100);
}

// Stop progress bar animation
function stopProgressAnimation() {
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
}

// Play/pause functionality
function togglePlayPause() {
    if (songs.length === 0) return;
    
    if (isPlaying) {
        currentAudio.pause();
        stopProgressAnimation();
        isPlaying = false;
    } else {
        // Ensure audio is loaded and ready
        if (currentAudio.readyState < 3) {
            currentAudio.load();
        }
        
        currentAudio.play().then(() => {
            isPlaying = true;
            startProgressAnimation();
        }).catch(error => {
            console.error("Error playing audio:", error);
            isPlaying = false;
        });
    }
    updatePlayPauseButton();
}

// Play next song
function playNext() {
    if (songs.length === 0) return;
    
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) {
        currentAudio.play().then(() => {
            startProgressAnimation();
        }).catch(error => {
            console.error("Error playing audio:", error);
            isPlaying = false;
            updatePlayPauseButton();
        });
    }
}

// Play previous song
function playPrev() {
    if (songs.length === 0) return;
    
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) {
        currentAudio.play().then(() => {
            startProgressAnimation();
        }).catch(error => {
            console.error("Error playing audio:", error);
            isPlaying = false;
            updatePlayPauseButton();
        });
    }
}

// Seek functionality
function seek(event) {
    if (songs.length === 0 || !currentAudio.duration) return;
    
    const progressWidth = progressBarWrapper.clientWidth;
    const clickX = event.offsetX;
    const duration = currentAudio.duration;
    
    const seekTime = (clickX / progressWidth) * duration;
    currentAudio.currentTime = seekTime;
    progressBar.style.width = `${(seekTime / duration) * 100}%`;
    currentTime.textContent = formatTime(seekTime);
}

// Search functionality with Deezer API
async function searchSongs() {
    const query = searchInput.value.trim();
    
    if (query.length === 0) {
        // If search is empty, reload popular songs
        await fetchSongsFromDeezer("popular");
        if (songs.length > 0) {
            currentSongIndex = 0;
            loadSong(currentSongIndex);
            renderTopTracks();
        }
        return;
    }
    
    // Search for any artist or song
    await fetchSongsFromDeezer(query);
    if (songs.length > 0) {
        currentSongIndex = 0;
        loadSong(currentSongIndex);
        renderTopTracks();
        
        // If was playing, continue playing the new search results
        if (isPlaying) {
            currentAudio.play().then(() => {
                startProgressAnimation();
            }).catch(error => {
                console.error("Error playing audio:", error);
                isPlaying = false;
                updatePlayPauseButton();
            });
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Player controls
    playPauseBtn.addEventListener('click', togglePlayPause);
    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrev);
    
    // Progress bar
    progressBarWrapper.addEventListener('click', seek);
    
    // Search with debounce
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(searchSongs, 500);
    });
    
    // Enter key to search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchSongs();
        }
    });
    
    // Track clicks
    tracksContainer.addEventListener('click', (e) => {
        const trackItem = e.target.closest('.track-item');
        if (trackItem) {
            const songIndex = parseInt(trackItem.dataset.index);
            if (!isNaN(songIndex) && songIndex >= 0 && songIndex < songs.length) {
                currentSongIndex = songIndex;
                loadSong(currentSongIndex);
                if (!isPlaying) {
                    togglePlayPause();
                } else {
                    currentAudio.play().then(() => {
                        startProgressAnimation();
                    }).catch(error => {
                        console.error("Error playing audio:", error);
                    });
                }
            }
        }
        
        // Favorite button clicks
        const favoriteBtn = e.target.closest('.favorite-btn');
        if (favoriteBtn) {
            const songId = parseInt(favoriteBtn.dataset.id);
            toggleFavorite(songId);
            e.stopPropagation();
        }
    });
    
    // Favorites container clicks
    favoritesContainer.addEventListener('click', (e) => {
        const trackItem = e.target.closest('.track-item');
        if (trackItem) {
            const songId = parseInt(trackItem.dataset.id);
            const songIndex = songs.findIndex(song => song.id === songId);
            if (songIndex !== -1) {
                currentSongIndex = songIndex;
                loadSong(currentSongIndex);
                if (!isPlaying) {
                    togglePlayPause();
                } else {
                    currentAudio.play().then(() => {
                        startProgressAnimation();
                    }).catch(error => {
                        console.error("Error playing audio:", error);
                    });
                }
            }
        }
        
        // Favorite button clicks
        const favoriteBtn = e.target.closest('.favorite-btn');
        if (favoriteBtn) {
            const songId = parseInt(favoriteBtn.dataset.id);
            toggleFavorite(songId);
            e.stopPropagation();
        }
    });
    
    // Recently played container clicks
    recentlyPlayedContainer.addEventListener('click', (e) => {
        const recentItem = e.target.closest('.recent-item');
        if (recentItem) {
            const songId = parseInt(recentItem.dataset.id);
            const songIndex = songs.findIndex(song => song.id === songId);
            if (songIndex !== -1) {
                currentSongIndex = songIndex;
                loadSong(currentSongIndex);
                if (!isPlaying) {
                    togglePlayPause();
                } else {
                    currentAudio.play().then(() => {
                        startProgressAnimation();
                    }).catch(error => {
                        console.error("Error playing audio:", error);
                    });
                }
            }
        }
    });
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        // Don't trigger if user is typing in search
        if (document.activeElement === searchInput) return;
        
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlayPause();
        } else if (e.code === 'ArrowRight') {
            e.preventDefault();
            playNext();
        } else if (e.code === 'ArrowLeft') {
            e.preventDefault();
            playPrev();
        }
    });
}

// Initialize the player when the page loads
document.addEventListener('DOMContentLoaded', initPlayer);