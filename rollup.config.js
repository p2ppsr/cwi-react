import babel from 'rollup-plugin-babel'
import autoExternal from 'rollup-plugin-auto-external'

export default {
  input: 'src/index.js',
  output: {
    file: 'build/index.js',
    format: 'umd',
    name: 'ReactCWI'
  },
  plugins: [
    autoExternal(),
    babel({
      babelrc: false,
      presets: [
        '@babel/preset-react'
      ]
    })
  ]
}
