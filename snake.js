var canvas = document.getElementById("gameCanvas")
var context = canvas.getContext("2d")

let snake = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150}, 
    {x: 110, y: 150}
];

let score = 0;
let bestScore = 0;

let dx = 10;
let dy = 0;

function main() {
    if (didGameEnd()) {
        clearTimeout(timeoutID);
        return;
    }
    var timeoutID = setTimeout(function onTick() {changingDirection = false; clearCanvas(); drawFood(); advanceSnake(); drawSnake(); main(); }, 150)
}

document.addEventListener("keydown", changeDirection)

function drawSnakePart(snakePart) {
    context.fillStyle = 'lightGreen';
    context.strokeStyle = 'darkGreen';
    context.fillRect(snakePart.x, snakePart.y, 10, 10);
    context.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function advanceSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    const didEatFood = snake[0].x == foodX && snake[0].y == foodY;
    if (didEatFood) {
        score++;
        document.getElementById('score').innerText = "SCORE: " + score;
        if (score > bestScore) {
            bestScore = score;
            document.getElementById('bestScore').innerText = "BEST SCORE: " + bestScore
        }
        createFood();
    }
    else {
        snake.pop();
    }
}

function clearCanvas() {
    context.fillStyle = "white";
    context.strokeStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeRect(0, 0, canvas.width, canvas.height);
}

function changeDirection(event) {
    if (changingDirection) {
        return;
    }
    changingDirection = true;

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38; 
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;  
    const goingUp = dy === -10;  
    const goingDown = dy === 10;  
    const goingRight = dx === 10;  
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }
    else if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }
    else if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    else if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
    foodX = randomTen(0, canvas.width - 10);
    foodY = randomTen(0, gameCanvas.height - 10);
    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x == foodX && part.y == foodY
        if (foodIsOnSnake) {
            createFood();
        }
    })
}

function drawFood() {
    context.fillStyle = 'red';
    context.strokeStyle = 'darkred';
    context.fillRect(foodX, foodY, 10, 10);
    context.strokeRect(foodX, foodY, 10, 10);
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        const didCollide = snake[i].x === snake[0].x && snake[i].y == snake[0].y;
        if (didCollide) {
            return true;
        }
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.width - 10;  
    const hitTopWall = snake[0].y < 0;  
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function replay() {
    snake = [
        {x: 150, y: 150},
        {x: 140, y: 150},
        {x: 130, y: 150},
        {x: 120, y: 150}, 
        {x: 110, y: 150}
    ];
    dx = 10;
    dy = 0;

    score = 0;
    document.getElementById('score').innerText = "SCORE: " + score;

    clearTimeout(timeoutID);
    main();
}

createFood();
main();