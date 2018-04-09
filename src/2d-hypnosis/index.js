import dat from 'dat-gui';
import { Renderer, Scene, cameras, Model, chunks } from '../../lowww-core';
import { Plane } from '../../lowww-geometries';

const { UBO } = chunks;

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
        this.scene.fog.enable = true;

        this.camera = new cameras.Orthographic();
    }

    init() {
        this.settings = {
            frequency: 10,
            speed: 2,
            offset: 5,
        };

        const gui = new dat.GUI();
        gui.close();

        gui.add(this.settings, 'frequency', 0, 100).onChange(() => {
            this.model.uniforms.u_frequency.value = this.settings.frequency;
        });

        gui.add(this.settings, 'speed', 0, 10).onChange(() => {
            this.model.uniforms.u_speed.value = this.settings.speed;
        });

        gui.add(this.settings, 'offset', 0, 10).onChange(() => {
            this.model.uniforms.u_offset.value = this.settings.offset;
        });

        const vertex = `#version 300 es
            in vec3 a_position;
            in vec3 a_normal;
            in vec2 a_uv;

            ${UBO.scene()}
            ${UBO.model()}

            out vec2 v_uv;

            void main() {
                v_uv = a_uv;
                gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(a_position, 1.0);
            }
        `;

        const fragment = `#version 300 es
            precision highp float;
            precision highp int;

            in vec2 v_uv;

            ${UBO.scene()}
            ${UBO.model()}

            uniform float u_ratio;
            uniform float u_frequency;
            uniform float u_speed;
            uniform float u_offset;

            out vec4 outColor;

            float circle(vec2 uv, vec2 offset) {
                float d = length(uv - offset);
                float c = cos(d * u_frequency - iGlobalTime * u_speed);
                c *= 200.0;

                return c;
            }

            void main() {
                vec2 uv = v_uv * 2.0 - 1.0;
                uv.x *= u_ratio;

                float i0 = circle(uv, vec2(0.0));
                float i1 = circle(uv, vec2(u_offset, 0.0));
                float i2 = circle(uv, vec2(0.0, u_offset));
                float i3 = circle(uv, vec2(-u_offset, 0.0));
                float i4 = circle(uv, vec2(0.0, -u_offset));

                float c = i0 + i1 + i2 + i3 + i4;

                outColor = vec4(vec3(c), 1.0);
            }
        `;

        const geometry = new Plane(1, 1);

        this.model = new Model();
        this.model.setAttribute('a_position', 'vec3', new Float32Array(geometry.positions));
        this.model.setIndex(new Uint16Array(geometry.indices));
        this.model.setAttribute('a_uv', 'vec2', new Float32Array(geometry.uvs));
        this.model.setUniform('u_ratio', 'float', global.innerWidth / global.innerHeight);
        this.model.setUniform('u_frequency', 'float', this.settings.frequency);
        this.model.setUniform('u_speed', 'float', this.settings.speed);
        this.model.setUniform('u_offset', 'float', this.settings.offset);
        this.model.setShader(vertex, fragment);
        this.scene.add(this.model);
    }

    resize = () => {
        this.model.uniforms.u_ratio.value = global.innerWidth / global.innerHeight;
        this.renderer.setSize(global.innerWidth, global.innerHeight);
        this.renderer.setRatio(global.devicePixelRatio);
    }

    update = () => {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.update);
    }
}

(() => new Main())();
