/*
 * This babel configuration is used along with Jest for execute tests,
 * do not modify to avoid conflicts with webpack.config.js.
 */

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
    [
      "@babel/react",
      {
        targets: {
          node: "current",
        },
      },
    ],
  ],
  plugins: [
    [
      "babel-plugin-styled-components",
      {
        namespace: "weconnect",
      },
    ],
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-proposal-class-properties",
    // ["@babel/plugin-proposal-class-properties", { loose: true }],
    "@babel/plugin-transform-runtime",
  ],
};
