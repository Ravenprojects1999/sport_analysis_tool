const video1Input = document.getElementById('video1');
const video2inputbox = document.getElementById('video2-upload');
// video 2 upload
const video2input = document.getElementById('video2')

const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');

const video1Container = document.getElementById('video-container');
const video2Container = document.getElementById('video2-container');
const wrapper = document.getElementById('video-wrapper');


// make appearable
const draggable = document.getElementById('timer_button');
const slidercontainer=document.getElementById('speed-slider-container')



// function for if two videos
function updateVideoLayout() {
    const wrapper = document.getElementById('video-wrapper');

    if(video1Container.style.display !== 'none' && video2Container.style.display !== 'none'){
        wrapper.classList.add('two-videos');
    } else {
        wrapper.classList.remove('two-videos');
    }
}



video1Input.addEventListener('change', () => {
    if(video1Input.files.length > 0){

        // show video
        player1.src = URL.createObjectURL(video1Input.files[0]);
        player1.load();
        video1Container.style.display = 'flex';

        // apears after first video is uploaded
        video2inputbox.style.display = 'inline';
        draggable.style.display ='inline';
        slidercontainer.style.display='inline'
        updateVideoLayout();       
    }
});

video2input.addEventListener('change', () => {
    if(video2input.files.length > 0){
        
        video2Container.style.display = 'inline';  
        player2.src = URL.createObjectURL(video2input.files[0]);
        player2.load();
        video2Container.style.display = 'flex';
        updateVideoLayout();
    }
});

// timer
let offsetX, offsetY;
let isDragging = false;
let activeVideo = null;

draggable.addEventListener('mousedown', (e) => {
    createDraggableOverlay(e);
});


function createDraggableOverlay(e){
       
    let isDragging=true
    // making overlay work here
    const overlay = document.createElement('div');
    overlay.classList.add('timer-overlay');
    overlay.textContent = `0.00`;
    document.body.appendChild(overlay);
    // adding function connected to eventlistener for movement of overlay
    function onMouseMove(ev) {
        if (!isDragging) return;
        overlay.style.left = `${ev.clientX }px`;
        overlay.style.top = `${ev.clientY }px`;
    }
    
    // function for if we let go
    function onMouseUp(ev){
        isDragging = false;
        const droppedVideo = Array.from(document.querySelectorAll('video')).find(video => {
            const rect = video.getBoundingClientRect();
            return (
                ev.clientX >= rect.left &&
                ev.clientX <= rect.right &&
                ev.clientY >= rect.top &&
                ev.clientY <= rect.bottom
            );
        });
        if (droppedVideo){
            attachTimerToVideo(droppedVideo, overlay);
        } 
        else if (overlay){
            overlay.remove();
        }
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

// attaching timre

function attachTimerToVideo(video, overlay) {
    video.parentElement.style.position = 'relative';
    video.parentElement.appendChild(overlay);
    const startTime=video.currentTime;
    // Start independent timer
    function updateTimer() {
        const time_elapsed=video.currentTime-startTime
        overlay.textContent = time_elapsed.toFixed(2);
        requestAnimationFrame(updateTimer);
    }
    updateTimer();

    // Make overlay redraggable on video
    makeOverlayDraggable(overlay,video);
}

function makeOverlayDraggable(overlay,video) {   
    overlay.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - overlay.offsetLeft;
        offsetY = e.clientY - overlay.offsetTop;
        document.body.style.userSelect = 'none';
    

        function onMouseMove(ev) {
            if (!isDragging) return;
            overlay.style.left = `${ev.clientX}px`;
            overlay.style.top = `${ev.clientY}px`;
        };

        function onMouseUp() {
            if (!isDragging) return;
            isDragging = false;
            document.body.style.userSelect = '';

            // Check if overlay outside video otherwise remove
            const rect = video.getBoundingClientRect();
            const overlayRect = overlay.getBoundingClientRect();
            const isInside =
                overlayRect.right > rect.left &&
                overlayRect.left < rect.right &&
                overlayRect.bottom > rect.top &&
                overlayRect.top < rect.bottom;

            if (!isInside) 
                overlay.remove();

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}


//// velocity of playing

var slider = document.getElementById("myRange");
slider.addEventListener('input', () => {
    player1.playbackRate = slider.value;
    player2.playbackRate = slider.value;
});



