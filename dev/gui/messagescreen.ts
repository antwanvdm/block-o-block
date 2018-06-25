import DomElement from "../helpers/domelement";
import WindowEventHandler from "../helpers/windoweventhandler";

export default class MessageScreen extends DomElement {
    public currentEvent: string;
    public isActive: boolean = false;

    private gameStates: { [k: string]: { 'header': string, 'body': string, 'className': string, 'keyboardTriggerKey': string } } = {
        'game:start': {
            'header': 'Welcome to Block-o-Block!',
            'body': 'It\'s time to catch them blocks!<br/><br/>Use your arrow keys to move your player around and press space to start.<br/><br/>Press -<strong>H</strong>- to view the highscore list.',
            'className': 'is-info',
            'keyboardTriggerKey': ' '
        },
        'game:end': {
            'header': 'Your game is over!',
            'body': 'You made it, your final score is __SCORE__ out of max __MAX_SCORE__ points.<br/><br/>Thanks for playing, press <strong>-N-</strong> to save your score or press enter to restart the madness.<br/><br/>Press -<strong>H</strong>- to view the highscore list.',
            'className': 'is-success',
            'keyboardTriggerKey': 'enter'
        },
        'level:success': {
            'header': 'YEAH! Level completed!',
            'body': 'Performing like a boss! Press space to proceed to the next level and catch even more blocks.',
            'className': 'is-success',
            'keyboardTriggerKey': ' '
        },
        'level:failed': {
            'header': 'AAH! Level failed!',
            'body': 'Try again and show us what you\'re made off! Press space to restart this level.',
            'className': 'is-danger',
            'keyboardTriggerKey': ' '
        }
    };

    constructor() {
        super('messagescreen', -1, -1, 'gui');
        this.el.classList.add('message');

        this.renderTemplate();
        this.show('game:start');
        WindowEventHandler.addEventListener('keyup.messagescreen', (e: KeyboardEvent) => this.keyBoardHandler(e));
    }

    /**
     * Handle the spacebar
     *
     * @param {KeyboardEvent} e
     */
    private keyBoardHandler(e: KeyboardEvent): void {
        let key = e.key.toLowerCase();
        let keyToUse = this.gameStates[this.currentEvent].keyboardTriggerKey;

        if (key === keyToUse && this.isActive === true) {
            window.dispatchEvent(new Event(`${this.currentEvent}:click`));
        }
    }

    /**
     * Show the desired message (type matches index in object)
     *
     * @param type
     * @param [bodyReplacements]
     */
    public show(type: string, bodyReplacements: { [k: string]: string } = {}): void {
        let messageHeader = this.gameStates[type].header;
        let messageBody = this.gameStates[type].body;
        for (let replacement in bodyReplacements) {
            messageBody = messageBody.replace(replacement, bodyReplacements[replacement]);
        }

        this.el.querySelector('.message-header').innerHTML = messageHeader;
        this.el.querySelector('.message-body').innerHTML = messageBody;

        this.el.classList.add('show', this.gameStates[type].className);
        this.currentEvent = type;
        this.isActive = true;
    }

    /**
     * Hide message on screen
     */
    public hide(): void {
        this.el.classList.remove('show', 'is-info', 'is-success', 'is-danger');
        this.isActive = false;
    }

    /**
     * Template needed to show more elements
     */
    private renderTemplate(): void {
        this.el.innerHTML = `
            <div class="message-header"></div>
            <div class="message-body"></div>
        `;
    }
}
