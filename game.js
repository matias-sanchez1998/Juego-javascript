const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const buttonResetGame = document.querySelector('#reset');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
  x: undefined,
  y: undefined,
};
const giftPosition = {
  x: undefined,
  y: undefined,
};
let collisionPosition = {
  x: undefined,
  y: undefined,
};


let enemyPositions = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);


function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.7;
  } else {
    canvasSize = window.innerHeight * 0.7;
  }

  canvasSize = Number(canvasSize.toFixed(0));

  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);

  elementsSize = canvasSize / 10.5;

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function startGame() {

  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';

  const map = maps[level];
  if (lives < 0) {
    gameLose();
    return
  }
  if (!map) {
    gameWin();
    return;
  }

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord();
  }


  const mapRows = map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));


  showLives();

  enemyPositions = [];
  game.clearRect(0, 0, canvasSize, canvasSize);

  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = (elementsSize * (colI + 1) + 20);
      const posY = (elementsSize * (rowI + 1) + 11);

      if (col == 'O') {
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
        }
      } else if (col == 'I') {
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if (col == 'X') {
        enemyPositions.push({
          x: posX,
          y: posY,
        });

      }

      game.fillText(emoji, posX, posY);
    });
  });
  buttonResetGame.addEventListener('click', () => location.reload());

  movePlayer();
}

function movePlayer() {
  const giftCollisionX = playerPosition.x.toFixed(0) == giftPosition.x.toFixed(0);
  const giftCollisionY = playerPosition.y.toFixed(0) == giftPosition.y.toFixed(0);
  const giftCollision = giftCollisionX && giftCollisionY;
  if (giftCollision) {
    levelWin();
  }

  const enemyCollision = enemyPositions.find(enemy => {
    const enemyCollisionX = enemy.x.toFixed(0) == playerPosition.x.toFixed(0);
    const enemyCollisionY = enemy.y.toFixed(0) == playerPosition.y.toFixed(0);
    return enemyCollisionX && enemyCollisionY;
  });
  if (enemyCollision) {

    collisionPosition = enemyCollision
    levelFail();
    game.fillText(emojis['COLLISION'], collisionPosition.x-10, collisionPosition.y);


  }

  game.fillText(emojis['PLAYER'], playerPosition.x , playerPosition.y);
}

function levelWin() {
  level++;
  
  startGame();
}

function levelFail() {


  lives--;
  playerPosition.x = undefined;
  playerPosition.y = undefined;


  startGame()
}

function gameLose() {
  game.clearRect(0, 0, canvasSize, canvasSize)
  animationWinorLose('GAME_OVER', lose);
  console.log('lose');
  clearInterval(timeInterval);

}

function gameWin() {
  console.log('¡Terminaste el juego!');
  clearInterval(timeInterval);
  game.clearRect(0, 0, canvasSize, canvasSize)

  const recordTime = localStorage.getItem('record_time');
  const playerTime = Date.now() - timeStart;

  if (recordTime) {
    if (recordTime >= playerTime) {
      localStorage.setItem('record_time', playerTime);
      animationWinorLose('WIN', win)
    } else {
      animationWinorLose('WIN', win)
    }
  } else {
    localStorage.setItem('record_time', playerTime);
    animationWinorLose('WIN', win)
  }

}

function animationWinorLose(emojiString, array) {


  const map = array[0];
  const mapRows = map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));



  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[emojiString];
      const posX = (elementsSize * (colI + 1) + 20);
      const posY = (elementsSize * (rowI + 1) + 11);

      if (col == 'X') {
        enemyPositions.push({
          x: posX,
          y: posY,
        });
        game.fillText(emoji, posX, posY);
      }


    });
  });
}



function showLives() {

  let text = []

  for (let i = 0; i < lives; i++) {
    text.push('💙')
  }
  spanLives.innerHTML = text.join(' ')


}




function showTime() {
  spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
  spanRecord.innerHTML = localStorage.getItem('record_time');
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
  if (event.key == 'ArrowUp') moveUp();
  else if (event.key == 'ArrowLeft') moveLeft();
  else if (event.key == 'ArrowRight') moveRight();
  else if (event.key == 'ArrowDown') moveDown();
}
function moveUp() {

  if ((playerPosition.y - elementsSize + 12) < elementsSize) {
  } else {
    playerPosition.y -= elementsSize;
    startGame();
  }
}
function moveLeft() {

  if ((playerPosition.x - elementsSize) < elementsSize) {
  } else {
    playerPosition.x -= elementsSize;
    startGame();
  }
}
function moveRight() {
  if ((playerPosition.x + elementsSize - 10) >= canvasSize) {
  } else {
    playerPosition.x += elementsSize;
    startGame();
  }
}
function moveDown() {

  if ((playerPosition.y + elementsSize) > (canvasSize + 22)) {

  } else {
    playerPosition.y += elementsSize;
    startGame();
  }
}