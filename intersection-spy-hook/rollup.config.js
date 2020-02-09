import ts from '@wessberg/rollup-plugin-ts';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  external: ['react', 'react-dom'],
  input: 'src/intersection-spy-hook.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [ts(), resolve(), commonjs()],
};
