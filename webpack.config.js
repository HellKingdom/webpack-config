var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var buildPath = path.resolve(__dirname, 'dist');
var glob = require('glob');
// //路径定义
var srcDir = path.resolve(process.cwd(), 'static/*/');
var autoprefixer = require('autoprefixer');

var extractCSS;
var cssLoader;
var lessLoader;
extractCSS = new ExtractTextPlugin('[name]/css/[name].css?[contenthash]');
cssLoader = extractCSS.extract({
    loader: 'css-loader',
    options: {
        minimize: false //css压缩
    }
});
lessLoader = extractCSS.extract({
    loader: 'less-loader',
    options: {
        minimize: false //css压缩
    }
});
//获取本地文件夹下的所有文件，生成入口文件
var entries = function () {
    var jsDir = path.resolve(srcDir, 'js');
    var entryFiles = glob.sync(jsDir + '/@(index).js');
    var map = {};
    for (var i = 0; i < entryFiles.length; i++) {
        var filePath = entryFiles[i];
        var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        // var folder =  filePath.substring(getStringLocation(filePath,"/",3)+1, getStringLocation(filePath,"/",2));
        map[filename] = filePath;
    }
    return map;
};

//
var html_plugins = function () {
    var entryHtml = glob.sync(srcDir + '/*.html');
    var r = [];
    var entriesFiles = entries();
    for (var i = 0; i < entryHtml.length; i++) {
        var filePath = entryHtml[i];
        var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        // var folder =  filePath.substring(getStringLocation(filePath,"/",2)+1, getStringLocation(filePath,"/",1));
        var conf = {
            template: filePath,
            filename: filename+"/"+filename + '.html'
        };

        //如果和入口js文件同名
        if (filename in entriesFiles) {
            conf.inject = 'body';
            conf.chunks = ["vendor",filename];
            conf.minify={ //压缩HTML文件
                		removeComments: true, //移除HTML中的注释
                		collapseWhitespace: false //删除空白符与换行符
                	}
        }
        r.push(new HtmlWebpackPlugin(conf))
    }
    return r
};
entries();

module.exports = {
	// context:buildPath,
	entry:Object.assign(entries(), {
        // 用到什么公共lib（例如jquery.js），就把它加进vendor去，目的是将公用库单独提取打包
        'vendor': ['jquery',"global"]
    }),
	output: {
		path: buildPath,
        filename: "[name]/js/[name].[chunkhash:8].js",
        chunkFilename: '[chunkhash:8].chunk.js'
	},
	module: {
		loaders: [{
			test: /\.css$/,
			loader: cssLoader
		}, {
            test: /\.less$/,
            loader: lessLoader
        }, {
            test: /\.(jpg|png)$/,
            loaders: [
                //小于10KB的图片会自动转成dataUrl，
                'url-loader?context=C:/Users/fangx/Desktop/myApp/static&limit=10000&name=/[path][hash:8].[name].[ext]'
            ]
		}, {　　　　　　
			test: /\.html$/,
			loader: 'html-withimg-loader'　　　　
		},{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }],
	},
	plugins: [
		// new webpack.BannerPlugin('版权所有，翻版必究'),
		new CopyWebpackPlugin([{
            from: './static/mock',
            to: buildPath+"/mock"
        }]),

		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			_: 'underscore',
            Swiper:"swiperJs"
		}),
		// new webpack.optimize.UglifyJsPlugin({
		// 	compress: {
		// 		warnings: false
		// 	},
		// 	output: {
		// 		comments: false
		// 	}
		// }),
        extractCSS
	].concat(html_plugins()),
	resolve: {
        extensions: ['.js', '.css', '.scss', '.tpl', '.png', '.jpg'],
		alias: {
			'global': path.resolve(__dirname, './static/libs/js/global.js'),
			'common/resetCss': path.resolve(__dirname, './static/libs/css/reset.css'),
			'jquery': path.resolve(__dirname, './static/libs/js/jquery.js'),
		}
	}
};