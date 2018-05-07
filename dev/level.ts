class Level extends DomElement {
    private totalBlocks: number;
    private blocks: Block[] = [];
    private player: Player;
    private timer: Timer;
    private scorePerBlock: number = 10;
    public failed = false;

    constructor(totalBlocks: number) {
        super('level', 0, 0);

        this.totalBlocks = totalBlocks;
        this.player = new Player();
        this.timer = new Timer();

        for (let i = 0; i < this.totalBlocks; i++) {
            this.blocks.push(new Block(Utils.getRandomColor(), Utils.getRandomInt(1, 5), Utils.getRandomInt(10, 150), Utils.getRandomInt(10, 150)));
        }

        WindowEventHandler.addEventListener('timer:done', () => {
            this.failed = true;
            this.destroy('level:failed');
        });
    }

    public update() {
        this.player.update();
        this.blocks.forEach((block, index) => {
            block.update();
            if (Utils.checkCollision(this.player.getClientReact(), block.getClientReact())) {
                this.player.blockCaught(block);
                block.destroy();
                this.blocks.splice(index, 1);
                window.dispatchEvent(new CustomEvent('level:scoreUpdate', {detail: {score: this.scorePerBlock}}));

                if (this.blocks.length === 0 && this.failed === false) {
                    console.log("??");
                    this.destroy('level:success');
                }
            }
        });
    }

    /**
     * Destroy object & timer and trigger event to notify the world about the status of this level
     * 
     * @param eventType 
     */
    private destroy(eventType:string) {
        window.dispatchEvent(new Event(eventType));
        this.timer.destroy();
        this.player.destroy();
        WindowEventHandler.removeEventListener('timer:done');
        this.el.remove();
    }
}