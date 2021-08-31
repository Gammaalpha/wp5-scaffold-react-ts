const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");
const ASSET_PATH = process.env.ASSET_PATH || "/";
const deps = require("./package.json").dependencies;
const sharedDeps = ["react", "react-dom"]; // add more packages to this array to share across remotes  and shell
const Dotenv = require("dotenv-webpack");

/**
 * Creates a singleton object with dependencies with their required version
 * @returns object of objects
 */
const setSingletonSharedDeps = () => {
  console.log("Setting singleton shared deps...");
  return sharedDeps.reduce(
    (acc, curr) =>
      Object.assign(acc, {
        [curr]: {
          eager: true,
          singleton: true,
          requiredVersion: deps[curr],
        },
      }),
    {}
  );
};

module.exports = (env) => {
  console.log("Target: ", env.target);
  console.log("Public Url: ", ASSET_PATH);
  return {
    mode: "development",
    target: "web",
    entry: path.resolve(__dirname, "src/index.js"),
    output: {
      path: path.resolve(__dirname, "build"),
      // publicPath: ASSET_PATH,
      filename: "host_remoteEntry.js",
      chunkFilename: "./assets/chunks/[name].chunk.js",
    },
    devServer: {
      port: 3000, // URL port
      historyApiFallback: true,
      contentBase: path.resolve(__dirname, "./public"),
      watchContentBase: true,
      hot: true,
      open: true,
      compress: true,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".json"],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
        // tsx
        {
          test: /\.(ts|tsx)$/,
          loader: "ts-loader",
          exclude: /node_modules/,
        },
        //scss to css
        {
          test: /\.s[ac]ss$/i,
          use: [
            { loader: "style-loader" },
            { loader: "css-loader" },
            { loader: "sass-loader" },
          ],
          include: /\.module\.scss$/,
        },
        // css
        {
          test: /\.css$/,
          use: [{ loader: "style-loader" }, { loader: "css-loader" }],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: "10000",
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "host", // Module name
        filename: "host_remoteEntry.js", // Module Filename
        /**
         * Add remotes to consume.
         * Example:
         * "externalComponent-mf":"{remote_module_name}@{URL}/{remote_module_filename}.js"
         */
        remotes: {},
        /**
         * Add components to expose and consume
         * Example:
         * "./{Component_Name}":"./{Component relative url location}"
         */
        exposes: {},
        /**
         * Shared dependencies across all the modules.
         */
        shared: {
          ...deps,
          ...setSingletonSharedDeps(),
        },
      }),
      new HtmlWebpackPlugin({
        inject: "head",
        template: path.resolve(__dirname, "public/index.html"),
        filename: "index.html",
        favicon: "./public/favicon.ico",
      }),
      new Dotenv({
        path: path.resolve(
          __dirname,
          `.env${env.target !== undefined ? `.${env.target}` : ""}`
        ),
        allowEmptyValues: true,
      }),
    ],
  };
};
