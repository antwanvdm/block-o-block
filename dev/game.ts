class Game {
    private level!: Level;
    private levelsPerGame: number = 10;
    private currentLevelsPlayed: number = 0;
    private elementsPerLevel: number = 5;
    private elementsIncreasePerLevel: number = 5;
    private scorePerElement: number = 10;
    private readonly maxScore: number;
    private gui: GUI;

    constructor() {
        this.gui = new GUI();
        this.maxScore = this.calculateMaxScore();
        this.gameLoop();

        ['level:success', 'level:failed'].map((eventType) => {
            window.addEventListener(eventType, (e) => this.update(e.type));
        });
        ['game:start:click', 'level:success:click', 'level:failed:click'].map((eventType) => {
            window.addEventListener(eventType, () => this.startNewLevel());
        });
        window.addEventListener('game:end:click', () => this.restart());
    }

    /**
     * Calculate the score with available parameters
     *
     * @todo Do I really need to to this so inefficient..?
     * @returns {number}
     */
    private calculateMaxScore() {
        let maxScore = 0;
        for (let i = 0; i < this.levelsPerGame; i++) {
            let elements = this.elementsPerLevel + (i === 0 ? 0 : (this.elementsIncreasePerLevel * i));
            maxScore += (elements * this.scorePerElement);
        }
        return maxScore;
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
     * Update the game by either the end or anything in between levels
     *
     * @param {string} type
     */
    private update(type: string) {
        this.currentLevelsPlayed++;
        if (this.currentLevelsPlayed === this.levelsPerGame) {
            this.gui.gameEnd(this.maxScore);
            return;
        }

        this.gui.levelDone(type);
    }

    /**
     * Time to start a new level with madness
     */
    private startNewLevel() {
        if (this.level && this.level.failed === false) {
            this.elementsPerLevel += this.elementsIncreasePerLevel;
        }

        delete this.level;
        this.gui.newLevel();

        this.level = new Level(this.elementsPerLevel, this.scorePerElement);
    }

    /**
     * Start everything from the beginning
     */
    private restart() {
        this.gui.restart();
        this.currentLevelsPlayed = 0;
        this.elementsPerLevel = 5;
    }
}

window.addEventListener("load", () => new Game());
