class Game {
    private level!: Level;
    private elementsPerLevel: number = 5;
    private elementsIncreasePerLevel: number = 5;
    private gui: GUI;

    constructor() {
        this.gui = new GUI();
        this.gameLoop();

        window.addEventListener('game:start:click', () => this.start());
        ['level:success:click', 'level:failed:click'].map((eventType) => { window.addEventListener(eventType, () => this.startNewLevel()); });
    }

    private start(){
        this.level = new Level(this.elementsPerLevel)
        this.gui.newLevel();
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
        if (this.level.failed === false) {
            this.elementsPerLevel += this.elementsIncreasePerLevel;
        }

        delete this.level;
        this.gui.newLevel();

        this.level = new Level(this.elementsPerLevel);
    }
}

window.addEventListener("load", () => new Game());