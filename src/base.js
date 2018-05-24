/* global CCapture */
import { getUrlParam } from './_lib/utils/url';

class Base {
    constructor() {
        this.ratio = global.devicePixelRatio;
        this.width = global.innerWidth * this.ratio;
        this.height = global.innerHeight * this.ratio;

        this.startTime = 0;

        global.addEventListener('resize', this.handleResize, false);

        this.capture();

        this.setup();
        this.debug();
        this.init();

        this.handleResize();
        this.handleUpdate();
    }

    capture() {
        this.captureMode = getUrlParam('controls') === 'false' && getUrlParam('capture') === 'true';
        if (this.captureMode) {
            document.body.className = 'hide';
            this.width = 420;
            this.height = 360;

            this.loopDuration = 1;
            this.capturing = false;

            this.cc = new CCapture({
                verbose: false,
                display: true,
                framerate: 60,
                motionBlurFrames: (960 / 60),
                quality: 99,
                format: 'gif',
                timeLimit: this.loopDuration,
                frameLimit: 0,
                autoSaveTime: 0,
                workersPath: 'js/',
            });

            setTimeout(() => {
                this.capturing = true;
                this.cc.start();
                this.startTime = global.performance.now();
            });
        }
    }

    setup() {}
    debug() {}
    init() {}
    resize() {}
    update() {}

    handleResize = () => {
        if (!this.captureMode) {
            this.resize();
        }
    }

    handleUpdate = () => {
        this.update(this.startTime);
        if (this.capturing) {
            console.log('capture');
            this.cc.capture(this.renderer.domElement);
        }
        requestAnimationFrame(this.handleUpdate);
    }
}

export default Base;
