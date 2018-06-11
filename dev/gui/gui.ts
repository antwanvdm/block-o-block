import Score from './score';
import MessageScreen from './messagescreen';
import DomElement from "../helpers/domelement";
import HighScoreList from "./highscorelist";
import WindowEventHandler from "../helpers/windoweventhandler";
import config from '../config.json';

export default class GUI extends DomElement {
    private score: Score;
    private messageScreen: MessageScreen;
    private highScoreList: HighScoreList;
    private highScoreListVisible: boolean = false;

    constructor() {
        super('gui', -1, -1);

        this.score = new Score();
        this.messageScreen = new MessageScreen();
        window.addEventListener('level:scoreUpdate', (e) => this.score.update((e as CustomEvent).detail.score));

        if (config.functionalities.dataService === true) {
            this.highScoreList = new HighScoreList();
            WindowEventHandler.addEventListener('keyup.highscorelist', (e: KeyboardEvent) => this.keyBoardHandler(e));
        }
    }

    /**
     * Handle the spacebar
     *
     * @param {KeyboardEvent} e
     */
    keyBoardHandler(e: KeyboardEvent) {
        let key = e.key.toLowerCase();
        if (key === 'h' && this.highScoreListVisible === false) {
            this.highScoreListVisible = true;
            this.highScoreList.show();
        } else if (key === 'escape' && this.highScoreListVisible === true) {
            this.highScoreListVisible = false;
            this.highScoreList.hide();
        }
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
        this.messageScreen.hide();
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
