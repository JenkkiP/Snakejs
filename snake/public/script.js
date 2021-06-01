const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

class SnakePart{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    
}

let speed = 7;
let gradient = ctx.createLinearGradient(0,0, canvas.width, 0);
let tileCount = 30;
let headX = 14;
let headY = 9;
let tileSize = canvas.width / tileCount - 2;

const snakeParts = [];
let tailLength = 2;

let appleX = 5;
let appleY = 5;

let rngPear = 0;
let pearX = 10;
let pearY = 10;

let rngFlash = 0;
let flashY = headY;
let flashX = headX;

let rockY = 13;
let rockX = 13;

let xVelocity = 0;
let yVelocity = 0;

let color = 0;

let score = 0;

let anyKeyEnabled = true;

const eatSound = new Audio('eat.wav');

const gameOverSound = new Audio('gameOver.wav');
const pearSound = new Audio('pearsounds.wav');

function anyKey(){
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.shadowBlur = 10;
    
    ctx.fillStyle = 'white';
    ctx.font = '50px Verdana';
    
    gradient.addColorStop('0.5', 'magenta');
    gradient.addColorStop('0.6', 'cyan');
    gradient.addColorStop('0.3', 'blue');
    ctx.fillStyle = gradient;
    ctx.fillText("Press Any Arrow Key To Start!", canvas.width / 2, canvas.height / 1.5 - 100);
}

document.getElementById('btn').addEventListener('click', function(e){
    let nickname = document.getElementById('nickname').value;
    let data = {
    score,
    nickname
    }
    console.log(nickname.value);
    fetch("http://localhost:3000/save", {
    method: 'POST',
    headers:{
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
})
.then(response => response.json())
.then(data => {
    console.log(data)
})
console.log(data);
console.log(score);

})

function drawGame(){
    changeSnakePosition();
    let result = isGameOver();
    if(result){
        return;
    }
    checkRockCollision();
    checkAppleCollision();
    clearScreen();
    
    drawScore();
    drawApple();
    drawPear();
    drawSnake();
    
    if(anyKeyEnabled == true){
        anyKey();
    }
    
    if(score > 2){
        speed = 11;
    }

    if (score > 5){
        speed = 15;
    }

    if(keyDown == true){
        anyKey = false;
    }

    setTimeout(drawGame, 1000 / speed);
}

function isGameOver(){
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.shadowBlur = 10;
    
    

    ctx.fillStyle = 'white';
    ctx.font = '50px Verdana';
    
    gradient.addColorStop('0.5', 'magenta');
    gradient.addColorStop('0.6', 'cyan');
    gradient.addColorStop('0.3', 'blue');
    ctx.fillStyle = gradient;
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 100);

    ctx.font = '200px Verdana';
    ctx.fillStyle = gradient;
    ctx.fillText(score, canvas.width / 2, canvas.height / 2 + 75);
    
    let hidden = document.getElementById('hidden');
    let gameOver = false;
    
    if(yVelocity === 0 && xVelocity === 0){
        
        return false;
    }

    if(headX < 0 ){
        
        gameOverSound.play();
        gameOver = true;
    }
     else if(headX === tileCount){
        gameOverSound.play();
        gameOver = true
    }
    else if(headY < 0){
        gameOverSound.play();
        gameOver = true
    }
    else if(headY === 20){
        gameOverSound.play();
        gameOver = true
    }

    for(let i = 0; i < snakeParts.length; i++){
        let part = snakeParts[i];
        if(part.x === headX && part.y === headY){
            gameOverSound.play();                       // dör om man rör i se sjölv
            gameOver = true;
            continue;
        }
        
    }
    
    if(gameOver == true){
        hidden.style.display = 'block';
    }

    return gameOver;
    
}

function drawSnake(){
    
    /*
    ctx.fillStyle = 'hsl(' + color + ', 100%, 50%)';
    color++*/

    gradient.addColorStop('0.6', 'cyan'); 
    gradient.addColorStop('0.9', 'magenta');
    gradient.addColorStop('0.6', 'cyan');
    
    ctx.fillStyle = gradient;
    ctx.fillStyle = '';
    for(let i = 0; i < snakeParts.length; i++){
        let part = snakeParts[i];
        
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize)
    }

    snakeParts.push(new SnakePart(headX, headY));
    while(snakeParts.length > tailLength){ // lägger en beta i sluuti åv array listo breivä hövo 
        snakeParts.shift(); // tar bort beta som e längst bort om i finns meijr än tailSize
    }

    ctx.fillStyle = 'orange';
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'cyan';
    ctx.shadowBlur = 10;
    ctx.shadowColor = "cyan";
    ctx.strokeRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
    
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
    
    
}

function drawScore(){
    gradient.addColorStop('0.5', 'magenta');
    gradient.addColorStop('0.6', 'cyan');
    gradient.addColorStop('0.3', 'blue');
    ctx.fillStyle = gradient;
    
    ctx.font = '200px Verdana';
    ctx.textAlign = "center";
    ctx.fillText(score, canvas.width / 2, canvas.height / 2 + 75)
}

function clearScreen(){
    ctx.fillStyle = 'black';                //background color
    ctx.fillRect(0,0,canvas.width,canvas.height)
    
}

function drawPear(){
    if(score >= 5){
    rngPear = Math.floor(Math.random() * 20);
    }
    if(rngPear > 15){
        ctx.fillStyle = 'green'
        ctx.fillRect(pearX * tileCount, pearY * tileCount, tileSize, tileSize)
        checkPearCollision();
    }
}

function drawApple(){
    ctx.fillStyle = 'red'
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize)
    
    drawRock();
}

function drawRock(){
    if(score >= 25){
        ctx.fillStyle = 'gray'
        ctx.fillRect(rockX * tileCount, rockY * tileCount, tileSize, tileSize)
    }
}

function checkRockCollision(){
    if(rockX === headX && rockY == headY && score >= 25){
        rockX = Math.floor(Math.random() * tileCount);
        rockY = Math.floor(Math.random() * 20);
        
        tailLength -= 2;
        score -= 5;
        eatSound.play();
    }
}

function checkAppleCollision(){
    if(appleX === headX && appleY == headY){
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * 20);
        
        
        tailLength++;
        score += 1;
        eatSound.play();
    }
    
    
}

function checkPearCollision(){
    if(pearX === headX && pearY == headY){
        pearX = Math.floor(Math.random() * tileCount);
        pearY = Math.floor(Math.random() * 20);
        
        tailLength += 4;
        score += 10;
        pearSound.play();
    }
}

function changeSnakePosition(){
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

document.addEventListener('keydown', keyDown);

function keyDown(event){
    if(event.keyCode == 38){
        
        if(yVelocity == 1){
            
            return
        }
        anyKeyEnabled = false;
        yVelocity = -1 //up
        xVelocity = 0;
    }

    if(event.keyCode == 40){
        
        if(yVelocity == -1){
            
            return
        }
        anyKeyEnabled = false;
        yVelocity = 1 //down
        xVelocity = 0;
    }

    if(event.keyCode == 37){
        
        if(xVelocity == 1){
            
            return
        }
        anyKeyEnabled = false;
        yVelocity = 0 //left
        xVelocity = -1;
    }
    
    if(event.keyCode == 39){
        
        if(xVelocity == -1){
           
            
            return
        }
        anyKeyEnabled = false;
        yVelocity = 0 //right
        xVelocity = 1;
        
        
    }
}

drawGame();