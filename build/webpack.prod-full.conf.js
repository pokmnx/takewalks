'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer

const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : require('../config/prod.env')

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jquery: 'jquery',
      'window.jQuery': 'jquery',
      jQuery: 'jquery',
      Slidebars: 'slidebars'
    })

   // /*
    ,
    new PrerenderSPAPlugin({

        staticDir: path.join(__dirname, '../dist'),

        // Optional - The path your rendered app should be output to.
        // (Defaults to staticDir.)
        // outputDir: path.join(__dirname, 'prerendered'),

        inject: {IS_PRERENDERING: true},

        routes: [
          '/contact',
          '/cancellation-policy',
          '/privacy-policy',
          '/terms',
          '/careers',
          '/payment',
          '/confirm',
          '/rome-tours',
          '/rome-tours/pristine-sistine-chapel-tour',
          '/rome-tours/rome-in-a-day-tour',
          '/rome-tours/complete-vatican-tour',
          '/rome-tours/sistine-chapel-tickets-express-tour',
          '/rome-tours/colosseum-undergound-tour',
          '/rome-tours/rome-in-a-day-tour',
          '/rome-tours/rome-colosseum-tour',
          '/rome-tours/rome-caesars-palace-tour-colosseum',
          '/rome-tours/colosseum-night-tour-underground',
          '/rome-tours/colosseum-tours-rome',
          '/rome-tours/domus-aurea-rome-tour',
          '/rome-tours/colosseum-tour-virtual-reality-gladiators-barracks',
          '/rome-tours/top-tier-colosseum-tour',
          '/rome-tours/walk-on-walk-off-rome-tour-pass',
          '/rome-tours/walk-on-walk-off-rome-vatican-tickets',
          '/rome-tours/roma-pass-colosseum-tickets-rome-tour-pass',
          '/rome-tours/rome-tour-pass-vatican-tickets-roma-pass',
          '/rome-tours/castel-gandolfo-tour-ostia-antica',
          '/rome-tours/pompeii-day-trip-from-rome',
          '/rome-tours/tuscany-from-rome-day-trip',
          '/rome-tours/amalfi-coast-from-rome-day-trip',
          '/rome-tours/cinque-terre-tours-from-rome',
          '/rome-tours/rome-catacombs-tour',
          '/rome-tours/rome-underground-tour-catacombs-at-night',
          '/rome-tours/cooking-classes-in-rome',
          '/rome-tours/rome-food-tour',
          '/rome-tours/rome-walking-tour',
          '/rome-tours/ancient-rome-tour',
          '/rome-tours/st-peters-basilica-tour',
          '/rome-tours/domus-aurea-rome-tour',
          '/rome-tours/rome-night-tour-forum-lightshow',
          '/florence-tours',
          '/florence-tours/david-florence-tours',
          '/florence-tours/tuscany-tours-from-florence',
          '/florence-tours/florence-in-a-day-tour',
          '/florence-tours/after-hours-florence-accademia-tickets',
          '/florence-tours/david-florence-tours',
          '/florence-tours/vip-florence-duomo-tour',
          '/florence-tours/florence-in-a-day-tour',
          '/florence-tours/uffizi-and-accademia-tickets',
          '/florence-tours/florence-in-a-day-tour',
          '/florence-tours/uffizi-tour',
          '/florence-tours/uffizi-gallery-tickets',
          '/florence-tours/uffizi-and-accademia-tickets',
          '/florence-tours/tuscany-tours-from-florence',
          '/florence-tours/florence-walking-tour',
          '/florence-tours/after-hours-florence-accademia-tickets',
          '/venice-tours',
          '/venice-tours/doges-palace-tour',
          '/venice-tours/st-marks-basilica-at-night-tour',
          '/venice-tours/venice-walking-tour-gondola-ride',
          '/venice-tours/doges-palace-tour',
          '/venice-tours/st-marks-basilica-at-night-tour',
          '/venice-tours/venice-walking-tour-gondola-ride',
          '/venice-tours/st-marks-basilica-doges-palace-night-tour',
          '/venice-tours/doges-palace-secret-itineraries-tour',
          '/venice-tours/venice-in-a-day-tour',
          '/venice-tours/venice-food-tour',
          '/venice-tours/verona-day-trip-from-venice',
          '/venice-tours/venice-boat-tour',
          '/milan-tours',
          '/milan-tours/last-supper-tickets-milan-tours',
          '/pompeii-tours',
          '/pompeii-tours/pompeii-day-trip-from-rome',
          '/pompeii-tours/best-of-pompeii-tour',
          '/paris-tours',
          '/paris-tours/paris-catacombs-tour',
          '/paris-tours/paris-city-tour',
          '/paris-tours/notre-dame-tour-sainte-chapelle-tickets',
          '/paris-tours/paris-walking-tour',
          '/paris-tours/louvre-tour-mona-lisa',
          '/paris-tours/paris-city-tour',
          '/paris-tours/louvre-museum-tour-tickets',
          '/paris-tours/paris-to-versailles-day-trip',
          '/paris-tours/versailles-tour-from-paris',
          '/paris-tours/paris-to-mont-st-michel-day-trip',
          '/paris-tours/paris-to-versailles-day-trip',
          '/paris-tours/paris-to-bordeaux-wine-tour',
          '/paris-tours/champagne-tours-from-paris',
          '/paris-tours/versailles-tour-from-paris',
          '/barcelona-tours',
          '/barcelona-tours/barcelona-in-a-day-tour',
          '/barcelona-tours/complete-gaudi-tour-casa-batllo',
          '/barcelona-tours/barcelona-to-girona-day-trip',
          '/barcelona-tours/barcelona-city-tour',
          '/barcelona-tours/montserrat-tour-day-trip-from-barcelona',
          '/barcelona-tours/sagrada-familia-tour',
          '/barcelona-tours/barcelona-cooking-class',
          '/barcelona-tours/barcelona-in-a-day-tour',
          '/barcelona-tours/complete-gaudi-tour-casa-batllo',
          '/barcelona-tours/sagrada-familia-tour',
          '/barcelona-tours/barcelona-to-girona-day-trip',
          '/barcelona-tours/montserrat-tour-day-trip-from-barcelona',
          '/london-tours',
          '/london-tours/stonehenge-tour',
          '/london-tours/tower-of-london-tour-london-city-tour',
          '/london-tours/walk-on-walk-off-london-tour-pass',
          '/london-tours/london-walking-tour',
          '/london-tours/houses-of-parliament-tour-westminster-abbey-tour',
          '/london-tours/highgate-cemetery-tour',
          '/london-tours/london-tour-pass-tower-of-london-tickets',
          '/london-tours/walk-on-walk-off-london-tour-pass-thames-cruise',
          '/london-tours/walk-on-walk-off-london-tour-pass-tower-of-london-thames-cruise',
          '/london-tours/walk-on-walk-off-london-tour-pass',
          '/london-tours/walk-on-walk-off-london-tour-pass-tower-of-london-thames-cruise',
          '/london-tours/london-tour-pass-tower-of-london-tickets',
          '/london-tours/walk-on-walk-off-london-tour-pass-thames-cruise',
          '/london-tours/stonehenge-tour',
          '/new-york-tours',
          '/new-york-tours/statue-of-liberty-tour-ellis-island-tour',
          '/new-york-tours/disney-broadway-tours-new-amsterdam-theater',
          '/new-york-tours/New-York-Walking-Tour',
          '/new-york-tours/statue-of-liberty-pedestal-tickets',
          '/new-york-tours/statue-of-liberty-tour-ellis-island-tour',
          '/new-york-tours/world-trade-center-tour-one-world-observatory-tickets',
          '/new-york-tours/tour-statue-of-liberty',
          '/new-york-tours/9-11-museum-tickets-911-memorial-tour',
          '/new-york-tours/freedom-tower-tickets-ground-zero-tour',
          '/new-york-tours/met-tours',
          '/new-york-tours/met-museum-tours',
          '/new-york-tours/disney-broadway-tours-new-amsterdam-theater',
          '/new-york-tours/nypd-tour-mob-mafia',
          '/new-york-tours/greenwich-village-food-tour',
          '/new-york-tours/nypd-tour-mob-mafia',
          '/new-york-tours/nbc-studio-tour',
          '/new-york-tours/New-York-Walking-Tour',
          '/new-york-tours/day-trip-from-new-york-to-washington-dc',
          '/san-francisco-tours',
          '/san-francisco-tours/walk-on-walk-off-san-francisco-tour-pass',
          '/san-francisco-tours/alcatraz-tour-walk-on-walk-off-san-francisco-tour-pass',
          '/san-francisco-tours/walk-on-walk-off-san-francisco-tour-pass',
          '/san-francisco-tours/alcatraz-tour-walk-on-walk-off-san-francisco-tour-pass',
          '/madrid-tours',
          '/madrid-tours/Madrid-Walking-Tour',
          '/madrid-tours/madrid-city-tour',
          '/madrid-tours/real-madrid-stadium-tour',
          '/madrid-tours/Madrid-in-a-day-tour',
          '/madrid-tours/madrid-to-segovia-day-trip',
          '/madrid-tours/madrid-to-toledo-day-trip'
        ],

        renderer: new Renderer({
          maxConcurrentRoutes: 6,
          headless: true,
	        renderAfterTime: 20000
        }),
        renderAfterDocumentEvent: 'render-event',
        //captureAfterElementExists: "meta[name='description']"
/*
        postProcess(context) {
          context.html = context.html.replace('id="app"', 'id="app" data-server-rendered="true"');
          return context;
        }
*/
      })
 //   */

  ]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
