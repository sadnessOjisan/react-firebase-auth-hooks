import { resolve } from 'path';
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy';
import resolveModule from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';

import pkg from './package.json';
import authPkg from './auth/package.json';

const pkgsByName = {
  auth: authPkg,
};

const plugins = [
  resolveModule(),
  typescript({
    typescript: require('typescript'),
  }),
  commonjs(),
];

const external = Object.keys(pkg.peerDependencies || {});

const components = ['auth'];

export default components
  .map((component) => {
    const pkg = pkgsByName[component];
    console.log(component);
    return [
      {
        input: `${component}/index.ts`,
        output: [
          { file: resolve(component, pkg.main), format: 'cjs' },
          { file: resolve(component, pkg.module), format: 'es' },
        ],
        plugins,
        external,
      },
      {
        input: `${component}/index.ts`,
        output: {
          file: `dist/react-firebase-hooks-${component}.js`,
          format: 'iife',
          sourcemap: true,
          extend: true,
          name: 'react-firebase-hooks',
          globals: {
            react: 'react',
          },
        },
        plugins: [
          ...plugins,
          uglify(),
          // Copy flow files
          copy({
            [`${component}/index.js.flow`]: `${component}/dist/index.cjs.js.flow`,
          }),
          copy({
            [`${component}/index.js.flow`]: `${component}/dist/index.esm.js.flow`,
          }),
        ],
        external,
      },
    ];
  })
  .reduce((a, b) => a.concat(b), []);
