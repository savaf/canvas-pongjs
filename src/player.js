import Rect from './rect';
import Vector from './vector';

class Player extends Rect {
    constructor() {
        super(20, 100);
        this.velocity = new Vector;
        this.score = 0;

        this._lastPosition = new Vector;
    }
    update(dt) {
        this.velocity.y = (this.position.y - this._lastPosition.y) / dt;
        this._lastPosition.y = this.position.y;
    }
}

export default Player;
