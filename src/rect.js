import Vector from './vector';

class Rect {
    constructor(x = 0, y = 0) {
        this.position = new Vector(0, 0);
        this.size = new Vector(x, y);
    }
    get left() {
        return this.position.x - this.size.x / 2;
    }
    get right() {
        return this.position.x + this.size.x / 2;
    }
    get top() {
        return this.position.y - this.size.y / 2;
    }
    get bottom() {
        return this.position.y + this.size.y / 2;
    }
}

export default Rect;