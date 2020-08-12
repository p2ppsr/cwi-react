import babel from 'rollup-plugin-babel'
import copy from 'rollup-plugin-copy'

export default {
  input: 'src/index.js',
  output: {
    file: 'index.js',
    format: 'umd',
    name: 'ReactCWI'
  },
  plugins: [
    babel({
      babelrc: false,
      presets: [
        '@babel/preset-react'
      ]
    }),
    copy({
      targets: [
        {
          src: 'node_modules/@p2ppsr/cwi-auth/build/index.js',
          dest: '.',
          rename: 'auth.js'
        }
      ]
    })
  ]
}
