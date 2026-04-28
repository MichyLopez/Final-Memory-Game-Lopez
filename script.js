// Variables
const images = [
    "assets/Alien1.png",
    "assets/Alien2.png",
    "assets/Alien3.png",
    "assets/Alien4.png",
    "assets/Alien5.png",
    "assets/Alien6.png",
];

let firstCard = null;
let secondCard = null;
let canFlip = true;
let matches = 0;
let moves = 0;
let seconds = 0;
let timerRunning = false;
let timerInterval = null;

// Start Game
function startGame() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';

    let cardImages = [...images, ...images];
    cardImages.sort(() => Math.random() - 0.5);

    cardImages.forEach(image => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
        <div class="card-front"><i class="fas fa-rocket"></i></div>
        <div class="card-back"><img src="${image}" alt=""></div>
        `;
        card.dataset.image = image;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });

    resetGameStates();
    updateStats();
}

function resetGameStates() {
     firstCard = null;
     secondCard = null;
     canFlip = true;
     matches = 0;
     moves = 0;
     seconds = 0;
     timerRunning = false;

     if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function flipCard(){
    if (!canFlip) return;
    if (this.classList.contains('flipped') || this.classList.contains('matched')) return;

    if (!timerRunning) {
        startTimer();
    }

    this.classList.add('flipped')

     if (!firstCard) {
        firstCard = this;
    } else if (firstCard !== this) {
        secondCard = this;
        canFlip = false;
        moves++;
        updateStats();
        checkMatch();
    }
}

function checkMatch() {
    const isMatch = firstCard.dataset.image === secondCard.dataset.image;
    const card1 = firstCard;
    const card2 = secondCard;

    if (isMatch) {
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matches++;
            updateStats();

            if (matches === 6) {
                endGame();
            } else {
                resetCards();
            }
        }, 600);
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            resetCards();
        }, 600);
    }
}

function resetCards(){
    firstCard = null;
    secondCard = null;
    canFlip = true;
}

function startTimer(){
    timerRunning = true;
    timerInterval = setInterval(() => {
        seconds++;
        updateStats();
    }, 1000);
}

function updateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    if (statValues.length >= 3) {
        statValues[0].textContent = moves;
        statValues[2].textContent = `${matches}/6`;
        const mins = Math.floor(seconds / 60);
        let secs = seconds % 60;
        secs = secs < 10 ? '0' + secs : secs;
        statValues[1].textContent = `${mins}:${secs}`;
    }
}

function endGame() {
    if (timerInterval) clearInterval(timerInterval);

    document.getElementById('finalMoves').textContent = moves;

    const timeEl = document.querySelector('.stat-value:nth-child(2)');
    document.getElementById('finalTime').textContent = timeEl ? timeEl.textContent : '0:00';
    
    document.getElementById('winModal').classList.add('show');
}

function newGame() {
    document.getElementById('winModal').classList.remove('show');
    clearInterval(timerInterval);
    startGame();   
}

window.addEventListener('load', startGame);