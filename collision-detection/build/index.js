"use strict";
class Coordinate2D {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
function clampCoordinate2D(target, bounds) {
    target.x = Math.max(0, Math.min(target.x, bounds.x));
    target.y = Math.max(0, Math.min(target.y, bounds.y));
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
    doesCollide(other) {
        return (this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y);
    }
    translate(delta) {
        this.x += delta.x;
        this.y += delta.y;
    }
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(Math.round(this.x), Math.round(this.y), this.width, this.height);
    }
}
class PlayerController {
    renderObject;
    controllerAxis;
    moveSpeed = 200;
    windowBounds;
    constructor(renderObject, windowBounds) {
        this.renderObject = renderObject;
        this.controllerAxis = new Coordinate2D(0, 0);
        this.windowBounds = windowBounds;
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }
    onKeyDown(e) {
        if (e.repeat)
            return;
        switch (e.key) {
            case ('ArrowDown'):
                this.controllerAxis.y += 1;
                break;
            case ('ArrowUp'):
                this.controllerAxis.y -= 1;
                break;
            case ('ArrowRight'):
                this.controllerAxis.x += 1;
                break;
            case ('ArrowLeft'):
                this.controllerAxis.x -= 1;
                break;
        }
    }
    onKeyUp(e) {
        switch (e.key) {
            case ('ArrowDown'):
                this.controllerAxis.y -= 1;
                break;
            case ('ArrowUp'):
                this.controllerAxis.y += 1;
                break;
            case ('ArrowRight'):
                this.controllerAxis.x -= 1;
                break;
            case ('ArrowLeft'):
                this.controllerAxis.x += 1;
                break;
        }
    }
    getDelta(ms) {
        return new Coordinate2D(this.controllerAxis.x * this.moveSpeed * ms / 1000, this.controllerAxis.y * this.moveSpeed * ms / 1000);
    }
    movePlayer(ms) {
        const delta = this.getDelta(ms);
        this.renderObject.translate(delta);
        clampCoordinate2D(this.renderObject.position, this.windowBounds);
    }
}
class Game {
    canvas;
    ctx;
    renderObjects = [];
    playerController;
    lastFrame;
    player;
    constructor(canvasRef) {
        const ctx = canvasRef.getContext('2d');
        if (!ctx)
            throw new Error('Unable to get 2D context from canvas.');
        this.ctx = ctx;
        this.canvas = canvasRef;
        this.initScene();
        const player = new RenderObject(this.canvas.width / 2 - 10, this.canvas.height / 2 - 10, 20, 20, '#222222');
        this.player = player;
        this.playerController = new PlayerController(player, new Coordinate2D(this.canvas.width - this.player.width, this.canvas.height - this.player.height));
        this.lastFrame = new Date();
    }
    createRenderObject(x, y, w, h) {
        const result = new RenderObject(x, y, w, h, '#bbbbbb');
        this.renderObjects.push(result);
        return result;
    }
    initScene() {
        this.createRenderObject(0, this.canvas.height - 40, this.canvas.width, 40);
        this.createRenderObject(20, 20, 50, 50);
        this.createRenderObject(400, 400, 80, 20);
        this.createRenderObject(80, 105, 80, 60);
        this.createRenderObject(150, 300, 80, 90);
        this.createRenderObject(180, 60, 200, 90);
    }
    tick() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const renderObject of this.renderObjects) {
            renderObject.render(this.ctx);
        }
        this.player.render(this.ctx);
        // Sloppy; input and render should be decoupled. This is only a demo.
        const currentFrame = new Date();
        this.playerController.movePlayer(currentFrame.getTime() - this.lastFrame.getTime());
        this.lastFrame = currentFrame;
        const collidingBoxes = this.renderObjects.filter(obj => obj.doesCollide(this.player));
        const noncollidingBoxes = this.renderObjects.filter(obj => !obj.doesCollide(this.player));
        collidingBoxes.forEach(box => box.color = '#444444');
        noncollidingBoxes.forEach(box => box.color = '#bbbbbb');
    }
    run() {
        // TODO Crude, replace with proper render loop.
        this.tick();
        setInterval(() => {
            this.tick();
        }, 30);
    }
}
class BoxCreator {
    xRef;
    yRef;
    wRef;
    hRef;
    buttonRef;
    game;
    constructor(game) {
        const xRef = document.querySelector('#box-x');
        const yRef = document.querySelector('#box-y');
        const wRef = document.querySelector('#box-w');
        const hRef = document.querySelector('#box-h');
        const buttonRef = document.querySelector('#new-box');
        this.game = game;
        if (!xRef || !yRef || !wRef || !hRef || !buttonRef)
            throw new Error('Could not get Box Creator refs.');
        xRef;
        this.xRef = xRef;
        this.yRef = yRef;
        this.wRef = wRef;
        this.hRef = hRef;
        this.buttonRef = buttonRef;
        this.buttonRef.addEventListener('click', this.onButtonClick.bind(this));
    }
    onButtonClick() {
        try {
            const [x, y, w, h] = [this.xRef, this.yRef, this.wRef, this.hRef].map(ref => parseInt(ref.value));
            this.game.createRenderObject(x, y, w, h);
        }
        catch (e) {
            console.log('Invalid input; try using integer values.');
        }
    }
}
function main() {
    const canvasRef = document.querySelector('#app');
    if (!canvasRef)
        throw new Error('Unable to find <canvas id="app">');
    const game = new Game(canvasRef);
    game.run();
    const boxCreator = new BoxCreator(game);
}
window.addEventListener('load', main);
