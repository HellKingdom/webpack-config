(function() {
    var global = {
        appName: '直播宝',
        IMAGE_1x1: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
        supportPushState: window.history && window.history.pushState && window.history.replaceState,
        go: function(url) {
            //是否支持H5 history浏览
            if (global.supportPushState) {
                page(url);
            } else {
                window.location = url;
            }
        },
        Domain: "", //网页域名配置
        InterfaceDomain:"",//接口域名配置
        fileDomain:"",//静态文件域名配置
        ImgDomain:"",//图片域名配置
        PortraitDomain:"",//头像域名配置
        urlRequestParams: function() {
            //对url对象序列化
            var url = location.search; //获取url中"?"符后的字串
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        },
        calcRootSize: function() {
            //设置fontSize
            var self = this;
            var deviceWidth = window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth;
            var UIWIDTH = 750;
            var rootSize = 100 * deviceWidth / UIWIDTH;
            // $('html').css({
            //     'font-size': rootSize + 'px'
            // });
            // $(window).on('resize', this.calcRootSize);
            document.getElementsByTagName("html")[0].style.fontSize = rootSize + "px";
            window.onresize = function () {
                self.calcRootSize();
            }
        },
        canvasWaterMark: function() {
            //设置水印
            var waterMarkText = global.appName,canvas = document.createElement('canvas'),ctx = canvas.getContext('2d');
            canvas.width = canvas.height = 100;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.globalAlpha = 0.08;
            ctx.font = '20px Microsoft Yahei';
            ctx.translate(50, 50);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText(waterMarkText, 0, 0);
            return canvas;
        },
        compare: function(prop,obj1,obj2) {
            //将对象根据某个属性排序
            return function() {
                var val1 = obj1[prop];
                var val2 = obj2[prop];
                if (val1 < val2) {
                    return 1;
                } else if (val1 >= val2) {
                    return -1;
                } else {
                    return 0;
                }
            }
        },
        myBrowser:function () {
            //判断浏览器类型
            var userAgent = window.navigator.userAgent.toLowerCase(); //取得浏览器的userAgent字符串
            var isOpera = /opera/.test(userAgent);
            if (isOpera) {
                return "opera";
                //判断是否Opera浏览器
            }else if (/firefox/.test(userAgent)) {
                return "FF";
                //判断是否Firefox浏览器
            }else if (/chrome/.test(userAgent)){
                return "Chrome";
            }else if (/safari/.test(userAgent)) {
                return "safari";//判断是否Safari浏览器
            }else if (/compatible/.test(userAgent) && /msie/.test(userAgent) && !isOpera) {
                return "ie";
                //判断是否IE浏览器
            }else if(/micromessenger/.test(userAgent)){
                return "wx";
                //判断是否为支付宝浏览器
            }else if(/alipayclient/.test(userAgent)){
                return "ali";
                //判断是否为支付宝浏览器
            }else{
                return "";
                // 未知类型，作谷歌处理
            }
        },
        isMobile:function () {
            //判断设备类型
            var MOBILE_UA_REGEXP = /(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone|Prerender|MicroMessenger)/i;
            return  MOBILE_UA_REGEXP.test(window.navigator.userAgent);
        },
        changeUrlParams:function (url, arg, val) {
            //替换url中的某个参数，若无则添加该参数
            var pattern = arg+'=([^&]*)';
            var replaceText = arg+'='+val;
            return url.match(pattern) ? url.replace(eval('/('+ arg+'=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url+'&'+replaceText : url+'?'+replaceText);
        },
        ENV:{
            //获取当前的设备属于什么系统
            isIOS: /iPad/i.test(navigator.userAgent) || /iPhone|iPod/i.test(navigator.userAgent),
            isAndroid: /Android/i.test(navigator.userAgent)
        },
        reg_test:function () {
            let mail_reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;//邮箱检测
            let mobile_reg = /^(1[3|4|5|7|8])\d{9}$/;//手机检测
            let passward_reg = /^(?!_)(?!.*?_$)^(?=.{5,15})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*_).*$/;//密码强度检测
            let chinese_reg = /^[\u4e00-\u9fa5]{0,}$///中文检测
        }
    };
    window.global = global;
})();
//
// (function() {
//     var o = $({});
//     $.sub = function() {
//         o.on.apply(o, arguments);
//     };
//     $.unsub = function() {
//         o.off.apply(o, arguments);
//     };
//     $.pub = function() {
//         o.trigger.apply(o, arguments);
//     };
// })();


window.pubsub = {};
//发布订阅流程
(function(myObject) {
    // Storage for topics that can be broadcast
    // or listened to
    var topics = {};
    // An topic identifier
    var subUid = -1;
    // Publish or broadcast events of interest
    // with a specific topic name and arguments
    // such as the data to pass along
    myObject.pub = function( topic, args ) {
        if ( !topics[topic] ) {
            return false;
        }
        var subscribers = topics[topic],
            len = subscribers ? subscribers.length : 0;
        while (len--) {
            subscribers[len].func( args );
        }
        return this;
    };
    // Subscribe to events of interest
    // with a specific topic name and a
    // callback function, to be executed
    // when the topic/event is observed
    myObject.sub = function( topic, func ) {
        if (!topics[topic]) {
            topics[topic] = [];
        }
        var token = ( ++subUid ).toString();
        topics[topic].push({
            token: token,
            func: func
        });
        return token;
    };
    // Unsubscribe from a specific
    // topic, based on a tokenized reference
    // to the subscription
    myObject.unsub = function( token ) {
        for ( var m in topics ) {
            if ( topics[m] ) {
                for ( var i = 0, j = topics[m].length; i < j; i++ ) {
                    if ( topics[m][i].token === token ) {
                        topics[m].splice( i, 1 );
                        return token;
                    }
                }
            }
        }
        return this;
    };
}( pubsub ));