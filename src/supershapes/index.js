import dat from 'dat-gui';
import { Renderer, Scene, cameras, Model, Performance, chunks } from '../../lowww-core';
import { Icosahedron } from '../../lowww-geometries';
import { Orbit } from '../../lowww-controls';

const { UBO, FOG, LIGHT } = chunks;

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

        this.camera = new cameras.Perspective();
        this.camera.position.set(0, 100, 300);

        this.controls = new Orbit(this.camera, this.renderer.domElement);

        this.performance = new Performance();
        document.body.appendChild(this.performance.domElement);
    }

    init() {
        this.settings = {
            n1_1: 0.20,
            n2_1: 1.7,
            n3_1: 1.7,
            m_1: 7,
            a_1: 1,
            b_1: 1,
            n1_2: 0.2,
            n2_2: 1.7,
            n3_2: 1.7,
            m_2: 7,
            a_2: 1,
            b_2: 1,
        };

        const gui = new dat.GUI();

        gui.add(this.settings, 'n1_1', 0, 2).onChange(() => {
            this.model.uniforms.n1_1.value = this.settings.n1_1;
        });
        gui.add(this.settings, 'n2_1', 0, 10).onChange(() => {
            this.model.uniforms.n2_1.value = this.settings.n2_1;
        });
        gui.add(this.settings, 'n3_1', 0, 10).onChange(() => {
            this.model.uniforms.n3_1.value = this.settings.n3_1;
        });
        gui.add(this.settings, 'm_1', 0, 10).onChange(() => {
            this.model.uniforms.m_1.value = this.settings.m_1;
        });
        gui.add(this.settings, 'a_1', 1, 2).onChange(() => {
            this.model.uniforms.a_1.value = this.settings.a_1;
        });
        gui.add(this.settings, 'b_1', 1, 2).onChange(() => {
            this.model.uniforms.b_1.value = this.settings.b_1;
        });

        gui.add(this.settings, 'n1_2', 0, 2).onChange(() => {
            this.model.uniforms.n1_2.value = this.settings.n1_2;
        });
        gui.add(this.settings, 'n2_2', 0, 10).onChange(() => {
            this.model.uniforms.n2_2.value = this.settings.n2_2;
        });
        gui.add(this.settings, 'n3_2', 0, 10).onChange(() => {
            this.model.uniforms.n3_2.value = this.settings.n3_2;
        });
        gui.add(this.settings, 'm_2', 0, 10).onChange(() => {
            this.model.uniforms.m_2.value = this.settings.m_2;
        });
        gui.add(this.settings, 'a_2', 1, 2).onChange(() => {
            this.model.uniforms.a_2.value = this.settings.a_2;
        });
        gui.add(this.settings, 'b_2', 1, 2).onChange(() => {
            this.model.uniforms.b_2.value = this.settings.b_2;
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
                vec4 position = projectionMatrix * viewMatrix * modelMatrix * vec4(superPositionForPosition(a_position), 1.0);;
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
        this.model.setUniform('n1_1', 'float', this.settings.n1_1);
        this.model.setUniform('n2_1', 'float', this.settings.n2_1);
        this.model.setUniform('n3_1', 'float', this.settings.n3_1);
        this.model.setUniform('m_1', 'float', this.settings.m_1);
        this.model.setUniform('a_1', 'float', this.settings.a_1);
        this.model.setUniform('b_1', 'float', this.settings.b_1);
        this.model.setUniform('n1_2', 'float', this.settings.n1_2);
        this.model.setUniform('n2_2', 'float', this.settings.n2_2);
        this.model.setUniform('n3_2', 'float', this.settings.n3_2);
        this.model.setUniform('m_2', 'float', this.settings.m_2);
        this.model.setUniform('a_2', 'float', this.settings.a_2);
        this.model.setUniform('b_2', 'float', this.settings.b_2);
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
        this.performance.update(this.renderer);
        requestAnimationFrame(this.update);
    }
}

(() => new Main())();
