"use strict";
class DomElement {
    constructor(type, x, y, parentClass = '') {
        this.x = x;
        this.y = y;
        this.el = document.createElement('div');
        let main = document.getElementById('main');
        if (main === null) {
            throw new Error("<main> element doesn't exist!");
        }
        this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.el.classList.add(type);
        if (parentClass === '') {
            main.appendChild(this.el);
        }
        else {
            let parentEl = document.querySelector(`.${parentClass}`);
            if (parentEl === null) {
                throw new Error(`<.${parentClass}> element doesn't exist!`);
            }
            parentEl.appendChild(this.el);
        }
    }
    getClientReact() {
        return this.el.getBoundingClientRect();
    }
}
class Level extends DomElement {
    constructor(totalBlocks) {
        super('level', 0, 0);
        this.blocks = [];
        this.scorePerBlock = 10;
        this.failed = false;
        this.totalBlocks = totalBlocks;
        this.player = new Player();
        this.timer = new Timer();
        for (let i = 0; i < this.totalBlocks; i++) {
            this.blocks.push(new Block(Utils.getRandomColor(), Utils.getRandomInt(1, 5), Utils.getRandomInt(10, 150), Utils.getRandomInt(10, 150)));
        }
        WindowEventHandler.addEventListener('timer:done', () => {
            this.failed = true;
            this.destroy('level:failed');
        });
    }
    update() {
        this.player.update();
        this.blocks.forEach((block, index) => {
            block.update();
            if (Utils.checkCollision(this.player.getClientReact(), block.getClientReact())) {
                this.player.blockCaught(block);
                block.destroy();
                this.blocks.splice(index, 1);
                window.dispatchEvent(new CustomEvent('level:scoreUpdate', { detail: { score: this.scorePerBlock } }));
                if (this.blocks.length === 0 && this.failed === false) {
                    this.destroy('level:success');
                }
            }
        });
    }
    destroy(eventType) {
        window.dispatchEvent(new Event(eventType));
        this.timer.destroy();
        this.player.destroy();
        WindowEventHandler.removeEventListener('timer:done');
        this.el.remove();
    }
}
class Block extends DomElement {
    constructor(color, speed, width, height) {
        super('block', 0, 0, 'level');
        this.destination = { x: 0, y: 0 };
        this.speed = speed;
        this.width = width;
        this.height = height;
        this.color = color;
        this.el.style.backgroundColor = this.color;
        this.el.style.width = `${this.width}px`;
        this.el.style.height = `${this.height}px`;
    }
    destroy() {
        this.el.remove();
    }
    update() {
        if (this.x > (this.destination.x - this.speed) && this.x < (this.destination.x + this.speed)) {
            this.destination.x = Utils.getRandomInt(0, (window.outerWidth - this.width));
        }
        if (this.y > (this.destination.y - this.speed) && this.y < (this.destination.y + this.speed)) {
            this.destination.y = Utils.getRandomInt(0, (document.documentElement.clientHeight - this.height));
        }
        if (this.destination.x >= this.x) {
            this.x += this.speed;
        }
        else {
            this.x -= this.speed;
        }
        if (this.destination.y >= this.y) {
            this.y += this.speed;
        }
        else {
            this.y -= this.speed;
        }
        this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
}
class Game {
    constructor() {
        this.elementsPerLevel = 5;
        this.elementsIncreasePerLevel = 5;
        this.level = new Level(this.elementsPerLevel);
        this.gui = new GUI();
        this.gameLoop();
        window.addEventListener('gameover:restart', () => this.startNewLevel());
    }
    gameLoop() {
        if (typeof this.level !== 'undefined') {
            this.level.update();
        }
        requestAnimationFrame(() => this.gameLoop());
    }
    startNewLevel() {
        if (this.level.failed === false) {
            this.elementsPerLevel += this.elementsIncreasePerLevel;
        }
        delete this.level;
        this.gui.newLevel();
        this.level = new Level(this.elementsPerLevel);
    }
}
window.addEventListener("load", () => new Game());
class GameOver extends DomElement {
    constructor() {
        super('gameover', 0, 0, 'gui');
        this.height = 200;
        this.width = 400;
        this.messages = {
            'level:success': 'YEAH! Level completed! Click here to proceed to the next level',
            'level:failed': 'AAH! Level failed! Click here to restart this level'
        };
        this.x = window.outerWidth / 2 - this.width / 2;
        this.y = document.documentElement.clientHeight / 2 - this.height / 2;
        this.el.style.width = `${this.width}px`;
        this.el.style.height = `${this.height}px`;
        this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.el.addEventListener('click', () => window.dispatchEvent(new Event('gameover:restart')));
    }
    show(type) {
        this.el.innerHTML = this.messages[type];
        this.el.classList.add('show');
    }
    hide() {
        this.el.classList.remove('show');
    }
}
class GUI extends DomElement {
    constructor() {
        super('gui', 0, 0);
        this.score = new Score();
        this.gameOver = new GameOver();
        window.addEventListener('level:scoreUpdate', (e) => this.score.update(e.detail.score));
        ['level:success', 'level:failed'].map((eventType) => { window.addEventListener(eventType, (e) => this.gameOver.show(e.type)); });
    }
    newLevel() {
        this.gameOver.hide();
    }
}
class Player extends DomElement {
    constructor() {
        super('player', 0, 0, 'level');
        this.height = 10;
        this.width = 10;
        this.growthFactor = 1.5;
        this.speed = 2;
        this.speedIncreaseFactor = 0.2;
        this.keysAllowed = [37, 38, 39, 40];
        this.keysPressed = [];
        this.x = window.outerWidth / 2 - this.width / 2;
        this.y = document.documentElement.clientHeight / 2 - this.height / 2;
        this.el.style.width = `${this.width}px`;
        this.el.style.height = `${this.height}px`;
        WindowEventHandler.addEventListener('keydown.player', (e) => this.keyDownHandler(e));
        WindowEventHandler.addEventListener('keyup.player', (e) => this.keyUpHandler(e));
    }
    keyDownHandler(e) {
        let key = e.keyCode;
        if (this.keysAllowed.indexOf(key) > -1 && this.keysPressed.indexOf(key) === -1) {
            this.keysPressed.push(key);
        }
    }
    keyUpHandler(e) {
        let key = e.keyCode;
        let keyPressedPosition = this.keysPressed.indexOf(key);
        if (this.keysAllowed.indexOf(key) > -1 && keyPressedPosition > -1) {
            this.keysPressed.splice(keyPressedPosition, 1);
        }
    }
    update() {
        this.keysPressed.forEach((key) => {
            switch (key) {
                case 37:
                    this.x -= this.speed;
                    break;
                case 38:
                    this.y -= this.speed;
                    break;
                case 39:
                    this.x += this.speed;
                    break;
                case 40:
                    this.y += this.speed;
                    break;
                default:
                    return;
            }
        });
        this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
    blockCaught(block) {
        this.speed += this.speedIncreaseFactor;
        this.width += this.growthFactor;
        this.height += this.growthFactor;
        this.el.style.height = `${this.height}px`;
        this.el.style.width = `${this.width}px`;
        this.el.style.backgroundColor = block.color;
    }
    destroy() {
        WindowEventHandler.removeEventListener('keydown.player');
        WindowEventHandler.removeEventListener('keyup.player');
    }
}
class Score extends DomElement {
    constructor() {
        super('score', 10, 10, 'gui');
        this.score = 0;
        this.el.innerHTML = `score: ${this.score.toString()}`;
    }
    update(score) {
        this.score += score;
        this.el.innerHTML = `score: ${this.score.toString()}`;
    }
}
class Timer extends DomElement {
    constructor() {
        super('timer', 10, 40, 'level');
        this.seconds = 10;
        this.el.innerHTML = `time: ${this.seconds}`;
        this.intervalId = setInterval(() => this.update(), 1000);
    }
    update() {
        this.seconds--;
        this.el.innerHTML = `time: ${this.seconds}`;
        if (this.seconds === 0) {
            window.dispatchEvent(new Event('timer:done'));
        }
    }
    destroy() {
        clearInterval(this.intervalId);
    }
}
class Utils {
    static getRandomColor() {
        var o = Math.round, r = Math.random, s = 255;
        return `rgba(${o(r() * s)},${o(r() * s)},${o(r() * s)},1)`;
    }
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static checkCollision(a, b) {
        return (a.left <= b.right &&
            b.left <= a.right &&
            a.top <= b.bottom &&
            b.top <= a.bottom);
    }
}
class WindowEventHandler {
    static addEventListener(event, func) {
        WindowEventHandler.functionMap[event] = func;
        window.addEventListener(event.split('.')[0], WindowEventHandler.functionMap[event]);
    }
    static removeEventListener(event) {
        window.removeEventListener(event.split('.')[0], WindowEventHandler.functionMap[event]);
        delete WindowEventHandler.functionMap[event];
    }
}
WindowEventHandler.functionMap = {};
//# sourceMappingURL=main.js.map