class GameOver extends DomElement {
    private height: number = 200;
    private width: number = 400;

    private messages: { [k: string]: string } = {
        'level:success': 'YEAH! Level completed! Click here to proceed to the next level',
        'level:failed': 'AAH! Level failed! Click here to restart this level'
    };

    constructor() {
        super('gameover', 0, 0, 'gui');

        this.x = window.outerWidth / 2 - this.width / 2;
        this.y = document.documentElement.clientHeight / 2 - this.height / 2;

        this.el.style.width = `${this.width}px`;
        this.el.style.height = `${this.height}px`;
        this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;

        this.el.addEventListener('click', () => window.dispatchEvent(new Event('gameover:restart')));
    }

    public show(type: string) {
        console.log(type);
        this.el.innerHTML = this.messages[type];
        this.el.classList.add('show');
    }

    public hide() {
        this.el.classList.remove('show');
    }
}