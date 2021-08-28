
const holes = document.querySelectorAll('.hole');
//spec comment for locStorage stuff

const moles = document.querySelectorAll('.mole');

const game = document.querySelector('.game');
const startButton = document.querySelector('.start-button');
const resetButton = document.querySelector('.reset-button');
//saved in localStorage
const scoreTotalNode = document.querySelector('.score');
const gameLevel = document.querySelector('.game-level');
const targetsTime = document.querySelector('.game-targets');


let lastHole;
let timeUp = false;
let scoreTotalCount;//wtf
let levelCurrent = 1;//wtf
//more consts
const maxLevel = 5;
let timeRound = 10000;

const timeStarting = 1500;
let timeTarget = timeStarting;
let records = [0, 0, 0, 0, 0,0, 0, 0, 0, 0]

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



function setLocalStorage() {
    localStorage.setItem('score-total', scoreTotalNode.textContent);
    localStorage.setItem('game-level', gameLevel.textContent);
    localStorage.setItem('targets-time', targetsTime.textContent);
}

window.addEventListener('beforeunload', setLocalStorage);

function getLocaleStorage() {
    if (localStorage.getItem('score-total')) {
        scoreTotalNode.textContent = localStorage.getItem('score-total');
    }
    if (localStorage.getItem('game-level')) {
        gameLevel.textContent = localStorage.getItem('game-level');
    }
    if (localStorage.getItem('targets-time')) {
        targetsTime.textContent = localStorage.getItem('targets-time');
    }
}

window.addEventListener('load', getLocaleStorage);

function finishLevel() {
    startButton.disabled = false;
    resetButton.disabled = false;
    timeUp = true;

    levelCurrent++;
    if (levelCurrent === maxLevel) {//10
        //addresults
        resetGame();
        gameOverSound();
        
    }
    
    gameLevel.textContent = levelCurrent;
    targetsTime.textContent = timeStarting-200*(levelCurrent-1);
    //time getinfo
}

function startGame() {

    
    timeUp = false;
    scoreTotalCount = Number(scoreTotalNode.textContent);
    levelCurrent = Number(gameLevel.textContent);
    timeTarget = Number(targetsTime.textContent);
   
    peep();
    startButton.disabled = true;
    resetButton.disabled = true;
    setTimeout(finishLevel, timeRound);//show time left
}

function peep() {
    
    let timeRandom = randomTime(timeTarget-400, timeTarget+400);
    //let time = randomTime(1000, 1500);
    const hole = randomHole(holes);
    console.log(timeRandom, hole);
    //hole.querySelector('.mole').classList.remove('dead');
    hole.classList.add('up');

    setTimeout(() => {
        hole.classList.remove('up');
        hole.querySelector('.mole').classList.remove('dead');
        if (!timeUp) peep();
    }, timeRandom);
}

function resetGame() {
    scoreTotalNode.textContent = 0;
    gameLevel.textContent = 1;
    levelCurrent = 1;
    targetsTime.textContent = 1500;
    score = 0;
    
    timeUp = true;
    timeTarget = 1500;
    //textContent of this item
}

function bonk(e) {
    if (!e.isTrusted) return;
    if (this.parentNode.classList.contains('up')) { 
        scoreTotalCount++;//add cond
        //console.log('sc++');
    } 
    
    this.parentNode.classList.remove('up');
    this.classList.add('dead');
    setTimeout(() => this.classList.remove('dead'), 500);
    //this.classList.remove('up');
    scoreTotalNode.textContent = scoreTotalCount;
}

moles.forEach(mole => mole.addEventListener('click', bonk));

game.addEventListener('click', gunSound);

function gunSound() {
    let audio = new Audio(); // Создаём новый элемент Audio
    audio.src = "./assets/audio/sw_blaster.mp3"; // Указываем путь к звуку "клика"
    audio.autoplay = true; // Автоматически запускаем
}

function gameOverSound() {
    let audio = new Audio(); // Создаём новый элемент Audio
    audio.src = "./assets/audio/swag.mp3"; // Указываем путь к звуку "клика"
    audio.autoplay = true; // Автоматически запускаем
}

//files лишние
//top3 results ammo времяРаунда 
//лишние данные и Лишние cons log


//время раунда сделать

//add republic logo
//pre load screen

//чем выше уровень - тем меньше секунд на появление
//max levl 10
//scores records table

//звуки

//rename functions, constants etc

//time until round finish
/* Обязательный дополнительный фукционал
Дополните игру постепенно усложняющимися уровнями, сохранением текущего уровня и набранного количества баллов в LocalStorage и отображением его на странице игры после перезагрузки.
Количество уровней и в чём должно заключаться усложнение игры при переходе к следующему уровню - на ваше усмотрение.

Дополнительный функционал на выбор
добавьте звуки, ограничьте количество кликов в каждом раунде, добавьте анимацию и рандомное перемещение мишеней, и получите приложение, похожее на один из лучших финальных проектов набора 2020q3 Duck Hunt.
Статья про работу над проектом


перед перезагрузкой или закрытием страницы (событие beforeunload) данные нужно сохранить
function setLocalStorage() {
  localStorage.setItem('name', name.value);
}
window.addEventListener('beforeunload', setLocalStorage)
перед загрузкой страницы (событие load) данные нужно восстановить и отобразить
function getLocalStorage() {
  if(localStorage.getItem('name')) {
    name.value = localStorage.getItem('name');
  }
}
window.addEventListener('load', getLocalStorage)*/