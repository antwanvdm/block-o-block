import config from '../config.json';
import DomElement from "../helpers/domelement";

export default class Timer extends DomElement {
    seconds: number = config.game.secondsPerLevel;
    intervalId: number;

    constructor() {
        super('timer', -1, -1, 'level');

        this.renderTemplate();
        this.el.classList.add('message', 'is-primary');
        this.el.querySelector('.seconds').innerHTML = this.seconds.toString();

        this.intervalId = setInterval(() => this.update(), 1000);
    }

    /**
     * Countdown of seconds
     */
    private update(): void {
        this.seconds--;
        this.el.querySelector('.seconds').innerHTML = this.seconds.toString();

        if (this.seconds <= 3) {
            this.el.classList.remove('is-primary');
            this.el.classList.add('is-danger');
        } else {
            this.el.classList.add('is-primary');
            this.el.classList.remove('is-danger');
        }

        if (this.seconds === 0) {
            window.dispatchEvent(new Event('timer:done'));
        }
    }

    public destroy(): void {
        clearInterval(this.intervalId);
    }

    /**
     * Template needed to show more elements
     */
    private renderTemplate(): void {
        this.el.innerHTML = `
            <div class="message-body">
                <span>time: </span>
                <span class="seconds"></span>
            </div>
        `;
    }
}
