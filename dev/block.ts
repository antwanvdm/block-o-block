class Block extends DomElement {
    private speed: number;
    private timeout: number;
    protected width: number;
    protected height: number;
    public color: string;

    constructor(color: string, speed: number, timeout: number, width: number, height: number) {
        super('block', 0, 0, 'level');

        this.speed = speed;
        this.timeout = timeout;
        this.width = width;
        this.height = height;
        this.color = color;

        this.el.style.backgroundColor = this.color;
        this.el.style.width = `${this.width}px`;
        this.el.style.height = `${this.height}px`;
    }

    /**
     * Handler for clicking the blocks
     */
    public destroy() {
        this.el.remove();
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