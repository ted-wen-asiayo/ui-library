const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const { npm_lifecycle_event } = process.env;

const config = {
  entry: "./index.ts",
  output: {
    path: path.resolve(__dirname, "lib"),
    libraryTarget: "commonjs2",
    filename: "[name].js?v=[contenthash]",
  },
  externals: {
    react: "commonjs react",
    "react-dom": "commonjs react-dom",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
      {
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              additionalData: "",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: "react",
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css",
      chunkFilename: "css/[name].[contenthash].css",
    }),
  ],
  resolve: {
    modules: [path.join(__dirname, "node_modules")],
    alias: {
      "@/src": path.join(__dirname, "src"),
      "@/components": path.join(__dirname, "src/components"),
      "@/theme": path.join(__dirname, "src/theme"),
    },
    extensions: [".tsx", ".ts", ".jsx", ".js", ".scss", ".sass", ".css"],
  },
  optimization: {
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      `...`,
      new CssMinimizerPlugin(),
    ],
  },
};

if (npm_lifecycle_event === "build:analyzer") {
  config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;
