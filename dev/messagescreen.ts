class MessageScreen extends DomElement {
    private height: number = 200;
    private width: number = 400;
    private currentEvent!: string;

    private messages: { [k: string]: string } = {
        'game:start': 'Welcome to Block-o-Block, it\'s time to catch them blocks!<br/><br/>Use your arrow keys to move your player around.',
        'level:success': 'YEAH! Level completed! Click here to proceed to the next level',
        'level:failed': 'AAH! Level failed! Click here to restart this level'
    };

    constructor() {
        super('messagescreen', 0, 0, 'gui');

        this.x = window.outerWidth / 2 - this.width / 2;
        this.y = document.documentElement.clientHeight / 2 - this.height / 2;

        this.el.style.width = `${this.width}px`;
        this.el.style.height = `${this.height}px`;
        this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;

        this.show('game:start');
        this.el.addEventListener('click', () => window.dispatchEvent(new Event(`${this.currentEvent}:click`)));
    }

    /**
     * Show the desired message (type matches index in object)
     * 
     * @param type 
     */
    public show(type: string) {
        this.el.innerHTML = this.messages[type];
        this.el.classList.add('show');
        this.currentEvent = type;
    }

    public hide() {
        this.el.classList.remove('show');
    }
}