
// actual dragging with visualization
document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    draggable.style.left = `${e.clientX - offsetX}px`;
    draggable.style.top = `${e.clientY - offsetY}px`;
    overlay.style.left = `${e.clientX}px`;
    overlay.style.top  = `${e.clientY}px`;
    overlay.textContent = `${(e.clientX).toFixed(0)}, ${(e.clientY).toFixed(0)}`;
});


document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;

    // Detect if dropped on a video
    document.querySelectorAll('video').forEach(video => {
        const rect = video.getBoundingClientRect();
        if (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
        ) {
            attachTimerToVideo(video);
        }
    });
});

function attachTimerToVideo(video) {
    // Remove any existing overlay
    const existing = video.parentElement.querySelector('.timer-overlay');
    if (existing) existing.remove();

    // Create overlay in video
    const overlay = document.createElement('div');
    overlay.classList.add('timer-overlay');
    video.parentElement.appendChild(overlay);
    activeVideo = video;

    // Update timer dynamically
    function updateTimer() {
        if (activeVideo === video) {
            overlay.textContent = video.currentTime.toFixed(2);
            requestAnimationFrame(updateTimer);
        }
    }
    updateTimer();
}