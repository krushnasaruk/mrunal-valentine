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
    // Initialize Memory Game if level 4
    if (level === 4) {
        initMemoryGame();
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

    // Logic: Key found on 1st, 2nd, 3rd, or 4th pop.
    let poppedCount = 0;
    const targetPop = Math.floor(Math.random() * 4) + 1;
    let keyFound = false;

    for (let i = 0; i < numBalloons; i++) {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');

        // Random style
        const bg = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.background = bg;

        balloon.style.left = `${Math.random() * 80 + 10}%`;
        balloon.style.top = `${Math.random() * 80 + 10}%`;

        // Click Logic
        balloon.addEventListener('click', (e) => {
            if (keyFound) return;

            poppedCount++;

            // Pop animation
            anime({
                targets: balloon,
                scale: 1.5,
                opacity: 0,
                duration: 200,
                easing: 'easeOutQuad',
                complete: () => {
                    balloon.remove();
                    // Check if this was the lucky pop
                    if (poppedCount === targetPop) {
                        keyFound = true;
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

    // Animate key to center (Faster now)
    anime({
        targets: key,
        scale: [0, 2],
        rotate: 360,
        duration: 800,
    });

    // Go to Level 4 (Memory) - Faster transition
    setTimeout(() => {
        key.remove();
        showLevel(4);
    }, 1000);
}

// ---- LEVEL 4: MEMORY MATCH ----
function initMemoryGame() {
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';

    // 4 Pairs of images
    const images = [
        './0bd16202-a399-4677-8928-deed9977c814.JPG',
        './0c3fb8b4-522f-4a96-be3a-d1d2d91dffcd.JPG',
        './37fc632c-9f63-47b5-94a4-3920ae184561.JPG',
        './9ba5abae-68ba-4736-8c5a-a7410bdf35da.JPG'
    ];

    // Duplicate and shuffle
    let cards = [...images, ...images];
    cards.sort(() => 0.5 - Math.random());

    let flippedCards = [];
    let matchedPairs = 0;
    let canClick = false; // Wait for preview

    // Create card elements
    const cardElements = [];

    cards.forEach(imgSrc => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.classList.add('flipped'); // Start flipped (Preview)
        card.dataset.img = imgSrc;

        const front = document.createElement('div');
        front.classList.add('front');
        front.innerHTML = '❤️';

        const back = document.createElement('div');
        back.classList.add('back');
        const img = document.createElement('img');
        img.src = imgSrc;
        back.appendChild(img);

        card.appendChild(front);
        card.appendChild(back);

        card.addEventListener('click', () => {
            if (!canClick) return;
            if (flippedCards.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
                card.classList.add('flipped');
                flippedCards.push(card);

                if (flippedCards.length === 2) {
                    canClick = false; // Prevent clicks while checking
                    setTimeout(checkMatch, 800);
                }
            }
        });

        grid.appendChild(card);
        cardElements.push(card);
    });

    // Preview Phase: Hide cards after 10 seconds
    setTimeout(() => {
        cardElements.forEach(c => c.classList.remove('flipped'));
        canClick = true;
        // Optional: Update title to say "GO!" or similar, but keeping it simple.
    }, 10000);

    function checkMatch() {
        const [c1, c2] = flippedCards;
        if (c1.dataset.img === c2.dataset.img) {
            // Match
            c1.classList.add('matched');
            c2.classList.add('matched');
            matchedPairs++;
            flippedCards = [];
            canClick = true;

            if (matchedPairs === 4) {
                setTimeout(() => {
                    alert("YAY! Good Memory! ❤️");
                    showLevel(5);
                }, 500);
            }
        } else {
            // No match
            c1.classList.remove('flipped');
            c2.classList.remove('flipped');
            flippedCards = [];
            canClick = true;
        }
    }
}

// ---- LEVEL 5: PHOTO TOSS ----
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
                    showLevel(6);
                }
            }
        });
    });
});

// ---- LEVEL 6: PROPOSAL ----
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
    showLevel(7);
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
