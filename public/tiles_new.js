class Character {
    frameWidth = 16;
    frameHeight = 24;
    frameSpeed = 66.67;
    frameCount = 3;
    south = 0;
    north = 3;
    west = 6;
    east = 9;

    constructor(name, src) {
        this.name = name;
        this.spriteSheet = new Image();
        this.spriteSheet.src = src;
        this.characterFrame = new Map([
            //South
            [0, [0, 0, false]],
            [1, [1, 0, false]],
            [2, [2, 0, false]],
            //North
            [3, [3, 0, false]],
            [4, [4, 0, false]],
            [5, [5, 0, false]],
            //West
            [6, [6, 0, false]],
            [7, [7, 0, false]],
            [8, [0, 1, false]],
            //East
            [9, [6, 0, true]],
            [10, [7, 0, true]],
            [11, [0, 1, true]],
        ]);
        this.currentFrame = 1;
        this.lastFrameTime = 0;
        this.flip = false;
        this.isMoving = false;
    }

    updateFrame(timeStamp) {
        if (this.isMoving) {
            if (timeStamp - this.lastFrameTime >= this.frameSpeed) {
                this.currentFrame = (this.currentFrame + 1) % 3;
                this.lastFrameTime = timeStamp;
            }
        } else {
            this.currentFrame = 1;
        }
    }

    draw() {
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

function mainLoop(timeStamp) {
    ctx.clearRect(0, 0, characterCanvas.width, characterCanvas.height);

    for (let character of control.list) {
        character.updateFrame(timeStamp);
        character.draw();
    }
    requestAnimationFrame(mainLoop);
}

function startUp(ctrl) {
    const cyan = new Character('Cyan Garamonde', 'SNES - Final Fantasy 6 T-Edition Hack - Cyan Garamonde.png');
    ctrl.addTo(cyan);
    const celes = new Character('Celes Chere', '/SNES - Final Fantasy 6 T-Edition Hack - Celes Chere.png');
    ctrl.addTo(celes);
    ctrl.selectCharacter(celes);
    mainLoop();
}

window.addEventListener('load', () => {
    const container = document.querySelector('#container');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const marginWidth = (windowWidth - 1000) / 2;
    container.style.left = `${marginWidth}px`;

    const marginHeight = (windowHeight - 500) / 2;
    container.style.top = `${marginHeight}px`;

    const characterCanvas = document.querySelector('#characterCanvas');
    const mapCanvas = document.querySelector('#mapCanvas');
    const ctx = characterCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const control = new Control;
    startUp(control);
});

window.addEventListener('keyup', () => {
    control.isMoving(false);
});

window.addEventListener('keypress', (k) => {
    console.log(k.key);
    if (k.key === '+') control.nextCharacter();
});