const webpack = require('@nativescript/webpack');

module.exports = (env) => {
  webpack.init(env);

  // Learn how to customize:
  // https://docs.nativescript.org/webpack

  webpack.Utils.addCopyRule('app/*.json');
  webpack.Utils.addCopyRule('app/*.pdf');

  return webpack.resolveConfig();
};
