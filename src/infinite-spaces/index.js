import { vec2 } from 'gl-matrix';
import { Renderer, Scene, cameras, Model, chunks } from '../../lowww-core';
import { Box } from '../../lowww-geometries';

import { getUrlParam } from '../_utils/url';
import { mod } from '../_utils/math';

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

        if (getUrlParam('controls') === 'false') {
            document.body.className = 'hide';
        }
    }

    setup() {
        this.renderer = new Renderer();
        document.body.appendChild(this.renderer.domElement);

        this.scene = new Scene();
        this.scene.fog.start = 1000;
        this.scene.fog.end = 1800;
        this.scene.fog.enable = true;

        this.camera = new cameras.Perspective({ near: 0.01, far: 10000 });
        this.camera.position.set(0, 400, 1200);
    }

    debug() {
        this.settings = {
            width: 80,
            height: 150,
            depth: 80,
            row: 34,
            col: 20,
            speed: 5,
            seed: 700,
            scale: 110,
        };

        this.mouse = vec2.create();
        this.offset = vec2.create();
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
            uniform float u_speed;

            out vec3 v_color;

            float noise(vec3 p) {
                float n = 0.0;
                n += 1.00 * (cnoise(p * 1.0));
                return n;
            }

            float map(float value, float inMin, float inMax, float outMin, float outMax) {
                if (inMin == inMax) return 0.5;
                return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
            }

            void main() {
                float n = noise(vec3(a_offset / u_seed) + vec3(u_speed / 100.0 * iGlobalTime));
                vec3 position = a_position + a_offset + vec3(0.0, n * u_scale, 0.0);
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
        const { width, height, depth } = this.settings;

        for (let i = 0; i < instances; i++) {
            offsets.push(0, 0, 0);
        }

        const geometry = new Box(width / 2, height / 2, depth / 2);
        this.model = new Model();
        this.model.setAttribute('a_position', 'vec3', new Float32Array(geometry.positions));
        this.model.setIndex(new Uint16Array(geometry.indices));
        this.model.setAttribute('a_normal', 'vec3', new Float32Array(geometry.normals));
        this.model.setInstanceAttribute('a_offset', 'vec3', new Float32Array(offsets), true);
        this.model.setInstanceCount(instances);
        this.model.setUniform('u_seed', 'float', this.settings.seed);
        this.model.setUniform('u_scale', 'float', this.settings.scale);
        this.model.setUniform('u_speed', 'float', this.settings.speed);
        this.model.setShader(vertex, fragment);
        this.scene.add(this.model);

        this.renderer.domElement.addEventListener('mousemove', this.move, false);
    }

    resize = () => {
        this.renderer.setSize(global.innerWidth, global.innerHeight);
        this.renderer.setRatio(global.devicePixelRatio);

        this.initialX = (this.settings.row * this.settings.width) / -2;
        this.initialX += this.settings.width / 2;

        this.initialZ = (this.settings.col * this.settings.depth) / -2;
        this.initialZ += this.settings.depth / 2;

        this.maxWidth = this.settings.row * this.settings.width;
        this.maxDepth = this.settings.col * this.settings.depth;
    }

    move = (e) => {
        this.mouse[0] = ((e.clientX / global.innerWidth) * 2) - 1;
        this.mouse[1] = -((e.clientY / global.innerHeight) * 2) + 1;
    }

    updateOffsets = () => {
        this.offset[0] -= this.mouse[0] * 10;
        this.offset[1] += this.mouse[1] * 10;

        this.model.dirty.attributes = true;

        this.offset[1] += this.settings.speed;
        let id = 0;
        let x;
        let z;
        const p = this.model.attributes.a_offset.value;
        for (let i = 0; i < p.length; i += 3) {
            x = Math.floor(id / this.settings.col) * this.settings.width;
            z = (id % this.settings.col) * this.settings.depth;

            p[i + 0] = this.initialX + mod(x + this.offset[0], this.maxWidth);
            p[i + 1] = 0;
            p[i + 2] = this.initialZ + mod(z + this.offset[1], this.maxDepth);

            id++;
        }
    }

    update = () => {
        this.updateOffsets();
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.update);
    }
}

(() => new Main())();
