import config from './config.json';
import GUI from './gui/gui';
import Level from "./level/level";

export default class Game {
    private level: Level;
    private levelsPerGame: number = config.game.levelsPerGame;
    private currentLevelsPlayed: number = 0;
    private startElementsPerLevel: number = config.game.startElementsPerLevel;
    private elementsIncreasePerLevel: number = config.game.elementsIncreasePerLevel;
    private scorePerElement: number = config.game.scorePerElement;
    private readonly maxScore: number;
    private gui: GUI;

    constructor() {
        this.gui = new GUI();
        this.maxScore = this.calculateMaxScore();
        this.gameLoop();

        ['level:success', 'level:failed'].map((eventType) => {
            window.addEventListener(eventType, (e: Event) => this.update(e.type));
        });
        ['game:start:click', 'level:success:click', 'level:failed:click'].map((eventType) => {
            window.addEventListener(eventType, () => this.startNewLevel());
        });
        window.addEventListener('game:end:click', () => this.restart());
    }

    /**
     * Calculate the score with available parameters
     *
     * @returns {number}
     */
    private calculateMaxScore(): number {
        let maxScore = 0;
        for (let i = 0; i < this.levelsPerGame; i++) {
            let elements = this.startElementsPerLevel + (i === 0 ? 0 : (this.elementsIncreasePerLevel * i));
            maxScore += (elements * this.scorePerElement);
        }
        return maxScore;
    }

    /**
     * The only place for a requestAnimationFrame
     */
    private gameLoop(): void {
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
    private update(type: string): void {
        this.currentLevelsPlayed++;
        if (this.currentLevelsPlayed === this.levelsPerGame) {
            this.gui.gameEnd(this.maxScore);
            return;
        }

        this.gui.show(type);
    }

    /**
     * Time to start a new level with madness
     */
    private startNewLevel(): void {
        if (this.level && this.level.failed === false) {
            this.startElementsPerLevel += this.elementsIncreasePerLevel;
        }

        delete this.level;
        this.gui.hide();

        this.level = new Level(this.startElementsPerLevel, this.scorePerElement);
    }

    /**
     * Start everything from the beginning
     */
    private restart(): void {
        this.gui.restart();
        this.currentLevelsPlayed = 0;
        this.startElementsPerLevel = config.game.startElementsPerLevel;
        delete this.level;
    }
}
