class Coordinate2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

function clampCoordinate2D(target: Coordinate2D, bounds: Coordinate2D) {
  target.x = Math.max(0, Math.min(target.x, bounds.x));
  target.y = Math.max(0, Math.min(target.y, bounds.y));
}

class RenderObject {
  position: Coordinate2D;
  dimensions: Coordinate2D;
  color: string

  constructor(x: number, y: number, w: number, h: number, color: string) {
    this.position = new Coordinate2D(x, y);
    this.dimensions = new Coordinate2D(w, h);
    this.color = color;
  }

  //#region Getters and setters
  public get x(): number {
    return this.position.x;
  }
  
  public set x(val: number) {
    this.position.x = val;
  }
  
  public get y(): number {
    return this.position.y;
  }

  public set y(val: number) {
    this.position.y = val;
  }

  public get width(): number {
    return this.dimensions.x;
  }
  
  public set width(val: number) {
    this.dimensions.x = val;
  }

  public get height(): number {
    return this.dimensions.y;
  }

  public set height (val: number) {
    this.dimensions.y = val;
  }
  //#endregion

  doesCollide(other: RenderObject) {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }

  translate(delta: Coordinate2D) {
    this.x += delta.x;
    this.y += delta.y;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(Math.round(this.x), Math.round(this.y), this.width, this.height);
  }
}

class PlayerController {
  renderObject: RenderObject;
  controllerAxis: Coordinate2D;
  moveSpeed: number = 200;
  windowBounds: Coordinate2D;

  constructor(renderObject: RenderObject, windowBounds: Coordinate2D) {
    this.renderObject = renderObject;
    this.controllerAxis = new Coordinate2D(0, 0);
    this.windowBounds = windowBounds;
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.repeat) return;
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

  onKeyUp(e: KeyboardEvent) {
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

  getDelta(ms: number): Coordinate2D {
    return new Coordinate2D(this.controllerAxis.x * this.moveSpeed * ms / 1000, this.controllerAxis.y * this.moveSpeed * ms / 1000);
  }

  movePlayer(ms: number) {
    const delta = this.getDelta(ms);
    this.renderObject.translate(delta);
    clampCoordinate2D(this.renderObject.position, this.windowBounds);
  }
}

class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  renderObjects: RenderObject[] = [];
  playerController: PlayerController;
  lastFrame: Date;
  player: RenderObject;

  constructor(canvasRef: HTMLCanvasElement) {
    const ctx = canvasRef.getContext('2d');
    if (!ctx) throw new Error('Unable to get 2D context from canvas.');
    this.ctx = ctx;
    this.canvas = canvasRef;

    this.initScene();

    const player = new RenderObject(this.canvas.width / 2 - 10, this.canvas.height / 2 - 10, 20, 20, '#222222');
    this.player = player;
    this.playerController = new PlayerController(player, new Coordinate2D(this.canvas.width - this.player.width, this.canvas.height - this.player.height));

    this.lastFrame = new Date();
  }

  createRenderObject(x: number, y: number, w: number, h: number): RenderObject {
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
  xRef: HTMLInputElement;
  yRef: HTMLInputElement;
  wRef: HTMLInputElement;
  hRef: HTMLInputElement;
  buttonRef: HTMLButtonElement;
  game: Game;

  constructor(game: Game) {
    const xRef = document.querySelector<HTMLInputElement>('#box-x');
    const yRef = document.querySelector<HTMLInputElement>('#box-y');
    const wRef = document.querySelector<HTMLInputElement>('#box-w');
    const hRef = document.querySelector<HTMLInputElement>('#box-h');
    const buttonRef = document.querySelector<HTMLButtonElement>('#new-box');
    this.game = game;

    if (!xRef || !yRef || !wRef || !hRef || !buttonRef) throw new Error ('Could not get Box Creator refs.');
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
    } catch (e) {
      console.log('Invalid input; try using integer values.');
    }
  }
}

function main() {
  const canvasRef = document.querySelector<HTMLCanvasElement>('#app');
  if (!canvasRef) throw new Error('Unable to find <canvas id="app">');
  const game = new Game(canvasRef);
  game.run();

  const boxCreator = new BoxCreator(game);
}

window.addEventListener('load', main);