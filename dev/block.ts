class Block extends DomElement {
    private readonly speed: number;
    private readonly width: number;
    private readonly height: number;
    public color: string;
    private destination = {x: 0, y: 0};

    constructor(color: string, speed: number, width: number, height: number) {
        super('block', 0, 0, 'level');

        this.speed = speed;
        this.width = width;
        this.height = height;
        this.color = color;

        this.el.style.backgroundColor = this.color;
        this.el.style.backgroundImage = `linear-gradient(90deg, rgba(2,0,36,1) 0%, ${this.color} 29%, #FFFFFF 100%)`;
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
     * Main update handler for the game for moving our block randomly over the screen
     */
    public update() {
        if (this.x > (this.destination.x - this.speed) && this.x < (this.destination.x + this.speed)) {
            this.destination.x = Utils.getRandomInt(0, (window.outerWidth - this.width));
        }
        if (this.y > (this.destination.y - this.speed) && this.y < (this.destination.y + this.speed)) {
            this.destination.y = Utils.getRandomInt(0, (document.documentElement.clientHeight - this.height));
        }

        if (this.destination.x >= this.x) {
            this.x += this.speed;
        } else {
            this.x -= this.speed;
        }

        if (this.destination.y >= this.y) {
            this.y += this.speed;
        } else {
            this.y -= this.speed;
        }

        this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
}
