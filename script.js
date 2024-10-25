// Grab elements from the document
const cardContainer = document.querySelector('.game-container');
const questionPopup = document.getElementById('question-popup');
const questionText = document.getElementById('question-text');
const timerDisplay = document.getElementById('time-left');
const options = [...document.querySelectorAll('.option-btn')];
const levelMessage = document.createElement('div'); // To show level message
levelMessage.classList.add('level-message');
const winMessage = document.createElement('div');   // To show the win message
winMessage.classList.add('level-message');
const startButton = document.getElementById('start-button');
const introScreen = document.getElementById('intro-screen');
const introContainer = document.querySelector('.intro-container');
const tileContainer = document.querySelector('.background-tiles');
const overlay = document.querySelector('.overlay');

// Load sound effects
const startGameSound = new Audio('sounds/start_game.wav');
const flipCardSound = new Audio('sounds/flipcard.wav');
const levelUpSound = new Audio('sounds/level_up.mp3');
const questionTimeSound = new Audio('sounds/question_time.wav');
const gameOverSound = new Audio('sounds/game_over.wav');

// Preload audio files to avoid playback delay
startGameSound.load();
flipCardSound.load();
levelUpSound.load();
questionTimeSound.load();
gameOverSound.load();



let flippedCards = [];
let missedTries = 0;  // Keep track of missed tries
let level = 1;
let correctAnswer;
let timer;
let timerSeconds = 20;  // Start with 20 seconds for the first level
let maxLevels = 15; // Total number of levels until the screen is fully covered

// Predefine the number of cards for each level to ensure symmetry
const levelCardCounts = [8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64];


// Helper function to append message elements only if they are not already in the DOM
function appendMessageIfNeeded(element) {
    if (!document.body.contains(element)) {
        document.body.appendChild(element);
    }
}


// Function to create a grid of tiles and animate them
function createTileGrid() {
    const tileCountX = Math.floor(window.innerWidth / 100); // Number of tiles horizontally
    const tileCountY = Math.floor(window.innerHeight / 100); // Number of tiles vertically
    const totalTiles = tileCountX * tileCountY;

    tileContainer.style.gridTemplateColumns = `repeat(${tileCountX}, 1fr)`; // Define the grid layout

    for (let i = 0; i < totalTiles; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');

        // Create the flipping animation using two sides
        tile.innerHTML = `
            <div class="tile-inner">
                <div class="tile-front"></div>
                <div class="tile-back"></div>
            </div>
        `;
        tileContainer.appendChild(tile);
    }

    // Animate the tiles using GSAP to create a constant rhythmic flip
    const allTiles = document.querySelectorAll('.tile-inner');
    gsap.set(allTiles, { rotationY: 0 }); // Set initial rotation to zero

    // Animate each tile to flip continuously in a staggered pattern
    allTiles.forEach((tile, index) => {
        gsap.to(tile, {
            rotationY: 180,
            duration: 3,
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true,
            delay: index * 0.1, // Staggering the start time for each tile to create a wave effect
        });
    });
}

// Call the function to generate the tile grid when the page loads
window.addEventListener('load', createTileGrid);

// GSAP Animation for the Intro Screen
window.addEventListener('load', () => {
    gsap.from(".intro-screen h1", {
        duration: 1.5,
        y: -100,
        opacity: 0,
        ease: "bounce.out"
    });

    gsap.from("#start-button", {
        duration: 1.2,
        scale: 0,
        ease: "back.out(1.7)",
        delay: 0.5
    });
});

// Dancing animation for each letter in the title
const title = document.querySelector('.intro-screen h1');
const titleText = title.innerText;
title.innerHTML = ''; // Clear the original text

titleText.split('').forEach(letter => {
    const span = document.createElement('span');
    span.innerText = letter === ' ' ? '\u00A0' : letter; // Preserve spaces
    title.appendChild(span);
});

// GSAP Dancing Animation for each letter
gsap.from(".intro-screen h1 span", {
    duration: 1,
    y: 100,
    opacity: 0,
    stagger: 0.05, // Delay between each letter animation
    ease: "elastic.out(1, 0.3)",
    rotation: 360,
    repeat: -1,
    yoyo: true,
    delay: 0.5
});

// Start Button click event - start the game
startButton.addEventListener('click', startGame);

function startGame() {
    // Play the start game sound
    startGameSound.play();
    // Hide the intro screen, overlays, and tile background
    introContainer.style.display = 'none';
    introScreen.style.display = 'none';
    overlay.style.display = 'none';
    tileContainer.style.display = 'none';

    // Display the game container and start the first level
    cardContainer.style.display = 'grid';
    setupLevel();
}

// Function to set up the current level with a specified number of cards
function setupLevel() {
    console.log(`Setting up level ${level}`);
    cardContainer.innerHTML = ''; // Clear previous level cards

    const numCards = levelCardCounts[level - 1]; // Get the number of cards for the current level
    const totalPairs = numCards / 2;
    let cardValues = [];  // Reset card values for each new level

    // Generate card values based on the current level
    if (level === 1) {
        // Level 1: Numbers
        for (let i = 0; i < totalPairs; i++) {
            cardValues.push(i, i);
        }
    } else if (level === 2) {
        // Level 2: Images
        for (let i = 0; i < totalPairs; i++) {
            cardValues.push(`https://picsum.photos/200?random=${i}`, `https://picsum.photos/200?random=${i}`);
        }
    } else if (level === 3) {
        // Level 3: Emojis
        const emojis = ["🐶", "🐱", "🦊", "🐻", "🐼", "🦁", "🐯", "🐨", "🐸", "🦄"];
        for (let i = 0; i < totalPairs; i++) {
            cardValues.push(emojis[i % emojis.length], emojis[i % emojis.length]);
        }
    } else if (level === 4) {
        // Level 4: Colors
        const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFC300", "#8E44AD", "#16A085", "#E74C3C"];
        for (let i = 0; i < totalPairs; i++) {
            cardValues.push(colors[i % colors.length], colors[i % colors.length]);
        }
    } else if (level === 5) {
        // Level 5: Math Problems and Solutions
        for (let i = 0; i < totalPairs; i++) {
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            const problem = `${num1} + ${num2}`;
            const solution = num1 + num2;
            cardValues.push(problem, solution);
        }
    } else if (level === 6) {
        // Level 6: Animal Sounds
        const animals = [
            { image: "🐱", sound: "Meow" },
            { image: "🐶", sound: "Woof" },
            { image: "🐮", sound: "Moo" },
            { image: "🐸", sound: "Ribbit" },
            { image: "🦆", sound: "Quack" },
            { image: "🐑", sound: "Baa" }
        ];
        for (let i = 0; i < totalPairs; i++) {
            const { image, sound } = animals[i % animals.length];
            cardValues.push(image, sound);
        }
    } else if (level === 7) {
        // Level 7: Flags and Country Names
        const countries = [
            { flag: "🇺🇸", name: "United States" },
            { flag: "🇬🇧", name: "United Kingdom" },
            { flag: "🇨🇦", name: "Canada" },
            { flag: "🇯🇵", name: "Japan" },
            { flag: "🇫🇷", name: "France" },
            { flag: "🇩🇪", name: "Germany" }
        ];
        for (let i = 0; i < totalPairs; i++) {
            const { flag, name } = countries[i % countries.length];
            cardValues.push(flag, name);
        }
    } else if (level === 8) {
        // Level 8: Icon and Object Pairs (Famous Characters)
        const icons = [
            { icon: "⚡", character: "Harry Potter" },
            { icon: "🛡️", character: "Captain America" },
            { icon: "🦇", character: "Batman" },
            { icon: "🌊", character: "Aquaman" },
            { icon: "💍", character: "Frodo Baggins" },
            { icon: "🕷️", character: "Spider-Man" }
        ];
        for (let i = 0; i < totalPairs; i++) {
            const { icon, character } = icons[i % icons.length];
            cardValues.push(icon, character);
        }
    } else if (level === 9) {
        // Level 9: Memory Sounds (Audio Clips)
        const sounds = [
            { sound: "bell.mp3", label: "🔔 Bell" },
            { sound: "dog_bark.mp3", label: "🐶 Dog Bark" },
            { sound: "cat_meow.mp3", label: "🐱 Cat Meow" },
            { sound: "car_horn.mp3", label: "🚗 Car Horn" },
            { sound: "laugh.mp3", label: "😂 Laugh" }
        ];
        for (let i = 0; i < totalPairs; i++) {
            const { sound, label } = sounds[i % sounds.length];
            cardValues.push(`sound:${sound}`, label);
        }
    } else {
        // Default to Images for levels beyond 9
        for (let i = 0; i < totalPairs; i++) {
            cardValues.push(`https://picsum.photos/200?random=${i + 20}`, `https://picsum.photos/200?random=${i + 20}`);
        }
    }

    // Shuffle the cards
    cardValues = cardValues.sort(() => Math.random() - 0.5);

    // Create the card elements and add them to the game container
    cardValues.forEach((value, index) => {
        const card = document.createElement('div');
        card.classList.add('card');

        // Determine the card-back content based on the value type
        if (typeof value === "string" && value.startsWith("https")) {
            // Handle image URLs
            card.innerHTML = `<div class="card-front">🤔</div><div class="card-back" style="background-image: url('${value}'); background-size: cover;"></div>`;
        } else if (typeof value === "string" && value.startsWith("#")) {
            // Handle color blocks for Level 4
            card.innerHTML = `<div class="card-front">🤔</div><div class="card-back" style="background-color: ${value};"></div>`;
        } else if (typeof value === "string" && value.startsWith("sound:")) {
            // Handle audio files for Level 9
            const soundFile = value.split(":")[1];
            card.innerHTML = `<div class="card-front">🤔</div><div class="card-back"><audio src="${soundFile}" controls></audio></div>`;
        } else {
            // Handle all other content (numbers, emojis, text)
            card.innerHTML = `<div class="card-front">🤔</div><div class="card-back">${value}</div>`;
        }

        // Add click event to flip the card
        card.addEventListener('click', () => flipCard(card, value));
        cardContainer.appendChild(card);
    });

    // Update the grid layout and card size
    updateGridAndCardSize(numCards);

    // Animate the cards appearing with a domino effect
    dominoAppear();
}

// Function to set up the current level with a specified number of cards
function setupLevel() {
    console.log(`Setting up level ${level}`);
    cardContainer.innerHTML = ''; // Clear previous level cards

    const numCards = levelCardCounts[level - 1]; // Get the number of cards for the current level
    const totalPairs = numCards / 2;
    let cardValues = [];  // Reset card values for each new level

    // Generate card values based on the current level
    if (level === 1) {
        // Level 1: Numbers
        for (let i = 0; i < totalPairs; i++) {
            cardValues.push(i, i);
        }
    } else if (level === 2) {
        // Level 2: Images
        for (let i = 0; i < totalPairs; i++) {
            cardValues.push(`https://picsum.photos/200?random=${i}`, `https://picsum.photos/200?random=${i}`);
        }
    } else if (level === 3) {
        // Level 3: Emojis
        const emojis = ["🐶", "🐱", "🦊", "🐻", "🐼", "🦁", "🐯", "🐨", "🐸", "🦄"];
        for (let i = 0; i < totalPairs; i++) {
            cardValues.push(emojis[i % emojis.length], emojis[i % emojis.length]);
        }
    } else if (level === 4) {
        // Level 4: Colors
        const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFC300", "#8E44AD", "#16A085", "#E74C3C"];
        for (let i = 0; i < totalPairs; i++) {
            cardValues.push(colors[i % colors.length], colors[i % colors.length]);
        }
    } else if (level === 5) {
        // Level 5: Math Problems and Solutions
        for (let i = 0; i < totalPairs; i++) {
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            const problem = `${num1} + ${num2}`;
            const solution = num1 + num2;
            cardValues.push(problem, solution);
        }
    } else if (level === 6) {
        // Level 6: Animal Sounds
        const animals = [
            { image: "🐱", sound: "Meow" },
            { image: "🐶", sound: "Woof" },
            { image: "🐮", sound: "Moo" },
            { image: "🐸", sound: "Ribbit" },
            { image: "🦆", sound: "Quack" },
            { image: "🐑", sound: "Baa" }
        ];
        for (let i = 0; i < totalPairs; i++) {
            const { image, sound } = animals[i % animals.length];
            cardValues.push(image, sound);
        }
    } else if (level === 7) {
        // Level 7: Flags and Country Names
        const countries = [
            { flag: "🇺🇸", name: "United States" },
            { flag: "🇬🇧", name: "United Kingdom" },
            { flag: "🇨🇦", name: "Canada" },
            { flag: "🇯🇵", name: "Japan" },
            { flag: "🇫🇷", name: "France" },
            { flag: "🇩🇪", name: "Germany" }
        ];
        for (let i = 0; i < totalPairs; i++) {
            const { flag, name } = countries[i % countries.length];
            cardValues.push(flag, name);
        }
    } else if (level === 8) {
        // Level 8: Icon and Object Pairs (Famous Characters)
        const icons = [
            { icon: "⚡", character: "Harry Potter" },
            { icon: "🛡️", character: "Captain America" },
            { icon: "🦇", character: "Batman" },
            { icon: "🌊", character: "Aquaman" },
            { icon: "💍", character: "Frodo Baggins" },
            { icon: "🕷️", character: "Spider-Man" }
        ];
        for (let i = 0; i < totalPairs; i++) {
            const { icon, character } = icons[i % icons.length];
            cardValues.push(icon, character);
        }
    } else if (level === 9) {
        // Level 9: Memory Sounds (Audio Clips)
        const sounds = [
            { sound: "bell.mp3", label: "🔔 Bell" },
            { sound: "dog_bark.mp3", label: "🐶 Dog Bark" },
            { sound: "cat_meow.mp3", label: "🐱 Cat Meow" },
            { sound: "car_horn.mp3", label: "🚗 Car Horn" },
            { sound: "laugh.mp3", label: "😂 Laugh" }
        ];
        for (let i = 0; i < totalPairs; i++) {
            const { sound, label } = sounds[i % sounds.length];
            cardValues.push(`sound:${sound}`, label);
        }
    } else {
        // Default to Images for levels beyond 9
        for (let i = 0; i < totalPairs; i++) {
            cardValues.push(`https://picsum.photos/200?random=${i + 20}`, `https://picsum.photos/200?random=${i + 20}`);
        }
    }

    // Shuffle the cards
    cardValues = cardValues.sort(() => Math.random() - 0.5);

    // Create the card elements and add them to the game container
    cardValues.forEach((value, index) => {
        const card = document.createElement('div');
        card.classList.add('card');

        // Determine the card-back content based on the value type
        if (typeof value === "string" && value.startsWith("https")) {
            // Handle image URLs
            card.innerHTML = `<div class="card-front">🤔</div><div class="card-back" style="background-image: url('${value}'); background-size: cover;"></div>`;
        } else if (typeof value === "string" && value.startsWith("#")) {
            // Handle color blocks for Level 4
            card.innerHTML = `<div class="card-front">🤔</div><div class="card-back" style="background-color: ${value};"></div>`;
        } else if (typeof value === "string" && value.startsWith("sound:")) {
            // Handle audio files for Level 9
            const soundFile = value.split(":")[1];
            card.innerHTML = `<div class="card-front">🤔</div><div class="card-back"><audio src="${soundFile}" controls></audio></div>`;
        } else {
            // Handle all other content (numbers, emojis, text)
            card.innerHTML = `<div class="card-front">🤔</div><div class="card-back">${value}</div>`;
        }

        // Add click event to flip the card
        card.addEventListener('click', () => flipCard(card, value));
        cardContainer.appendChild(card);
    });

    // Update the grid layout and card size
    updateGridAndCardSize(numCards);

    // Animate the cards appearing with a domino effect
    dominoAppear();
}





function ensureSymmetricalCardCount(cards, columns) {
    const remainder = cards.length % columns;
    if (remainder !== 0) {
        // Add dummy cards to make the total number divisible by the number of columns
        const cardsToAdd = columns - remainder;
        for (let i = 0; i < cardsToAdd; i++) {
            const dummyCard = document.createElement('div');
            dummyCard.classList.add('card', 'dummy-card');
            dummyCard.style.visibility = 'hidden'; // Hide dummy cards
            document.querySelector('.game-container').appendChild(dummyCard);
        }
    }
}

// Assuming you have an array of cards or a way to fetch them
const cards = document.querySelectorAll('.card');
ensureSymmetricalCardCount(cards, 4);  // Assuming 4 columns


// Function to animate the cards appearing with a domino effect
function dominoAppear() {
    const allCards = document.querySelectorAll('.card');
    gsap.set(allCards, { scale: 0 }); // Set the initial scale of all cards to 0 (invisible)

    gsap.to(allCards, {
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)", // This will give a nice "pop" effect
    });
}

// Function to update the grid layout and card size based on the number of cards
function updateGridAndCardSize(numCards) {
    // Set the number of columns based on the total number of cards
    let columns;
    let rows;

    if (numCards % 4 === 0) {
        columns = Math.ceil(numCards / 4);
        rows = 4;
    } else {
        columns = Math.ceil(numCards / 4);
        rows = Math.ceil(numCards / columns);
    }

    // Ensure that we always keep symmetry with an even number of columns and rows
    if (columns % 2 !== 0) {
        columns += 1; // Make sure the number of columns is even
    }
    
    if (rows % 2 !== 0) {
        rows += 1; // Make sure the number of rows is even
    }

    // Update the container's grid style
    cardContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    cardContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    // Set a base width for the cards and adjust proportionally
    const cardWidth = Math.min(120, 600 / columns); // Base card width, adjustable based on screen size
    const cardHeight = cardWidth * 1.5; // Maintain a 2:3 aspect ratio

    document.querySelectorAll('.card').forEach(card => {
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardHeight}px`;
    });
}


let isFlipping = false; // Prevent overlapping actions

// Function to flip the card and check for a match
function flipCard(card, value) {
    // Prevent card flipping if another flip action is being processed or if the card is already flipped
    if (isFlipping || card.classList.contains('flipped') || card.style.visibility === 'hidden') {
        return;
    }

    // Set flipping state to true until this action completes
    isFlipping = true;

    // Play the card flip sound
    flipCardSound.play();

    // Flip the card and add it to the flipped cards array
    card.classList.add('flipped');
    flippedCards.push({ card, value });

    // Check if two cards are flipped
    if (flippedCards.length === 2) {
        // Use a timeout to allow the user to see both cards before matching logic is executed
        setTimeout(() => {
            checkMatch();
            // Reset the flipping state once matching logic completes
            isFlipping = false;
        }, 600);
    } else {
        // If only one card is flipped, reset the flipping state immediately
        isFlipping = false;
    }
}


// Function to check if the flipped cards are a match
function checkMatch() {
    const [first, second] = flippedCards;

    if (first.value === second.value) {
        setTimeout(() => {
            first.card.style.visibility = 'hidden';
            second.card.style.visibility = 'hidden';
            flippedCards = [];
            console.log('Matched a pair!');

            // Check if all pairs are matched
            if (document.querySelectorAll('.card:not([style*="visibility: hidden"])').length === 0) {
                if (level === maxLevels) {
                    setTimeout(showWinMessage, 1000);
                } else {
                    // Play level up sound before moving to the next level
                    levelUpSound.play();
                    // Using Promises to wait for animation completion before proceeding
                    showLevelMessage(level + 1).then(() => {
                        nextLevel();
                    });
                }
            }
        }, 500);

        missedTries = 0;  // Reset missed tries when a match is found
    } else {
        missedTries++;
        if (missedTries >= 2) {
            setTimeout(() => {
                askQuestion();
            }, 1000);
        } else {
            setTimeout(() => {
                first.card.classList.remove('flipped');
                second.card.classList.remove('flipped');
                flippedCards = [];
                console.log('No match, flipping back.');
            }, 1000);
        }
    }
}


// Adjust the timer based on the level
function adjustTimerByLevel() {
    if (level < maxLevels) {
        timerSeconds = Math.max(10, 20 - (level - 1)); // Decrease timer by 1 second per level, minimum 10 seconds
    }
}

// Function to progress to the next level with more cards
function nextLevel() {
    level++;
    console.log(`Progressing to level ${level}`);
    adjustTimerByLevel();
    setTimeout(() => {
        setupLevel();
    }, 2000); // Adding a delay to make sure level transition animations are completed
}

// Function to display the win message when the game is completed
function showWinMessage() {
    winMessage.innerText = `Congratulations, you are the memory king!`;
    appendMessageIfNeeded(winMessage); // Append if not already in the DOM
    gsap.to(winMessage, { duration: 1.5, scale: 1.2, ease: "bounce.out" });
    setTimeout(animateCards, 1500);
}


// Function to animate the cards like in Solitaire
function animateCards() {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach((card) => {
        gsap.to(card, { duration: 2, x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, rotation: 360 });
    });
}

// Function to display the question modal
function askQuestion() {

    // Play the question time sound
    questionTimeSound.play();

    console.log('Showing question modal after 2 missed tries.');
    flippedCards.forEach(({ card }) => card.classList.remove('flipped'));
    flippedCards = [];
    missedTries = 0;
    questionPopup.classList.remove('hidden');
    const question = generateRandomQuestion();
    displayQuestion(question);
    startTimer(timerSeconds);
}

// Function to start the timer for answering the question
function startTimer(seconds) {
    // Clear any existing timer to avoid overlapping intervals
    if (timer) {
        clearInterval(timer);
    }

    let timeLeft = seconds;
    timerDisplay.innerText = timeLeft;

    // Change the timer display to default color initially
    timerDisplay.style.color = ""; 

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;

        // Change the timer color to red when time is running out
        if (timeLeft <= 5) {
            timerDisplay.style.color = "red";
        }

        // If time runs out, clear the timer and end the game
        if (timeLeft <= 0) {
            clearInterval(timer);
            gameOver();
        }
    }, 1000);
}


// Function to reset the game after losing
function gameOver() {

    // Play the game over sound
    gameOverSound.play();

    clearInterval(timer);
    questionPopup.classList.add('hidden');
    alert('Game Over! Try Again.');
    level = 1;
    timerSeconds = 20;
    setupLevel();
}

// Function to generate a random math question
function generateRandomQuestion() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    correctAnswer = num1 + num2;
    return `What is ${num1} + ${num2}?`;
}

// Function to display the question with multiple choice answers
function displayQuestion(question) {
    questionText.innerText = question;
    const correctIndex = Math.floor(Math.random() * 3);
    options.forEach((option, index) => {
        if (index === correctIndex) {
            option.innerText = correctAnswer;
        } else {
            option.innerText = correctAnswer + Math.floor(Math.random() * 3) + 1;
        }
        option.onclick = () => checkAnswer(parseInt(option.innerText));
    });
}

// Function to check if the chosen answer is correct
function checkAnswer(answer) {
    clearInterval(timer);
    if (answer === correctAnswer) {
        console.log('Correct answer!');
        questionPopup.classList.add('hidden');
    } else {
        gameOver();
    }
}

// Function to show the animated message for the next level
function showLevelMessage(nextLevel) {
    return new Promise((resolve) => {
        console.log(`Showing level message for level ${nextLevel}`);
        
        // Ensure that the message element is cleared of any lingering properties
        levelMessage.innerText = `Welcome to Level ${nextLevel}!`;
        levelMessage.style.opacity = "1";  // Reset opacity to make sure it is visible
        
        // Append the message to the body using the helper function
        appendMessageIfNeeded(levelMessage);

        // Animate the level message
        gsap.to(levelMessage, { duration: 1.5, scale: 1.2, ease: "bounce.out" });
        setTimeout(() => {
            gsap.to(levelMessage, { duration: 1, opacity: 0, onComplete: () => {
                if (document.body.contains(levelMessage)) {
                    document.body.removeChild(levelMessage);
                }
                resolve();
            }});
        }, 1500);  // Delay before fading out the message
    });
}



// Start the game with the first level (8 cards)
setupLevel();