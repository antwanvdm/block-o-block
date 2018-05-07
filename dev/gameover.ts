class GameOver extends DomElement {
    private height: number = 200;
    private width: number = 400;
    private message: string = 'Game over! Click on this message on the screen to restart the game';

    constructor() {
        super('gameover', 0, 0);

        this.el.innerHTML = this.message;
        this.x = window.outerWidth / 2 - this.width / 2;
        this.y = document.documentElement.clientHeight / 2 - this.height / 2;

        this.el.style.width = `${this.width}px`;
        this.el.style.height = `${this.height}px`;

        this.el.addEventListener('click', () => window.dispatchEvent(new Event('gameover:restart')));
    }

    public show() {
        this.el.classList.add('show');
    }

    public hide() {
        this.el.classList.remove('show');
    }
}