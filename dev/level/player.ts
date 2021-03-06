import config from '../config.json';
import DomElement from "../helpers/domelement";
import Block from "./block";
import WindowEventHandler from "../helpers/windoweventhandler";
import LevelEntity from "./levelentity";

export default class Player extends DomElement implements LevelEntity {
    private height: number = 10;
    private width: number = 10;
    private growthFactor: number = config.game.player.growthFactor;
    private speed: number = config.game.player.speed;
    private speedIncreaseFactor: number = config.game.player.speedIncreaseFactor;
    private keysAllowed: string[] = ['arrowleft', 'arrowup', 'arrowright', 'arrowdown'];
    private keysPressed: string[] = [];

    constructor() {
        super('player', 0, 0, 'level');
        this.x = window.outerWidth / 2 - this.width / 2;
        this.y = document.documentElement.clientHeight / 2 - this.height / 2;

        this.el.style.width = `${this.width}px`;
        this.el.style.height = `${this.height}px`;
        this.el.style.borderRadius = `${this.width}px`;

        WindowEventHandler.addEventListener('keydown.player', (e: KeyboardEvent) => this.keyDownHandler(e));
        WindowEventHandler.addEventListener('keyup.player', (e: KeyboardEvent) => this.keyUpHandler(e));
    }

    /**
     * Key down handler for moving the player
     *
     * @param e
     */
    private keyDownHandler(e: KeyboardEvent): void {
        let key = e.key.toLowerCase();
        if (this.keysAllowed.indexOf(key) > -1 && this.keysPressed.indexOf(key) === -1) {
            this.keysPressed.push(key);
        }
    }

    /**
     * Key down handler for moving the player
     *
     * @param e
     */
    private keyUpHandler(e: KeyboardEvent): void {
        let key = e.key.toLowerCase();
        let keyPressedPosition = this.keysPressed.indexOf(key);
        if (this.keysAllowed.indexOf(key) > -1 && keyPressedPosition > -1) {
            this.keysPressed.splice(keyPressedPosition, 1);
        }
    }

    /**
     * Update the actual position based on earlier events
     */
    public update(): void {
        this.keysPressed.forEach((key) => {
            switch (key) {
                case 'arrowleft':
                    this.x -= this.speed;
                    break;

                case 'arrowup':
                    this.y -= this.speed;
                    break;

                case 'arrowright':
                    this.x += this.speed;
                    break;

                case 'arrowdown':
                    this.y += this.speed;
                    break;

                default:
                    return;
            }
        });

        //Checks to stay in bounds
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.x > (window.outerWidth - this.width)) {
            this.x = (window.outerWidth - this.width);
        }
        if (this.y > (document.documentElement.clientHeight - this.height)) {
            this.y = (document.documentElement.clientHeight - this.height);
        }

        this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }

    /**
     * Update player when a block got caught
     *
     * @param block
     */
    public blockCaught(block: Block): void {
        this.speed += this.speedIncreaseFactor;
        this.width += this.growthFactor;
        this.height += this.growthFactor;

        this.el.style.height = `${this.height}px`;
        this.el.style.width = `${this.width}px`;
        this.el.style.borderRadius = `${this.width}px`;
        this.el.style.backgroundColor = block.color;
    }

    /**
     * Clean up!
     */
    public destroy(): void {
        this.el.remove();
        WindowEventHandler.removeEventListener('keydown.player');
        WindowEventHandler.removeEventListener('keyup.player');
    }
}
