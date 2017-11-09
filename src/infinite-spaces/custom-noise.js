import SimplexNoise from './simplex-noise';

class CustomNoise {
    constructor() {
        this.size = 16;

        this.noise = new SimplexNoise();

        this.domElement = document.createElement('canvas');
        this.domElement.width = this.size;
        this.domElement.height = this.size;
        this.domElement.style.position = 'absolute';
        this.domElement.style.top = '100px';
        this.domElement.style.border = '1px solid white';
        document.body.appendChild(this.domElement);

        this.context = this.domElement.getContext('2d');

        const { width, height } = this.domElement;
        this.imageData = this.context.getImageData(0, 0, width, height);
        this.initialTime = Date.now();
        this.elapsedTime = 0;
    }

    getNoise(x, y, time) {
        return this.noise.noise3D(x, y, time);
    }

    update() {
        this.elapsedTime = (Date.now() - this.initialTime) / 1000;

        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                const n = this.getNoise(x / this.size, y / this.size, this.elapsedTime);
                const pixel = ((x + (y * this.size)) * 4);
                this.imageData.data[pixel + 0] = n * 255;
                this.imageData.data[pixel + 1] = n * 255;
                this.imageData.data[pixel + 2] = n * 255;
                this.imageData.data[pixel + 3] = 255;
            }
        }
        this.context.putImageData(this.imageData, 0, 0);
    }
}
export default CustomNoise;
