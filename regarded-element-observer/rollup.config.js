import ts from '@wessberg/rollup-plugin-ts';

export default {
  input: 'src/regarded-element-observer.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [ts()],
};
