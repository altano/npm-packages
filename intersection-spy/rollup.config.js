import ts from '@wessberg/rollup-plugin-ts';

export default {
  input: 'src/intersection-spy.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [ts()],
};
