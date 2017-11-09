import { gui } from 'dat-gui';
import { Renderer, Scene, cameras, Model, chunks } from '../../lowww-core';
import { Icosahedron, Dodecahedron } from '../../lowww-geometries';
import { Orbit } from '../../lowww-controls';

const {
    UBO,
    NOISE,
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
        this.camera = new cameras.Perspective();
        this.camera.position.set(0, 0, 500);

        this.controls = new Orbit(this.camera, this.renderer.domElement);
    }

    init() {
        this.settings = {
            scale: 0,
        };

        this.gui = new gui.GUI();
        this.gui.add(this.settings, 'scale', 0, 30);

        const vertex = `#version 300 es
            in vec3 a_position;
            in vec3 a_normal;
            in vec2 a_uv;

            ${UBO.scene()}
            ${UBO.model()}

            uniform float u_scale;

            ${NOISE()}

            out vec3 v_normal;
            out vec3 v_flat_normal;

            void main() {
                float f = u_scale * pnoise( a_normal + iGlobalTime, vec3( u_scale ) );
                vec3 pos = a_position + f * a_normal;
                vec4 position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
                gl_Position = position;
                v_normal = normalize(mat3(normalMatrix) * a_normal);
                v_flat_normal = position.xyz;
            }
        `;

        const fragment = `#version 300 es
            precision highp float;
            precision highp int;

            ${UBO.scene()}
            ${UBO.model()}

            in vec3 v_normal;
            in vec3 v_flat_normal;

            out vec4 outColor;

            void main() {
                vec3 v_normal = normalize(cross(dFdx(v_flat_normal), dFdy(v_flat_normal)));
                outColor = vec4(v_normal, 1.0);
            }
        `;

        const size = 100;
        let geometry = new Dodecahedron(size, 3);
        geometry = new Icosahedron(size, 3);

        this.model = new Model();
        this.model.setAttribute('a_position', 'vec3', new Float32Array(geometry.positions));
        this.model.setIndex(new Uint16Array(geometry.indices));
        this.model.setAttribute('a_normal', 'vec3', new Float32Array(geometry.normals));
        this.model.setAttribute('a_uv', 'vec2', new Float32Array(geometry.uvs));
        this.model.setUniform('u_scale', 'float', this.settings.scale);
        this.model.setShader(vertex, fragment);
        this.scene.add(this.model);
    }

    resize = () => {
        this.renderer.setSize(global.innerWidth, global.innerHeight);
        this.renderer.setRatio(global.devicePixelRatio);
    }

    update = () => {
        this.controls.update();
        this.model.uniforms.u_scale.value = this.settings.scale;
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.update);
    }
}

(() => new Main())();
