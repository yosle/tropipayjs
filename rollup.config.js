// Contents of the file /rollup.config.js
import typescript from '@rollup/plugin-typescript';
import dts from "rollup-plugin-dts";
const config = [
    {
        input: 'src/dist/index.js',
        output: {
            file: 'index.js',
            format: 'cjs',
            sourcemap: true,
        },
        external: ['axios'],
        plugins: [typescript()]
    }, {
        input: 'src/dist/index.d.ts',
        output: {
            file: 'index.d.ts',
            format: 'es'
        },
        plugins: [dts()]
    }
];
export default config;