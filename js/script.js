// useful to have them as global variables
var canvas, ctx, w, h;
var mousePos;

// an empty array!
var balls = [];
var initialNumberOfBalls;
var globalSpeedMultiplier = 0.5;
var colorToEat = 'red';
var wrongBallsEaten = goodBallsEaten = 0;
var numberOfGoodBalls;
let level = 1;
let nbVies = 3;
let score = 0;
let gameState = 'PLAYING';
let canvasSound;
let ballEatenSound;

alert("WARNING ! This game is spooky, are you sure to continue?")


var player = {
    x: 10,
    y: 10,
    width: 30,
    height: 30,
};


function drawPlayer(r) {
    ctx.save();

    var playerImg = new Image();
    playerImg.src = './img/skeleton.png';

    ctx.translate(r.x - r.width, r.y - r.height);

    // ctx.fillStyle = r.color;
    // ctx.fillRect(0, 0, r.width, r.height);
    ctx.drawImage(playerImg, 0, 0, 50, 70);
    ctx.restore();


}


window.onload = function init() {
     // Start playing the background music as soon as the page has loaded
     playBackgroundMusic();
    // called AFTER the page has been loaded
    canvas = document.querySelector("#myCanvas");
   
    // often useful
    w = canvas.width;
    h = canvas.height;
    
    // important, we will draw with this object
    ctx = canvas.getContext('2d');

    // start game with 10 balls, balls to eat = red balls
    startGame(10);

    // add a mousemove event listener to the canvas
    canvas.addEventListener('mousemove', mouseMoved);
    window.addEventListener('keydown', traiteToucheEnfoncee);

    // ready to go !
    mainLoop();
    canvasSound = new Howl({
        urls: ['./fx/music.mp3'],
        onload: function () {
          // start background music
            mainLoop();
        }
    });
    canvasSound.play()
 ballEatenSound = new Howl({
                urls: ['./fx/fx1.mp3'],
                onload: function () {
                  // start ghost sound
                    mainLoop();
                }
            });
            
  
};
function playBackgroundMusic() {
   let audioPlayer = document.querySelector("#audioPlayer");
   audioPlayer.play();
}

function pausebackgroundMusic() {
   let audioPlayer = document.querySelector("#audioPlayer");
   audioPlayer.pause();  
}
function traiteToucheEnfoncee(evt) {
    console.log(evt.key);
    if (evt.key === ' ') {
        if (gameState === 'Game Over') {
            gameState = 'PLAYING';
            
            level = 1;
            score = 0;
            nbVies = 3;
            startGame(level);
        }
    }
}

function startGame(level) {
    let nb = level + 1;

    do {
        balls = createBalls(nb);
        initialNumberOfBalls = nb;
        numberOfGoodBalls = countNumberOfGoodBalls(balls, colorToEat);
    } while (numberOfGoodBalls === 0);

    wrongBallsEaten = goodBallsEaten = 0;
}

function countNumberOfGoodBalls(balls, colorToEat) {
    var nb = 0;

    balls.forEach(function (b) {
        if (b.color === colorToEat)
            nb++;
    });

    return nb;
}
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }
function changeNbBalls(nb) {
    startGame(nb);
}

function changeColorToEat(color) {
    colorToEat = color;
}


function changeBallSpeed(coef) {
    globalSpeedMultiplier = coef;
}

function mouseMoved(evt) {
    mousePos = getMousePos(canvas, evt);
}

function getMousePos(canvas, evt) {
    // necessary work in the canvas coordinate system
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function movePlayerWithMouse() {
    if (mousePos !== undefined) {
        player.x = mousePos.x;
        player.y = mousePos.y;
    }
}

function mainLoop() {
    // 1 - clear the canvas
    ctx.clearRect(0, 0, w, h);

    if (gameState === 'PLAYING') {
        // draw the ball and the player
        drawPlayer(player);
        drawAllBalls(balls);
        drawInfosTextuelles(balls);

        // animate the ball that is bouncing all over the walls
        moveAllBalls(balls);
        movePlayerWithMouse();
    } else if(gameState === 'Game Over') {
        ctx.font = "100px Creepy";
        ctx.fillText("Game Over!" , 200, 350+Math.random()*5);
        ctx.font = "50px Creepy";
        ctx.fillText(`Final score: ${score}`, 250+Math.random()*5, 200);
        ctx.fillText("Press <SPACE> to start again" , 150, 100+Math.random()*5);
ctx.fillStyle = "red"
    }    
    // ask the browser to call mainloop in 1/60 of  for a new animation frame
    requestAnimationFrame(mainLoop);
}

// Collisions between rectangle and circle
function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
    var testX = cx;
    var testY = cy;
    if (testX < x0) testX = x0;
    if (testX > (x0 + w0)) testX = (x0 + w0);
    if (testY < y0) testY = y0;
    if (testY > (y0 + h0)) testY = (y0 + h0);
    return (((cx - testX) * (cx - testX) + (cy - testY) * (cy - testY)) < r * r);
}

function createBalls(n) {
    // empty array
    var ballArray = [];

    // create n balls
    for (var i = 0; i < n; i++) {
        var b = {
            x: Math.round(Math.random() * h),
            y: Math.round(Math.random() * w),
            radius: 5 + 5 * Math.random() , // between 5 and 35
            speedX: -5 + 10 * Math.random(), // between -5 and + 5
            speedY: -5 + 10 * Math.random(), // between -5 and + 5
            color: getARandomColor(),
        };
        // add ball b to the array

        ballArray.push(b);
    }
    // returns the array full of randomly created balls
    return ballArray;
}

function getARandomColor() {
    var colors = ['red', 'blue', 'cyan', 'purple', 'pink', 'green', 'yellow'];
    // a value between 0 and color.length-1
    // Math.round = rounded value
    // Math.random() a value between 0 and 1
    var colorIndex = Math.round((colors.length - 1) * Math.random());
    var c = colors[colorIndex];

    // return the random color
    return c;
}

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
function drawInfosTextuelles(balls) {
    ctx.save();
    ctx.font = "20px Creepy";
    ctx.fillStyle = "rgb(255, 0, 255)"
    if (nbVies <= 0) {
        // on a perdu
        gameState = 'Game Over';
        
    } else if (goodBallsEaten === numberOfGoodBalls) {
        // On a gagné, on a mangé toutes les bonnes balles
       

        // on change de niveau + faux chargement
        sleep(100)
            ctx.font = "50px Creepy";
            ctx.fillText("LOADING...",300, 350);
        passerAuNiveauSuivant()
    } else {
        
        // On est en train de jouer....
        ctx.fillText("Balls still alive: " + balls.length, 625, 30);
        ctx.fillText("Good Balls eaten: " + goodBallsEaten, 625, 50);
        ctx.fillText("Wrong Balls eaten: " + wrongBallsEaten, 625, 70);
        ctx.fillText("Level: " + level, 625, 90);
        ctx.fillText("Vies: " + nbVies, 625, 110);
        ctx.fillText("Score: " + score, 625, 130);
    }
    ctx.restore();
}

function passerAuNiveauSuivant() {
    level++;
    globalSpeedMultiplier += 0;
    startGame(level);
}

function drawAllBalls(ballArray) {
    ballArray.forEach(function (b) {
        drawFilledCircle(b);
    });
}

function moveAllBalls(ballArray) {
    // iterate on all balls in array
    balls.forEach(function (b, index) {
        // b is the current ball in the array
        if (index === 0) {
            b.radius += 0.1;
            if (b.radius > 40) {
                b.radius = 5;
            }
            b.x += (b.speedX * globalSpeedMultiplier/2);
            b.y += (b.speedY * globalSpeedMultiplier/2);
        } else {
            b.x += (b.speedX * globalSpeedMultiplier/2);
            b.y += (b.speedY * globalSpeedMultiplier/2);
        }

        testCollisionBallWithWalls(b);

        testCollisionWithPlayer(b, index);
    });
}

function testCollisionWithPlayer(b, index) {
    if (circRectsOverlap(player.x, player.y,
        player.width, player.height,
        b.x, b.y, b.radius)) {
        // we remove the element located at index
        // from the balls array
        // splice: first parameter = starting index
        //         second parameter = number of elements to remove
         // PLAY A PLOP SOUND!
    ballEatenSound.play();
        if (b.color === colorToEat) {
            // Yes, we remove it and increment the score
            goodBallsEaten += 1;
            score += 10;
        } else {
            wrongBallsEaten += 1;
            nbVies = nbVies - 1;
        }

        balls.splice(index, 1);

    }
}

function testCollisionBallWithWalls(b) {
    // COLLISION WITH VERTICAL WALLS ?
    if ((b.x + b.radius) > w) {
        // the ball hit the right wall
        // change horizontal direction
        b.speedX = -b.speedX;

        // put the ball at the collision point
        b.x = w - b.radius;
    } else if ((b.x - b.radius) < 0) {
        // the ball hit the left wall
        // change horizontal direction
        b.speedX = -b.speedX;

        // put the ball at the collision point
        b.x = b.radius;
    }

    // COLLISIONS WTH HORIZONTAL WALLS ?
    // Not in the else as the ball can touch both
    // vertical and horizontal walls in corners
    if ((b.y + b.radius) > h) {
        // the ball hit the right wall
        // change horizontal direction
        b.speedY = -b.speedY;

        // put the ball at the collision point
        b.y = h - b.radius;
    } else if ((b.y - b.radius) < 0) {
        // the ball hit the left wall
        // change horizontal direction
        b.speedY = -b.speedY;

        // put the ball at the collision point
        b.Y = b.radius;
    }
}

function drawFilledCircle(c) {
    // GOOD practice: save the context, use 2D trasnformations
    ctx.save();

    // translate the coordinate system, draw relative to it
    ctx.translate(c.x, c.y);

    ctx.fillStyle = c.color;
    // (0, 0) is the top left corner of the monster.
    ctx.beginPath();
    ctx.arc(0, 0, c.radius, 0, 2 * Math.PI);
    ctx.fill();

    // GOOD practice: restore the context
    ctx.restore();
}
