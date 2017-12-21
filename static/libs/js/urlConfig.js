(function() {
    var Bridge = require('./zyPcBridge.js');
    var urlConfig = {
        pieceImg:"http://pre-h5-claw.diaoyu-1.com/pc/common/libs/img/pieceImg.png",
        avatarDomain:"http://a.avatar.diaoyu-3.com/",
        file_domain:"http://h5.zywawa.com/",
        domain:"http://a.img.diaoyu-3.com/",
        // userInfo: '/common/user/info/',
        myCode: '/user/invitation/info?debug',
        editCode: '/user/invitation/modify?debug',
        useCode: '/user/invitation/award?debug',
        taskList: '/task/mission/lists?debug',
        getReward: '/task/mission/receive?debug',
        recordCoinList: '/user/coin/record?debug',
        wish: '/user/wish/create?debug',
        fishball: '/user/fishball/record?debug',
        qiniu: '/grant/qiniu/token?debug',
        action: '/replay/video/message/',
        playbackVideo: '/replay/video/query',
        playback30sVideo: '/replay/video/share?debug',
        mall:'/mall/goods/lists?debug=1',
        spoils_detail:"/common/wawa/info/",
        appeal: '/game/logic/complain?debug',
        gameHistory:"/user/game/history?debug",
        fishBallHistory:"/user/fishball/record?debug",
        coinHistory:"/user/coin/record?debug",
        doll_manage:"/user/wawa/lists?debug",
        payment:"/payment/order/create?debug=1",
        dayData:"/task/mission/login?debug",
        getLoginreWard:"/task/mission/receive?debug",
        paymentResult:"/payment/notify/query?debug",
        logisticsInfo:"/user/express/getinfo?debug",
        userInfo:"/user/info/get?debug",
        complain:"/game/complain/get?debug=1",
        share:"/common/share/info/pc?debug",
        order_products:"/payment/order/products?debug",
        wardrobe:"/common/user/wardrobe/",
        report_share:"/user/reporter/share",
        piece_get:"/user/splinter/luckydraw?debug",//娃娃碎片获取情况
        overturn_piece:"/user/splinter/obtain?debug",//娃娃碎片翻牌
        check_piece:"/user/splinter/synthesis?debug",//碎片合成接口
        piece_list:"/user/splinter/depot?debug",//碎片仓库
        piece_record:"/user/splinter/record",//碎片记录
    };

    // var API_PREFIX = 'http://api.zywawa.com';

    var API_PREFIX = 'http://pre-api-claw.diaoyu-1.com';
    urlConfig.file_domain = 'http://pre-h5-claw.diaoyu-1.com/';
    // var API_PREFIX = 'http://pre-api-claw.diaoyu-1.com';
    function getApiUrl(path) {
        console.log(API_PREFIX);
        if (/http/.test(path)) {
            return path;
        } else {
            return API_PREFIX + path;
        }
    }

    var API = {
        get: function(path, data, callback) {
            var $defer = $.Deferred();
            if(!zywawa.common.sid){
                zywawa.qWebInit();
            }
            var options = $.extend({}, zywawa.common, data);
            $.ajax({
                type: 'get',
                url: getApiUrl(path),
                data: options,
                dataType: 'json',
                // crossDomain: true,
                // xhrFields: {
                //     withCredentials: true
                // },
                timeout: 20000,
                success: function(data) {
                    typeof(callback) == 'function' && callback(data);
                    if (data) {
                        $defer.resolve(data);
                        if( data.code ){
                            console.log(path);
                            new Toast(data.message)
                        }
                    } else {
                        $defer.reject();
                    }
                },
                error: function(xhr, state) {
                    typeof(callback) == 'function' && callback(state);
                    $defer.reject(state);
                }
            });
            return $defer;
        },
        post: function(path, data, callback) {
            var $defer = $.Deferred();
            if(!zywawa.common.sid){
                zywawa.qWebInit();
            }
            var options = $.extend({}, zywawa.common, data);
            $.ajax({
                type: 'post',
                url: getApiUrl(path),
                data: options,
                dataType: 'json',
                // crossDomain: true,
                // xhrFields: {
                //     withCredentials: true
                // },
                timeout: 20000,
                success: function(data) {
                    typeof(callback) == 'function' && callback(data);

                    if (data) {
                        $defer.resolve(data);
                        if( data.code && path != "/payment/notify/query?debug"){
                            console.log(path);
                            new Toast(data.message)
                        }
                    } else {
                        $defer.reject();
                    }
                },
                error: function(xhr, state) {
                    typeof(callback) == 'function' && callback(state);
                    $defer.reject(state);
                }
            });

            return $defer;
        }
    };


    function getUrlParams() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    };

    //对字符串做base64转换
    var Base64 = {

        // private property
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        // public method for encoding
        encode: function(input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = Base64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        },

        // public method for decoding
        decode: function(input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = Base64._utf8_decode(output);

            return output;

        },

        // private method for UTF-8 encoding
        _utf8_encode: function(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

        // private method for UTF-8 decoding
        _utf8_decode: function(utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while (i < utftext.length) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }
            return string;
        }

    }


    //
    var imgError = function (url) {
        var url = url || "http://h5.zywawa.com/pc/common/libs/img/wawa.png";
        $("img").on("error", function(e){  //加入相应的图片类名
            $(this).attr("src",url );
        });
    };

    $("img").on("error", function(e){  //加入相应的图片类名
        $(this).attr("src", "http://h5.zywawa.com/pc/common/libs/img/wawa.png");
    });

    function getAvatar(str) {
        if( str && str.length > 2 ){
            return urlConfig.domain+ str.substr(2);
        }
        return "";
    }
    //将长连接转换成短连接
    function get_short_url(long_url,callback) {
        $.ajax({
            async:false,
            url: "http://api.ft12.com/api.php",//跨域的dns/document!searchJSONResult.action,
            type: "GET",
            dataType: 'jsonp',
            data: {format:'jsonp',url:long_url},
            timeout: 5000,
            success: function (data) {//客户端jquery预先定义好的callback函数,成功获取跨域服务器上的json数据后,会动态执行这个callback函数

                if(callback){
                    callback(data.url);
                }
            },
            complete: function(XMLHttpRequest, textStatus){
                console.log(XMLHttpRequest);
            },
            error: function(xhr){
                //jsonp 方式此方法不被触发.原因可能是dataType如果指定为jsonp的话,就已经不是ajax事件了
                //请求出错处理
            }
        });
    }
    //下载图片
    function  download_img(imgdata) {
        $("body").on("click",".download",function () {
            var saveFile = function (data, filename) {
                var link = document.createElement('a');
                link.href = data;
                link.download = filename;
                var event = document.createEvent('MouseEvents');
                event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                link.dispatchEvent(event);
            };
            var filename = new Date().toLocaleDateString() + '.png';
            saveFile(imgdata, filename);
        })
    }

    /*
     * 功能：生成一个GUID码，其中GUID以14个以下的日期时间及18个以上的16进制随机数组成，GUID存在一定的重复概率，但重复概率极低，理论上重复概率为每10ms有1/(16^18)，即16的18次方分之1，重复概率低至可忽略不计
     */

    function GUID() {
        this.date = new Date();

        /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
        if (typeof this.newGUID != 'function') {
            /* 生成GUID码 */
            GUID.prototype.newGUID = function() {
                this.date = new Date();
                var guidStr = '';
                sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
                sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
                for (var i = 0; i < 9; i++) {
                    guidStr += Math.floor(Math.random() * 16).toString(16);
                }
                guidStr += sexadecimalDate;
                guidStr += sexadecimalTime;
                while (guidStr.length < 32) {
                    guidStr += Math.floor(Math.random() * 16).toString(16);
                }
                return this.formatGUID(guidStr);
            }

            /*
             * 功能：获取当前日期的GUID格式，即8位数的日期：19700101
             * 返回值：返回GUID日期格式的字条串
             */
            GUID.prototype.getGUIDDate = function() {
                return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
            }

            /*
             * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933
             * 返回值：返回GUID日期格式的字条串
             */
            GUID.prototype.getGUIDTime = function() {
                return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero(parseInt(this.date.getMilliseconds() / 10));
            }

            /*
             * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现
             * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串
             * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串
             */
            GUID.prototype.addZero = function(num) {
                if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
                    return '0' + Math.floor(num);
                } else {
                    return num.toString();
                }
            }

            /*
             * 功能：将y进制的数值，转换为x进制的数值
             * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10
             * 返回值：返回转换后的字符串
             */
            GUID.prototype.hexadecimal = function(num, x, y) {
                if (y != undefined) {
                    return parseInt(num.toString(), y).toString(x);
                } else {
                    return parseInt(num.toString()).toString(x);
                }
            }

            /*
             * 功能：格式化32位的字符串为GUID模式的字符串
             * 参数：第1个参数表示32位的字符串
             * 返回值：标准GUID格式的字符串
             */
            GUID.prototype.formatGUID = function(guidStr) {
                var str1 = guidStr.slice(0, 8) + '-',
                    str2 = guidStr.slice(8, 12) + '-',
                    str3 = guidStr.slice(12, 16) + '-',
                    str4 = guidStr.slice(16, 20) + '-',
                    str5 = guidStr.slice(20);
                return str1 + str2 + str3 + str4 + str5;
            }
        }
    }


    // 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    Date.prototype.Format = function(fmt)
    { //author: meizz
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    }
    window.API = API;
    window.GUID = GUID;
    window.download_img =download_img;
    window.urlConfig = urlConfig;
    window.get_short_url = get_short_url;
    window.getUrlParams = getUrlParams;
    window.Base64 = Base64;
    window.imgError = imgError;
    window.getAvatar = getAvatar
})();