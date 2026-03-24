function toggleSection(section) {
    section.classList.toggle('active');
}

function openLightbox(videoSrc) {
    const lightbox = document.getElementById('lightbox');
    const video = document.getElementById('lightbox-video');
    
    video.src = videoSrc;
    lightbox.style.display = 'flex';
    video.play();
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const video = document.getElementById('lightbox-video');
    
    lightbox.style.display = 'none';
    video.pause();
    video.src = "";
}

// Hover auto-play per i video piccoli
document.querySelectorAll('.video-card video').forEach(v => {
    v.addEventListener('mouseenter', () => v.play());
    v.addEventListener('mouseleave', () => { v.pause(); v.currentTime = 0; });
});
