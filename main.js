'use strict';

const CARROT_SIZE = 80;
const CARROT_COUNT = 15;
const BUG_COUNT = 10;
const GAME_DURATION_SEC = 15;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();

const gameBtn = document.querySelector('.game__btn');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const popup = document.querySelector('.popup');
const popupText = document.querySelector('.popup__message');
const popupReplay = document.querySelector('.popup__replay');

const carrotSound = new Audio('../sound/carrot_pull.mp3');
const alertSound = new Audio('../sound/alert.wav');
const bgSound = new Audio('../sound/bg.mp3');
const bugSound = new Audio('../sound/bug_pull.mp3');
const winSound = new Audio('../sound/game_win.mp3');

//게임이 시작이 되었는지 안되었는지
let started = false;
//점수 기억
let score = 0;
//타이머
let timer = undefined;

field.addEventListener('click', onFieldClick);
gameBtn.addEventListener('click', () => {
    if(started) {
        stopGame();
    } else{
        startGame();
    }
});

popupReplay.addEventListener('click', () => {
    startGame();
    hidePopup();
})

function startGame() {
    started = true;
    //init : 초기화
    initGame();
    showStopBtn();
    showTimerAndScore();
    startGameTimer();
    playSound(bgSound);
}
function stopGame() {
    started = false;
    stopGameTimer();
    hideGameBtn();
    showPopupWithText('REPLAY❓');
    playSound(alertSound);
    stopSound(bgSound);
}

function finishGame(win) {
    started = false;
    hideGameBtn();
    if(win) {
        playSound(winSound);
    }else {
        playSound(bugSound);
    }
    stopGameTimer();
    stopSound(bgSound);
    showPopupWithText(win? 'YOU WIN!🎉' : 'YOU LOSE!🥵')
}

function showStopBtn() {
    const icon = gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    gameBtn.style.visibility = 'visible';
}

function hideGameBtn() {
    gameBtn.style.visibility = 'hidden';
}

function showTimerAndScore() {
    gameTimer.style.visibility = 'visible';
    gameScore.style.visibility = 'visible';

}

function startGameTimer() {
    let remainingTimeSec = GAME_DURATION_SEC;
    updateTimerText(remainingTimeSec);
    timer = setInterval(() => {
        if(remainingTimeSec <= 0) {
            clearInterval(timer);
            finishGame(CARROT_COUNT === score);
            return;
        }
        updateTimerText(--remainingTimeSec);
    }, 1000);
}

function stopGameTimer() {
    clearInterval(timer);
}

function updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    gameTimer.innerText = `${minutes} : ${seconds}`;
}

function showPopupWithText(text) {
    popupText.innerText = text;
    popup.classList.remove('popup--hide');
}

function hidePopup() {
    popup.classList.add('popup--hide');
    
}
function initGame() {
    score = 0;
    field.innerHTML = '';
    gameScore.innerText = CARROT_COUNT;
    //After randomly positioning carrot & bugs, add to field
    addItem('carrot', CARROT_COUNT, 'img/carrot.png');
    addItem('bug', BUG_COUNT, 'img/bug.png');
}

function onFieldClick(event) {
    if(!started) {
        return;
    }
    const target = event.target;
    if(target.matches('.carrot')) {
        //당근!!
        target.remove();
        score++;
        playSound(carrotSound);
        updateScoreBoard();
        if(score === CARROT_COUNT) {
            finishGame(true);
        }
    }else if (target.matches('.bug')) {
        //벌레!!
        finishGame(false);
    }
}

function playSound(sound) {
    sound.currentTime = 0 ;
    sound.play();
}

function stopSound(sound) {
    sound.pause();
}

function updateScoreBoard() {
    gameScore.innerText = CARROT_COUNT - score;
}

function addItem(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    const x2 = fieldRect.width - CARROT_SIZE;
    const y2 = fieldRect.height - CARROT_SIZE;
    for (let i = 0; i < count; i++) {
        const item = document.createElement('img');
        item.setAttribute('class', className);
        item.setAttribute('src', imgPath);
        item.style.position = 'absolute';
        const x = randomNumber(x1, x2);
        const y = randomNumber(y1, y2);
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        field.appendChild(item);
    }
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}



