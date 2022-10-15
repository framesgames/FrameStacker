
class Coords {
  constructor(x, y, width, height) {
    this.setCoords(x, y, width, height)
  }

  setCoords(x, y, width, height) {
    if (x + width > 1 || y + height > 1) {
      throw new Error('Invalid coordinates. Cannot place block outside of canvas!');
    }
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  isClicked(x, y) {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }

  isCollided(coords) {
    return (
      (this.x < coords.x && this.x + this.width > coords.x || coords.x < this.x && coords.x + coords.width > this.x) && 
      (this.y < coords.y && this.y + this.width > coords.y || coords.y < this.y && coords.y + coords.width > this.y)
    )
  }

}


class Block {
  // constructor(x, y, height, width, frameId, canvas) {
  constructor(coords, frameId, canvas, context) {
    this.coords = coords;
    this.previousCoords = new Coords(coords.x, coords.y, coords.width, coords.height);
    this.frameId = frameId;
    this.dragging = false;
    this.canvas = canvas;
    this.context = context;
  }

  draw() {
    this.context.fillRect(
      Math.round(this.coords.x * this.canvas.width), 
      Math.round(this.coords.y * this.canvas.height), 
      Math.round(this.coords.width * this.canvas.width), 
      Math.round(this.coords.height * this.canvas.height),
    );
    this.context.fillText(
      this.frameId, 
      Math.round(this.coords.x * this.canvas.width), 
      Math.round(this.coords.y * this.canvas.height), 
      Math.round(this.coords.width * this.canvas.width), 
    );
  }

  drop() {
    this.dragging = false;
    this.previousCoords.setCoords(this.coords.x, this.coords.y, this.coords.width, this.coords.height);
  }

  drag() {
    this.dragging = true;
  }

  move(x, y) {
    this.coords.setCoords(x, y, this.coords.width, this.coords.height);
  }

  revert() {
    this.move(this.previousCoords.x, this.previousCoords.y);
  }

  // TODO: implement collision detection
  isCollided(block) {
    return this.coords.isCollided(block.coords);
  }

  isClicked(x, y) {
    return this.coords.isClicked(x, y);
  }

}