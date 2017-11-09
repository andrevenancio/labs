import { gui } from 'dat-gui';
import { vec2 } from 'gl-matrix';
import { Renderer, Scene, cameras, Model, Performance, chunks } from '../../lowww-core';
import { Box, Icosahedron } from '../../lowww-geometries';
import { Orbit } from '../../lowww-controls';

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

        this.scene = new Scene();
        this.scene.fog.start = 1;
        this.scene.fog.end = 2000;
        this.scene.fog.enable = true;

        this.camera = new cameras.Perspective({ fov: 35, near: 1, far: 10000 });
        this.camera.position.set(0, 350, 1400);

        this.controls = new Orbit(this.camera, this.renderer.domElement);

        this.performance = new Performance();
        document.body.appendChild(this.performance.domElement);
    }

    debug() {
        this.settings = {
            width: 10,
            height: 10,
            depth: 10,
            row: 500,
            col: 500,
            seed: 500,
            amplitude: 440,
            speedX: 0,
            speedY: 0,
            speedZ: 0,
        };

        this.mouse = vec2.create();

        this.gui = new gui.GUI();
        this.gui.add(this.settings, 'seed').onChange(() => {
            this.model.uniforms.u_seed.value = this.settings.seed;
        });
        this.gui.add(this.settings, 'amplitude').onChange(() => {
            this.model.uniforms.u_scale.value = this.settings.amplitude;
        });
        this.gui.add(this.settings, 'speedX', -1, 1).onChange(() => {
            this.model.uniforms.u_speed.value = [
                this.settings.speedX,
                this.settings.speedY,
                this.settings.speedZ,
            ];
        });
        this.gui.add(this.settings, 'speedY', -1, 1).onChange(() => {
            this.model.uniforms.u_speed.value = [
                this.settings.speedX,
                this.settings.speedY,
                this.settings.speedZ,
            ];
        });
        this.gui.add(this.settings, 'speedZ', -1, 1).onChange(() => {
            this.model.uniforms.u_speed.value = [
                this.settings.speedX,
                this.settings.speedY,
                this.settings.speedZ,
            ];
        });
    }

    init() {
        const vertex = `#version 300 es
            in vec3 a_position;
            in vec3 a_offset;
            in vec3 a_normal;
            in vec3 a_color;

            ${UBO.scene()}
            ${UBO.model()}
            ${NOISE()}

            uniform float u_seed;
            uniform float u_scale;
            uniform vec3 u_speed;

            out vec4 v_color;

            // float turbulence( vec3 p ) {
            //     float w = 100.0;
            //     float t = -.5;
            //     for (float f = 1.0 ; f <= 10.0 ; f++ ){
            //         float power = pow( 2.0, f );
            //         t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
            //     }
            //     return t;
            // }

            void main() {
                vec3 perInstance = vec3(float(gl_InstanceID));

                vec3 p = vec3(a_offset); // DISTORTS vec3(a_position + a_offset);
                vec3 p1 = vec3(p / u_seed) + vec3(u_speed * iGlobalTime);
                float n = 0.0;
                n += 1.0 * (cnoise(p1 * 1.0));
                n += 0.5 * (cnoise(p1 * 2.0));
                vec3 position = a_position + a_offset;
                position.y += n * u_scale;

                gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
                v_color = vec4(vec3(n * 2.0), 1.0); //vec4(a_color * vec3(n), 1.0);
            }
        `;

        const fragment = `#version 300 es
            precision highp float;
            precision highp int;

            in vec4 v_color;

            ${UBO.scene()}

            out vec4 outColor;

            void main() {
                vec4 base = v_color + vec4(vec3(0.5), 1.0);
                ${FOG.linear()}
                outColor = base;
            }
        `;

        const instances = this.settings.row * this.settings.col;
        const offsets = [];
        const colors = [];

        let initialX = (this.settings.row * this.settings.width) / -2;
        initialX += this.settings.width / 2;

        let initialZ = (this.settings.col * this.settings.depth) / -2;
        initialZ += this.settings.depth / 2;

        for (let i = 0; i < instances; i++) {
            const x = initialX + (Math.floor(i / this.settings.col) * this.settings.width);
            const y = 0;
            const z = initialZ + ((i % this.settings.col) * this.settings.depth);
            offsets.push(x, y, z);
            colors.push(Math.random(), Math.random(), Math.random());
        }

        // geometry
        const { width, height, depth } = this.settings;
        let geometry = new Box(width / 2, height / 2, depth / 2);
        geometry = new Icosahedron(width / 2, 0);
        this.model = new Model();
        this.model.setAttribute('a_position', 'vec3', new Float32Array(geometry.positions));
        this.model.setIndex(new Uint16Array(geometry.indices));
        this.model.setAttribute('a_normal', 'vec3', new Float32Array(geometry.normals));
        this.model.setInstanceAttribute('a_offset', 'vec3', new Float32Array(offsets), true);
        this.model.setInstanceAttribute('a_color', 'vec3', new Float32Array(colors), true);
        this.model.setInstanceCount(instances);
        this.model.setUniform('u_seed', 'float', this.settings.seed);
        this.model.setUniform('u_scale', 'float', this.settings.amplitude);
        this.model.setUniform('u_speed', 'vec3', [this.settings.speedX, this.settings.speedY, this.settings.speedZ]);
        this.model.setShader(vertex, fragment);
        this.scene.add(this.model);
    }

    resize = () => {
        this.renderer.setSize(global.innerWidth, global.innerHeight);
        this.renderer.setRatio(global.devicePixelRatio);
    }

    update = () => {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        this.performance.update(this.renderer);

        requestAnimationFrame(this.update);
    }
}

(() => new Main())();
