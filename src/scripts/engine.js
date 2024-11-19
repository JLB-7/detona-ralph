const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        record: document.querySelector("#record"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        lives: 3,
    },
    action: {
        timerId: null,
        countDownTimerId: null,
    }
}

const sounds = {
    hit: new Audio("./src/audios/hit.m4a"),
    miss: new Audio("/src/audios/error.mp4")
};

function playSound(audioName){
    let audio = sounds[audioName];
    audio.volume = 0.2;
    audio.currentTime = 0;
    audio.play();
}

function randomSquare(){
    state.view.squares.forEach(square => {
        square.classList.remove("enemy");
    })

    let newHitPosition;
    do {
        let randomNumber = Math.floor(Math.random() * state.view.squares.length);
        newHitPosition = state.view.squares[randomNumber].id;
    } while (newHitPosition === state.values.hitPosition);

    const randomSquare = document.getElementById(newHitPosition);
    randomSquare.classList.add("enemy");
    state.values.hitPosition = newHitPosition;
}

function countDown(){
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;
    
    if (state.values.currentTime <= 0) {
        clearInterval(state.action.countDownTimerId);
        clearInterval(state.action.timerId);
        gamerOver();   
    }
}

function gamerOver(){
    if (state.values.lives > 1) {
         state.values.lives--;
         state.view.lives.textContent = state.values.lives;
         resetGame();
    } else {
        saveRecord();
        alert(`Game Over! O seu resultado final foi: ${state.values.result}`);
        resetAll();
    }
}

function resetGame() {
    state.values.result = 0;
    state.view.score.textContent = state.values.result;
    state.values.currentTime = 60;
    state.view.timeLeft.textContent = state.values.currentTime;

    state.action.timerId = setInterval (randomSquare, state.values.gameVelocity);
    state.action.countDownTimerId = setInterval (countDown, 1000);
}

function resetAll(){
    state.values.lives = 3;
    state.view.lives.textContent = state.values.lives;
    state.values.result = 0;
    state.view.score.textContent = state.values.result;
    state.values.currentTime = 60;
    state.view.timeLeft.textContent = state.values.currentTime;

    clearInterval(state.action.timerId);
    clearInterval(state.action.countDownTimerId);
}

function saveRecord(){
    const currentRecord = localStorage.getItem("record") || 0;
    if (state.values.result > currentRecord){
        localStorage.setItem('record', state.values.result);
        alert("Parabéns! Você quebrou o recorde!")
    }
}

function showRecord() {
    const record = localStorage.getItem("record") || 0;
    state.view.record.textContent = record;
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if(square.id === state.values.hitPosition){
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("hit");
            } else {
                playSound("miss");
            }
        })
    })
}

function initialize() {
    state.view.lives.textContent = state.values.lives;
    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.score.textContent = state.values.result;
    showRecord();

    addListenerHitBox();

    state.action.timerId = setInterval(randomSquare, state.values.gameVelocity);
    state.action.countDownTimerId = setInterval(countDown, 1000);
}

initialize();