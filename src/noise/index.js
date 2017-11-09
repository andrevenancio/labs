import { gui } from 'dat-gui';
import { Renderer, Scene, cameras, Model, chunks, Texture } from '../../lowww-core';
import { Octahedron } from '../../lowww-geometries';
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

            out vec2 Vertex_UV;
            out vec4 Vertex_Normal;
            out vec4 Vertex_LightDir;
            out vec4 Vertex_EyeVec;
            out vec3 v_noise;

            void main() {
                float f = u_scale * pnoise( a_normal + iGlobalTime, vec3( u_scale ) );
                vec3 pos = a_position + f * a_normal;
                vec4 position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
                gl_Position = position;

                v_noise = vec3(a_position + f * a_normal);

                // new stuff
                Vertex_UV = a_uv;
                Vertex_Normal = viewMatrix * modelMatrix * vec4(a_normal, 1.0);
                vec4 view_vertex = viewMatrix * modelMatrix * vec4(pos, 1.0);
                Vertex_LightDir = vec4(0.0, 0.25, 0.5, 1.0) - view_vertex;
                Vertex_EyeVec = -view_vertex;
            }
        `;

        const fragment = `#version 300 es
            precision highp float;
            precision highp int;

            ${UBO.scene()}
            ${UBO.model()}

            in vec2 Vertex_UV;
            in vec4 Vertex_Normal;
            in vec4 Vertex_LightDir;
            in vec4 Vertex_EyeVec;
            in vec3 v_noise;

            uniform sampler2D u_map;

            out vec4 outColor;

            // http://www.thetenthplanet.de/archives/1180
            mat3 cotangent_frame(vec3 N, vec3 p, vec2 uv) {
                // get edge vectors of the pixel triangle
                vec3 dp1 = dFdx( p );
                vec3 dp2 = dFdy( p );
                vec2 duv1 = dFdx( uv );
                vec2 duv2 = dFdy( uv );

                // solve the linear system
                vec3 dp2perp = cross( dp2, N );
                vec3 dp1perp = cross( N, dp1 );
                vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;
                vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;

                // construct a scale-invariant frame
                float invmax = inversesqrt( max( dot(T,T), dot(B,B) ) );
                return mat3( T * invmax, B * invmax, N );
            }

            vec3 perturb_normal( vec3 N, vec3 V, vec2 texcoord ) {
                // assume N, the interpolated vertex normal and
                // V, the view vector (vertex to eye)
               vec3 map = v_noise;
               map = map * 255./127. - 128./127.;
                mat3 TBN = cotangent_frame(N, -V, texcoord);
                return normalize(TBN * map);
            }

            void main() {
                vec2 uv = Vertex_UV.xy;

                vec3 N = normalize(Vertex_Normal.xyz);
                vec3 L = normalize(Vertex_LightDir.xyz);
                vec3 V = normalize(Vertex_EyeVec.xyz);
                vec3 PN = perturb_normal(N, V, uv);

                vec4 tex01_color = vec4(1.0); // texture(tex0, uv).rgba;
                vec4 final_color = vec4(0.2, 0.15, 0.15, 1.0) * tex01_color;

                float lambertTerm = dot(PN, L);
                if (lambertTerm > 0.0) {
                    vec4 light_diffuse = vec4(vec3(0.0), 1.0);
                    vec4 material_diffuse = vec4(vec3(0.0, 1.0, 1.0), 1.0);
                    vec4 light_specular = vec4(vec3(0.3, 0.2, 0.9), 1.0);
                    vec4 material_specular = vec4(vec3(0.2), 1.0);

                    float material_shininess = 0.4;

                    final_color += light_diffuse * material_diffuse * lambertTerm * tex01_color;

                    vec3 E = normalize(Vertex_EyeVec.xyz);
                    vec3 R = reflect(-L, PN);
                    float specular = pow( max(dot(R, E), 0.0), material_shininess);
                    final_color += light_specular * material_specular * specular;
                }
                outColor.rgb = final_color.rgb;
                //outColor.rgb = PN.rgb;
                //outColor.rgb = N.rgb;
                outColor.a = 1.0;

                outColor = mix(texture(u_map, Vertex_UV), vec4(1.0), 0.9);
            }
        `;

        const map = new Texture({ transparent: true });
        map.fromImage('noise.png');

        const size = 100;
        const geometry = new Octahedron(size, 3);

        this.model = new Model();
        this.model.setAttribute('a_position', 'vec3', new Float32Array(geometry.positions));
        this.model.setIndex(new Uint16Array(geometry.indices));
        this.model.setAttribute('a_normal', 'vec3', new Float32Array(geometry.normals));
        this.model.setAttribute('a_uv', 'vec2', new Float32Array(geometry.uvs));
        this.model.setUniform('u_scale', 'float', this.settings.scale);
        this.model.setUniform('u_map', 'sampler2D', map.texture);
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
