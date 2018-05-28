import DomElement from "../helpers/domelement";
import WindowEventHandler from "../helpers/windoweventhandler";

export default class MessageScreen extends DomElement {
    private height: number = 200;
    private width: number = 400;
    private currentEvent!: string;
    private isActive: boolean = false;

    private messages: { [k: string]: { 'header': string, 'body': string, 'className': string } } = {
        'game:start': {
            'header': 'Welcome to Block-o-Block!',
            'body': 'It\'s time to catch them blocks!<br/><br/>Use your arrow keys to move your player around and press space to start.',
            'className': 'is-info'
        },
        'game:end': {
            'header': 'Your game is over!',
            'body': 'You made it, your final score is __SCORE__ out of max __MAX_SCORE__ points.<br/><br/>Thanks for playing, press space to restart the madness',
            'className': 'is-success'
        },
        'level:success': {
            'header': 'YEAH! Level completed!',
            'body': 'Performing like a boss! Press space to proceed to the next level and catch even more blocks',
            'className': 'is-success'
        },
        'level:failed': {
            'header': 'AAH! Level failed!',
            'body': 'Try again and show us what you\'re made off! Press space to restart this level',
            'className': 'is-danger'
        }
    };

    constructor() {
        super('messagescreen', 0, 0, 'gui');

        this.x = window.outerWidth / 2 - this.width / 2;
        this.y = document.documentElement.clientHeight / 2 - this.height / 2;

        this.el.classList.add('message');
        this.el.style.width = `${this.width}px`;
        this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;

        this.renderTemplate();
        this.show('game:start');
        WindowEventHandler.addEventListener('keyup.messagescreen', (e: KeyboardEvent) => this.keyBoardHandler(e));
    }

    /**
     * Handle the spacebar
     *
     * @param {KeyboardEvent} e
     */
    keyBoardHandler(e: KeyboardEvent) {
        if (e.keyCode === 32 && this.isActive === true) {
            window.dispatchEvent(new Event(`${this.currentEvent}:click`));
        }
    }

    /**
     * Show the desired message (type matches index in object)
     *
     * @param type
     * @param [bodyReplacements]
     */
    public show(type: string, bodyReplacements: { [k: string]: string } = {}) {
        let messageHeader = this.messages[type].header;
        let messageBody = this.messages[type].body;
        for (let replacement in bodyReplacements) {
            messageBody = messageBody.replace(replacement, bodyReplacements[replacement]);
        }

        this.el.querySelector('.message-header').innerHTML = messageHeader;
        this.el.querySelector('.message-body').innerHTML = messageBody;

        this.el.classList.add('show', this.messages[type].className);
        this.currentEvent = type;
        this.isActive = true;
    }

    /**
     * Hide message on screen
     */
    public hide() {
        this.el.classList.remove('show', 'is-info', 'is-success', 'is-danger');
        this.isActive = false;
    }

    /**
     * Template needed to show more elements
     */
    private renderTemplate() {
        this.el.innerHTML = `
            <div class="message-header"></div>
            <div class="message-body"></div>
        `;
    }
}
