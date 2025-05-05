const canvas = document.querySelector("canvas");
const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play")

const ctx = canvas.getContext("2d");

const size = 20;
let speed = 200;
const audioEat = new Audio("../assets/colect-song.mp3")
const audioLose = new Audio("../assets/loser-song.mp3")

const incrementScore = () => {
    score.innerHTML = parseInt(score.innerHTML) + 10

};

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)

}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - 20);
    return Math.round(number / 20) * 20; 

}

let snake = [
    {x: 280, y: 240},   
    {x: 300, y: 240},   
];

const food = {x: randomPosition(), y: randomPosition(), color: "red"}

let direction, lopId

const drawSnake = () => {
    const colors = ["#1E3A8A", "#3B82F6", "#06B6D4"];
    const eyeRadius = 2;

    snake.forEach((position, index) => {
        const isHead = index === snake.length - 1;

        const bodyColor = colors[index % colors.length];

        if (isHead) {
            ctx.beginPath();
            ctx.fillStyle = "white"; 
            ctx.roundRect(position.x, position.y, size, size, 6);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.arc(position.x + size * 0.25, position.y + size * 0.3, eyeRadius, 0, Math.PI * 2);
            ctx.arc(position.x + size * 0.75, position.y + size * 0.3, eyeRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.arc(position.x + size * 0.25, position.y + size * 0.3, 1, 0, Math.PI * 2);
            ctx.arc(position.x + size * 0.75, position.y + size * 0.3, 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        } else {
            ctx.beginPath();
            ctx.fillStyle = bodyColor;
            ctx.strokeStyle = "#222";
            ctx.lineWidth = 1;
            ctx.roundRect(position.x, position.y, size, size, 6);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
    });
};

const drawFood = () => {
    ctx.beginPath();
    ctx.fillStyle = food.color;
    ctx.shadowBlur = 40,
    ctx.shadowColor = food.color
    ctx.arc(food.x + size / 2, food.y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0

    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.fillRect(food.x + size / 2 - 2, food.y, 4, 6);
    ctx.closePath();
};

const drawGrid = () => {
    ctx.lineWidth = 1   
    ctx.strokeStyle = "#191919"

    for(let i = size; i < canvas.width; i += size) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, canvas.height)      
        ctx.stroke()
    }

    for(let i = size; i < canvas.width; i += size) {
        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(canvas.width, i)      
        ctx.stroke()
    }
}

const moveSnake = () => {
    const head = snake[snake.length -1]
   
    if(!direction){
        return 
    }

    if(direction == "right") {
        snake.push({x: head.x + size, y: head.y})

    };

    if(direction == "left") {
        snake.push({x: head.x - size, y: head.y})

    };

    if(direction == "up") {
        snake.push({x: head.x, y: head.y - size})

    };

    if(direction == "down") {
        snake.push({x: head.x, y: head.y + size})

    };

    snake.shift()
}

const checkEat = () => {
    const head = snake[snake.length - 1];

    if (head.x === food.x && head.y === food.y) {
        audioEat.play();
        snake.push(head);
        incrementScore();

        speed = Math.max(speed - 10, 30);

        food.x = randomPosition();
        food.y = randomPosition();
    }
};

const gameOver = () => {
    direction = undefined;
    canvas.style.filter = "blur(5px)";
    menu.style.display = "flex";
    finalScore.innerHTML = score.innerHTML;
    speed = 1000000000
};



const checkColision = () => {
    head = snake[snake.length - 1];
    const canvasLimit = canvas.width - 20;
    const wallColision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;
    const neckIndex = snake.length - 2;

    const selfColison = () => {
        return snake.find((position, index) => {
            return index < neckIndex && position.x === head.x && position.y === head.y;
        });
    };

    if (wallColision || selfColison()) {
        audioLose.play();
        gameOver()
    }
};

const gameLoop = () => {
    clearInterval(lopId)
    ctx.clearRect(0, 0, 600, 500)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkColision()

    
    lopId = setTimeout(() => {
        gameLoop()
    }, speed)
}
gameLoop()



document.addEventListener("keydown", ({key}) => {   
    if(key == "ArrowRight" && direction != "left"){
        direction = "right"
    }

    if(key == "ArrowLeft" && direction != "right"){
        direction = "left"
    }

    if(key == "ArrowUp" && direction != "down"){
        direction = "up"
    }

    if(key == "ArrowDown" && direction != "up"){
        direction = "down"
    }

    if(key == "Enter"){
        score.innerHTML = "00";
        menu.style.display = "none";
        canvas.style.filter = "none";
    
        snake = [
            {x: 280, y: 240},
            {x: 300, y: 240}
        ];
    
        speed = 200; 
        direction = undefined; 
        gameLoop(); 
        
    }

    if(key == " " || key == "Space"){
        score.innerHTML = "00";
        menu.style.display = "none";
        canvas.style.filter = "none";
    
        snake = [
            {x: 280, y: 240},
            {x: 300, y: 240}
        ];
    
        speed = 200; 
        direction = undefined; 
        gameLoop(); 
        
    }

})

buttonPlay.addEventListener("click", () => {
    score.innerHTML = "00";
    menu.style.display = "none";
    canvas.style.filter = "none";

    snake = [
        {x: 280, y: 240},
        {x: 300, y: 240}
    ];

    speed = 200; 
    direction = undefined; 
    gameLoop(); 
});

