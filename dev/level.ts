class Level extends DomElement{
    private totalBlocks: number = 10;
    private blocks: Block[] = [];
    private score: Score;
    private player: Player;
    private scorePerBlock: number = 10;

    constructor() {
        super('level', 0, 0);
        this.player = new Player();
        for (let i = 0; i < this.totalBlocks; i++) {
            this.blocks.push(new Block(Utils.getRandomColor(), Utils.getRandomInt(1, 5), i * 100, Utils.getRandomInt(10, 150), Utils.getRandomInt(10, 150)));
        }
        this.score = new Score();
    }

    public update() {
        this.player.update();
        this.blocks.forEach((block, index) => {
            block.update();
            if (Utils.checkCollision(this.player.getClientReact(), block.getClientReact())) {
                this.player.blockCaught(block);
                block.destroy();
                this.blocks.splice(index, 1);
                this.score.update(this.scorePerBlock);

                if (this.blocks.length === 0) {
                    window.dispatchEvent(new Event('level:gameover'));
                    this.el.remove();
                }
            }
        });
    }
}