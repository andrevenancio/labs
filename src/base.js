import { getUrlParam } from './_utils/url';

class Base {
    constructor() {
        const ratio = global.devicePixelRatio;
        this.width = global.innerWidth * ratio;
        this.height = global.innerHeight * ratio;

        global.addEventListener('resize', this.handleResize, false);

        this.setup();
        this.debug();
        this.init();

        this.handleResize();
        this.handleUpdate();

        if (getUrlParam('controls') === 'false') {
            document.body.className = 'hide';
        }
    }

    setup() {}
    debug() {}
    init() {}
    resize() {}
    update() {}

    handleResize = () => {
        this.resize();
    }

    handleUpdate = () => {
        this.update();
        requestAnimationFrame(this.handleUpdate);
    }
}

export default Base;
