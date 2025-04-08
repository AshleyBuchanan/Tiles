const characterCanvas = document.querySelector('#characterCanvas');
const mapCanvas = document.querySelector('#mapCanvas');
const ctx = characterCanvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
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
        this.direction = this.west;
        this.frameSpeed = 66.67 * 2;
        this.currentFrame = 0;
        this.lastFrameTime = 0;
        this.isMoving = false;
        this.name = name;
        this.x = characterCanvas.width / 2 - this.frameWidth / 2;
        this.y = characterCanvas.height / 2 - this.frameHeight / 2;
        this.spriteSheet = new Image();
        this.spriteSheet.src = src;
        this.spriteSheet.onload = () => {
            requestAnimationFrame(this.animate.bind(this));
        };

        this.characterFrame = new Map();
        //South
        this.characterFrame.set(0, [0, 0, false]);
        this.characterFrame.set(1, [1, 0, false]);
        this.characterFrame.set(2, [2, 0, false]);
        //North
        this.characterFrame.set(3, [3, 0, false]);
        this.characterFrame.set(4, [4, 0, false]);
        this.characterFrame.set(5, [5, 0, false]);
        //West
        this.characterFrame.set(6, [6, 0, false]);
        this.characterFrame.set(7, [7, 0, false]);
        this.characterFrame.set(8, [0, 1, false]);
        //East
        this.characterFrame.set(9, [6, 0, true]);
        this.characterFrame.set(10, [7, 0, true]);
        this.characterFrame.set(11, [0, 1, true]);
    }

    animate(timestamp) {
        if (this.isMoving) {
            if (timestamp - this.lastFrameTime >= this.frameSpeed) {
                this.currentFrame = (this.currentFrame + 1) % 3;
                this.lastFrameTime = timestamp;
            }
        } else {
            this.currentFrame = 1;
        }

        ctx.clearRect(0, 0, characterCanvas.width, characterCanvas.height);
        ctx.save();

        let thisFrame = this.characterFrame.get(this.currentFrame + this.direction);

        if (!thisFrame[2]) {
            ctx.scale(1, 1);
            ctx.translate(0, 0);
        } else {
            ctx.scale(-1, 1);
            ctx.translate(-characterCanvas.width - this.frameWidth, 0);
        }

        ctx.drawImage(this.spriteSheet,
            thisFrame[0] * this.frameWidth, thisFrame[1] * this.frameHeight,
            this.frameWidth, this.frameHeight,
            this.x, this.y,
            this.frameWidth * 2, this.frameHeight * 2);

        ctx.restore();

        requestAnimationFrame(this.animate.bind(this));
    }
}

class Control {
    constructor() {
        this.list = new Set();
        this.selected = null;
    }
    addTo(character) {
        this.list.add(character);
    }
    selectCharacter(character) {
        this.selected = character;
    }
    nextCharacter() {
        const arr = [...this.list];
        let index = arr.indexOf(this.selected);
        if (index + 1 === arr.length) {
            index = 0;
        } else {
            index++;
        }
        this.selected = arr[index];
    }
    direction(direction) {
        this.selected.direction = direction;
    }
    isMoving(isMoving) {
        this.selected.isMoving = isMoving;
    }
}

const control = new Control();

const cyan = new Character('Cyan Garamonde', 'SNES - Final Fantasy 6 T-Edition Hack - Cyan Garamonde.png');
control.addTo(cyan);
const celes = new Character('Celes Chere', '/SNES - Final Fantasy 6 T-Edition Hack - Celes Chere.png');
control.addTo(celes);
control.selectCharacter(celes);

window.addEventListener('keydown', (k) => {
    console.log(k.key);
    if (k.key == 'ArrowDown') {
        control.direction(celes.south);
        control.isMoving(true);
    }
    if (k.key == 'ArrowUp') {
        control.direction(celes.north);
        control.isMoving(true);
    }
    if (k.key == 'ArrowRight') {
        control.direction(celes.east);
        control.isMoving(true);
    }
    if (k.key == 'ArrowLeft') {
        control.direction(celes.west);
        control.isMoving(true);
    }
});

window.addEventListener('keyup', () => {
    control.isMoving(false);
});

window.addEventListener('keypress', (k) => {
    console.log(k.key);
    if (k.key === '+') control.nextCharacter();
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