const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var path = require('path');
var contentbase = path.join(__dirname, 'public')

console.log(`Contentbase: ${contentbase}`);


module.exports = env => {
  if (!env) {
    env = {}
  }



  return {
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: path.join('js', 'bundle.js')
    },

    performance: {
      hints: false
    },

    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [".ts", ".tsx", ".js", ".jsx"]
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules\/(?!(@metacell)\/).*/,
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { modules: false }],
              '@babel/preset-react',
              { plugins: ['@babel/plugin-proposal-class-properties', '@babel/transform-runtime', '@babel/plugin-transform-modules-commonjs'] },
            ],
          },
        },
        {
          test: /\.ts(x?)$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
              },
            }
          ]
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'less-loader',
            },
          ],
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|gif|jpg|cur)$/i,
          loader: 'url-loader',
        },
        {
          test: /\.obj|\.drc|\.gltf/,
          loader: 'url-loader',
        },
      ]
    },

    plugins: [
      new CleanWebpackPlugin(),
      new webpack.EnvironmentPlugin({ 'DOMAIN': env.DOMAIN || null, 'NAMESPACE': env.NAMESPACE || null }),
      new CopyPlugin({
        patterns: [
          {
            from: './src/assets', to: contentbase,
          },

        ]
      }),
    ],
  }
};