import { gui } from 'dat-gui';
import { vec2, vec3 } from 'gl-matrix';
import { Renderer, Scene, cameras, Model, Performance, chunks } from '../../lowww-core';
import { Box } from '../../lowww-geometries';

const {
    UBO,
    NOISE,
    FOG,
} = chunks;

class Main {
    constructor() {
        global.addEventListener('resize', this.resize, false);

        this.setup();
        this.debug();
        this.init();
        this.resize();
        this.update();
    }

    setup() {
        this.renderer = new Renderer();
        document.body.appendChild(this.renderer.domElement);

        this.renderer.domElement.addEventListener('mousemove', this.move, false);

        this.scene = new Scene();
        this.scene.fog.start = 0;
        this.scene.fog.end = 2000;
        this.scene.fog.enable = true;

        this.camera = new cameras.Perspective({ near: 0.01, far: 10000 });
        this.camera.position.set(0, 400, 1300);

        this.performance = new Performance();
        document.body.appendChild(this.performance.domElement);
    }

    debug() {
        this.settings = {
            size: 80,
            row: 24,
            col: 18,
            seed: 600,
            amplitude: 170,
            speedX: 0,
            speedY: 0,
            speedZ: -1,
        };

        this.mouse = vec2.create();
        this.eased = vec3.create();

        this.gui = new gui.GUI();
        this.gui.add(this.settings, 'seed', 0.1, 1000).onChange(() => {
            this.model.uniforms.u_seed.value = this.settings.seed;
        });
        this.gui.add(this.settings, 'amplitude', -200, 200).onChange(() => {
            this.model.uniforms.u_scale.value = this.settings.amplitude;
        });
    }

    init() {
        const vertex = `#version 300 es
            in vec3 a_position;
            in vec3 a_offset;
            in vec3 a_normal;

            ${UBO.scene()}
            ${UBO.model()}
            ${NOISE()}

            uniform float u_seed;
            uniform float u_scale;
            uniform vec3 u_speed;
            uniform vec3 u_mouse_offset;

            out vec3 v_color;

            float noise(vec3 p) {
                float n = 0.0;
                n += 1.00 * (cnoise(p * 1.0));
                //n += 0.50 * (cnoise(p * 2.0));
                //n += 0.25 * (cnoise(p * 4.0));
                return n;
            }

            float map(float value, float inMin, float inMax, float outMin, float outMax) {
                if (inMin == inMax) return 0.5;
                return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
            }

            void main() {
                vec3 mouseOff = vec3(u_mouse_offset.x / 2., 0.0, 0.0);
                float n = noise(vec3(a_offset / u_seed) + vec3(u_speed * iGlobalTime) + mouseOff);

                vec3 position = a_position + a_offset + vec3(0.0, n * u_scale, 0.0) + u_mouse_offset;
                gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
                float v = 200.0;
                v_color = vec3( map(position.y, -v, v, 0., 1.) );
            }
        `;

        const fragment = `#version 300 es
            precision highp float;
            precision highp int;

            in vec3 v_color;

            ${UBO.scene()}

            out vec4 outColor;

            void main() {
                vec4 base = vec4(v_color, 1.0);
                ${FOG.linear()}
                outColor = base;
            }
        `;

        const instances = this.settings.row * this.settings.col;
        const offsets = [];

        let initialX = (this.settings.row * this.settings.size) / -2;
        initialX += this.settings.size / 2;

        let initialZ = (this.settings.col * this.settings.size) / -2;
        initialZ += this.settings.size / 2;

        const margin = 0;
        for (let i = 0; i < instances; i++) {
            const x = initialX + (Math.floor(i / this.settings.col) * (this.settings.size + margin));
            const y = 0;
            const z = initialZ + ((i % this.settings.col) * (this.settings.size + margin));
            offsets.push(x, y, z);
        }

        // geometry
        const { size } = this.settings;
        const hsize = size / 2;

        const geometry = new Box(hsize, hsize * 4, hsize);
        this.model = new Model();
        this.model.setAttribute('a_position', 'vec3', new Float32Array(geometry.positions));
        this.model.setIndex(new Uint16Array(geometry.indices));
        this.model.setAttribute('a_normal', 'vec3', new Float32Array(geometry.normals));
        this.model.setInstanceAttribute('a_offset', 'vec3', new Float32Array(offsets), true);
        this.model.setInstanceCount(instances);
        this.model.setUniform('u_seed', 'float', this.settings.seed);
        this.model.setUniform('u_scale', 'float', this.settings.amplitude);
        this.model.setUniform('u_speed', 'vec3', [this.settings.speedX, this.settings.speedY, this.settings.speedZ]);
        this.model.setUniform('u_mouse_offset', 'vec3', this.eased);
        this.model.setShader(vertex, fragment);
        this.scene.add(this.model);
    }

    resize = () => {
        this.renderer.setSize(global.innerWidth, global.innerHeight);
        this.renderer.setRatio(global.devicePixelRatio);
    }

    move = (e) => {
        this.mouse[0] = ((e.clientX / global.innerWidth) * 2) - 1;
        this.mouse[1] = -(e.clientY / global.innerHeight);

        const [x, z] = this.mouse;
        this.model.uniforms.u_mouse_offset.value[0] = x;
        this.model.uniforms.u_mouse_offset.value[2] = z;
        // console.log(this.model.uniforms.u_speed.value[0]);
    }

    update = () => {
        // this.eased[0] -= (this.eased[0] + this.mouse[0]) / 20;
        // this.eased[2] -= (this.eased[2] + this.mouse[1]) / 20;

        this.renderer.render(this.scene, this.camera);
        this.performance.update(this.renderer);

        requestAnimationFrame(this.update);
    }
}

(() => new Main())();
