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

const googleTag1Replace = '<script>\n' +
  '    window.dataLayer = window.dataLayer || [];\n' +
  '    window.dataLayer.push({originalLocation: document.location.protocol + "//" + document.location.hostname + document.location.pathname + document.location.search});\n' +
  '    (function (w, d, s, l, i) {\n' +
  '      if (window._didAsyncInjectGoogleAnalytics) return; // <----- here; prevents exec twice\n' +
  '      w[l] = w[l] || []; w[l].push({\'gtm.start\':\n' +
  '          new Date().getTime(),\n' +
  '        event: \'gtm.js\'}); var f = d.getElementsByTagName(s)[0],\n' +
  '        j = d.createElement(s), dl = l != \'dataLayer\' ? \'&l=\' + l : \'\'; j.async = true; j.src =\n' +
  '        \'https://www.googletagmanager.com/gtm.js?id=\' + i + dl; f.parentNode.insertBefore(j, f)\n' +
  '        window._didAsyncInjectGoogleAnalytics = true; // <----- here\n' +
  '    })(window, document, \'script\', \'dataLayer\', \'GTM-K2FSVLT\')\n' +
  '  </script></head>'

  const zendeskReplace = '<script type="text/JavaScript">\n' +
  '    window.zESettings = {\n' +
  '     webWidget: {\n' +
  '       contactForm: {\n' +
  '       subject: true,\n' +
  '      }\n' +
  '     }\n' +
  '    };\n' +
  '    </script>\n' +
  '    <script>\n' +
  '        /*<![CDATA[*/window.zE||(function(e,t,s){var n=window.zE=window.zEmbed=function(){n._.push(arguments)}, a=n.s=e.createElement(t),r=e.getElementsByTagName(t)[0];n.set=function(e){ n.set._.push(e)},n._=[],n.set._=[],a.async=true,a.setAttribute("charset","utf-8"), a.src="https://static.zdassets.com/ekr/asset_composer.js?key="+s, n.t=+new Date,a.type="text/javascript",r.parentNode.insertBefore(a,r)})(document,"script","85674609-900e-4d02-820e-4a3a0998e7d9");/*]]>*/\n' +
  '    </script>'

const googleTag2Replace = '<body><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K2FSVLT"\n' +
  '                  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>'

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

      routes: [
        '/',
        '/contact/',
        '/cancellation-policy/',
        '/privacy-policy/',
        '/terms/',
        '/careers/',
        '/payment/',
        '/confirm/',
        '/cookies-policy',
        '/venice-tours/st-marks-basilica-doges-palace-tours-compare/',
        '/rome-tours/rome-colosseum-tour-compare/',
        '/paris-tours/louvre-tours-compare/',
        '/rome-tours/vatican-tours-compare/',
        '/barcelona-tours/barcelona-sagrada-familia-tours-compare/',
        '/florence-tours/florence-david-duomo-tours-compare/',
        '/new-york-tours/911-memorial-tours-compare/',
        '/florence-tours/florence-uffizi-tours-compare/',
        '/new-york-tours/statue-of-liberty-tours-compare/',
        '/rome-tours/',
        '/rome-tours/pristine-sistine-chapel-tour/',
        '/rome-tours/pristine-sistine-chapel-tour/reviews/',
        '/rome-tours/rome-in-a-day-tour/',
        '/rome-tours/rome-in-a-day-tour/reviews/',
        '/rome-tours/complete-vatican-tour/',
        '/rome-tours/complete-vatican-tour/reviews/',
        '/rome-tours/sistine-chapel-tickets-express-tour/',
        '/rome-tours/sistine-chapel-tickets-express-tour/reviews/',
        '/rome-tours/colosseum-undergound-tour/',
        '/rome-tours/colosseum-undergound-tour/reviews/',
        '/rome-tours/rome-colosseum-tour/',
        '/rome-tours/rome-colosseum-tour/reviews/',
        '/rome-tours/rome-caesars-palace-tour-colosseum/',
        '/rome-tours/rome-caesars-palace-tour-colosseum/reviews/',
        '/rome-tours/colosseum-night-tour-underground/',
        '/rome-tours/colosseum-night-tour-underground/reviews/',
        '/rome-tours/colosseum-tours-rome/',
        '/rome-tours/colosseum-tours-rome/reviews/',
        '/rome-tours/domus-aurea-rome-tour/',
        '/rome-tours/domus-aurea-rome-tour/reviews/',
        '/rome-tours/colosseum-tour-virtual-reality-gladiators-barracks/',
        '/rome-tours/colosseum-tour-virtual-reality-gladiators-barracks/reviews/',
        '/rome-tours/top-tier-colosseum-tour/',
        '/rome-tours/top-tier-colosseum-tour/reviews/',
        '/rome-tours/walk-on-walk-off-rome-tour-pass/',
        '/rome-tours/walk-on-walk-off-rome-tour-pass/reviews/',
        '/rome-tours/walk-on-walk-off-rome-vatican-tickets/',
        '/rome-tours/walk-on-walk-off-rome-vatican-tickets/reviews/',
        '/rome-tours/roma-pass-colosseum-tickets-rome-tour-pass/',
        '/rome-tours/roma-pass-colosseum-tickets-rome-tour-pass/reviews/',
        '/rome-tours/rome-tour-pass-vatican-tickets-roma-pass/',
        '/rome-tours/rome-tour-pass-vatican-tickets-roma-pass/reviews/',
        '/rome-tours/borghese-gallery-tour/',
        '/rome-tours/borghese-gallery-tour/reviews/',
        '/rome-tours/castel-gandolfo-tour-ostia-antica/',
        '/rome-tours/castel-gandolfo-tour-ostia-antica/reviews/',
        '/rome-tours/pompeii-day-trip-from-rome/',
        '/rome-tours/pompeii-day-trip-from-rome/reviews/',
        '/rome-tours/tuscany-from-rome-day-trip/',
        '/rome-tours/tuscany-from-rome-day-trip/reviews/',
        '/rome-tours/amalfi-coast-from-rome-day-trip/',
        '/rome-tours/amalfi-coast-from-rome-day-trip/reviews/',
        '/rome-tours/cinque-terre-tours-from-rome/',
        '/rome-tours/cinque-terre-tours-from-rome/reviews/',
        '/rome-tours/rome-catacombs-tour/',
        '/rome-tours/rome-catacombs-tour/reviews/',
        '/rome-tours/rome-underground-tour-catacombs-at-night/',
        '/rome-tours/rome-underground-tour-catacombs-at-night/reviews/',
        '/rome-tours/cooking-classes-in-rome/',
        '/rome-tours/cooking-classes-in-rome/reviews/',
        '/rome-tours/rome-food-tour/',
        '/rome-tours/rome-food-tour/reviews/',
        '/rome-tours/rome-walking-tour/',
        '/rome-tours/rome-walking-tour/reviews/',
        '/rome-tours/ancient-rome-tour/',
        '/rome-tours/ancient-rome-tour/reviews/',
        '/rome-tours/st-peters-basilica-tour/',
        '/rome-tours/st-peters-basilica-tour/reviews/',
        '/rome-tours/rome-night-tour-forum-lightshow/',
        '/rome-tours/rome-night-tour-forum-lightshow/reviews/',
        '/rome-tours/vatican-museums-tour-highlights/',
        '/rome-tours/vatican-museums-tour-highlights/reviews/',
        '/rome-tours/rome-to-florence-day-trip/',
        '/rome-tours/rome-to-florence-day-trip/reviews/',
        '/rome-tours/vatican-at-night-tour/',
        '/rome-tours/vatican-at-night-tour/reviews/',
        '/florence-tours/',
        '/florence-tours/david-florence-tours/',
        '/florence-tours/david-florence-tours/reviews/',
        '/florence-tours/vip-florence-duomo-tour/',
        '/florence-tours/vip-florence-duomo-tour/reviews/',
        '/florence-tours/florence-in-a-day-tour/',
        '/florence-tours/florence-in-a-day-tour/reviews/',
        '/florence-tours/uffizi-and-accademia-tickets/',
        '/florence-tours/uffizi-and-accademia-tickets/reviews/',
        '/florence-tours/uffizi-tour/',
        '/florence-tours/uffizi-tour/reviews/',
        '/florence-tours/uffizi-gallery-tickets/',
        '/florence-tours/uffizi-gallery-tickets/reviews/',
        '/florence-tours/tuscany-tours-from-florence/',
        '/florence-tours/tuscany-tours-from-florence/reviews/',
        '/florence-tours/florence-walking-tour/',
        '/florence-tours/florence-walking-tour/reviews/',
        '/florence-tours/after-hours-florence-accademia-tickets/',
        '/florence-tours/after-hours-florence-accademia-tickets/reviews/',
        '/florence-tours/florence-food-tour-dine-around/',
        '/florence-tours/florence-food-tour-dine-around/reviews/',
        '/venice-tours/',
        '/venice-tours/doges-palace-tour/',
        '/venice-tours/doges-palace-tour/reviews/',
        '/venice-tours/venice-walking-tour-gondola-ride/',
        '/venice-tours/venice-walking-tour-gondola-ride/reviews/',
        '/venice-tours/st-marks-basilica-at-night-tour/',
        '/venice-tours/st-marks-basilica-at-night-tour/reviews/',
        '/venice-tours/st-marks-basilica-doges-palace-night-tour/',
        '/venice-tours/st-marks-basilica-doges-palace-night-tour/reviews/',
        '/venice-tours/doges-palace-secret-itineraries-tour/',
        '/venice-tours/doges-palace-secret-itineraries-tour/reviews/',
        '/venice-tours/venice-in-a-day-tour/',
        '/venice-tours/venice-in-a-day-tour/reviews/',
        '/venice-tours/venice-food-tour/',
        '/venice-tours/venice-food-tour/reviews/',
        '/venice-tours/verona-day-trip-from-venice/',
        '/venice-tours/verona-day-trip-from-venice/reviews/',
        '/venice-tours/venice-boat-tour/',
        '/venice-tours/venice-boat-tour/reviews/',
        '/milan-tours/',
        '/milan-tours/last-supper-tickets-milan-tours/',
        '/milan-tours/last-supper-tickets-milan-tours/reviews/',
        '/pompeii-tours/',
        '/pompeii-tours/pompeii-day-trip-from-rome/',
        '/pompeii-tours/pompeii-day-trip-from-rome/reviews/',
        '/pompeii-tours/best-of-pompeii-tour/',
        '/pompeii-tours/best-of-pompeii-tour/reviews/',
        '/paris-tours/',
        '/paris-tours/paris-catacombs-tour/',
        '/paris-tours/paris-catacombs-tour/reviews/',
        '/paris-tours/paris-city-tour/',
        '/paris-tours/paris-city-tour/reviews/',
        '/paris-tours/notre-dame-tour-sainte-chapelle-tickets/',
        '/paris-tours/notre-dame-tour-sainte-chapelle-tickets/reviews/',
        '/paris-tours/paris-walking-tour/',
        '/paris-tours/paris-walking-tour/reviews/',
        '/paris-tours/louvre-tour-mona-lisa/',
        '/paris-tours/louvre-tour-mona-lisa/reviews/',
        '/paris-tours/louvre-museum-tour-tickets/',
        '/paris-tours/louvre-museum-tour-tickets/reviews/',
        '/paris-tours/paris-to-mont-st-michel-day-trip/',
        '/paris-tours/paris-to-mont-st-michel-day-trip/reviews/',
        '/paris-tours/paris-to-versailles-day-trip/',
        '/paris-tours/paris-to-versailles-day-trip/reviews/',
        '/paris-tours/paris-to-bordeaux-wine-tour/',
        '/paris-tours/paris-to-bordeaux-wine-tour/reviews/',
        '/paris-tours/champagne-tours-from-paris/',
        '/paris-tours/champagne-tours-from-paris/reviews/',
        '/paris-tours/versailles-tour-from-paris/',
        '/paris-tours/versailles-tour-from-paris/reviews/',
        '/paris-tours/small-group-paris-catacombs-tour/',
        '/paris-tours/small-group-paris-catacombs-tour/reviews/',
        '/paris-tours/ile-de-la-cite-tour/',
        '/paris-tours/ile-de-la-cite-tour/reviews/',
        '/barcelona-tours/',
        '/barcelona-tours/barcelona-in-a-day-tour/',
        '/barcelona-tours/barcelona-in-a-day-tour/reviews/',
        '/barcelona-tours/barcelona-to-girona-day-trip/',
        '/barcelona-tours/barcelona-to-girona-day-trip/reviews/',
        '/barcelona-tours/barcelona-city-tour/',
        '/barcelona-tours/barcelona-city-tour/reviews/',
        '/barcelona-tours/montserrat-tour-day-trip-from-barcelona/',
        '/barcelona-tours/montserrat-tour-day-trip-from-barcelona/reviews/',
        '/barcelona-tours/sagrada-familia-tour/',
        '/barcelona-tours/sagrada-familia-tour/reviews/',
        '/barcelona-tours/barcelona-cooking-class/',
        '/barcelona-tours/barcelona-cooking-class/reviews/',
        '/barcelona-tours/complete-gaudi-tour-casa-batllo/',
        '/barcelona-tours/complete-gaudi-tour-casa-batllo/reviews/',
        '/london-tours/',
        '/london-tours/tower-of-london-tour-london-city-tour/',
        '/london-tours/tower-of-london-tour-london-city-tour/reviews/',
        '/london-tours/walk-on-walk-off-london-tour-pass/',
        '/london-tours/walk-on-walk-off-london-tour-pass/reviews/',
        '/london-tours/london-walking-tour/',
        '/london-tours/london-walking-tour/reviews/',
        '/london-tours/houses-of-parliament-tour-westminster-abbey-tour/',
        '/london-tours/houses-of-parliament-tour-westminster-abbey-tour/reviews/',
        '/london-tours/highgate-cemetery-tour/',
        '/london-tours/highgate-cemetery-tour/reviews/',
        '/london-tours/walk-on-walk-off-london-tour-pass-thames-cruise/',
        '/london-tours/walk-on-walk-off-london-tour-pass-thames-cruise/reviews/',
        '/london-tours/walk-on-walk-off-london-tour-pass-tower-of-london-thames-cruise/',
        '/london-tours/walk-on-walk-off-london-tour-pass-tower-of-london-thames-cruise/reviews/',
        '/london-tours/london-tour-pass-tower-of-london-tickets/',
        '/london-tours/london-tour-pass-tower-of-london-tickets/reviews/',
        '/london-tours/stonehenge-tour/',
        '/london-tours/stonehenge-tour/reviews/',
        '/new-york-tours/',
        '/new-york-tours/statue-of-liberty-tour-ellis-island-tour/',
        '/new-york-tours/statue-of-liberty-tour-ellis-island-tour/reviews/',
        '/new-york-tours/disney-broadway-tours-new-amsterdam-theater/',
        '/new-york-tours/disney-broadway-tours-new-amsterdam-theater/reviews/',
        '/new-york-tours/New-York-Walking-Tour/',
        '/new-york-tours/New-York-Walking-Tour/reviews/',
        '/new-york-tours/statue-of-liberty-pedestal-tickets/',
        '/new-york-tours/statue-of-liberty-pedestal-tickets/reviews/',
        '/new-york-tours/world-trade-center-tour-one-world-observatory-tickets/',
        '/new-york-tours/world-trade-center-tour-one-world-observatory-tickets/reviews/',
        '/new-york-tours/tour-statue-of-liberty/',
        '/new-york-tours/tour-statue-of-liberty/reviews/',
        '/new-york-tours/ground-zero-tour-911-museum-tickets/',
        '/new-york-tours/ground-zero-tour-911-museum-tickets/reviews/',
        '/new-york-tours/9-11-museum-tickets-911-memorial-tour/',
        '/new-york-tours/9-11-museum-tickets-911-memorial-tour/reviews/',
        '/new-york-tours/freedom-tower-tickets-ground-zero-tour/',
        '/new-york-tours/freedom-tower-tickets-ground-zero-tour/reviews/',
        '/new-york-tours/met-tours/',
        '/new-york-tours/met-tours/reviews/',
        '/new-york-tours/met-museum-tours/',
        '/new-york-tours/met-museum-tours/reviews/',
        '/new-york-tours/nypd-tour-mob-mafia/',
        '/new-york-tours/nypd-tour-mob-mafia/reviews/',
        '/new-york-tours/greenwich-village-food-tour/',
        '/new-york-tours/greenwich-village-food-tour/reviews/',
        '/new-york-tours/nbc-studio-tour/',
        '/new-york-tours/nbc-studio-tour/reviews/',
        '/new-york-tours/day-trip-from-new-york-to-washington-dc/',
        '/new-york-tours/day-trip-from-new-york-to-washington-dc/reviews/',
        '/new-york-tours/new-york-in-a-day-tour/',
        '/new-york-tours/new-york-in-a-day-tour/reviews/',
        '/san-francisco-tours/',
        '/san-francisco-tours/san-francisco-day-tour/',
        '/san-francisco-tours/san-francisco-day-tour/reviews',
        '/san-francisco-tours/alcatraz-ticket-and-chinatown-tour/',
        '/san-francisco-tours/alcatraz-ticket-and-chinatown-tour/reviews',
        '/san-francisco-tours/walk-on-walk-off-san-francisco-tour-pass/',
        '/san-francisco-tours/walk-on-walk-off-san-francisco-tour-pass/reviews/',
        '/san-francisco-tours/alcatraz-tour-walk-on-walk-off-san-francisco-tour-pass/',
        '/san-francisco-tours/alcatraz-tour-walk-on-walk-off-san-francisco-tour-pass/reviews/',
        '/madrid-tours/',
        '/madrid-tours/Madrid-Walking-Tour/',
        '/madrid-tours/Madrid-Walking-Tour/reviews/',
        '/madrid-tours/real-madrid-stadium-tour/',
        '/madrid-tours/real-madrid-stadium-tour/reviews/',
        '/madrid-tours/madrid-in-a-day-tour/',
        '/madrid-tours/madrid-in-a-day-tour/reviews/',
        '/madrid-tours/madrid-city-tour/',
        '/madrid-tours/madrid-city-tour/reviews/',
        '/madrid-tours/madrid-to-segovia-day-trip/',
        '/madrid-tours/madrid-to-segovia-day-trip/reviews/',
        '/madrid-tours/madrid-to-toledo-day-trip/',
        '/madrid-tours/madrid-to-toledo-day-trip/reviews/',
        '/guide/angelo/',
        '/guide/giulietta/',
        '/guide/tiberio/',
        '/new-orleans-tours/',
        '/new-orleans-tours/new-orleans-day-tour/',
        '/new-orleans-tours/new-orleans-day-tour/reviews/',
        '/new-orleans-tours/garden-district-tour/',
        '/new-orleans-tours/garden-district-tour/reviews/',
        '/new-orleans-tours/mardi-gras-tour/',
        '/new-orleans-tours/mardi-gras-tour/reviews/',
        '/new-orleans-tours/french-quarter-tour/',
        '/new-orleans-tours/french-quarter-tour/reviews/',
        '/athens-tours/',
        '/athens-tours/pristine-parthenon-acropolis-tour/',
        '/athens-tours/pristine-parthenon-acropolis-tour/reviews/',
        '/athens-tours/athens-city-tour/',
        '/athens-tours/athens-city-tour/reviews/',
        '/athens-tours/acropolis-museum-tour/',
        '/athens-tours/acropolis-museum-tour/reviews/',
        '/athens-tours/athens-day-tour/',
        '/athens-tours/athens-day-tour/reviews/',
        '/rome-tours/castel-gandolfo-tour/',
        '/rome-tours/castel-gandolfo-tour/reviews/',
        '/florence-tours/florence-duomo-tour/',
        '/florence-tours/florence-duomo-tour/reviews/',
        '/rome-tours/pristine-sistine-breakfast-vatican-tour/',
        '/rome-tours/pristine-sistine-breakfast-vatican-tour/reviews/',
        '/san-francisco-tours/napa-and-sonoma-wine-tour/',
        '/san-francisco-tours/napa-and-sonoma-wine-tour/reviews/',
        '/florence-tours/statue-of-david-tickets-aperitivo-tour/',
        '/florence-tours/statue-of-david-tickets-aperitivo-tour/reviews/',
        '/london-tours/changing-of-the-guard-tour/',
        '/london-tours/changing-of-the-guard-tour/reviews/',
        '/london-tours/houses-of-parliament-guided-tour/',
        '/london-tours/houses-of-parliament-guided-tour/reviews/',
        '/venice-tours/venice-food-and-wine-tour/',
        '/venice-tours/venice-food-and-wine-tour/reviews/',
        '/paris-tours/Musee-dorsay-tour/',
        '/paris-tours/Musee-dorsay-tour/reviews/',
        '/rome-tours/rome-highlights-tour/',
        '/rome-tours/rome-highlights-tour/reviews/',
        '/florence-tours/florence-to-pisa-day-trip/',
        '/florence-tours/florence-to-pisa-day-trip/reviews/',
        '/london-tours/tower-of-london-guided-tour/',
        '/london-tours/tower-of-london-guided-tour/reviews/',
        '/paris-tours/louvre-guided-tour/',
        '/paris-tours/louvre-guided-tour/reviews/',
        '/venice-tours/murano-burano-tour/',
        '/venice-tours/murano-burano-tour/reviews/',
        '/barcelona-tours/barcelona-food-tour/',
        '/barcelona-tours/barcelona-food-tour/reviews/',
        '/paris-tours/loire-valley-day-trip-from-paris/',
        '/paris-tours/loire-valley-day-trip-from-paris/reviews/',
        '/london-tours/parliament-tour-house-of-lords-tour/',
        '/london-tours/parliament-tour-house-of-lords-tour/reviews/',
        '/new-york-tours/metropolitan-museum-of-art-tour/',
        '/new-york-tours/metropolitan-museum-of-art-tour/reviews/',
        '/florence-tours/pisa-tour-from-florence/',
        '/florence-tours/pisa-tour-from-florence/reviews',
        '/florence-tours/gourmet-day-trip-from-florence/',
        '/florence-tours/gourmet-day-trip-from-florence/reviews/',
        '/san-francisco-tours/san-francisco-victorian-houses-tour/',
        '/san-francisco-tours/san-francisco-victorian-houses-tour/reviews/',
        '/new-york-tours/closing-time-at-met-museum-tour/',
        '/new-york-tours/closing-time-at-met-museum-tour/reviews/'
      ],

      renderer: new Renderer({
        maxConcurrentRoutes: 12,
        headless: true,
        renderAfterTime: 45000,
        inject: {IS_PRERENDERING: true}
      }),
      renderAfterDocumentEvent: 'render-event',
      //captureAfterElementExists: "meta[name='description']"
      /*
              postProcess(context) {
                context.html = context.html.replace('id="app"', 'id="app" data-server-rendered="true"');
                return context;
              }
      */
      postProcess(context) {
        // Move the title up to the top because seo
        let titleTag = context.html.match(/<title>[^<]*<\/title>/i);
        if (titleTag !== null) {
          context.html = context.html.replace(/<title>[^<]*<\/title>/i, '')
          context.html = context.html.replace(/<head>/i, '<head>' + titleTag[0])
        }

        // Add google Tag Manager Snippets
        if (!context.html.match(/K2FSVLT/)) {
          context.html = context.html.replace(/<\/head>/i, googleTag1Replace)
          context.html = context.html.replace(/<body>/i, googleTag2Replace)
        }

        //Add Zendesk Snippet
        if (context.html.match(/K2FSVLT/)) {
          context.html = context.html.replace(/<\/head>/i, zendeskReplace)
        }
        return context
      }
    })


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
