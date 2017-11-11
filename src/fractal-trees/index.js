import { Renderer, Scene, cameras, Model, chunks, GL } from '../../lowww-core';
import { Box } from '../../lowww-geometries';
import { Orbit } from '../../lowww-controls';

const {
    UBO,
} = chunks;

class Main {
    constructor() {
        global.addEventListener('resize', this.resize, false);

        this.setup();
        this.init();
        this.resize();
        this.update();
    }

    setup() {
        this.renderer = new Renderer();
        document.body.appendChild(this.renderer.domElement);

        this.scene = new Scene();
        // this.scene.fog.enable = true;

        this.camera = new cameras.Perspective();
        this.camera.position.set(0, 100, 500);

        this.controls = new Orbit(this.camera, this.renderer.domElement);
    }

    init() {
        const vertex = `#version 300 es
            in vec3 a_position;
            in vec3 a_offset;
            in vec3 a_normal;

            ${UBO.scene()}
            ${UBO.model()}

            void main() {
                gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(a_position, 1.0);
            }
        `;

        const fragment = `#version 300 es
            precision highp float;
            precision highp int;

            out vec4 outColor;

            void main() {
                outColor = vec4(1.0);
            }
        `;

        // add geometry
        let geometry = {
            positions: [],
            indices: [],
            normals: [],
            uvs: [],
        };

        for (let i = 0; i < 100; i++) {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const z = Math.random() * 100;

            geometry.positions.push(x, y, z);
        }

        geometry = new Box(10, 10, 10);

        this.model = new Model();
        this.model.setAttribute('a_position', 'vec3', new Float32Array(geometry.positions));
        this.model.setIndex(new Uint16Array(geometry.indices));
        this.model.setAttribute('a_normal', 'vec3', new Float32Array(geometry.normals));
        this.model.setShader(vertex, fragment);
        this.model.mode = 0;
        this.scene.add(this.model);
    }

    resize = () => {
        this.renderer.setSize(global.innerWidth, global.innerHeight);
        this.renderer.setRatio(global.devicePixelRatio);
    }

    update = () => {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.update);
    }
}

(() => new Main())();
