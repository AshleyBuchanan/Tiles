class Main {
    constructor() {
        this.allCharacters = [];
    }
    addTo(character) {
        this.allCharacters.push(character);
    }
    mainLoop(timestamp) {
        //draw background
        background.draw();

        //draw characters
        this.allCharacters[0].clear();
        for (let character of this.allCharacters) {
            character.animate(timestamp);
            character.update();
            character.draw();
        }

        //draw foreground

        //draw UI

        requestAnimationFrame(this.mainLoop.bind(this));   //<--old
        // requestAnimationFrame(() => this.mainLoop());           //<--new
    }
}

class Control {
    constructor() {
        this.characterList = new Set();
        this.selectedCharacter = null;
    }
    addTo(character) {
        this.characterList.add(character);
    }
    selectCharacter(character) {
        this.selectedCharacter = character;
    }
    nextCharacter() {
        const arr = [...this.characterList];
        let index = arr.indexOf(this.selectedCharacter);
        if (index + 1 === arr.length) {
            index = 0;
        } else {
            index++;
        }
        this.selectedCharacter = arr[index];
    }
    direction(direction) {
        this.selectedCharacter.flip = false;
        if (direction === 'south') direction = this.selectedCharacter.south;
        if (direction === 'north') direction = this.selectedCharacter.north;
        if (direction === 'west') direction = this.selectedCharacter.west;
        if (direction === 'east') {
            direction = this.selectedCharacter.east;
            this.selectedCharacter.flip = true;
        }
        this.selectedCharacter.direction = direction;
    }
    isMoving(isMoving) {
        this.selectedCharacter.isMoving = isMoving;
    }
}
class Background {
    constructor() {
        //canvas
        this.background = document.querySelector('#backgroundCanvas');
        this.bgx = this.background.getContext('2d');
        this.bgx.imageSmoothingEnabled = false;
        //map for canvas
        this.map = new Image();
        this.map.src = 'SNES - Final Fantasy 6 - South Figaro Exterior.png';
    }
    draw() {
        this.bgx.save();
        this.bgx.drawImage(this.map,
            0, 0,                   //left,top  
            1000, 562,              //w,h
            0, 0,                   //x,y on canvas
            1000 * 3, 562 * 3);     //size
        this.bgx.restore();
    }
}

class Character {
    constructor(name, src) {
        const container = document.querySelector('#container');
        //canvas
        this.characters = document.createElement('canvas');
        this.characters.id = 'characterCanvas';
        container.append(this.characters);

        this.ctx = this.characters.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        //character for canvas
        this.character = new Image();
        //uniques
        this.name = name;
        this.character.src = src;
        //commons
        this.frameWidth = 16;
        this.frameHeight = 24;
        this.frameSpeed = 66.67;
        this.frameCount = 3;
        this.currentFrame = 0;
        this.lastFrameTime = 0;
        this.flip = false;
        this.south = 0;
        this.north = 3;
        this.west = 6;
        this.east = 9;
        this.direction = this.south;

        this.x = characterCanvas.width / 2 - this.frameWidth / 2;
        this.y = characterCanvas.height / 2 - this.frameHeight / 2;

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
        main.addTo(this);
        control.addTo(this);
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
    }
    update() {
        let nx = 0;
        let ny = 0;

        if (this.isMoving) {
            if (this.direction === this.south) ny++;
            if (this.direction === this.north) ny--;
            if (this.direction === this.east) nx++;
            if (this.direction === this.west) nx--;
        }
        this.x += nx;
        this.y += ny;
    }
    clear() {
        this.ctx.clearRect(0, 0, this.characters.width, this.characters.height);
    }
    draw() {
        this.ctx.save();
        let thisFrame = this.characterFrame.get(this.currentFrame + this.direction);
        if (!thisFrame) thisFrame = [0];

        let dx = 0;
        if (this.flip) {
            this.ctx.setTransform(-1, 0, 0, 1, this.characters.width, 0);
            dx = -this.frameWidth * 3;
        } else {
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        this.ctx.drawImage(this.character,
            thisFrame[0] * this.frameWidth, thisFrame[1] * this.frameHeight,
            this.frameWidth, this.frameHeight,
            dx, 0,
            this.frameWidth * 3, this.frameHeight * 3);

        this.ctx.restore();
        this.ctx.left = '500px';
    }
}
const main = new Main();
const control = new Control();
const background = new Background();
const celes = new Character('Celes Chere', '/SNES - Final Fantasy 6 T-Edition Hack - Celes Chere.png');
//const cyan = new Character('Cyan Garamonde', 'SNES - Final Fantasy 6 T-Edition Hack - Cyan Garamonde.png');
control.selectCharacter(celes);
main.mainLoop();

window.addEventListener('keyup', () => {
    control.isMoving(false);
});

window.addEventListener('keypress', (k) => {
    console.log(k.key);
    if (k.key === '+') control.nextCharacter();
});

window.addEventListener('keydown', (k) => {
    console.log(k.key);
    if (k.key == 'ArrowDown') {
        control.direction('south');
        control.isMoving(true);
    }
    if (k.key == 'ArrowUp') {
        control.direction('north');
        control.isMoving(true);
    }
    if (k.key == 'ArrowRight') {
        control.direction('east');
        control.isMoving(true);
    }
    if (k.key == 'ArrowLeft') {
        control.direction('west');
        control.isMoving(true);
    }
});