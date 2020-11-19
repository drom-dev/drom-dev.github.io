// select canvas
const canvas = document.getElementById("pong");

// getContext of canvas - import properties needed to paint canvas
const ctx = canvas.getContext('2d');

//need 2 players
// create the user paddle
const user = {
    x: 0, //left
    y: canvas.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: "blue",
    score: 0
}

// create the com paddle
const com = {
    x: canvas.width-10, //right
    y: canvas.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: "red",
    score: 0
}

// create ball
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "white"
    
}

// draw rect function <- for paddles
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// create the net
const net = {
    x: (canvas.width - 2) / 2,
    y: 0,
    height: 10,
    width: 2,
    color: "white",
}

// draw net 
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// draw circle
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

// mouse event listener <- paddle control
canvas.addEventListener("mousemove", getMousePos); //useless if you cant find Pos

// event listener to pause game


function getMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2;
}


// field reset ball on score
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

// draw text
function drawText(text, x, y){
    ctx.fillStyle = "#FFF";
    ctx.font = "45px fantasy";
    ctx.fillText(text, x, y);
}


// collision detection
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}


// update function defined
function update() {
    
    // score change
    if (ball.x - ball.radius < 0){
        
        com.score++;
        resetBall();
        
        
    }else if( ball.x + ball.radius > canvas.width) {
        
        user.score++
        resetBall();
        
    }

    // the ball must move or its not fun UwU
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // super simple ai to later become unbeatable raid-boss
    com.y += ((ball.y - (com.y + com.height/2))) * 0.1; // note: value of 1 at the end is unbeatable

    //ball collision for top and bottom walls 
    //need to inverse the y velocity value for reflection of angle
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        
        ball.velocityY = -ball.velocityY;
        wall.play();
    }

    //paddle hit reg - user and com
    let player = (ball.x + ball.radius < canvas.width / 2) ? user : com;

    //paddle contact response - user and com
    if (collision(ball,player)){
        // hit sound
        

        //collision point
        let collidePoint = (ball.y - (player.y + player.height/2));

        //normalize values of collidePoint for values: -1, 0, 1
        // - player.height/2 < collidePoint < player.height/2
        collidePoint = collidePoint / (player.height/2);
        
        //ball needs to take -45, 0, 45 degree angles
        //Math.PI/4= 45 degrees
        let angleRad = (Math.PI / 4) * collidePoint;

        //change x and y velocity direction
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        //i am speed - speed addition

        ball.speed += 0.1;
    }
}


// render the game & game functions needed
function render(){
    
    //clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");

    //draw the net 
    drawNet();

    // draw score
    drawText(user.score, canvas.width/4, canvas.height/5,);
    drawText(com.score, 3*canvas.width/4, canvas.height/5,);

    // draw the user and com paddles
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    //draw the ball
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

// game init
function game() {
    update();
    render();
}

// pause function

// loop 
const framesPerSecond = 50;
let loop = setInterval(game, 1000 / framesPerSecond);


