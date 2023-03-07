const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
//getContext() method  return a canvas drawing context.
//drawing context can draw
const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;

//using array to store the snake
//every node stores the x,y coordinate

let snake = [];
function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };
  snake[1] = {
    x: 60,
    y: 0,
  };
  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}

//fruit
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }
  pickALocation() {
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlapping(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x == new_x && snake[i].y == new_y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlapping(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

//default settings
let d = "Right";
createSnake();
let myFruit = new Fruit();
let highestScore;
let score = 0;
let myScore = document.getElementById("myScore");
myScore.innerHTML = "Score : " + score;
loadHighestScore();
let myHighestScore = document.getElementById("myScore2");
myHighestScore.innerHTML = "Highest Score :" + highestScore;

//control the snake direction
window.addEventListener("keydown", changeDirection);
function changeDirection(e) {
  if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  } else if (e.key == "ArrowRight" && d != "Left") {
    d = "Right";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  } else if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  }

  //before the next pin was drawn , any keydown event were forbidden , to prevent the snake suicide

  window.removeEventListener("keydown", changeDirection);
}

function draw() {
  // confirm whether the snake has bite itself
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("Game over");
      return;
    }
  }

  //use black canvas to overlap, in oreder to prevent the snake adding nodes
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.height, canvas.width);
  myFruit.drawFruit();
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "orange";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white";

    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    //x,y,width,height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  //to decide where the snake will be in the next pin
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Right") {
    snakeX += unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Down") {
    snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  //check whether the snake eat the fruit or not
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    //renew a location for the fruit , the new fruit will be draw in the next interval.
    myFruit.pickALocation();
    //update the score
    score++;
    setHighestScore(score);
    myScore.innerHTML = "Score : " + score;
    myHighestScore.innerHTML = "Highest Score :" + highestScore;
  } else {
    snake.pop();
  }

  snake.unshift(newHead);

  // after the snake was drawn , event listener was allowed
  window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 100);

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    highestScore = score;
    localStorage.setItem("highestScore", score);
  }
}
