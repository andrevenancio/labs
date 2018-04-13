import QuadTree, { Rectangle, Point } from './quadtree';

import { getUrlParam } from '../_utils/url';

class Main {
    constructor() {
        global.addEventListener('resize', this.resize, false);

        this.setup();
        this.resize();
        this.init();
        this.update();

        if (getUrlParam('controls') === 'false') {
            document.body.className = 'hide';
        }
    }

    setup() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);

        this.context = this.canvas.getContext('2d');

        global.addEventListener('resize', this.resize, false);

        this.range = new Rectangle(0, 0, 200, 200);

        global.addEventListener('mousemove', this.handleMove, false);
        global.addEventListener('mousedown', this.handleDown, false);
    }

    random(min, max) {
        return (Math.random() * (max - min)) + min;
    }

    init() {
        const boundary = new Rectangle(
            0,
            0,
            this.width,
            this.height,
        );
        this.quadtree = new QuadTree(boundary);

        for (let i = 0; i < 256; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;

            const point = new Point(x, y);
            this.quadtree.insert(point);
        }
    }

    handleMove = (e) => {
        const ratio = global.devicePixelRatio;
        this.range.x = (e.clientX - 50) * ratio;
        this.range.y = (e.clientY - 50) * ratio;
    }

    handleDown = (e) => {
        const ratio = global.devicePixelRatio;
        const x = e.clientX * ratio;
        const y = e.clientY * ratio;

        const point = new Point(x, y);
        this.quadtree.insert(point);
    }

    resize = () => {
        const ratio = global.devicePixelRatio;
        this.width = 400 * ratio; // global.innerWidth * ratio;
        this.height = 400 * ratio; // global.innerHeight * ratio;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = `${this.width / ratio}px`;
        this.canvas.style.height = `${this.height / ratio}px`;
    }

    update = () => {
        this.context.clearRect(0, 0, this.width, this.height);

        this.quadtree.debug(this.context);

        // grab from area
        this.context.beginPath();
        this.context.strokeStyle = '#0f0';
        this.context.rect(this.range.x, this.range.y, this.range.width, this.range.height);
        this.context.stroke();
        this.context.closePath();

        const selected = this.quadtree.query(this.range);
        for (let i = 0; i < selected.length; i++) {
            this.context.beginPath();
            this.context.fillStyle = '#0f0';
            this.context.arc(selected[i].x, selected[i].y, 2, 0, 2 * Math.PI);
            this.context.fill();
            this.context.closePath();
        }

        requestAnimationFrame(this.update);
    }
}

(() => new Main())();
