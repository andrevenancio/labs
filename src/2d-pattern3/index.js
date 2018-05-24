import dat from 'dat-gui';
import { Renderer, Scene, cameras, Model, chunks } from 'lowww-core';
import { Plane } from 'lowww-geometries';
import Base from '../base';

const { UBO } = chunks;

class Main extends Base {
    setup() {
        this.renderer = new Renderer();
        document.body.appendChild(this.renderer.domElement);

        this.scene = new Scene();
        this.scene.fog.enable = true;

        this.camera = new cameras.Orthographic();
    }

    debug() {
        this.settings = {
            width: 30,
            height: 30,
        };

        const gui = new dat.GUI();
        gui.close();

        gui.add(this.settings, 'width', 1, 50).step(1).onChange(() => {
            this.model.uniforms.u_width.value = this.settings.width;
        });

        gui.add(this.settings, 'height', 1, 50).step(1).onChange(() => {
            this.model.uniforms.u_height.value = this.settings.height;
        });
    }

    init() {
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

            #define thickness 0.01

            in vec2 v_uv;

            ${UBO.scene()}
            ${UBO.model()}

            uniform float u_width;
            uniform float u_height;
            uniform float u_ratio;

            out vec4 outColor;

            float drawLine(vec2 p, vec2 a,vec2 b) {
                p -= a, b -= a;
                float h = clamp(dot(p, b) / dot(b, b), 0.0, 1.0);
                return length(p - b * h);
            }

            float rand(vec2 co){
                return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
            }

            void main() {
                vec2 uv = v_uv;
                uv.x *= u_ratio;

                float color = 0.0;

                // divide the screen in square steps
                float stepW = 1.0 / u_width;
                float stepH = 1.0 / u_height;

                int x = int(uv.x * u_width);
                int y = int(uv.y * u_height);

                vec2 p = vec2(float(x) * stepW, float(y) * stepH);

                // draw lines
                vec2 a = p;
                vec2 b = vec2(p.x + stepW, p.y + stepH);

                if (rand(p) > 0.5) {
                    a.x = p.x + stepW;
                    b.x = p.x;
                }

                float distance = drawLine(uv, a, b);
                float line = smoothstep(thickness / 4.0, thickness / 4.0 - (0.012), distance);
                color += line;

                outColor = vec4(color);
            }
        `;

        const geometry = new Plane(1, 1);

        this.model = new Model();
        this.model.setAttribute('a_position', 'vec3', new Float32Array(geometry.positions));
        this.model.setIndex(new Uint16Array(geometry.indices));
        this.model.setAttribute('a_uv', 'vec2', new Float32Array(geometry.uvs));
        this.model.setUniform('u_ratio', 'float', global.innerWidth / global.innerHeight);
        this.model.setUniform('u_width', 'float', this.settings.width);
        this.model.setUniform('u_height', 'float', this.settings.height);
        this.model.setShader(vertex, fragment);
        this.scene.add(this.model);
    }

    resize() {
        this.model.uniforms.u_ratio.value = global.innerWidth / global.innerHeight;
        this.renderer.setSize(global.innerWidth, global.innerHeight);
        this.renderer.setRatio(global.devicePixelRatio);
    }

    update() {
        this.renderer.render(this.scene, this.camera);
    }
}

(() => new Main())();
