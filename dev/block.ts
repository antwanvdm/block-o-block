class Block extends DomElement {
    speed: number;
    timeout: number;
    protected width: number;
    protected height: number;

    constructor(color: string, speed: number, timeout: number, width: number, height: number) {
        super('block', 0, 0);

        this.speed = speed;
        this.timeout = timeout;
        this.width = width;
        this.height = height;

        this.el.style.backgroundColor = color;
        this.el.style.width = this.width + 'px';
        this.el.style.height = this.height + 'px';
        this.el.addEventListener('click', (e) => this.clickHandler(e));
    }

    /**
     * Handler for clicking the blocks
     * 
     * @param e 
     */
    private clickHandler(e: MouseEvent) {
        e.target;
        this.el.remove();

        let scoreUpdateEvents = new CustomEvent('scoreUpdate', { detail: { score: 10 } });
        window.dispatchEvent(scoreUpdateEvents);
    }

    /**
     * Main update handler for the game
     */
    public update() {
        setTimeout(() => this.updateXY(), this.timeout);
    }

    /**
     * Actual handler for updating X & Y for a block
     */
    private updateXY() {
        if (this.x < (window.outerWidth - this.width) && this.y === 0) {
            this.x += this.speed;
        } else if (this.x >= (window.outerWidth - this.width) && this.y < (document.documentElement.clientHeight - this.height)) {
            this.y += this.speed;
        } else if (this.y >= (document.documentElement.clientHeight - this.height) && this.x > 0) {
            this.x -= this.speed;
        } else if (this.x === 0 && this.y > 0) {
            this.y -= this.speed;
        } else {
            //someone loves messing with resizing.. reset!
            this.x = 0;
            this.y = 0;
        }

        this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
}