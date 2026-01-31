const path = require('path');

module.exports = {
  mode: 'development', // Important for readable source maps
  entry: {
    bundle: './src/index.ts',
    tests: './src/tests/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // Ensure ts-loader doesn't disable source maps
              compilerOptions: {
                sourceMap: true,
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    hot: true,
  },
  devtool: 'source-map', // or 'inline-source-map' for development
};
