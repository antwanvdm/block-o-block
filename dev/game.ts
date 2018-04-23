class Game {
    private totalBlocks: number = 10;
    private blocks: Block[] = [];
    private score: Score;

    constructor() {
        for (let i = 0; i < this.totalBlocks; i++) {
            this.blocks.push(new Block(Utils.getRandomColor(), Utils.getRandomInt(1, 5), i * 100, Utils.getRandomInt(10, 150), Utils.getRandomInt(10, 150)));
        }
        this.score = new Score();
        this.gameLoop();
    }

    /**
     * The only place for a requestAnimationFrame
     */
    gameLoop() {
        this.blocks.forEach((block) => block.update());
        requestAnimationFrame(() => this.gameLoop());
    }
}

window.addEventListener("load", () => new Game());