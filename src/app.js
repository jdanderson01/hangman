"use strict";
const gameState = {
    categoryData: {},
    currentCategory: "",
};
const startScreen = document.querySelector(".start-screen");
const categoryScreen = document.querySelector(".categories");
const gameScreen = document.querySelector(".game");
const startBtn = document.querySelector(".start-btn");
let selectedCategory = "";
let randomWord = { name: '', selected: false };
let guessedLetters = [];
let remainingGuesses = 6;
let letterArray = [];
const fetchCategoryData = () => {
    fetch("./data.json").then((response) => response.json()).then((data) => {
        gameState.categoryData = data;
        console.log("Category data loaded:", gameState.categoryData);
    })
        .catch((error) => {
        console.error("Error fetching category data:", error);
    });
};
const generateCategoryButtons = () => {
    const categories = ["Movies", "TV Shows", "Countries", "Capital Cities", "Animals", "Sports"];
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    categories.forEach((category) => {
        const button = document.createElement("button");
        button.textContent = category;
        button.classList.add("category-btn");
        button.addEventListener("click", () => handleCategoryClick(category));
        buttonContainer.appendChild(button);
    });
    categoryScreen.innerHTML = "";
    categoryScreen.appendChild(buttonContainer);
};
const displayUnderscores = () => {
    const wordDisplayContainer = document.querySelector(".word-display");
    wordDisplayContainer.innerHTML = "";
    letterArray.forEach(letter => {
        const letterElement = document.createElement("span");
        if (letter === " ") {
            letterElement.textContent = " ";
            letterElement.classList.add("space-element");
        }
        else {
            letterElement.textContent = guessedLetters.includes(letter) ? letter : "_";
            letterElement.classList.add("letter-element");
        }
        letterElement.style.marginRight = "10px";
        wordDisplayContainer.appendChild(letterElement);
    });
};
const startGame = () => {
    guessedLetters = [];
    remainingGuesses = 6;
    randomCategoryWord();
    letterArray = randomWord.name.toLowerCase().split("");
    displayUnderscores();
};
const handleCategoryClick = (category) => {
    selectedCategory = category;
    toggleScreenVisibility(categoryScreen, gameScreen);
    const categoryDisplay = document.createElement("h2");
    categoryDisplay.textContent = `Category: ${category}`;
    gameScreen.innerHTML = "";
    gameScreen.appendChild(categoryDisplay);
    const wordDisplayContainer = document.createElement("div");
    wordDisplayContainer.classList.add("word-display");
    gameScreen.appendChild(wordDisplayContainer);
    generateAlphabetButtons();
    startGame();
};
// Select a random word from the chosen category
const randomCategoryWord = () => {
    const { categories } = gameState.categoryData;
    const categoryWords = categories[selectedCategory];
    console.log("Selected Category:", selectedCategory);
    console.log("Category Words:", categoryWords);
    randomWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
    console.log(randomWord.name);
};
// Generate alphabet buttons 
const generateAlphabetButtons = () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const alphabetContainer = document.querySelector(".alphabet-container");
    if (!alphabetContainer) {
        const newAlphabetContainer = document.createElement("div");
        newAlphabetContainer.classList.add("alphabet-container");
        alphabet.split("").forEach((letter) => {
            const button = document.createElement("button");
            button.textContent = letter.toUpperCase();
            button.classList.add("letter-btn");
            button.addEventListener("click", (event) => handleLetterClick(letter, event));
            newAlphabetContainer.appendChild(button);
        });
        gameScreen.appendChild(newAlphabetContainer);
    }
};
// Handle letter guess
const handleLetterClick = (letter, event) => {
    const clickedButton = event.target;
    wordGuess(letter, clickedButton);
};
// Process the guessed letter
const wordGuess = (letter, clickedButton) => {
    letterArray = randomWord.name.toLowerCase().split("");
    if (letterArray.includes(letter)) {
        guessedLetters.push(letter);
        console.log(`You're right! ${letter} is in there.`);
        displayUnderscores();
    }
    else {
        console.log(`Incorrect! ${letter} is not in there.`);
        remainingGuesses--;
        if (remainingGuesses === 0) {
            // Show game over message and play again button
            const gameOverMessage = document.querySelector(".game-over-message");
            const playAgainButton = document.querySelector(".play-again-btn");
            if (gameOverMessage)
                gameOverMessage.style.display = "block";
            if (playAgainButton)
                playAgainButton.style.display = "block";
        }
    }
    // Disable the button after the guess
    clickedButton.disabled = true;
};
// Utility function to toggle screen visibility
const toggleScreenVisibility = (hideScreen, showScreen) => {
    hideScreen.style.display = "none";
    showScreen.style.display = "block";
};
// Reset the game and go back to category screen
const resetGame = () => {
    // Hide game over screen
    const gameOverMessage = document.querySelector(".game-over-message");
    const playAgainButton = document.querySelector(".play-again-btn");
    if (gameOverMessage)
        gameOverMessage.style.display = "none";
    if (playAgainButton)
        playAgainButton.style.display = "none";
    // Show category screen again
    toggleScreenVisibility(gameScreen, categoryScreen);
    // Reset guesses
    remainingGuesses = 6;
    guessedLetters = [];
};
// Display the category screen
const displayCategoryScreen = () => {
    toggleScreenVisibility(startScreen, categoryScreen);
    generateCategoryButtons();
};
// Initialize the game
const initializeGame = () => {
    fetchCategoryData();
    // Hide game over elements on initialization
    const gameOverMessage = document.querySelector(".game-over-message");
    const playAgainButton = document.querySelector(".play-again-btn");
    if (gameOverMessage)
        gameOverMessage.style.display = "none";
    if (playAgainButton)
        playAgainButton.style.display = "none";
    if (startBtn) {
        startBtn.addEventListener("click", displayCategoryScreen);
    }
    // Attach play again button event listener
    const playAgainButtonElement = document.querySelector(".play-again-btn");
    if (playAgainButtonElement) {
        playAgainButtonElement.addEventListener("click", resetGame);
    }
};
initializeGame();
