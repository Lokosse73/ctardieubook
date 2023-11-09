const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const startButton = document.querySelector('#startButton');

let lifeUI = document.querySelector('#life');
let scoreUI = document.querySelector('#score');
let score = 0;
let life = 3;

const fruits = [];
let fruitSpawnInterval = 1000;

let DammageAnimcount = 0;

let FruitsReady;
let OlderFruitsReady;
let gameover = false;
let Started = false;

window.onload = function () {
    if(window.self !== window.top){
        startGame();
    }
    resize();
}
window.addEventListener('resize', resize);
function resize() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const square = document.querySelector('.allGame');

    const scaleFactor = Math.min(screenWidth / square.offsetWidth, screenHeight / square.offsetHeight);
    square.style.transform = 'scale(' + scaleFactor + ') translate(-50%, -50%)';
}


ctx.beginPath();
const grd = ctx.createLinearGradient(0, 300, 0, 350);
grd.addColorStop(0, "#497233");
grd.addColorStop(1, "#395627");

ctx.fillStyle = grd;
ctx.fillRect(0, 0, 300, 400);

// Load images before starting the game
const tomatoImage = new Image();
tomatoImage.src = 'Tomato.png';
tomatoImage.onload = function () {
    ctx.drawImage(tomatoImage, 0, 350, 25, 25);
};
const carrotImage = new Image();
carrotImage.src = 'Carrot.png';
carrotImage.onload = function () {
    ctx.drawImage(carrotImage, 275, 350, 25, 25);
};
const slugImage = new Image();
slugImage.src = 'Slug.png';
slugImage.onload = function () {
    ctx.drawImage(slugImage, 137.5, 380, 25, 25);
};


startButton.addEventListener('click', function () {
    startGame();
});

function startGame() {
    if (Started === false){
        Started = true;
        gameover = true;

        UpdateCanvas(false);

        setTimeout(function () {

            fruitSpawnInterval = 1000;
            life = 3;
            score = 0;
            lifeUI.innerHTML = life;
            scoreUI.innerHTML = score;
            FruitsReady = null;
            OlderFruitsReady = null;

            for (let i = 0; i < fruits.length; i++) {
                fruits.splice(i, 1);
                i--; // Decrement the index to compensate for the removed element
            }
            Started = false;
            gameover = false;
            createFruit();
            animateFruits();
        }, 1000);
    }
}
class Fruit {
    constructor(x, y, dy, texture, sorted) {
        this.x = x;
        this.y = y;
        this.dy = dy;
        this.texture = texture;
        this.sorted = sorted;
    }
    draw() {
        ctx.beginPath();
        const image = this.texture;
        ctx.drawImage(image, this.x, this.y, 50, 50);

        if (this.y >= 250 && !this.sorted) {
            FruitsReady = this;
        }
    }
    sort() {
        this.sorted = true;
    }
}

function createFruit() {
    let newFruit = new Fruit(Math.floor(Math.random() * 3) * 50 + 75, -60, 2 + 0.05 + score / 100, getRandomFruit(), false);
    fruits.push(newFruit);
    if (gameover === false){
        setTimeout(function () { createFruit(); }, fruitSpawnInterval);
    }
}

function getRandomFruit() {
    if (Math.random() < 0.1) {
        return slugImage;
    } else {
        if (Math.random() < 0.5) {
            return tomatoImage;
        } else {
            return carrotImage;
        }
    }
}
function UpdateCanvas(Dammaged){


    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const grd = ctx.createLinearGradient(0, 300, 0, 350);
    grd.addColorStop(0, "#497233");
    if (Dammaged === true){
        DammageAnimcount = 50;
        grd.addColorStop(1, "#503737");
    }else if (DammageAnimcount === 0){
        grd.addColorStop(1, "#395627");
    }else{
        grd.addColorStop(1, "#503737");
        DammageAnimcount--;
    }

    if (gameover){
        DammageAnimcount = 0;
    }

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 300, 400);

// Load images before starting the game
    ctx.drawImage(tomatoImage, 0, 350, 25, 25);
    ctx.drawImage(carrotImage, 275, 350, 25, 25);
    ctx.drawImage(slugImage, 137.5, 380, 25, 25);
}
// Function to animate the falling fruits
function animateFruits() {
    if (gameover){
        return;
    }
    // Clear the canvas before redrawing the fruits at their new positions
    UpdateCanvas(false)
    // Draw and make each fruit fall
    for (let i = 0; i < fruits.length; i++) {
        if(fruits[i].sorted === false){
            fruits[i].y += fruits[i].dy;
        }else{
            if(fruits[i].texture === slugImage){
                fruits[i].y += fruits[i].dy;
            }else if(fruits[i].texture === carrotImage){
                fruits[i].x += fruits[i].dy * 2;
            }else if(fruits[i].texture === tomatoImage){
                fruits[i].x -= fruits[i].dy * 2;
            }
        }
        fruits[i].draw();

        // Remove the fruit if it goes out of the canvas to optimize performance
        if (fruits[i].y - 50 > canvas.height) {
            if(fruits[i].sorted === false && fruits[i].texture !== slugImage && window.self === window.top){
                Dammage();
            }
            fruits.splice(i, 1);

            i--; // Decrement the index to compensate for the removed element
        }else if (fruits[i].x - 50 > canvas.width || fruits[i].x + 50 < 0){
            fruits.splice(i, 1);

            i--; // Decrement the index to compensate for the removed element
        }

    }

    requestAnimationFrame(animateFruits);

}


{
// Drapeau pour indiquer si le script doit s'exécuter ou non
    let shouldExecute = true;

// Fonction qui sera appelée lorsque la touche spécifique est enfoncée
    function handleKeyDown(event) {
        if (shouldExecute === true) {
            if (event.key === 'ArrowLeft' && OlderFruitsReady !== FruitsReady) {
                if (FruitsReady.texture === tomatoImage) {
                    OlderFruitsReady = FruitsReady;
                    shouldExecute = false;
                    OlderFruitsReady.sort();
                    AddScore();
                } else {
                    OlderFruitsReady = FruitsReady;
                    shouldExecute = false;
                    OlderFruitsReady.sort();
                    Dammage();
                }
            }

            if (event.key === 'ArrowRight' && OlderFruitsReady !== FruitsReady) {
                if (FruitsReady.texture === carrotImage) {
                    OlderFruitsReady = FruitsReady;
                    shouldExecute = false;
                    OlderFruitsReady.sort();
                    AddScore();
                } else {
                    OlderFruitsReady = FruitsReady;
                    shouldExecute = false;
                    OlderFruitsReady.sort();
                    Dammage();
                }
            }


        }
    }


// Fonction qui sera appelée lorsque la touche spécifique est relâchée
    function handleKeyUp(event) {

        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            // Empêchez l'exécution du script
            shouldExecute = true;
        }
    }


// Ajoutez des écouteurs d'événement aux touches
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

} // Clavier


{
    let startX = 0; // Position de départ du toucher

    function handleTouchStart(event) {
        startX = event.touches[0].clientX; // Enregistre la position de départ du toucher
    }
    function handleTouchEnd(event) {
        const endX = event.changedTouches[0].clientX; // Récupère la position finale du toucher
        const deltaX = endX - startX; // Calcule la différence de position

        if (deltaX < 0 && OlderFruitsReady !== FruitsReady) {
            // Glissement vers la gauche
            if (FruitsReady.texture === tomatoImage) {
                OlderFruitsReady = FruitsReady;
                OlderFruitsReady.sort();

                AddScore();
            } else {
                OlderFruitsReady = FruitsReady;
                OlderFruitsReady.sort();
                Dammage();
            }
        }

        if (deltaX > 0 && OlderFruitsReady !== FruitsReady) {
            // Glissement vers la droite
            if (FruitsReady.texture === carrotImage) {
                OlderFruitsReady = FruitsReady;
                OlderFruitsReady.sort();

                AddScore();
            } else {
                OlderFruitsReady = FruitsReady;
                OlderFruitsReady.sort();
                Dammage();
            }
        }
    }

// Ajouter les écouteurs d'événements tactiles aux éléments appropriés
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
} // Tactile

function Dammage() {
    life--;
    lifeUI.innerHTML = life;

    UpdateCanvas(true);

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 300, 400);

    if (life === 0){
        GameOver();
    }
}

function AddScore() {
    scoreUI.innerHTML = ++score;
    fruitSpawnInterval = fruitSpawnInterval - 3;
}

function GameOver() {

    gameover = true;
    FruitsReady = null;
    OlderFruitsReady = null;
    for (let i = 0; i < fruits.length; i++) {
        fruits.splice(i, 1);
        i--; // Decrement the index to compensate for the removed element
    }
    UpdateCanvas(false);
    drawGameOverText();

}
function drawGameOverText() {
    ctx.beginPath();
    ctx.textAlign = "center";
    ctx.font = "50px Arial";
    ctx.fillStyle = "#503737";
    ctx.fillText("Game Over", 150, 120);

    ctx.textAlign = "center";
    ctx.font = "20px Arial";
    ctx.fillStyle = "#503737";
    ctx.fillText("Score : " + score, 150, 150);

}