"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DomElement = (function () {
    function DomElement(type, x, y, parentClass) {
        if (parentClass === void 0) { parentClass = ''; }
        this.x = x;
        this.y = y;
        this.el = document.createElement('div');
        var main = document.getElementById('main');
        if (main === null) {
            throw new Error("<main> element doesn't exist!");
        }
        this.el.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
        this.el.classList.add(type);
        if (parentClass === '') {
            main.appendChild(this.el);
        }
        else {
            var parentEl = document.querySelector("." + parentClass);
            if (parentEl === null) {
                throw new Error("<." + parentClass + "> element doesn't exist!");
            }
            parentEl.appendChild(this.el);
        }
    }
    DomElement.prototype.getClientReact = function () {
        return this.el.getBoundingClientRect();
    };
    return DomElement;
}());
var Level = (function (_super) {
    __extends(Level, _super);
    function Level() {
        var _this = _super.call(this, 'level', 0, 0) || this;
        _this.totalBlocks = 10;
        _this.blocks = [];
        _this.scorePerBlock = 10;
        _this.player = new Player();
        for (var i = 0; i < _this.totalBlocks; i++) {
            _this.blocks.push(new Block(Utils.getRandomColor(), Utils.getRandomInt(1, 5), i * 100, Utils.getRandomInt(10, 150), Utils.getRandomInt(10, 150)));
        }
        _this.score = new Score();
        return _this;
    }
    Level.prototype.update = function () {
        var _this = this;
        this.player.update();
        this.blocks.forEach(function (block, index) {
            block.update();
            if (Utils.checkCollision(_this.player.getClientReact(), block.getClientReact())) {
                _this.player.blockCaught(block);
                block.destroy();
                _this.blocks.splice(index, 1);
                _this.score.update(_this.scorePerBlock);
                if (_this.blocks.length === 0) {
                    window.dispatchEvent(new Event('level:gameover'));
                    _this.el.remove();
                }
            }
        });
    };
    return Level;
}(DomElement));
var Block = (function (_super) {
    __extends(Block, _super);
    function Block(color, speed, timeout, width, height) {
        var _this = _super.call(this, 'block', 0, 0, 'level') || this;
        _this.speed = speed;
        _this.timeout = timeout;
        _this.width = width;
        _this.height = height;
        _this.color = color;
        _this.el.style.backgroundColor = _this.color;
        _this.el.style.width = _this.width + "px";
        _this.el.style.height = _this.height + "px";
        return _this;
    }
    Block.prototype.destroy = function () {
        this.el.remove();
    };
    Block.prototype.update = function () {
        var _this = this;
        setTimeout(function () { return _this.updateXY(); }, this.timeout);
    };
    Block.prototype.updateXY = function () {
        if (this.x < (window.outerWidth - this.width) && this.y === 0) {
            this.x += this.speed;
        }
        else if (this.x >= (window.outerWidth - this.width) && this.y < (document.documentElement.clientHeight - this.height)) {
            this.y += this.speed;
        }
        else if (this.y >= (document.documentElement.clientHeight - this.height) && this.x > 0) {
            this.x -= this.speed;
        }
        else if (this.x === 0 && this.y > 0) {
            this.y -= this.speed;
        }
        else {
            this.x = 0;
            this.y = 0;
        }
        this.el.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
    };
    return Block;
}(DomElement));
var Game = (function () {
    function Game() {
        var _this = this;
        this.level = new Level();
        this.gameOver = new GameOver();
        this.gameLoop();
        window.addEventListener('level:gameover', function () { return _this.gameOver.show(); });
        window.addEventListener('gameover:restart', function () { return _this.startNewLevel(); });
    }
    Game.prototype.gameLoop = function () {
        var _this = this;
        if (typeof this.level !== 'undefined') {
            this.level.update();
        }
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    Game.prototype.startNewLevel = function () {
        console.log("???");
        delete this.level;
        this.gameOver.hide();
        this.level = new Level();
    };
    return Game;
}());
window.addEventListener("load", function () { return new Game(); });
var GameOver = (function (_super) {
    __extends(GameOver, _super);
    function GameOver() {
        var _this = _super.call(this, 'gameover', 0, 0) || this;
        _this.height = 200;
        _this.width = 400;
        _this.message = 'Game over! Click on this message on the screen to restart the game';
        _this.el.innerHTML = _this.message;
        _this.x = window.outerWidth / 2 - _this.width / 2;
        _this.y = document.documentElement.clientHeight / 2 - _this.height / 2;
        _this.el.style.width = _this.width + "px";
        _this.el.style.height = _this.height + "px";
        _this.el.addEventListener('click', function () { return window.dispatchEvent(new Event('gameover:restart')); });
        return _this;
    }
    GameOver.prototype.show = function () {
        this.el.classList.add('show');
    };
    GameOver.prototype.hide = function () {
        this.el.classList.remove('show');
    };
    return GameOver;
}(DomElement));
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this, 'player', 0, 0, 'level') || this;
        _this.height = 10;
        _this.width = 10;
        _this.growthFactor = 1.5;
        _this.speed = 2;
        _this.speedIncreaseFactor = 0.5;
        _this.keysAllowed = [37, 38, 39, 40];
        _this.keysPressed = [];
        _this.x = window.outerWidth / 2 - _this.width / 2;
        _this.y = document.documentElement.clientHeight / 2 - _this.height / 2;
        _this.el.style.width = _this.width + "px";
        _this.el.style.height = _this.height + "px";
        window.addEventListener('keydown', function (e) { return _this.keyDownHandler(e); });
        window.addEventListener('keyup', function (e) { return _this.keyUpHandler(e); });
        return _this;
    }
    Player.prototype.keyDownHandler = function (e) {
        var key = e.keyCode;
        if (this.keysAllowed.indexOf(key) > -1 && this.keysPressed.indexOf(key) === -1) {
            this.keysPressed.push(key);
        }
    };
    Player.prototype.keyUpHandler = function (e) {
        var key = e.keyCode;
        var keyPressedPosition = this.keysPressed.indexOf(key);
        if (this.keysAllowed.indexOf(key) > -1 && keyPressedPosition > -1) {
            this.keysPressed.splice(keyPressedPosition, 1);
        }
    };
    Player.prototype.update = function () {
        var _this = this;
        this.keysPressed.forEach(function (key) {
            switch (key) {
                case 37:
                    _this.x -= _this.speed;
                    break;
                case 38:
                    _this.y -= _this.speed;
                    break;
                case 39:
                    _this.x += _this.speed;
                    break;
                case 40:
                    _this.y += _this.speed;
                    break;
                default:
                    return;
            }
        });
        this.el.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
    };
    Player.prototype.blockCaught = function (block) {
        this.speed += this.speedIncreaseFactor;
        this.width += this.growthFactor;
        this.height += this.growthFactor;
        this.el.style.height = this.height + "px";
        this.el.style.width = this.width + "px";
        this.el.style.backgroundColor = block.color;
    };
    return Player;
}(DomElement));
var Score = (function (_super) {
    __extends(Score, _super);
    function Score() {
        var _this = _super.call(this, 'score', 10, 10, 'level') || this;
        _this.score = 0;
        _this.el.innerHTML = "score: " + _this.score.toString();
        return _this;
    }
    Score.prototype.update = function (score) {
        this.score += score;
        this.el.innerHTML = "score: " + this.score.toString();
    };
    return Score;
}(DomElement));
var Utils = (function () {
    function Utils() {
    }
    Utils.getRandomColor = function () {
        var o = Math.round, r = Math.random, s = 255;
        return "rgba(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + ",1)";
    };
    Utils.getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    Utils.checkCollision = function (a, b) {
        return (a.left <= b.right &&
            b.left <= a.right &&
            a.top <= b.bottom &&
            b.top <= a.bottom);
    };
    return Utils;
}());
//# sourceMappingURL=main.js.map