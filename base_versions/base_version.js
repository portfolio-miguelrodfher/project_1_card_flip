
const cardContainer = document.querySelector('.game-container');
const questionPopup = document.getElementById('question-popup');
const questionText = document.getElementById('question-text');
const timerDisplay = document.getElementById('time-left');
const options = [...document.querySelectorAll('.option-btn')];
const levelMessage = document.createElement('div'); // To show level message
levelMessage.classList.add('level-message');
const winMessage = document.createElement('div');   // To show the win message
winMessage.classList.add('level-message');

let flippedCards = [];
let missedTries = 0;  // Keep track of missed tries
let level = 1;
let correctAnswer;
let timer;
let timerSeconds = 20;  // Start with 20 seconds for the first level
let maxLevels = 15; // Total number of levels until the screen is fully covered

// Predefine the number of cards for each level to ensure symmetry
const levelCardCounts = [8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64];

// Function to set up the current level with a specified number of cards
function setupLevel() {
    console.log(`Setting up level ${level}`);
    const numCards = levelCardCounts[level - 1]; // Get the number of cards for the current level
    cardContainer.innerHTML = ''; // Clear previous level

    const totalPairs = numCards / 2;
    let cardValues = [];

    if (level === 1) {
        // Use numbers for level 1
        for (let i = 0; i < totalPairs; i++) {
            cardValues.push(i, i); // Push two of each number for matching pairs
        }
    } else {
        // Use images for levels 2 and beyond
        for (let i = 0; i < totalPairs; i++) {
            cardValues.push(`https://picsum.photos/200?random=${i}`, `https://picsum.photos/200?random=${i}`); // Push two of each image for matching pairs
        }
    }

    // Shuffle the cards
    cardValues = cardValues.sort(() => Math.random() - 0.5);

    // Create the card elements
    cardValues.forEach((value, index) => {
        const card = document.createElement('div');
        card.classList.add('card');

        if (level === 1) {
            // For level 1, display numbers on the card-back
            card.innerHTML = `<div class="card-front">🤔</div><div class="card-back">${value}</div>`;
        } else {
            // For levels 2 and beyond, display images on the card-back
            card.innerHTML = `<div class="card-front">🤔</div><div class="card-back" style="background-image: url('${value}'); background-size: cover;"></div>`;
        }

        card.addEventListener('click', () => flipCard(card, value));
        cardContainer.appendChild(card);
    });

    // Update the grid layout and card size
    updateGridAndCardSize(numCards);

    // Call the domino effect animation after setting up the level
    dominoAppear();
}

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
    let columns;

    if (numCards % 4 === 0) {
        columns = Math.sqrt(numCards); // Ensure a square-like layout if possible
    } else {
        columns = Math.ceil(Math.sqrt(numCards));
    }

    cardContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    // Set a base width for the cards and adjust proportionally
    const cardWidth = Math.min(150, 600 / columns); // Base card width
    const cardHeight = cardWidth * 1.5; // Keep the 2:3 aspect ratio

    document.querySelectorAll('.card').forEach(card => {
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardHeight}px`;
    });
}

// Function to flip the card and check for a match
function flipCard(card, value) {
    if (flippedCards.length < 2 && !card.classList.contains('flipped') && card.style.visibility !== 'hidden') {
        card.classList.add('flipped');
        flippedCards.push({ card, value });

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 600);  // Slight delay to allow viewing the flip before checking match
        }
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
    document.body.appendChild(winMessage);
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
    let timeLeft = seconds;
    timerDisplay.innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            gameOver();
        }
    }, 1000);
}

// Function to reset the game after losing
function gameOver() {
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
        
        // Append the message to the body
        if (!document.body.contains(levelMessage)) {
            document.body.appendChild(levelMessage);
        }

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
