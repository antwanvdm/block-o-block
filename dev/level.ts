import DomElement from "./domelement";
import Block from "./block";
import Player from "./player";
import Timer from "./timer";
import Utils from "./utils";
import WindowEventHandler from "./windoweventhandler";

export default class Level extends DomElement {
    private readonly totalBlocks: number;
    private readonly scorePerBlock: number;
    private blocks: Block[] = [];
    private player: Player;
    private timer: Timer;
    public failed = false;

    constructor(totalBlocks: number, scorePerBlock: number) {
        super('level', 0, 0);

        this.totalBlocks = totalBlocks;
        this.scorePerBlock = scorePerBlock;
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

    /**
     * Checks for collision and potential success of this level
     */
    public update() {
        this.player.update();
        this.blocks.forEach((block, index) => {
            block.update();

            if (Utils.checkCollision(this.player.getClientReact(), block.getClientReact()) && this.failed === false) {
                this.player.blockCaught(block);
                block.destroy();
                this.blocks.splice(index, 1);
                window.dispatchEvent(new CustomEvent('level:scoreUpdate', {detail: {score: this.scorePerBlock}}));

                if (this.blocks.length === 0) {
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
    private destroy(eventType: string) {
        this.timer.destroy();
        this.player.destroy();
        this.blocks.forEach((block, index) => {
            block.destroy();
            this.blocks.splice(index, 1);
        });
        WindowEventHandler.removeEventListener('timer:done');
        window.dispatchEvent(new Event(eventType));
        this.el.remove();
    }
}
