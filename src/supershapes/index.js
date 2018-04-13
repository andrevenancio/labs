import dat from 'dat-gui';
import { Renderer, Scene, cameras, Model, chunks } from '../../lowww-core';
import { Icosahedron } from '../../lowww-geometries';
import { Orbit } from '../../lowww-controls';

import { getUrlParam } from '../_utils/url';

const { UBO, FOG, LIGHT } = chunks;

class Main {
    constructor() {
        global.addEventListener('resize', this.resize, false);

        this.setup();
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
        this.scene.fog.enable = true;

        this.camera = new cameras.Perspective();
        this.camera.position.set(0, 100, 300);

        this.controls = new Orbit(this.camera, this.renderer.domElement);
    }

    init() {
        this.settings = {
            a: {
                n1: 0.20,
                n2: 1.7,
                n3: 1.7,
                m: 7,
                a: 1,
                b: 1,
            },
            b: {
                n1: 0.2,
                n2: 1.7,
                n3: 1.7,
                m: 7,
                a: 1,
                b: 1,
            },
        };

        const gui = new dat.GUI();
        gui.close();

        const a = gui.addFolder('a');
        a.open();
        a.add(this.settings.a, 'n1', 0, 2).onChange(() => {
            this.model.uniforms.n1_1.value = this.settings.a.n1;
        });
        a.add(this.settings.a, 'n2', 0, 10).onChange(() => {
            this.model.uniforms.n2_1.value = this.settings.a.n2;
        });
        a.add(this.settings.a, 'n3', 0, 10).onChange(() => {
            this.model.uniforms.n3_1.value = this.settings.a.n3;
        });
        a.add(this.settings.a, 'm', 0, 10).onChange(() => {
            this.model.uniforms.m_1.value = this.settings.a.m;
        });
        a.add(this.settings.a, 'a', 1, 2).onChange(() => {
            this.model.uniforms.a_1.value = this.settings.a.a;
        });
        a.add(this.settings.a, 'b', 1, 2).onChange(() => {
            this.model.uniforms.b_1.value = this.settings.a.b;
        });

        const b = gui.addFolder('b');
        b.open();
        b.add(this.settings.b, 'n1', 0, 2).onChange(() => {
            this.model.uniforms.n1_2.value = this.settings.b.n1;
        });
        b.add(this.settings.b, 'n2', 0, 10).onChange(() => {
            this.model.uniforms.n2_2.value = this.settings.b.n2;
        });
        b.add(this.settings.b, 'n3', 0, 10).onChange(() => {
            this.model.uniforms.n3_2.value = this.settings.b.n3;
        });
        b.add(this.settings.b, 'm', 0, 10).onChange(() => {
            this.model.uniforms.m_2.value = this.settings.b.m;
        });
        b.add(this.settings.b, 'a', 1, 2).onChange(() => {
            this.model.uniforms.a_2.value = this.settings.b.a;
        });
        b.add(this.settings.b, 'b', 1, 2).onChange(() => {
            this.model.uniforms.b_2.value = this.settings.b.b;
        });
        const vertex = `#version 300 es
            in vec3 a_position;
            in vec3 a_normal;
            in vec2 a_uv;

            ${UBO.scene()}
            ${UBO.model()}

            uniform float n1_1;
            uniform float n2_1;
            uniform float n3_1;
            uniform float m_1;
            uniform float a_1;
            uniform float b_1;

            uniform float n1_2;
            uniform float n2_2;
            uniform float n3_2;
            uniform float m_2;
            uniform float a_2;
            uniform float b_2;

            out vec3 fragVertexEc;
            out vec2 v_uv;
            out vec3 v_normal;

            float supershape(float angle, float n1, float n2, float n3, float m, float a, float b) {
                float t1 = abs(cos(angle * m * 0.25) / a);
                float t2 = abs(sin(angle * m * 0.25) / b);
                float t3 = pow(t1, n2) + pow(t2, n3);
                return abs(pow(t3, - 1.0 / n1));
            }

            vec3 superPositionForPosition(vec3 p) {
                float r = length(p);

                float lon = atan(p.y, p.x);
                float lat = r == 0.0 ? 0.0 : asin(p.z / r);

                float superRadiusPhi = supershape(lon, n1_1, n2_1, n3_1, m_1, a_1, b_1);
                float superRadiusTheta = supershape(lat, n1_2, n2_2, n3_2, m_2, a_2, b_2);

                p.x = r * superRadiusPhi * cos(lon) * superRadiusTheta * cos(lat);
                p.y = r * superRadiusPhi * sin(lon) * superRadiusTheta * cos(lat);
                p.z = r * superRadiusTheta * sin(lat);

                return p;
            }

            void main() {
                vec4 position = projectionMatrix * viewMatrix * modelMatrix * vec4(superPositionForPosition(a_position), 1.0);
                gl_Position = position;
                fragVertexEc = position.xyz;
                v_uv = a_uv;
                v_normal = normalize(mat3(normalMatrix) * a_normal);
            }
        `;

        const fragment = `#version 300 es
            precision highp float;
            precision highp int;

            in vec3 fragVertexEc;
            in vec2 v_uv;
            in vec3 v_normal;

            ${UBO.scene()}
            ${UBO.model()}
            ${UBO.lights()}

            out vec4 outColor;

            void main() {
                vec3 v_normal = normalize(cross(dFdx(fragVertexEc), dFdy(fragVertexEc)));

                vec4 base = vec4(v_uv, 0.0, 0.0);
                base += vec4(vec3(1.0), 1.0);

                ${LIGHT.factory()}
                ${FOG.linear()}

                outColor = base;
            }
        `;

        const geometry = new Icosahedron(20, 3);

        this.model = new Model();
        this.model.setAttribute('a_position', 'vec3', new Float32Array(geometry.positions));
        this.model.setIndex(new Uint16Array(geometry.indices));
        this.model.setAttribute('a_normal', 'vec3', new Float32Array(geometry.normals));
        this.model.setUniform('n1_1', 'float', this.settings.a.n1);
        this.model.setUniform('n2_1', 'float', this.settings.a.n2);
        this.model.setUniform('n3_1', 'float', this.settings.a.n3);
        this.model.setUniform('m_1', 'float', this.settings.a.m);
        this.model.setUniform('a_1', 'float', this.settings.a.a);
        this.model.setUniform('b_1', 'float', this.settings.a.b);
        this.model.setUniform('n1_2', 'float', this.settings.b.n1);
        this.model.setUniform('n2_2', 'float', this.settings.b.n2);
        this.model.setUniform('n3_2', 'float', this.settings.b.n3);
        this.model.setUniform('m_2', 'float', this.settings.b.m);
        this.model.setUniform('a_2', 'float', this.settings.b.a);
        this.model.setUniform('b_2', 'float', this.settings.b.b);
        this.model.setShader(vertex, fragment);
        this.scene.add(this.model);
    }

    resize = () => {
        this.renderer.setSize(global.innerWidth, global.innerHeight);
        this.renderer.setRatio(global.devicePixelRatio);
    }

    update = () => {
        this.model.rotation.x += 0.01;
        this.model.rotation.y += 0.02;
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.update);
    }
}

(() => new Main())();
