const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
module.exports = {
  mode: 'development', // Or 'production' for production builds
  entry: './src/index.js',
  plugins: [
    new webpack.DefinePlugin({
        'process.env': JSON.stringify(process.env)
    })
],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  },
  devServer: {
    static: './dist',
    port: 3000
  }
};