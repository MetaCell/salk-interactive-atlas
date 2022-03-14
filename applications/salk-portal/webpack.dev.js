const { merge } = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const CopyPlugin = require('copy-webpack-plugin');
var path = require('path');
const { env } = require('process');

const contentbase = path.join(__dirname, 'public')

PORT = 3000;

module.exports = env => {
  const protocol = env && env.PROTOCOL ? env.PROTOCOL : 'https'
  const proxyTarget = `${protocol}://__APP_NAME__/`

  const salkDomain = env && env.DOMAIN ? env.DOMAIN : 'salk.local';
  const replaceHost = (uri, appName) => uri.replace("__APP_NAME__", appName + '.' + salkDomain);

  function setEnv(content) {
    console.log("Replacing ENV", env);
    let result = content.toString();
    for (const v in env) {
      result = result.replace(new RegExp(`__${v}__`), env[v]);
    }
    console.log(result);
    return result;
  }

  return merge(
    common(env),
    {
      mode: 'development',
      devtool: 'eval-source-map',
      devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        publicPath: '/',
        filename: path.join('js', 'bundle.js'),
        compress: true,
        https: protocol == 'https',
        disableHostCheck: true,
        historyApiFallback: true,
        proxy: {
          '/proxy/workspaces': {
            target: replaceHost(proxyTarget, 'workspaces'), // 'http://localhost:8000', // for local development
            secure: false,
            changeOrigin: true,
            pathRewrite: { '^/proxy/workspaces': '' }
          },
          '/api/sentry': {
            target: replaceHost(proxyTarget, 'common'),
            secure: false,
            changeOrigin: true,
          }
        },
        port: PORT,

      },

      plugins: [
        new webpack.EnvironmentPlugin({ 'DOMAIN': env.DOMAIN || 'salk.dev.metacell.us', 'NAMESPACE': env.NAMESPACE || 'salk' }),
        new CopyPlugin({
          patterns: [
            {
              from: './src/assets-parametrized',
              to: contentbase,
              transform(content, path) {
                return setEnv(content);
              }
            },
            {
              from: './src/assets',
              to: contentbase,
            },

          ]
        }),
      ],

    })
};
