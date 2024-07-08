const path = require('path');
const SveltePreprocess = require('svelte-preprocess');
const version = require('./package.json').version;
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');  // Add this line

// Custom webpack rules
const rules = [
  { test: /\.ts$/, loader: 'ts-loader',
    options: {
      configFile: 'tsconfig.json'
    }
  },
  { test: /\.js$/, loader: 'source-map-loader' , exclude: /node_modules/},
  { test: /\.css$/, use: ['style-loader', 'css-loader']},
  {
    test: /\.svelte$/,
    loader: 'svelte-loader',
    options: {
      preprocess: SveltePreprocess({
        sourceMap: true,
        postcss: true,
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
          require('postcss-nesting'),
        ],
      }),
      dev: true,
    },
  },
  {
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  },
];
const commonPlugins = [
  new CopyPlugin({
    patterns: [
      { 
        from: path.resolve(__dirname, 'src/toolbar/'),
        to: path.resolve(__dirname, 'lib/toolbar'),
        noErrorOnMissing: true,  
        globOptions: {
          ignore: ['**/*.js'],  // Don't copy TypeScript and JavaScript files
        },
      },
    ],
  }),
];


const optimization = (mode) => {
  return {
    minimize: mode === 'production',
    minimizer: [new CssMinimizerPlugin()],
  };
};

// Packages that shouldn't be bundled but loaded at runtime
const externals = ['@jupyter-widgets/base'];

const resolve = {
  // Add '.ts' and '.tsx' as resolvable extensions.
  extensions: ['.webpack.js', '.web.js', '.ts', '.js', '.svelte'],
  mainFields: ['svelte', 'browser', 'module', 'main'],
  modules: [path.resolve(__dirname, 'src'), 'node_modules']
};

module.exports = [
  /**
   * Notebook extension
   *
   * This bundle only contains the part of the JavaScript that is run on load of
   * the notebook.
   */
  {
    entry: './src/extension.ts',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'betterwithdata_viz', 'nbextension'),
      libraryTarget: 'amd',
      publicPath: '',
    },
    module: {
      rules: rules
    },
    devtool: 'source-map',
    externals,
    resolve,
  },

  /**
   * Embeddable betterwithdata-viz bundle
   *
   * This bundle is almost identical to the notebook extension bundle. The only
   * difference is in the configuration of the webpack public path for the
   * static assets.
   *
   * The target bundle is always `dist/index.js`, which is the path required by
   * the custom widget embedder.
   */
  {
    entry: './src/index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'amd',
        library: "betterwithdata-viz",
        publicPath: 'https://unpkg.com/betterwithdata-viz@' + version + '/dist/'
    },
    devtool: 'source-map',
    module: {
        rules: rules
    },
    externals,
    resolve,
    plugins: commonPlugins,
  },


  /**
   * Documentation widget bundle
   *
   * This bundle is used to embed widgets in the package documentation.
   */
  {
    entry: './src/index.ts',
    output: {
      filename: 'embed-bundle.js',
      path: path.resolve(__dirname, 'docs', 'source', '_static'),
      library: "betterwithdata-viz",
      libraryTarget: 'amd'
    },
    module: {
      rules: rules
    },
    devtool: 'source-map',
    externals,
    resolve,
  },
  /**
   * Lab extension
   *
   * This builds the lib/ folder with the JupyterLab extension.
   */
  {
    entry: './src/plugin.ts',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'lib'),
      libraryTarget: 'amd',
      publicPath: '',
    },
    module: {
      rules: rules
    },
    devtool: 'source-map',
    externals,
    resolve,
    plugins: commonPlugins,
  },

];
