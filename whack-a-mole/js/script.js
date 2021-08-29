
const holes = document.querySelectorAll('.hole');
//spec comment for locStorage stuff

const moles = document.querySelectorAll('.mole');

const game = document.querySelector('.game');
const startButton = document.querySelector('.start-button');
const resetButton = document.querySelector('.reset-button');
const resetTopButton = document.querySelector('.reset-top-button');




//saved in localStorage
const scoreTotalNode = document.querySelector('.score-total');
let scoreTotalValue = 0;

const gameLevelNode = document.querySelector('.game-level');
let gameLevelValue = 1;

const targetsTimeNode = document.querySelector('.game-targets');

/* let topScores = document.querySelectorAll('.top');
for (let scoreResult of topScores) {
    scoreResult.textContent = 'x';
} */

const top1 = document.querySelector('.top1');
const top2 = document.querySelector('.top2');
const top3 = document.querySelector('.top3');


//
const currentRoundScoreNode = document.querySelector('.current-round-score');
let currentRoundScore = 0;//

let lastTrooper;
let roundOver = true;
//consts отдельно вверху

const maxLevel = 5;
const maxLevelNode = document.querySelector('.max-level');
maxLevelNode.textContent = maxLevel;
const timeTargetInterval = 1600;
targetsTimeNode.textContent = timeTargetInterval / 1000;
const timeStep = 200;
const timeRound = 10000;
const timeChange = 1000;
let timeCurrentRound = timeRound;

const timeLeft = document.querySelector('.time-left');
timeLeft.textContent = timeCurrentRound / 1000;

let timeTarget = timeTargetInterval;


const ammoDefault = 30;
let ammoCurrent = ammoDefault;
const ammoLeft = document.querySelector('.ammo-left');
ammoLeft.textContent = ammoCurrent;//append ammo current patrons
//let records = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]



function setLocalStorage() {
    localStorage.setItem('score-total', scoreTotalNode.textContent);
    localStorage.setItem('game-level', gameLevelNode.textContent);
    localStorage.setItem('targets-time', targetsTimeNode.textContent);
    localStorage.setItem('top-1', top1.textContent);
    localStorage.setItem('top-2', top2.textContent);
    localStorage.setItem('top-3', top3.textContent);
}

window.addEventListener('beforeunload', setLocalStorage);



function getLocaleStorage() {
    if (localStorage.getItem('score-total')) {
        scoreTotalNode.textContent = localStorage.getItem('score-total');
        scoreTotalValue = Number(scoreTotalNode.textContent);
    }
    if (localStorage.getItem('game-level')) {
        gameLevelNode.textContent = localStorage.getItem('game-level');
        gameLevelValue = Number(gameLevelNode.textContent);
        timeCurrentRound = timeRound - timeChange * (gameLevelValue - 1);
        timeLeft.textContent = timeCurrentRound / 1000;
        ammoCurrent = ammoDefault-(gameLevelValue-1)*5;
        ammoLeft.textContent = ammoCurrent;
    }
    if (localStorage.getItem('targets-time')) {
        targetsTimeNode.textContent = localStorage.getItem('targets-time');
        timeTarget = Number(targetsTimeNode.textContent * 1000);
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

window.addEventListener('load', getLocaleStorage);


startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
resetTopButton.addEventListener('click', resetTop);


function startGame() {
    
    roundOver = false;
    scoreTotalValue = Number(scoreTotalNode.textContent);//перенести в финиш
    gameLevelValue = Number(gameLevelNode.textContent);//
    timeTarget = Number(targetsTimeNode.textContent * 1000);//

    timeCurrentRound = timeRound - timeChange * (gameLevelValue - 1);//
    //



    startButton.disabled = true;
    resetButton.disabled = true;
    resetTopButton.disabled = true;
    timer();
    peep();
    setTimeout(finishLevel, timeCurrentRound);//show tim left
}

function timer() {
    setTimeout(() => {
        timeCurrentRound -= 100;
        timeLeft.textContent = timeCurrentRound / 1000;
        if (timeCurrentRound > 0) {
            timer();
        } else if (gameLevelValue != maxLevel + 1) {
            timeLeft.textContent = (timeRound - timeChange * (gameLevelValue - 1)) / 1000;
        } else if (gameLevelValue === maxLevel + 1) {
            timeLeft.textContent = timeRound / 1000;
        }

    }, 100);
}

function peep() {

    let timeRandom = randomTime(timeTarget - 400, timeTarget + 400);
    //let time = randomTime(1000, 1500);
    const hole = randomHole(holes);
    console.log('timeRand', timeRandom, hole);
    console.log('timeCurrentRound', timeCurrentRound);

    //hole.querySelector('.mole').classList.remove('dead');
    hole.classList.add('up');

    setTimeout(() => {
        hole.classList.remove('up');
        hole.querySelector('.mole').classList.remove('dead');
        if (!roundOver && timeCurrentRound >= timeRandom) peep();
    }, timeRandom);
}

function finishLevel() {

    startButton.disabled = false;
    resetButton.disabled = false;
    resetTopButton.disabled = false;
    roundOver = true;
    scoreTotalValue += currentRoundScore;
    scoreTotalNode.textContent = scoreTotalValue;
    gameLevelValue++;

    //
    gameLevelNode.textContent = gameLevelValue;
    targetsTimeNode.textContent = (timeTargetInterval - timeStep * (gameLevelValue - 1)) / 1000;
    //tim getinfo
    currentRoundScore = 0;
    currentRoundScoreNode.textContent = 0;


    ammoCurrent = ammoDefault-(gameLevelValue-1)*5;
    ammoLeft.textContent = ammoCurrent;

    if (gameLevelValue === maxLevel + 1) {//10
        //addresults
        addTopScore();
        resetGame();
        gameOverSound();

    }
}

function addTopScore() {
    let currentTop = Number(scoreTotalNode.textContent);
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

    targetsTimeNode.textContent = timeTargetInterval / 1000;
    ammoCurrent = ammoDefault;
    ammoLeft.textContent = ammoDefault;
    roundOver = true;
    timeTarget = timeTargetInterval;
    timeLeft.textContent = timeRound / 1000;
    gameLevelValue = 1;
    //timeCurrentRound = timeRound;
    localStorage.setItem('score-total', 0);
    localStorage.setItem('game-level', 1);
    localStorage.setItem('targets-time', timeTargetInterval / 1000);
    //textContent of this item
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
    if (hole === lastTrooper) {
        return randomHole(holes);
    }
    lastTrooper = hole;
    return hole;
}

moles.forEach(mole => mole.addEventListener('click', bonk));
function bonk(e) {
    if (!e.isTrusted || ammoCurrent<1) return false;
    if (this.parentNode.classList.contains('up') & !roundOver) {
        currentRoundScore++;
        currentRoundScoreNode.textContent = currentRoundScore;        
    }

    this.parentNode.classList.remove('up');
    this.classList.add('dead');
    setTimeout(() => this.classList.remove('dead'), 500);

    //scoreTotalNode.textContent = scoreTotalValue;
}

game.addEventListener('click', blaster);

function blaster() {
    if (roundOver) return false;    
    let swSound1 = new Audio(); 
    if (ammoCurrent>0) {
        ammoCurrent--;
        ammoLeft.textContent = ammoCurrent;
        swSound1.src = "./assets/audio/sw_blaster.mp3";
    } else {
        swSound1.src = "./assets/audio/fail.mp3"
    }
    swSound1.play();
    
}

function gameOverSound() {
    let gameOverSound = new Audio(); // Создаём новый элемент Audio
    gameOverSound.src = "./assets/audio/swag.mp3"; // Указываем путь к звуку "клика"
    gameOverSound.play(); // Автоматически запускаем
}





