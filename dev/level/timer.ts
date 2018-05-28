import DomElement from "../helpers/domelement";

export default class Timer extends DomElement {
    seconds: number = 10;
    intervalId: number;

    constructor() {
        super('timer', -1, -1, 'level');

        this.renderTemplate();
        this.el.classList.add('message', 'is-primary');
        this.el.querySelector('.message-body').innerHTML = `time: ${this.seconds}`;

        this.intervalId = setInterval(() => this.update(), 1000);
    }

    /**
     * Countdown of seconds
     */
    private update() {
        this.seconds--;
        this.el.querySelector('.message-body').innerHTML = `time: ${this.seconds}`;

        if (this.seconds === 0) {
            window.dispatchEvent(new Event('timer:done'));
        }
    }

    public destroy() {
        clearInterval(this.intervalId);
    }

    /**
     * Template needed to show more elements
     */
    private renderTemplate() {
        this.el.innerHTML = `
            <div class="message-body"></div>
        `;
    }
}
