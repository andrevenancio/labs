import Base from '../base';
import QuadTree, { Rectangle, Point } from './quadtree';
import { random } from '../_utils/math';

const VELOCITY = 4;
let quadtree;
let point;
class Main extends Base {
    setup() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);

        this.context = this.canvas.getContext('2d');
    }

    debug() {
        this.settings = {
            particles: 100,
            distance: 300,
        };
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.settings.particles; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const vx = random(-VELOCITY, VELOCITY);
            const vy = random(-VELOCITY, VELOCITY);
            this.particles.push({
                x,
                y,
                vx,
                vy,
            });
        }
    }

    resize() {
        const ratio = global.devicePixelRatio;
        this.width = global.innerWidth * ratio;
        this.height = global.innerHeight * ratio;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = `${this.width / ratio}px`;
        this.canvas.style.height = `${this.height / ratio}px`;

        const max = Math.max(this.width, this.height);
        this.boundary = new Rectangle(0, 0, max, max);
    }

    update() {
        this.context.clearRect(0, 0, this.width, this.height);

        // move points
        for (let i = 0; i < this.particles.length; i++) {
            const current = this.particles[i];
            if (current.x > this.width) {
                current.vx = -VELOCITY;
            } else if (current.x < 0) {
                current.vx = VELOCITY;
            } else {
                current.vx *= 1;
            }

            if (current.y >= this.height) {
                current.vy = -VELOCITY;
            } else if (current.y <= 0) {
                current.vy = VELOCITY;
            } else {
                current.vy *= 1;
            }

            current.x += current.vx;
            current.y += current.vy;

            this.context.beginPath();
            this.context.fillStyle = '#fff';
            this.context.arc(current.x, current.y, 2, 0, 2 * Math.PI);
            this.context.fill();
            this.context.closePath();
        }

        // add points to quad
        quadtree = new QuadTree(this.boundary, 4);
        for (let i = 0; i < this.particles.length; i++) {
            point = new Point(
                this.particles[i].x,
                this.particles[i].y,
            );
            quadtree.insert(point);
        }

        // draw rectangles
        quadtree.borders(this.context);

        for (let i = 0; i < this.particles.length - 1; i++) {
            const width = this.settings.distance;
            const height = this.settings.distance;
            const x = this.particles[i].x - (width / 2);
            const y = this.particles[i].y - (height / 2);

            const bounds = new Rectangle(x, y, width, height);
            const selected = quadtree.query(bounds);
            for (let j = 0; j < selected.length; j++) {
                this.connect(this.particles[i], selected[j]);
            }
        }
    }

    connect(partA, partB) {
        const dx = partB.x - partA.x;
        const dy = partB.y - partA.y;

        const dist = Math.sqrt((dx * dx) + (dy * dy));

        if (dist < this.settings.distance) {
            this.context.beginPath();
            this.context.strokeStyle = '#999';
            this.context.lineWidth = dist / this.settings.distance;
            this.context.moveTo(partA.x, partA.y);
            this.context.lineTo(partB.x, partB.y);
            this.context.stroke();
            this.context.closePath();

            const ax = dx * 0.0001;
            const ay = dy * 0.0001;

            partA.vx += ax;
            partA.vy += ay;
            partB.vx -= ax;
            partB.vy -= ay;
        }
    }
}

(() => new Main())();
