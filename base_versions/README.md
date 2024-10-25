# Andy's Memory Bash - Game Overview

## Table of Contents
- [Introduction](#introduction)
- [Game Requirements](#game-requirements)
- [Game Features](#game-features)
- [Levels and Logic](#levels-and-logic)
- [Gameplay Elements](#gameplay-elements)
- [Technical Setup](#technical-setup)
- [How to Play](#how-to-play)
- [Future Improvements](#future-improvements)

## Introduction
**Andy's Memory Bash** is an interactive card-matching memory game designed to be both challenging and fun for players of all ages. The game includes multiple levels, each increasing in difficulty, with dynamic features such as numbers, images from Unsplash, and additional challenges to keep players engaged. The game introduces concepts like random questioning to test cognitive skills, levels with different card sets, and creative visual elements.

## Game Requirements
To build and run **Andy's Memory Bash**, the following are required:
- **Web Browser**: A modern web browser like Chrome, Firefox, or Safari.
- **HTML, CSS, JavaScript**: The game uses these core technologies.
- **GSAP**: The animation library used to create visual effects.
- **Internet Connection**: Required to fetch random images from Unsplash during even-numbered levels.

## Game Features
1. **Intro Screen with Start Button**: When the game is loaded, players are welcomed by an introductory screen featuring the title of the game, "Andy's Memory Bash," and a "Start Game" button.
2. **Multiple Levels**: The game consists of multiple levels, increasing in difficulty as the player progresses.
    - Odd-numbered levels use numbers for the card pairs.
    - Even-numbered levels use randomly selected images from Unsplash.
3. **Dynamic Card Matching**: Cards are presented in different layouts, and players must flip and match them in pairs.
4. **Domino Effect Animation**: Cards appear on the screen with a "domino" effect at the beginning of each level.
5. **Random Question Challenges**: After two missed tries, players need to answer a randomly generated math question to proceed.
6. **Level Transition**: Each level transitions smoothly with an animated message introducing the next level.
7. **Game Completion Animation**: Once the player completes the final level, a celebratory message is displayed with a card animation inspired by Solitaire.

## Levels and Logic
- **Level Progression**: The game begins with 8 cards and gradually increases in difficulty by adding more cards up to a maximum of 15 levels.
- **Odd Levels**: Cards are represented by numbers, making it a simpler matching task.
- **Even Levels**: Cards are represented by images from Unsplash, adding a visual challenge.
- **Domino Effect**: At the beginning of each level, cards appear sequentially with a GSAP-powered "domino" animation, giving the game a visually pleasing start.

## Gameplay Elements
- **Game Container**: The main container where cards are displayed in a grid layout.
- **Cards**: Each card has two sides: a "front" side with a default image/icon and a "back" side containing a number or an image, depending on the level.
- **Question Popup**: A modal appears if the player misses two tries, challenging the player with a math question before proceeding.
- **Timer**: A timer is shown when a question popup appears, adding a time-based element to answer correctly.
- **Level Message**: Displays a message between levels to show progress, e.g., "Welcome to Level 2!"

## Technical Setup
- **HTML**: The core structure, including the game container, intro screen, and modal popups.
- **CSS**: Styling for all elements, including animations, card layouts, intro screen, and popups.
- **JavaScript**: Game logic, including card generation, shuffling, flipping, and handling player interactions.
  - **GSAP Library**: Used to provide animations like the "domino" effect for cards and bounce effects for messages.
  - **Unsplash API**: Integrated for even-numbered levels to generate random card images.

## How to Play
1. **Starting the Game**: Upon loading, players see an intro screen titled "Andy's Memory Bash" with a button labeled "Start Game".
2. **Flipping Cards**: Players need to click on the cards to reveal them and find matching pairs.
3. **Level Progression**: After completing a level, players will be notified with a "Welcome to Level X" message and will proceed to the next level.
4. **Random Question Challenge**: If the player fails to find a match twice, a random math question will be prompted, requiring a correct answer to continue.
5. **Winning the Game**: After completing the final level, a congratulatory message is displayed, along with an animated effect for the cards, similar to the classic Solitaire game.

## Future Improvements
1. **More Complex Challenges**: Introduce additional types of challenges, such as memory-based sequences or puzzles, between levels.
2. **Multiplayer Mode**: Add a multiplayer feature to allow two players to compete against each other in real time.
3. **Theming**: Allow players to select themes for the cards, such as animals, planets, or historical figures, adding more variety.
4. **Sound Effects and Background Music**: Integrate sounds to make the game more immersive and add background music with options to toggle.
5. **Scoring System**: Add a scoring system to track the player's efficiency and assign points based on how quickly levels are completed.

## Conclusion
**Andy's Memory Bash** is an engaging and dynamic game designed to challenge the player's memory skills while providing visually appealing animations and increasing difficulty. With interactive levels that use a mix of numbers and images, random question challenges, and exciting transitions, the game aims to provide an enjoyable and challenging experience for players of all ages.

