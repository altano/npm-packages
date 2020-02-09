import ts from '@wessberg/rollup-plugin-ts';

export default {
  external: ['react', 'react-dom'],
  input: 'src/intersection-spy-hook.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [ts()],
};
