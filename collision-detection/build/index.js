"use strict";
class Coordinate2D {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class RenderObject {
    position;
    dimensions;
    color;
    constructor(x, y, w, h, color) {
        this.position = new Coordinate2D(x, y);
        this.dimensions = new Coordinate2D(w, h);
        this.color = color;
    }
    //#region Getters and setters
    get x() {
        return this.position.x;
    }
    set x(val) {
        this.position.x = val;
    }
    get y() {
        return this.position.y;
    }
    set y(val) {
        this.position.y = val;
    }
    get width() {
        return this.dimensions.x;
    }
    set width(val) {
        this.dimensions.x = val;
    }
    get height() {
        return this.dimensions.y;
    }
    set height(val) {
        this.dimensions.y = val;
    }
    //#endregion
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
class Game {
    canvas;
    ctx;
    renderObjects = [];
    constructor(canvasRef) {
        const ctx = canvasRef.getContext('2d');
        if (!ctx)
            throw new Error('Unable to get 2D context from canvas.');
        this.ctx = ctx;
        this.canvas = canvasRef;
    }
    initScene() {
        const floor = new RenderObject(0, this.canvas.height - 40, this.canvas.width, 40, '#bbbbbb');
        this.renderObjects.push(floor);
    }
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const renderObject of this.renderObjects) {
            renderObject.render(this.ctx);
        }
    }
    run() {
        this.initScene();
        // TODO Crude, replace with proper render loop.
        this.render();
        setInterval(() => {
            this.render();
        }, 100);
    }
}
function main() {
    const canvasRef = document.querySelector('#app');
    if (!canvasRef)
        throw new Error('Unable to find <canvas id="app">');
    const game = new Game(canvasRef);
    game.run();
}
window.addEventListener('load', main);
