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
              exclude: [
                  /node_modules\/(?!(@metacell\/geppetto-meta-client)|(@metacell\/geppetto-meta-core)|(@metacell\/geppetto-meta-ui)\/).*/,
              ],
              use: {
                  loader: 'babel-loader',
                  options: {
                      presets: [
                          '@babel/preset-env',
                          '@babel/preset-react',
                      ],
                      plugins: [
                          '@babel/plugin-syntax-dynamic-import',
                          '@babel/plugin-proposal-class-properties',
                          '@babel/plugin-transform-runtime',
                          '@babel/plugin-transform-modules-commonjs'
                      ],
                      sourceType: 'unambiguous',
                  },
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
          test: /\.(png|gif|jpg|cur|svg)$/i,
          loader: 'url-loader',
        },
        {
          test: /\.obj|\.drc|\.gltf/,
          loader: 'url-loader',
        },
        {
          test: /\.s[a|c]ss$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            { loader: 'sass-loader' },
          ],
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