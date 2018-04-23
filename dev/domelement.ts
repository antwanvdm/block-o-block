class DomElement {
    protected el: HTMLElement;
    protected x: number;
    protected y: number;

    constructor(type: string, x:number, y:number) {
        this.x = x;
        this.y = y;

        this.el = document.createElement('div');
        let main = document.getElementById('main');
        if (main === null){
            throw new Error("main element doesn't exist!");
        }

        this.el.classList.add(type);
        this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;

        main.appendChild(this.el);
    }
}