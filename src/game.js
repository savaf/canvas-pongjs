import Ball from './ball';
import Player from './player';

class Game {
    constructor(canvas) {
        this._canvas = canvas;
        this._context = canvas.getContext('2d');

        this.initialSpeed = 250;

        this.ball = new Ball;

        this.players = [
            new Player,
            new Player,
        ];

        this.players[0].position.x = 40;
        this.players[1].position.x = this._canvas.width - 40;
        this.players.forEach(p => p.position.y = this._canvas.height / 2);

        let lastTime = null;
        this._frameCallback = (millis) => {
            if (lastTime !== null) {
                const diff = millis - lastTime;
                this.update(diff / 1000);
            }
            lastTime = millis;
            requestAnimationFrame(this._frameCallback);
        };

        this.CHAR_PIXEL = 10;
        this.CHARS = [
            '111101101101111',
            '010010010010010',
            '111001111100111',
            '111001111001111',
            '101101111001001',
            '111100111001111',
            '111100111101111',
            '111001001001001',
            '111101111101111',
            '111101111001111',
        ].map(str => {
            const canvas = document.createElement('canvas');
            const s = this.CHAR_PIXEL;
            canvas.height = s * 5;
            canvas.width = s * 3;
            const context = canvas.getContext('2d');
            context.fillStyle = '#fff';
            str.split('').forEach((fill, i) => {
                if (fill === '1') {
                    context.fillRect((i % 3) * s, (i / 3 | 0) * s, s, s);
                }
            });
            return canvas;
        });

        this.reset();
    }

    clear() {
        this._context.fillStyle = '#000';
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }

    collide(player, ball) {
        if (player.left < ball.right && player.right > ball.left &&
            player.top < ball.bottom && player.bottom > ball.top) {
            ball.velocity.x = -ball.velocity.x * 1.05;
            const len = ball.velocity.len;
            ball.velocity.y += player.velocity.y * .2;
            ball.velocity.len = len;
        }
    }

    draw() {
        this.clear();

        this.drawRect(this.ball);
        this.players.forEach(player => this.drawRect(player));

        this.drawScore();
    }
    drawRect(rect) {
        this._context.fillStyle = '#fff';
        this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }

    drawScore() {
        const align = this._canvas.width / 3;
        const cw = this.CHAR_PIXEL * 4;
        this.players.forEach((player, index) => {
            const chars = player.score.toString().split('');
            const offset = align * (index + 1) - (cw * chars.length / 2) + this.CHAR_PIXEL / 2;
            chars.forEach((char, position) => {
                this._context.drawImage(this.CHARS[char | 0], offset + position * cw, 20);
            });
        });
    }

    play() {
        const ball = this.ball;
        if (ball.velocity.x === 0 && ball.velocity.y === 0) {
            ball.velocity.x = 200 * (Math.random() > .5 ? 1 : -1);
            ball.velocity.y = 200 * (Math.random() * 2 - 1);
            ball.velocity.len = this.initialSpeed;
        }
    }

    reset() {
        const ball = this.ball;
        ball.velocity.x = 0;
        ball.velocity.y = 0;
        ball.position.x = this._canvas.width / 2;
        ball.position.y = this._canvas.height / 2;
    }

    start() {
        window.requestAnimationFrame(this._frameCallback);
    }

    update(dt) {
        const canvas = this._canvas;
        const ball = this.ball;
        ball.position.x += ball.velocity.x * dt;
        ball.position.y += ball.velocity.y * dt;

        if (ball.right < 0 || ball.left > canvas.width) {
            ++this.players[ball.velocity.x < 0 | 0].score;
            this.reset();
        }

        if (ball.velocity.y < 0 && ball.top < 0 ||
            ball.velocity.y > 0 && ball.bottom > canvas.height) {
            ball.velocity.y = -ball.velocity.y;
        }

        this.players[1].position.y = ball.position.y;

        this.players.forEach(player => {
            player.update(dt);
            this.collide(player, ball);
        });

        this.draw();
    }
}

export default Game;