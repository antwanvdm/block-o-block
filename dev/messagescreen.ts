class MessageScreen extends DomElement {
    private height: number = 200;
    private width: number = 400;
    private currentEvent!: string;
    private isActive: boolean = false;

    private messages: { [k: string]: string } = {
        'game:start': 'Welcome to Block-o-Block, it\'s time to catch them blocks!<br/><br/>Use your arrow keys to move your player around and press space to start.',
        'game:end': 'You made it, your final score is __SCORE__ out of max __MAX_SCORE__ points.<br/><br/>Thanks for playing, press space to restart the madness',
        'level:success': 'YEAH! Level completed! Press space to proceed to the next level',
        'level:failed': 'AAH! Level failed! Press space to restart this level'
    };

    constructor() {
        super('messagescreen', 0, 0, 'gui');

        this.x = window.outerWidth / 2 - this.width / 2;
        this.y = document.documentElement.clientHeight / 2 - this.height / 2;

        this.el.style.width = `${this.width}px`;
        this.el.style.height = `${this.height}px`;
        this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;

        this.show('game:start');
        WindowEventHandler.addEventListener('keyup.messagescreen', (e: KeyboardEvent) => {
            if (e.keyCode === 32 && this.isActive === true) {
                window.dispatchEvent(new Event(`${this.currentEvent}:click`));
            }
        });
    }

    /**
     * Show the desired message (type matches index in object)
     *
     * @param type
     * @param [replacements]
     */
    public show(type: string, replacements: { [k: string]: string } = {}) {
        let message = this.messages[type];
        for (let replacement in replacements) {
            message = message.replace(replacement, replacements[replacement]);
        }

        this.el.innerHTML = message;
        this.el.classList.add('show');
        this.currentEvent = type;
        this.isActive = true;
    }

    /**
     * Hide message on screen
     */
    public hide() {
        this.el.classList.remove('show');
        this.isActive = false;
    }
}
