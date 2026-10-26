// Constants
const INITIAL_LIVES = 3;
const MIN_STREAK_TO_WIN = 0;

// Game Database
const ITEMS_DATABASE = [
  { name: "First iPhone release", value: 2007, type: "year" },
  { name: "Yuri Gagarin's space flight", value: 1961, type: "year" },
  { name: "Google company foundation", value: 1998, type: "year" },
  { name: "Minecraft release", value: 2011, type: "year" },
  { name: "Price of a cup of coffee (in cents)", value: 350, type: "price" },
  { name: "IMDb rating of 'Inception' (multiplied by 10)", value: 88, type: "rating" },
  { name: "JavaScript release year", value: 1995, type: "year" },
  { name: "Average price of a good graphics card ($)", value: 600, type: "price" },
  { name: "Rating of 'The Witcher 3'", value: 93, type: "rating" },
  { name: "Apple company foundation year", value: 1976, type: "year" }
];

let lives = INITIAL_LIVES;
let streak = 0;
let bestStreak = 0;
let currentItem = null;
let nextItem = null;
let isGameOver = false;

// DOM Elements
const livesEl = document.getElementById('lives');
const streakEl = document.getElementById('streak');
const bestStreakEl = document.getElementById('best-streak');
const btnHigher = document.getElementById('btn-higher');
const btnLower = document.getElementById('btn-lower');
const gameMessageEl = document.getElementById('game-message');
const btnRestart = document.getElementById('btn-restart');

// Helper Functions
function getRandomItem(excludeItem = null) {
  let filtered = ITEMS_DATABASE;
  if (excludeItem) {
    filtered = ITEMS_DATABASE.filter(item => item.name !== excludeItem.name);
  }
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

// Game Initialization
function initGame() {
  lives = INITIAL_LIVES;
  streak = 0;
  isGameOver = false;

  currentItem = getRandomItem();
  nextItem = getRandomItem(currentItem);

  btnHigher.disabled = false;
  btnLower.disabled = false;
  btnRestart.style.display = 'none';
  
  updateUI();
  gameMessageEl.textContent = `Compare: is "${nextItem.name}" higher or lower than "${currentItem.name}"?`;
}

// UI Updates
function updateUI() {
  livesEl.textContent = lives;
  streakEl.textContent = streak;
  bestStreakEl.textContent = bestStreak;
  
  document.getElementById('item-left').innerHTML = `<span style="font-size: 12px; display: block; color: #9ca3af; margin-bottom: 5px;">Current:</span>${currentItem.name}`;
  document.getElementById('item-right').innerHTML = `<span style="font-size: 12px; display: block; color: #9ca3af; margin-bottom: 5px;">Next:</span>${nextItem.name}`;
}

// Game Logic
function makeGuess(userChoice) {
  if (isGameOver) {
    gameMessageEl.textContent = "Game over! Click 'Play Again'.";
    return;
  }

  if (userChoice !== 'higher' && userChoice !== 'lower') {
    gameMessageEl.textContent = "Error: invalid choice!";
    return;
  }

  let isCorrect = false;
  const diff = nextItem.value - currentItem.value;

  if (diff === 0 && (userChoice === 'higher' || userChoice === 'lower')) {
    isCorrect = true;
  } else if ((userChoice === 'higher' && nextItem.value > currentItem.value) || (diff > 0 && userChoice === 'higher')) {
    isCorrect = true;
  } else if ((userChoice === 'lower' && nextItem.value < currentItem.value) || (diff < 0 && userChoice === 'lower')) {
    isCorrect = true;
  }

  if (isCorrect) {
    streak++;
    if (streak > bestStreak) {
      bestStreak = streak;
    }
    gameMessageEl.textContent = `Correct! "${nextItem.name}" value was ${nextItem.value} (vs "${currentItem.name}" — ${currentItem.value}).`;
  } else {
    lives--;
    gameMessageEl.textContent = `Wrong! "${nextItem.name}" value was ${nextItem.value}, while "${currentItem.name}" was ${currentItem.value}.`;
  }

  if (lives <= 0) {
    isGameOver = true;
    gameMessageEl.textContent = `Game Over! Final streak: ${streak}.`;
    btnHigher.disabled = true;
    btnLower.disabled = true;
    btnRestart.style.display = 'inline-block';
  } else {
    currentItem = nextItem;
    nextItem = getRandomItem(currentItem);
  }

  updateUI();
}

// Event Listeners
btnHigher.addEventListener('click', () => makeGuess('higher'));
btnLower.addEventListener('click', () => makeGuess('lower'));
btnRestart.addEventListener('click', initGame);

// Start
initGame();