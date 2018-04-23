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
    function DomElement(type, x, y) {
        this.x = x;
        this.y = y;
        this.el = document.createElement('div');
        var main = document.getElementById('main');
        if (main === null) {
            throw new Error("main element doesn't exist!");
        }
        this.el.classList.add(type);
        this.el.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
        main.appendChild(this.el);
    }
    return DomElement;
}());
var Block = (function (_super) {
    __extends(Block, _super);
    function Block(color, speed, timeout, width, height) {
        var _this = _super.call(this, 'block', 0, 0) || this;
        _this.speed = speed;
        _this.timeout = timeout;
        _this.width = width;
        _this.height = height;
        _this.el.style.backgroundColor = color;
        _this.el.style.width = _this.width + 'px';
        _this.el.style.height = _this.height + 'px';
        _this.el.addEventListener('click', function (e) { return _this.clickHandler(e); });
        return _this;
    }
    Block.prototype.clickHandler = function (e) {
        e.target;
        this.el.remove();
        var scoreUpdateEvents = new CustomEvent('scoreUpdate', { detail: { score: 10 } });
        window.dispatchEvent(scoreUpdateEvents);
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
        this.totalBlocks = 10;
        this.blocks = [];
        for (var i = 0; i < this.totalBlocks; i++) {
            this.blocks.push(new Block(Utils.getRandomColor(), Utils.getRandomInt(1, 5), i * 100, Utils.getRandomInt(10, 150), Utils.getRandomInt(10, 150)));
        }
        this.score = new Score();
        this.gameLoop();
    }
    Game.prototype.gameLoop = function () {
        var _this = this;
        this.blocks.forEach(function (block) { return block.update(); });
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    return Game;
}());
window.addEventListener("load", function () { return new Game(); });
var Score = (function (_super) {
    __extends(Score, _super);
    function Score() {
        var _this = _super.call(this, 'score', 10, 10) || this;
        _this.score = 0;
        _this.el.innerHTML = "score: " + _this.score.toString();
        window.addEventListener('scoreUpdate', function (e) { return _this.update(e); });
        return _this;
    }
    Score.prototype.update = function (e) {
        if (!Utils.isCustomEvent(e)) {
            throw new Error('not a custom event');
        }
        this.score += e.detail.score;
        this.el.innerHTML = "score: " + this.score.toString();
    };
    return Score;
}(DomElement));
var Utils = (function () {
    function Utils() {
    }
    Utils.getRandomColor = function () {
        var o = Math.round, r = Math.random, s = 255;
        return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
    };
    Utils.getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    Utils.isCustomEvent = function (event) {
        return 'detail' in event;
    };
    return Utils;
}());
//# sourceMappingURL=main.js.map