class Timer extends DomElement {
    seconds: number = 10;
    intervalId: number;

    constructor() {
        super('timer', 10, 40, 'level');
        this.el.innerHTML = `time: ${this.seconds}`;

        this.intervalId = setInterval(() => this.update(), 1000);
    }

    /**
     * Countdown of seconds
     */
    private update() {
        this.seconds--;
        this.el.innerHTML = `time: ${this.seconds}`;

        if (this.seconds === 0) {
            window.dispatchEvent(new Event('timer:done'));
        }
    }

    public destroy() {
        clearInterval(this.intervalId);
    }
}