
// Step 1: Grab the HTML elements we need to interact with
const screenElems = document.querySelectorAll(".screen"); // All the screens (About Me, Gallery, etc.)
const screenBtnElems = document.querySelectorAll(".screen-btn"); // Buttons to switch between screens
const mySocialButton = document.getElementById("my-social-button"); // Button to toggle the social panel
const socialPanel = document.getElementById("socialPanel"); // The social panel at the bottom

// Step 1.5: Create global variables for timers (used for animations and effects)
let socialTimeout; // Timer for auto-hiding the social panel
let typingTimeout; // Timer for the typing effect in the quote box
let fadeInTimeout; // Timer for the fade-in effect of the quote author

// Step 2: Write functions to handle the behavior

// Screen switching (About Me, Gallery, etc.)
function switchScreen(event) {
  const screenToSwitchTo = event.target.dataset.screen;

  screenElems.forEach((screen) => {
    screen.style.display = "none"; 
  });

  const selectedScreen = document.getElementById(screenToSwitchTo);
  selectedScreen.style.display = "flex"; 


  const quoteBox = document.getElementById("quote-box");
  if (quoteBox) {
    quoteBox.style.display = "none"; 
    clearTimeout(typingTimeout); 
    clearTimeout(fadeInTimeout); 
  }
}

// Step 3: Attach event listeners to the screen buttons

screenBtnElems.forEach((screenBtn) => {
  screenBtn.addEventListener("click", switchScreen); 
});

// My socials button */
mySocialButton.addEventListener("click", () => {
  if (socialPanel.classList.contains("show")) {
    socialPanel.classList.remove("show");
    setTimeout(() => {
      socialPanel.classList.add("hidden");
    }, 300); 
    clearTimeout(socialTimeout); 
  } else {
    socialPanel.classList.remove("hidden");
    setTimeout(() => {
      socialPanel.classList.add("show");
    }, 10); 

    clearTimeout(socialTimeout);
    socialTimeout = setTimeout(() => {
      socialPanel.classList.remove("show");
      setTimeout(() => {
        socialPanel.classList.add("hidden");
      }, 300);
    }, 5000);
  }
});

//Fetches and displays a random quote with typing and fade-in effects.

async function displayRandomQuote() {
  try {
    const response = await fetch("https://raw.githubusercontent.com/AtaGowani/daily-motivation/master/src/data/quotes.json");
    const quotes = await response.json();
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteTextElem = document.getElementById("quote-text");
    const quoteAuthorElem = document.getElementById("quote-author");

    // Reset the content and styles
    quoteTextElem.textContent = "";
    quoteTextElem.classList.remove("error");
    quoteAuthorElem.textContent = `- ${randomQuote.author}`;
    quoteAuthorElem.style.opacity = 0;

    // Clear any ongoing timers
    clearTimeout(typingTimeout);
    clearTimeout(fadeInTimeout);


    // Typing effect for the quote  (thanks AI for this)
    let index = 0;
    function typeQuote() {
      if (index < randomQuote.quote.length) {
      if (index === 0) quoteTextElem.textContent = '" '; 
        quoteTextElem.textContent += randomQuote.quote.charAt(index);
      if (index === randomQuote.quote.length - 1) quoteTextElem.textContent += ' "';
        index++;
        typingTimeout = setTimeout(typeQuote, 50); // Delay between each character
      } else {
        fadeInTimeout = setTimeout(() => {
          quoteAuthorElem.style.opacity = 1; // Fade in the author name
        }, 500);
      }
    }

    typeQuote(); 
  } catch (error) {
    const quoteTextElem = document.getElementById("quote-text");
    const quoteAuthorElem = document.getElementById("quote-author");
    quoteTextElem.textContent = "Failed to load quote. Please try again.";
    quoteTextElem.classList.add("error");
    quoteAuthorElem.textContent = "";
    quoteAuthorElem.style.opacity = 0;
  }
}
document.getElementById("home").addEventListener("click", () => {
  const quoteBox = document.getElementById("quote-box");
  if (quoteBox) {
    quoteBox.style.display = "block";
  }
  displayRandomQuote();
});

// My Gallery


document.querySelectorAll(".album-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetAlbum = btn.dataset.album;

    document.querySelectorAll(".album-view").forEach((album) => {
      album.classList.add("hidden");
    });

    const activeAlbum = document.getElementById(targetAlbum);
    if (activeAlbum) {
      activeAlbum.classList.remove("hidden");
    }
  });
});


// Rock Paper Scissors Lizard Spock game logic  (thanks AI for this)

// Initialize scores
let wins = 0;
let losses = 0;
let draws = 0;

// Define the rules of the game
const rules = {
  rock: ["scissors", "lizard"],
  paper: ["rock", "spock"],
  scissors: ["paper", "lizard"],
  lizard: ["spock", "paper"],
  spock: ["scissors", "rock"],
};

// Show the game when the launcher is clicked
document.getElementById("rpsls-launcher").addEventListener("click", () => {
  document.getElementById("rpsls-launcher").style.display = "none"; // Hide the launcher icon
  document.getElementById("rpsls-game").classList.remove("hidden"); // Show the game
});

// Add event listeners to the game buttons
document.querySelectorAll(".buttons button").forEach((button) => {
  button.addEventListener("click", () => {
    const move = button.getAttribute("data-move"); // Get the player's move
    play(move); // Play the game
  });
});

// Reset the game when the reset button is clicked
document.getElementById("reset-btn").addEventListener("click", resetGame);

// Show and hide the rules modal
document.getElementById("show-rules-btn").addEventListener("click", showRules);
document.getElementById("close-rules-btn").addEventListener("click", closeRules);

// Exit the game and return to the launcher
document.getElementById("exit-game-btn").addEventListener("click", () => {
  document.getElementById("rpsls-game").classList.add("hidden"); // Hide the game
  document.getElementById("rpsls-launcher").style.display = "block"; // Show the launcher icon
});

/**
 * Plays a round of the game.
 * @param {string} playerMove - The player's move (rock, paper, etc.).
 */
function play(playerMove) {
  const imagePath = "images/game-RPSLS/"; // Path to the images
  const moves = Object.keys(rules); // All possible moves
  const computerMove = moves[Math.floor(Math.random() * moves.length)]; // Random computer move
  const playerImg = document.getElementById("player-img");
  const computerImg = document.getElementById("computer-img");
  const resultElem = document.getElementById("result");

  // Update the choices
  document.getElementById("player-choice").textContent = "You chose: " + playerMove;
  document.getElementById("computer-choice").textContent = "Computer chose: " + computerMove;

  // Update the images
  playerImg.src = `${imagePath}${playerMove}.png`;
  computerImg.src = `${imagePath}${computerMove}.png`;

  // Reset winner styles
  playerImg.classList.remove("winner");
  computerImg.classList.remove("winner");
  resultElem.classList.remove("result-win", "result-lose", "result-draw");

  // Determine the result
  if (playerMove === computerMove) {
    resultElem.textContent = "It's a draw!";
    resultElem.classList.add("result-draw");
    draws++;
  } else if (rules[playerMove].includes(computerMove)) {
    resultElem.textContent = "You win!";
    resultElem.classList.add("result-win");
    wins++;
    playerImg.classList.add("winner");
  } else {
    resultElem.textContent = "You lose!";
    resultElem.classList.add("result-lose");
    losses++;
    computerImg.classList.add("winner");
  }

  updateScoreboard(); // Update the scoreboard
}

/**
 * Updates the scoreboard with the current scores.
 */
function updateScoreboard() {
  document.getElementById("wins").textContent = wins;
  document.getElementById("losses").textContent = losses;
  document.getElementById("draws").textContent = draws;
}

/**
 * Resets the game to its initial state.
 */
function resetGame() {
  wins = 0;
  losses = 0;
  draws = 0;
  updateScoreboard();

  // Reset the game UI
  document.getElementById("player-choice").textContent = "";
  document.getElementById("computer-choice").textContent = "";
  document.getElementById("result").textContent = "";
  document.getElementById("player-img").src = "./images/game-RPSLS/you.png";
  document.getElementById("computer-img").src = "./images/game-RPSLS/computer.png";
  document.getElementById("player-img").classList.remove("winner");
  document.getElementById("computer-img").classList.remove("winner");
}

/**
 * Shows the rules modal.
 */
function showRules() {
  document.getElementById("rules-modal").style.display = "block";
}

/**
 * Hides the rules modal.
 */
function closeRules() {
  document.getElementById("rules-modal").style.display = "none";
}



