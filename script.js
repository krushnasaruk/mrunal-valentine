// Set GIFs
// Cute GIF replacement is now hardcoded in HTML as user photo
document.getElementById('success-gif').src = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGIwZHIxY3Z5dGZ3a3Z5dGZ3a3Z5dGZ3a3Z5dGZ3ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TdfyKrN7HGTIY/giphy.gif"; // Success celebration

// ---- LEVEL SYSTEM ----
let currentLevel = 1;

function showLevel(level) {
    // Hide all
    document.querySelectorAll('.screen').forEach(el => {
        el.classList.remove('active');
        el.style.opacity = 0;
        el.style.display = 'none';
    });

    // Show new
    const next = document.getElementById(`level-${level}`);
    next.style.display = 'flex';

    // Fade in
    anime({
        targets: next,
        opacity: [0, 1],
        duration: 500,
        easing: 'easeInOutQuad'
    });

    currentLevel = level;

    // Initialize balloons if level 3
    if (level === 3) {
        initBalloons();
    }
}

// ---- LEVEL 1: DOOR KNOCK ----
let taps = 3;
const door = document.getElementById('door');
const plate = document.querySelector('.plate');

door.addEventListener('click', () => {
    if (taps <= 0) return;

    taps--;
    plate.textContent = taps;

    // Bounce animation
    anime({
        targets: door,
        scale: [1, 0.95, 1],
        duration: 200,
        easing: 'easeOutQuad'
    });

    if (taps === 0) {
        plate.textContent = "Open!";
        // Open animation
        anime({
            targets: door,
            rotateY: -120,
            duration: 1000,
            easing: 'easeInOutQuad',
            complete: () => {
                setTimeout(() => showLevel(2), 500);
            }
        });
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    }
});

// ---- LEVEL 2: LETTER ----
const letterIcon = document.getElementById('letter-icon');
const modal = document.getElementById('letter-modal');
const finishLetterBtn = document.getElementById('finish-letter');

letterIcon.addEventListener('click', () => {
    modal.classList.remove('hidden');
});

finishLetterBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    showLevel(3);
});

// ---- LEVEL 3: BALLOONS ----
function initBalloons() {
    const container = document.getElementById('balloon-container');
    container.innerHTML = ''; // Clear prev

    const colors = ['#ff5d8f', '#ff8fab', '#ffc8dd', '#b5838d', '#e5989b'];
    const numBalloons = 15;
    const keyIndex = Math.floor(Math.random() * numBalloons);

    for (let i = 0; i < numBalloons; i++) {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');

        // Random style
        const bg = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.background = bg;
        // Hacky way to color the triangle knot
        // In real code we'd use CSS var, but here we just leave the knot pink or ignore it.

        balloon.style.left = `${Math.random() * 80 + 10}%`;
        balloon.style.top = `${Math.random() * 80 + 10}%`;

        // Click Logic
        balloon.addEventListener('click', (e) => {
            // Pop animation
            anime({
                targets: balloon,
                scale: 1.5,
                opacity: 0,
                duration: 200,
                easing: 'easeOutQuad',
                complete: () => {
                    balloon.remove();
                    if (i === keyIndex) {
                        foundKey(e.clientX, e.clientY);
                    }
                }
            });
        });

        container.appendChild(balloon);

        // Float animation
        anime({
            targets: balloon,
            translateY: [-20, 20],
            translateX: [-10, 10],
            duration: 2000 + Math.random() * 1000,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine',
            delay: Math.random() * 500
        });
    }
}

function foundKey(x, y) {
    // Show key visual
    const key = document.createElement('div');
    key.textContent = "🔑";
    key.style.position = "fixed";
    key.style.left = `${x}px`;
    key.style.top = `${y}px`;
    key.style.fontSize = "3rem";
    key.style.zIndex = "100";
    document.body.appendChild(key);

    // Animate key to center
    anime({
        targets: key,
        scale: [0, 2],
        rotate: 360,
        duration: 1000,
    });

    // Go to Level 4
    setTimeout(() => {
        key.remove();
        showLevel(4);
    }, 1500);
}

// ---- LEVEL 4: PHOTO TOSS ----
const photos = document.querySelectorAll('.photo');
let activePhotoIndex = photos.length - 1; // Start with top photo

// Initialize transforms randomly for messy look
photos.forEach((photo, index) => {
    if (index < photos.length - 1) { // Don't rotate the bottom key card
        let angle = Math.random() * 10 - 5; // -5 to 5 deg
        photo.style.transform = `rotate(${angle}deg)`;
    }
});

photos.forEach((photo, index) => {
    photo.addEventListener('click', () => {
        // Only allow clicking the top photo
        if (index !== activePhotoIndex) return;

        // Throw animation
        let dir = Math.random() > 0.5 ? 1 : -1; // Random left/right

        anime({
            targets: photo,
            translateX: dir * 500,
            translateY: -200,
            rotate: dir * 45,
            opacity: 0,
            duration: 800,
            easing: 'easeOutCubic',
            complete: () => {
                photo.style.display = 'none';
                activePhotoIndex--;

                // If we clicked the last one (index 0, which is the heart/key)
                if (index === 0) {
                    showLevel(5);
                }
            }
        });
    });
});

// ---- LEVEL 5: PROPOSAL ----
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const buttonsContainer = document.querySelector('.buttons-container');

noBtn.addEventListener('click', swapButtons);
noBtn.addEventListener('mouseover', swapButtons); // Optional desktop fun

function swapButtons() {
    // Get current visual order
    if (buttonsContainer.style.flexDirection === 'row-reverse') {
        buttonsContainer.style.flexDirection = 'row';
    } else {
        buttonsContainer.style.flexDirection = 'row-reverse';
    }

    // Animate the swap visually to confuse/amuse
    anime({
        targets: [yesBtn, noBtn],
        scale: [1, 1.1, 1],
        duration: 300
    });
}

yesBtn.addEventListener('click', () => {
    showLevel(6);
    celebrate();
});

function celebrate() {
    var duration = 5 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInOut(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInOut(0.1, 0.3), y: randomInOut(0.1, 0.4) } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInOut(0.7, 0.9), y: randomInOut(0.1, 0.4) } }));
    }, 250);
}
