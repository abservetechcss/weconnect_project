const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack");
// const postcssPrefixer = require("postcss-prefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const ROOT = path.resolve(__dirname, "src");
// const NLP_DIRNAME = "nlp";
const ASSETS_DIRNAME = "assets";
const MODELS_DIRNAME = "models";
const TASKS_DIRNAME = "tasks";

const INTENT_CLASSIFICATION_DIRNAME = "intent-classification";
const OUTPUT_PATH = path.resolve(__dirname, "../build/chat");
const WEBVIEWS_PATH = path.resolve(OUTPUT_PATH, "webviews");
// const TASKS_PATH = path.join(ROOT, NLP_DIRNAME, TASKS_DIRNAME);

const INTENT_CLASSIFICATION_MODELS_PATH = path.join(
  // NLP_DIRNAME,
  TASKS_DIRNAME,
  INTENT_CLASSIFICATION_DIRNAME,
  MODELS_DIRNAME
);
const INTENTS_ASSETS_MODELS_PATH = path.join(
  ASSETS_DIRNAME,
  TASKS_DIRNAME,
  INTENT_CLASSIFICATION_DIRNAME,
  MODELS_DIRNAME
);

// const BOTONIC_PATH = path.resolve(
//   __dirname,
//   "node_modules",
//   "@botonic",
//   "react"
// );
const BOTONIC_PATH = path.resolve(__dirname, "templates");

const WEBPACK_MODE = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
};

const WEBPACK_ENTRIES_DIRNAME = "webpack-entries";
const WEBPACK_ENTRIES = {
  DEV: "dev-entry.js",
  NODE: "node-entry.js",
  WEBCHAT: "webchat-entry.js",
  WEBVIEWS: "webviews-entry.js",
  WIDGET: "widget-entry.js",
  LANDING: "landing-entry.js",
  EMBED: "embed-entry.js",
  BUILDER: "builder-entry.js",
};

const TEMPLATES = {
  WEBCHAT: "webchat.template.html",
  WEBVIEWS: "webview.template.html",
  LANDING: "landing.template.html",
  EMBED: "embed.template.html",
};

const UMD_LIBRARY_TARGET = "umd";
// library & filename should be different for widget, landing, embed

const WEBCHAT_FILENAME = "webchat.WeConnect.js";
const BOTONIC_LIBRARY_NAME = "WeConnect";

function sourceMap(mode) {
  if (mode === WEBPACK_MODE.PRODUCTION) return "hidden-source-map";
  else if (mode === WEBPACK_MODE.DEVELOPMENT) return "eval-cheap-source-map";
  else
    throw new Error(
      "Invalid mode argument (" + mode + "). See package.json scripts"
    );
}

const optimizationConfig = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      parallel: true,
      terserOptions: {
        keep_fnames: true,
      },
    }),
  ],
  // moduleIds: 'hashed',
  // splitChunks: {
  //     cacheGroups: {
  //         default: false,
  //         vendors: false,
  //         // vendor chunk
  //         vendor: {
  //             name: 'vendor',
  //             // async + async chunks
  //             chunks: 'all',
  //             // import file path containing node_modules
  //             test: /node_modules/,
  //             priority: 20
  //         },

  //       }  }
};

const resolveConfig = {
  extensions: ["*", ".js", ".jsx", ".ts", ".tsx", ".mjs"],
  alias: {
    react: path.resolve(__dirname, "node_modules", "react"),
    "styled-components": path.resolve(
      __dirname,
      "node_modules",
      "styled-components"
    ),
    '@mui/styled-engine': '@mui/styled-engine-sc',
  },
  fallback: {
    util: require.resolve("util"),
  },
};

const babelLoaderConfig = {
  test: /\.(js|jsx|ts|tsx|mjs)$/,
  exclude: /node_modules\/(?!@botonic)/,
  use: {
    loader: "babel-loader",
    options: {
      sourceType: "unambiguous",
      cacheDirectory: true,
      presets: [
        "@babel/react",
        [
          "@babel/preset-env",
          {
            modules: false,
          },
        ],
      ],
      plugins: [
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-transform-runtime",
      ],
    },
  },
};

const staticLoaderConfig = {
  test: /\.(html)$/,
  use: [
    {
      loader: "file-loader",

    },
  ],
}

function fileLoaderConfig(outputPath) {
  return {
    test: /\.(jpe?g|png|gif)$/i,
    use: [
      {
        loader: "file-loader",
        options: {
          outputPath: outputPath,
        },
      },
    ],
  };
}

const nullLoaderConfig = {
  test: /\.(scss|css)$/,
  use: "null-loader",
};

const stylesLoaderConfig = {
  test: /\.(scss|css)$/,
  use: [
    {
      loader: "style-loader",
      options: {
        insert: function (element) {
          if (!window._botonicInsertStyles) window._botonicInsertStyles = [];
          window._botonicInsertStyles.push(element);
        },
      },
    },
    // {
    //   loader: "css-loader",
    //   options: {
    //     // modules: true,
    //     // importLoaders: 1,
    //     // localIdentName: "sss[name]_[local]_[hash:base64]",
    //     // sourceMap: true,
    //     // minimize: true,
    //     modules: {
    //       // mode: "local",
    //       // auto: true,
    //       // exportGlobals: true,
    //       // localIdentName: "sss[path][name]__[local]--[hash:base64:5]",
    //       // localIdentContext: path.resolve(__dirname, "src"),
    //       // localIdentHashPrefix: "my-custom-hash",
    //       // namedExport: true,
    //       // exportLocalsConvention: "camelCase",
    //       // exportOnlyLocals: false,
    //     },
    //   },
    // },
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        esModule: false,
      },
    },
    "css-loader",
    // {
    //   loader: "postcss-loader",
    //   options: {
    //     postcssOptions: {
    //       plugins: [
    //         postcssPrefixer({
    //           prefix: "tui-full-calendar-",
    //         }),
    //       ],
    //     },
    //   },
    // },
    "sass-loader",
    // {
    //   loader: "postcss-prefixer",
    //   options: {
    //     prefix: "prefix-",
    //   },
    // },
  ],
};

const jsonLoader = {
  test: /\.json$/,
  use: ['json-loader'],
  type: 'javascript/auto'
};

const svgLoader = {
  test: /\.svg$/,
  use: ['@svgr/webpack', 'file-loader'],
};

// const cssPrefixer = {
//   test: /\.(scss|css)$/,
//   use: [
//     {
//       loader: "react-classname-prefix-loader-with-lookup",
//       options: {
//         prefix: "prefix-",
//       },
//     },
//   ],
// };

const imageminPlugin = new ImageminPlugin({
  bail: false,
  cache: false,
  imageminOptions: {
    plugins: [
      ["imagemin-gifsicle", { interlaced: true }],
      ["imagemin-jpegtran", { progressive: true }],
      ["imagemin-optipng", { optimizationLevel: 5 }],
    ],
  },
});


function botonicWidgetConfig(mode) {
  return {
    stats: {
      // Display bailout reasons
      optimizationBailout: true,
      performance: true,
    },
    mode: mode,
    devtool: sourceMap(mode),
    // devtool: "source-map",
    entry: path.resolve(WEBPACK_ENTRIES_DIRNAME, WEBPACK_ENTRIES.WIDGET),
    target: "web",
    // optimization: {
    //   runtimeChunk: 'single',
    //   splitChunks: {
    //     chunks: 'all',
    //     maxInitialRequests: Infinity,
    //     minSize: 0,
    //   // cacheGroups: {
    //   //   vendor: {
    //   //     test: /[\\/]node_modules[\\/]/,
    //   //     name(module) {
    //   //       // get the name. E.g. node_modules/packageName/not/this/part.js
    //   //       // or node_modules/packageName
    //   //       const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)? module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]: "undefined";

    //   //       // npm package names are URL-safe, but some servers don't like @ symbols
    //   //       return `npm.${packageName.replace('@', '')}`;
    //   //     },
    //   //   },
    //   // },
    //   },
    // },
    module: {
      rules: [
        babelLoaderConfig,
        svgLoader,
        fileLoaderConfig(ASSETS_DIRNAME),
        stylesLoaderConfig,
        jsonLoader
      ],
    },
    output: {
      filename: WEBCHAT_FILENAME,
      library: BOTONIC_LIBRARY_NAME,
      libraryTarget: UMD_LIBRARY_TARGET,
      libraryExport: "app",
      path: OUTPUT_PATH,
    },
    // output: {
    //   path: OUTPUT_PATH,
    //   // filename: '[name].[hash:8].js',
    //   filename: '[name].[contenthash].js',
    //   libraryTarget: UMD_LIBRARY_TARGET,
    //   libraryExport: "app",
    //   library: BOTONIC_LIBRARY_NAME,
    //   // sourceMapFilename: '[name].[hash:8].map',
    //   chunkFilename: '[id].[chunkhash].js'
    // },
    resolve: resolveConfig,
    devServer: {
      static: [OUTPUT_PATH],
      liveReload: true,
      historyApiFallback: true,
      hot: true,
    },
    plugins: [
      new MiniCssExtractPlugin(),
      // new BundleAnalyzerPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(BOTONIC_PATH, "src", TEMPLATES.WEBCHAT),
        filename: "index.html",
      }),
      new webpack.HotModuleReplacementPlugin(),
      imageminPlugin,
      new webpack.DefinePlugin({
        IS_BROWSER: true,
        IS_NODE: false,
        HUBTYPE_API_URL: JSON.stringify(process.env.HUBTYPE_API_URL),
        ...(mode === "development"
          ? { MODELS_BASE_URL: JSON.stringify("http://localhost:8080") }
          : {}),
      }),
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
      new CopyWebpackPlugin({
        patterns: [
          path.resolve("static","muthu_webchat.js"),
          { from: path.resolve(__dirname, "static/embed"), to: 'embed' },
          { from: path.resolve(__dirname, "static/landing"), to: 'landing' },
          { from: path.resolve(__dirname, "static/widget"), to: 'widget' },
          { from: path.resolve(__dirname, "static/embed1"), to: 'embed1' },
          { from: path.resolve(__dirname, "static/landing1"), to: 'landing1' },
          { from: path.resolve(__dirname, "static/widget1"), to: 'widget1' }
        ]
      }),
      new Dotenv({
        path: path.resolve(__dirname, "../.env")
      }),
    ],
  };
}


module.exports = function (env, argv) {
  return [botonicWidgetConfig(argv.mode)];
};
