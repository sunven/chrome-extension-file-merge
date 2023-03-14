const svgToMiniDataURI = require('mini-svg-data-uri')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const srcDir = path.join(__dirname, '..', 'src')

module.exports = {
  entry: {
    popup: path.join(srcDir, 'popup.ts'),
  },
  output: {
    path: path.join(__dirname, '../dist/js'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        sideEffects: true,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              generator: content => svgToMiniDataURI(content.toString()),
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: '.', to: '../', context: 'public' }],
      options: {},
    }),
  ],
}
