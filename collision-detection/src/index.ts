class Coordinate2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
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

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  renderObjects: RenderObject[] = [];

  constructor(canvasRef: HTMLCanvasElement) {
    const ctx = canvasRef.getContext('2d');
    if (!ctx) throw new Error('Unable to get 2D context from canvas.');
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
  const canvasRef = document.querySelector<HTMLCanvasElement>('#app');
  if (!canvasRef) throw new Error('Unable to find <canvas id="app">');
  const game = new Game(canvasRef);
  game.run();
}

window.addEventListener('load', main);