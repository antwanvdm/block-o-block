class GUI extends DomElement {
    private score: Score;
    private gameOver: GameOver;

    constructor() {
        super('gui', 0, 0);

        this.score = new Score();
        this.gameOver = new GameOver();

        window.addEventListener('level:scoreUpdate', (e) => this.score.update((e as CustomEvent).detail.score));
        ['level:success', 'level:failed'].map((eventType) => { window.addEventListener(eventType, (e) => this.gameOver.show(e.type)); });
    }

    public newLevel() {
        this.gameOver.hide();
    }
}