class Game {
    private level: Level;
    private gameOver: GameOver;

    constructor() {
        this.level = new Level();
        this.gameOver = new GameOver();

        this.gameLoop();
        window.addEventListener('level:gameover', () => this.gameOver.show());
        window.addEventListener('gameover:restart', () => this.startNewLevel());
    }

    /**
     * The only place for a requestAnimationFrame
     */
    private gameLoop() {
        if (typeof this.level !== 'undefined') {
            this.level.update();
        }
        requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Time to start all over
     */
    private startNewLevel() {
        console.log("???");
        delete this.level;
        this.gameOver.hide();
        this.level = new Level();
    }
}

window.addEventListener("load", () => new Game());