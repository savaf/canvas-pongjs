import Rect from './rect';
import Vector from './vector';

class Ball extends Rect {
    constructor() {
        super(10, 10);
        this.velocity = new Vector;
    }
}

export default Ball;
