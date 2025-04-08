class Character {
    constructor(name, src) {
        this.frameWidth = 16;
        this.frameHeight = 24;
        this.frameCount = 3;
        this.south = 0;
        this.north = 3;
        this.west = 6;
        this.east = 9;
        this.flip = false;
        this.direction = west;
        this.frameSpeed = 66.67 * 2;
        this.currentFrame = 0;
        this.lastFrameTime = 0;
        this.isMoving = false;
        this.name = name;
        this.spriteSheet = new Image();
        this.spriteSheet.src = src;
        this.spriteSheet.onload = () => {
            requestAnimationFrame(animate);
        };
    }

    animate(timestamp) {
        if (isMoving === true) {
            if (timestamp - lastFrameTime >= frameSpeed) {
                currentFrame = (currentFrame + 1) % 3;
                lastFrameTime = timestamp;
            }
        } else {
            currentFrame = 1;
        }

        ctx.clearRect(0, 0, characterCanvas.width, characterCanvas.height);
        ctx.save();

        let thisFrame = characterFrame.get(currentFrame + direction);

        if (!thisFrame[2]) {
            ctx.scale(1, 1);
            ctx.translate(0, 0);
        } else {
            ctx.scale(-1, 1);
            ctx.translate(-characterCanvas.width - frameWidth, 0);
        }

        ctx.drawImage(spriteSheet,
            thisFrame[0] * frameWidth, thisFrame[1] * frameHeight,
            frameWidth, frameHeight,
            x, y,
            frameWidth * 2, frameHeight * 2);

        ctx.restore();

        requestAnimationFrame(animate);
    }
}

const characterCanvas = document.querySelector('#characterCanvas');
const mapCanvas = document.querySelector('#mapCanvas');

let x = characterCanvas.width / 2 - frameWidth / 2;
let y = characterCanvas.height / 2 - frameHeight / 2;
const ctx = characterCanvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const celes = new Character('Celes Chere', '/SNES - Final Fantasy 6 T-Edition Hack - Celes Chere.png');
// const spriteSheet = new Image();
// spriteSheet.src = '/SNES - Final Fantasy 6 T-Edition Hack - Celes Chere.png';

const characterFrame = new Map();
//South
characterFrame.set(0, [0, 0, false]);
characterFrame.set(1, [1, 0, false]);
characterFrame.set(2, [2, 0, false]);
//North
characterFrame.set(3, [3, 0, false]);
characterFrame.set(4, [4, 0, false]);
characterFrame.set(5, [5, 0, false]);
//West
characterFrame.set(6, [6, 0, false]);
characterFrame.set(7, [7, 0, false]);
characterFrame.set(8, [0, 1, false]);
//East
characterFrame.set(9, [6, 0, true]);
characterFrame.set(10, [7, 0, true]);
characterFrame.set(11, [0, 1, true]);

// function animate(timestamp) {
//     if (isMoving === true) {
//         if (timestamp - lastFrameTime >= frameSpeed) {
//             currentFrame = (currentFrame + 1) % 3;
//             lastFrameTime = timestamp;
//         }
//     } else {
//         currentFrame = 1;
//     }

//     ctx.clearRect(0, 0, characterCanvas.width, characterCanvas.height);
//     ctx.save();

//     let thisFrame = characterFrame.get(currentFrame + direction);

//     if (!thisFrame[2]) {
//         ctx.scale(1, 1);
//         ctx.translate(0, 0);
//     } else {
//         ctx.scale(-1, 1);
//         ctx.translate(-characterCanvas.width - frameWidth, 0);
//     }

//     ctx.drawImage(spriteSheet,
//         thisFrame[0] * frameWidth, thisFrame[1] * frameHeight,
//         frameWidth, frameHeight,
//         x, y,
//         frameWidth * 2, frameHeight * 2);

//     ctx.restore();

//     requestAnimationFrame(animate);
// }







// spriteSheet.onload = () => {
//     requestAnimationFrame(animate);
// };

window.addEventListener('keydown', (k) => {
    console.log(k.key);
    if (k.key == 'ArrowDown') {
        direction = south;
        isMoving = true;
    }
    if (k.key == 'ArrowUp') {
        direction = north;
        isMoving = true;
    }
    if (k.key == 'ArrowRight') {
        direction = east;
        isMoving = true;
    }
    if (k.key == 'ArrowLeft') {
        direction = west;
        isMoving = true;
    }
});

window.addEventListener('keyup', () => {
    isMoving = false;
});

window.addEventListener('load', () => {
    const container = document.querySelector('#container');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const marginWidth = (windowWidth - 1000) / 2;
    container.style.left = `${marginWidth}px`;

    const marginHeight = (windowHeight - 500) / 2;
    container.style.top = `${marginHeight}px`;

});

window.addEventListener('resize', () => {
    const container = document.querySelector('#container');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const marginWidth = (windowWidth - 1000) / 2;
    container.style.left = `${marginWidth}px`;

    const marginHeight = (windowHeight - 500) / 2;
    container.style.top = `${marginHeight}px`;

});