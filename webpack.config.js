const path = require('path');

module.exports = {
  mode: 'development', // Ensures fast builds and good source maps
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Cleans the dist folder on builds
  },
  // Add this section:
  devServer: {
    static: {
      directory: path.join(__dirname, ''), // Where to serve your static files (like index.html) from
    },
    compress: true,
    port: 8080, // You can change the port if 8080 is taken
    open: true, // Automatically opens your default browser when the server starts
    hot: true,  // Enables Hot Module Replacement (updates code without a full page refresh)
    watchFiles: ['src/**/*']
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      }
    ],
  }  
};
