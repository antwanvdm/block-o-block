export default class Utils {
    static getRandomColor(): string {
        let o = Math.round, r = Math.random, s = 255;
        return `rgba(${o(r() * s)},${o(r() * s)},${o(r() * s)},1)`;
    }

    static getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static checkCollision(a: ClientRect, b: ClientRect): boolean {
        return (a.left <= b.right &&
            b.left <= a.right &&
            a.top <= b.bottom &&
            b.top <= a.bottom);
    }
}
