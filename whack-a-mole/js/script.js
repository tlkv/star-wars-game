const MAX_LEVEL = 5;
const TIME_TARGET_INTERVAL = 1600;
const TIME_CHANGE = 200;
const TIME_ROUND = 10000;
const TIME_STEP = 1000;
const AMMO_DEFAULT = 30;

const holes = document.querySelectorAll('.hole');
const troopers = document.querySelectorAll('.trooper');
const game = document.querySelector('.game');
const startButton = document.querySelector('.start-button');
const resetButton = document.querySelector('.reset-button');
const resetTopButton = document.querySelector('.reset-top-button');
const scoreTotalNode = document.querySelector('.score-total');
const gameLevelNode = document.querySelector('.game-level');
const targetsTimeNode = document.querySelector('.game-targets');
const currentRoundScoreNode = document.querySelector('.current-round-score');
const maxLevelNode = document.querySelector('.max-level');
const timeLeft = document.querySelector('.time-left');
const ammoLeft = document.querySelector('.ammo-left');
const lastGameScore = document.querySelector('.last-game-score');
const top1 = document.querySelector('.top1');
const top2 = document.querySelector('.top2');
const top3 = document.querySelector('.top3');


let timeTarget = TIME_TARGET_INTERVAL;
let scoreTotalValue = 0;
let currentRoundScore = 0;
let gameLevelValue = 1;
let lastHole;
let roundOver = true;
let timeCurrentRound = TIME_ROUND;
let ammoCurrent = AMMO_DEFAULT;

gameLevelNode.textContent = gameLevelValue;
scoreTotalNode.textContent = scoreTotalValue;
currentRoundScoreNode.textContent = currentRoundScore;
maxLevelNode.textContent = MAX_LEVEL;
targetsTimeNode.textContent = TIME_TARGET_INTERVAL / 1000;
timeLeft.textContent = timeCurrentRound / 1000;
ammoLeft.textContent = ammoCurrent;
lastGameScore.textContent = 0;
top1.textContent = 0;
top2.textContent = 0;
top3.textContent = 0;

window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocaleStorage);
startButton.addEventListener('click', startLevel);
resetButton.addEventListener('click', resetGame);
resetTopButton.addEventListener('click', resetTop);
game.addEventListener('click', blaster);

troopers.forEach(trooper => trooper.addEventListener('click', shotOnTarget));

function setLocalStorage() {
    localStorage.setItem('score-total', scoreTotalNode.textContent);
    localStorage.setItem('game-level', gameLevelNode.textContent);
    localStorage.setItem('targets-time', targetsTimeNode.textContent);
    localStorage.setItem('last-game-score', lastGameScore.textContent);
    localStorage.setItem('top-1', top1.textContent);
    localStorage.setItem('top-2', top2.textContent);
    localStorage.setItem('top-3', top3.textContent);
}

function getLocaleStorage() {
    if (localStorage.getItem('score-total')) {
        scoreTotalNode.textContent = localStorage.getItem('score-total');
        scoreTotalValue = Number(scoreTotalNode.textContent);
    }
    if (localStorage.getItem('game-level')) {
        gameLevelNode.textContent = localStorage.getItem('game-level');
        gameLevelValue = Number(gameLevelNode.textContent);
        timeCurrentRound = TIME_ROUND - TIME_STEP * (gameLevelValue - 1);
        timeLeft.textContent = timeCurrentRound / 1000;
        ammoCurrent = AMMO_DEFAULT - (gameLevelValue - 1) * 5;
        ammoLeft.textContent = ammoCurrent;
    }
    if (localStorage.getItem('targets-time')) {
        targetsTimeNode.textContent = localStorage.getItem('targets-time');
        timeTarget = Number(targetsTimeNode.textContent * 1000);
    }
    if (localStorage.getItem('last-game-score')) {
        lastGameScore.textContent = localStorage.getItem('last-game-score');
    }
    if (localStorage.getItem('top-1')) {
        top1.textContent = localStorage.getItem('top-1');
    }
    if (localStorage.getItem('top-2')) {
        top2.textContent = localStorage.getItem('top-2');
    }
    if (localStorage.getItem('top-3')) {
        top3.textContent = localStorage.getItem('top-3');
    }
}

function startLevel() {
    
    roundOver = false;
    scoreTotalValue = Number(scoreTotalNode.textContent);
    gameLevelValue = Number(gameLevelNode.textContent);
    timeTarget = Number(targetsTimeNode.textContent * 1000);
    timeCurrentRound = TIME_ROUND - TIME_STEP * (gameLevelValue - 1);
    startButton.disabled = true;
    resetButton.disabled = true;
    resetTopButton.disabled = true;
    timer();
    launchTargets();
    setTimeout(finishLevel, timeCurrentRound);
}

function timer() {
    setTimeout(() => {
        timeCurrentRound -= 100;
        timeLeft.textContent = timeCurrentRound / 1000;
        if (timeCurrentRound > 0) {
            timer();
        } else if (gameLevelValue != MAX_LEVEL + 1) {
            timeLeft.textContent = (TIME_ROUND - TIME_STEP * (gameLevelValue - 1)) / 1000;
        } else if (gameLevelValue === MAX_LEVEL + 1) {
            timeLeft.textContent = TIME_ROUND / 1000;
        }
    }, 100);
}

function launchTargets() {
    let timeRandom = randomTime(timeTarget - 400, timeTarget + 400);
    const hole = randomHole(holes);
    //console.log('timeRandom: ', timeRandom, hole);
    hole.classList.add('up');

    setTimeout(() => {
        hole.classList.remove('up');
        hole.querySelector('.trooper').classList.remove('finished');
        if (!roundOver && timeCurrentRound >= timeRandom) launchTargets();
    }, timeRandom);
}

function finishLevel() {
    ammoLeft.classList.remove('ammo-none');
    startButton.disabled = false;
    resetButton.disabled = false;
    resetTopButton.disabled = false;
    roundOver = true;
    scoreTotalValue += currentRoundScore;
    scoreTotalNode.textContent = scoreTotalValue;
    gameLevelValue++;
    gameLevelNode.textContent = gameLevelValue;
    targetsTimeNode.textContent = (TIME_TARGET_INTERVAL - TIME_CHANGE * (gameLevelValue - 1)) / 1000;
    currentRoundScore = 0;
    currentRoundScoreNode.textContent = 0;
    ammoCurrent = AMMO_DEFAULT - (gameLevelValue - 1) * 5;
    ammoLeft.textContent = ammoCurrent;

    if (gameLevelValue === MAX_LEVEL + 1) {
        addTopScore();
        resetGame();
        gameOverSound();        
    }
}

function addTopScore() {
    let currentTop = Number(scoreTotalNode.textContent);
    lastGameScore.textContent = currentTop;
    let currentTop1 = Number(top1.textContent);
    let currentTop2 = Number(top2.textContent);
    let currentTop3 = Number(top3.textContent);

    if (currentTop > currentTop1) {
        top3.textContent = currentTop2;
        top2.textContent = currentTop1;
        top1.textContent = currentTop;
    }
    if (currentTop > currentTop2 && currentTop <= currentTop1) {
        top3.textContent = currentTop2;
        top2.textContent = currentTop;
    }
    if (currentTop > currentTop3 && currentTop <= currentTop2) {
        top3.textContent = currentTop;
    }
}

function resetGame() {
    scoreTotalNode.textContent = 0;
    scoreTotalValue = 0;
    gameLevelNode.textContent = 1;
    targetsTimeNode.textContent = TIME_TARGET_INTERVAL / 1000;
    ammoCurrent = AMMO_DEFAULT;
    ammoLeft.textContent = AMMO_DEFAULT;
    roundOver = true;
    timeTarget = TIME_TARGET_INTERVAL;
    timeLeft.textContent = TIME_ROUND / 1000;
    gameLevelValue = 1;
    localStorage.setItem('score-total', 0);
    localStorage.setItem('game-level', 1);
    localStorage.setItem('targets-time', TIME_TARGET_INTERVAL / 1000);    
}

function resetTop() {
    top1.textContent = 0;
    top2.textContent = 0;
    top3.textContent = 0;
    localStorage.setItem('top-1', 0);
    localStorage.setItem('top-2', 0);
    localStorage.setItem('top-3', 0);
}

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) {
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

function shotOnTarget(e) {
    if (!e.isTrusted || ammoCurrent < 1) return false;
    if (this.parentNode.classList.contains('up') & !roundOver) {
        currentRoundScore++;
        currentRoundScoreNode.textContent = currentRoundScore;
    }
    this.parentNode.classList.remove('up');
    this.classList.add('finished');
    setTimeout(() => this.classList.remove('finished'), 500);
}

function blaster() {
    if (roundOver) return false;
    let swSound1 = new Audio();
    if (ammoCurrent === 0) {
        ammoLeft.classList.add('ammo-none');
    }
    if (ammoCurrent > 0) {
        ammoCurrent--;
        ammoLeft.textContent = ammoCurrent;
        swSound1.src = "./assets/audio/sw_blaster.mp3";
    } else {
        swSound1.src = "./assets/audio/fail.mp3"
    }
    swSound1.play();
}

function gameOverSound() {
    let gameOverSound = new Audio();
    gameOverSound.src = "./assets/audio/swag.mp3";
    gameOverSound.play();
}

//adjust Scss
//CHeck w3 validator
//стилизация самооценки в консоли м мой ник там
//допилить оформление




/* Обязательный дополнительный фукционал
Дополните игру постепенно усложняющимися уровнями, сохранением текущего уровня и набранного количества баллов в LocalStorage и отображением его на странице игры после перезагрузки.
Количество уровней и в чём должно заключаться усложнение игры при переходе к следующему уровню - на ваше усмотрение.

Дополнительный функционал на выбор
добавьте звуки+,
ограничьте количество кликов в каждом раунде, добавьте анимацию и рандомное перемещение мишеней, и получите приложение, похожее на один из лучших финальных проектов набора 2020q3 Duck Hunt.*/