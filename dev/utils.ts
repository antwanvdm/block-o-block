export default class Utils {
    static getRandomColor() {
        let o = Math.round, r = Math.random, s = 255;
        return `rgba(${o(r() * s)},${o(r() * s)},${o(r() * s)},1)`;
    }

    static getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static checkCollision(a: ClientRect, b: ClientRect) {
        return (a.left <= b.right &&
            b.left <= a.right &&
            a.top <= b.bottom &&
            b.top <= a.bottom);
    }
}
