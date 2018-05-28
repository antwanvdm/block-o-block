import Score from './score';
import MessageScreen from './messagescreen';
import DomElement from "../helpers/domelement";

export default class GUI extends DomElement {
    private score: Score;
    private messageScreen: MessageScreen;

    constructor() {
        super('gui', 0, 0);

        this.score = new Score();
        this.messageScreen = new MessageScreen();

        window.addEventListener('level:scoreUpdate', (e) => this.score.update((e as CustomEvent).detail.score));
    }

    /**
     * Triggered when a level is done
     *
     * @param {string} type
     */
    public levelDone(type: string) {
        this.messageScreen.show(type);
    }

    /**
     * Triggered when a new level starts
     */
    public newLevel() {
        this.messageScreen.hide();
    }

    /**
     * Triggered when the game is done
     *
     * @param maxScore
     */
    public gameEnd(maxScore: number) {
        this.messageScreen.show('game:end', {
            '__SCORE__': this.score.get().toString(),
            '__MAX_SCORE__': maxScore.toString()
        });
    }

    /**
     * Triggered when we need to restart, go to first screen and set score to 0
     */
    public restart() {
        this.messageScreen.show('game:start');
        this.score.update(0, true);
    }

    /**
     * @returns {number}
     */
    public getScore() {
        return this.score.get();
    }
}
