import Score from './score';
import MessageScreen from './messagescreen';
import DomElement from "../helpers/domelement";
import HighScoreList from "./highscorelist";
import NameForm from './nameform';
import WindowEventHandler from "../helpers/windoweventhandler";

export default class GUI extends DomElement {
    private score: Score;
    private messageScreen: MessageScreen;
    private nameForm: NameForm;
    private nameFormVisible: boolean = false;
    private highScoreList: HighScoreList;
    private highScoreListVisible: boolean = false;

    constructor() {
        super('gui', -1, -1);

        this.score = new Score();
        this.messageScreen = new MessageScreen();
        this.nameForm = new NameForm();
        window.addEventListener('level:scoreUpdate', (e) => this.score.update((e as CustomEvent).detail.score));

        this.highScoreList = new HighScoreList();
        WindowEventHandler.addEventListener('keyup.highscorelist', (e: KeyboardEvent) => this.keyBoardHandler(e));
    }

    /**
     * Handle the spacebar
     *
     * @param {KeyboardEvent} e
     */
    keyBoardHandler(e: KeyboardEvent): void {
        let key = e.key.toLowerCase();

        //Checks for the high score modal show/hide
        if (key === 'h' && this.highScoreListVisible === false && this.nameFormVisible === false) {
            this.highScoreListVisible = true;
            this.highScoreList.show();
            this.messageScreen.isActive = false;
        } else if (key === 'escape' && this.highScoreListVisible === true) {
            this.highScoreListVisible = false;
            this.highScoreList.hide();
            this.messageScreen.isActive = true;
        }

        //Checks for the name entering modal show/hide
        if (key === 'n' && this.highScoreListVisible === false && this.nameFormVisible === false && this.messageScreen.currentEvent === 'game:end') {
            this.nameFormVisible = true;
            this.nameForm.show(this.score.get());
            this.messageScreen.isActive = false;
        } else if (key === 'escape' && this.nameFormVisible === true) {
            this.nameFormVisible = false;
            this.nameForm.hide();
            this.messageScreen.isActive = true;
        }
    }

    /**
     * Triggered when a level is done
     *
     * @param {string} type
     */
    public show(type: string): void {
        this.messageScreen.show(type);
    }

    /**
     * Triggered when a new level starts
     */
    public hide(): void {
        this.messageScreen.hide();
    }

    /**
     * Triggered when the game is done
     *
     * @param maxScore
     */
    public gameEnd(maxScore: number): void {
        this.messageScreen.show('game:end', {
            '__SCORE__': this.score.get().toString(),
            '__MAX_SCORE__': maxScore.toString()
        });
    }

    /**
     * Triggered when we need to restart, go to first screen and set score to 0
     */
    public restart(): void {
        this.messageScreen.hide();
        this.messageScreen.show('game:start');
        this.score.update(0, true);
    }
}
