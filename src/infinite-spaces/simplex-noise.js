/* eslint-disable no-lonely-if */
// 2D
const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

// 3D
const F3 = 1.0 / 3.0;
const G3 = 1.0 / 6.0;

// 4D
// const F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
// const G4 = (5.0 - Math.sqrt(5.0)) / 20.0;

class SimplexNoise {
    static grad3 = new Float32Array([
        1, 1, 0,
        -1, 1, 0,

        1, -1, 0,
        -1, -1, 0,

        1, 0, 1,
        -1, 0, 1,

        1, 0, -1,
        -1, 0, -1,

        0, 1, 1,
        0, -1, 1,

        0, 1, -1,
        0, -1, -1,
    ]);

    static grad4 = new Float32Array([
        0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1,
        0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1,
        1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0, -1, -1, -1,
        0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1,
        1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1, -1,
        1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1,
        1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1,
        1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0,
    ]);

    constructor(random = Math.random) {
        this.p = this.buildPermutationTable(random);
        this.perm = new Uint8Array(512);
        this.permMod12 = new Uint8Array(512);

        for (let i = 0; i < 512; i++) {
            this.perm[i] = this.p[i & 255];
            this.permMod12[i] = this.perm[i] % 12;
        }
    }

    buildPermutationTable(random) {
        const p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) {
            p[i] = i;
        }

        for (let i = 0; i < 255; i++) {
            const r = i + ~~(random() * (256 - i));
            const aux = p[i];
            p[i] = p[r];
            p[r] = aux;
        }

        return p;
    }

    noise2D(xin, yin) {
        const { permMod12, perm } = this;
        const { grad3 } = SimplexNoise;

        let n0 = 0;
        let n1 = 0;
        let n2 = 0;

        const s = (xin + yin) * F2;
        const i = Math.floor(xin + s);
        const j = Math.floor(yin + s);
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = xin - X0;
        const y0 = yin - Y0;

        let i1;
        let j1;

        if (x0 > y0) {
            i1 = 1;
            j1 = 0;
        } else {
            i1 = 0;
            j1 = 1;
        }

        const x1 = (x0 - i1) + G2;
        const y1 = (y0 - j1) + G2;
        const x2 = (x0 - 1.0) + (2.0 * G2);
        const y2 = (y0 - 1.0) + (2.0 * G2);

        const ii = i & 255;
        const jj = j & 255;

        let t0 = 0.5 - (x0 * x0) - (y0 * y0);
        if (t0 >= 0) {
            const gi0 = permMod12[ii + perm[jj]] * 3;
            t0 *= t0;
            n0 = t0 * t0 * ((grad3[gi0] * x0) + (grad3[gi0 + 1] * y0));
        }

        let t1 = 0.5 - (x1 * x1) - (y1 * y1);
        if (t1 >= 0) {
            const gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
            t1 *= t1;
            n1 = t1 * t1 * ((grad3[gi1] * x1) + (grad3[gi1 + 1] * y1));
        }

        let t2 = 0.5 - (x2 * x2) - (y2 * y2);
        if (t2 >= 0) {
            const gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
            t2 *= t2;
            n2 = t2 * t2 * ((grad3[gi2] * x2) + (grad3[gi2 + 1] * y2));
        }

        return 70.0 * (n0 + n1 + n2);
    }

    noise3D(xin, yin, zin) {
        const { permMod12, perm } = this;
        const { grad3 } = SimplexNoise;

        let n0;
        let n1;
        let n2;
        let n3;

        const s = (xin + yin + zin) * F3;
        const i = Math.floor(xin + s);
        const j = Math.floor(yin + s);
        const k = Math.floor(zin + s);
        const t = (i + j + k) * G3;
        const X0 = i - t;
        const Y0 = j - t;
        const Z0 = k - t;
        const x0 = xin - X0;
        const y0 = yin - Y0;
        const z0 = zin - Z0;

        let i1;
        let j1;
        let k1;
        let i2;
        let j2;
        let k2;
        if (x0 >= y0) {
            if (y0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            } else if (x0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            } else {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            }
        } else {
            if (y0 < z0) {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            } else if (x0 < z0) {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            } else {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            }
        }

        const x1 = (x0 - i1) + G3;
        const y1 = (y0 - j1) + G3;
        const z1 = (z0 - k1) + G3;
        const x2 = ((x0 - i2) + 2.0) * G3;
        const y2 = ((y0 - j2) + 2.0) * G3;
        const z2 = ((z0 - k2) + 2.0) * G3;
        const x3 = ((x0 - 1.0) + 3.0) * G3;
        const y3 = ((y0 - 1.0) + 3.0) * G3;
        const z3 = ((z0 - 1.0) + 3.0) * G3;

        const ii = i & 255;
        const jj = j & 255;
        const kk = k & 255;

        let t0 = 0.6 - (x0 * x0) - (y0 * y0) - (z0 * z0);
        if (t0 < 0) {
            n0 = 0.0;
        } else {
            const gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
            t0 *= t0;
            n0 = t0 * t0 * ((grad3[gi0] * x0) + (grad3[gi0 + 1] * y0) + (grad3[gi0 + 2] * z0));
        }

        let t1 = 0.6 - (x1 * x1) - (y1 * y1) - (z1 * z1);
        if (t1 < 0) {
            n1 = 0.0;
        } else {
            const gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
            t1 *= t1;
            n1 = t1 * t1 * ((grad3[gi1] * x1) + (grad3[gi1 + 1] * y1) + (grad3[gi1 + 2] * z1));
        }

        let t2 = 0.6 - (x2 * x2) - (y2 * y2) - (z2 * z2);
        if (t2 < 0) {
            n2 = 0.0;
        } else {
            const gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
            t2 *= t2;
            n2 = t2 * t2 * ((grad3[gi2] * x2) + (grad3[gi2 + 1] * y2) + (grad3[gi2 + 2] * z2));
        }

        let t3 = 0.6 - (x3 * x3) - (y3 * y3) - (z3 * z3);
        if (t3 < 0) {
            n3 = 0.0;
        } else {
            const gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
            t3 *= t3;
            n3 = t3 * t3 * ((grad3[gi3] * x3) + (grad3[gi3 + 1] * y3) + (grad3[gi3 + 2] * z3));
        }

        return 32.0 * (n0 + n1 + n2 + n3);
    }
}

export default SimplexNoise;
