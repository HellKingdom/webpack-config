var bridge = function() {
    // var QWebChannel = require('./libs/js/qwebchannel.js');
    // QWebChannel = QWebChannel.QWebChannel;

    var STATES = {
        'uninitialized': 0,
        'success': 1
    };
    var curState = STATES.uninitialized;
    var waitDoneFunc = [];

    window.zywawa = {
        ready: function(callback) {
            if (typeof callback == 'function') {
                if (curState == STATES.success) {
                    callback(true);
                } else {
                    waitDoneFunc.push(callback);
                }
            }
        },
        _doneReady: function(result) {
            for (var i in waitDoneFunc) {
                waitDoneFunc[i](result);
            }
        },
        _detect: function() {

            var count = 0;

            var loop = function() {
                count++;
                if (zywawa.isReady) {
                    zywawa._doneReady(true);
                } else {
                    setTimeout(function() {
                        loop();
                    }, 300);
                }
            };

            loop();
        },
        qWebInit:function () {
            var QWebCallback = function(channel) {
                var nativeWawa = channel.objects.zywawa;
                zywawa.common = {
                    toid: nativeWawa.toid,
                    token: nativeWawa.token,
                    sid: nativeWawa.sid,
                    cv: nativeWawa.cv,
                    dev: nativeWawa.dev,
                    sign: nativeWawa.sign,
                    conn: nativeWawa.conn,
                    osversion: nativeWawa.osversion,
                    cid:nativeWawa.cid,
                    debug: 1
                };
                zywawa.userInfo = {
                    nickname: nativeWawa.nickname,
                    portrait: nativeWawa.portrait,
                    coin: nativeWawa.coin,
                    fishball: nativeWawa.fishball,
                    gender:nativeWawa.gender,
                    rid:nativeWawa.roomId,
                    code:nativeWawa.icode,
                    no:nativeWawa.zynumber||""
                };
                zywawa.params = "";
                for( var key in zywawa.common){
                    zywawa.params +=("&"+key+"="+zywawa.common[key])
                }
                zywawa.close = nativeWawa.close;
                zywawa.updateRich=nativeWawa.updateRich;
                zywawa.logout = nativeWawa.logout;
                zywawa.setCurTitle = nativeWawa.setCurTitle;
                zywawa.jlog = nativeWawa.jlog;
                zywawa.share =nativeWawa.share;
                zywawa.update_tasks =nativeWawa.update_tasks;

                zywawa.update_splinter=nativeWawa.update_splinter;//翻牌之后传递碎片个数
                zywawa.update_privilege = nativeWawa.update_privilege;//购买了新手特权后调用
                zywawa.splinter_composed =nativeWawa.splinter_composed;//碎片合成
                zywawa.showGameHistory = nativeWawa.showGameHistory;//展示个人中心游戏记录
                zywawa.showMarketDetail = nativeWawa.showMarketDetail;//展示鱼丸商城

                // // GET /user/splinter/depot?debug&toid=1796909596&token=6f748a030637617a637e40d68a7e691c&sid=6f748a030637617a637e40d68a7e691c&cv=v1.1_1.0.0-17121315&
                // // dev=00000000-0000-0000-0000-309C230A278C&sign=b37c2dfc9d463e4b34668f42381a83f7&conn=ethernet&osversion=win_10&cid=1&debug=1 HTTP/1.1
                // zywawa.common = {
                //     toid: "1796909596",
                //     token: "6f748a030637617a637e40d68a7e691c",
                //     sid: "6f748a030637617a637e40d68a7e691c",
                //     cv: "v1.1_1.0.0-17121315",
                //     dev: "00000000-0000-0000-0000-309C230A278C",
                //     sign: "b37c2dfc9d463e4b34668f42381a83f7",
                //     conn: "ethernet",
                //     osversion: "win_10",
                //     cid:1,
                //     debug: 1
                // };
                // zywawa.userInfo = {
                //     nickname: "哈哈哈哈或或或或或或",
                //     portrait: "http://h5.zywawa.com/pc/center/img/11.png",
                //     coin: 247858569,
                //     fishball: 213465478,
                //     gender:0,
                //     rid:"123",
                //     code:"47DLP",
                //     no:53||"",
                // };
                // zywawa.params = "";
                // for( var key in zywawa.common){
                //     zywawa.params +=("&"+key+"="+zywawa.common[key])
                // }
                // console.log(zywawa.params);
                zywawa.isReady = true;
                curState = STATES.success;
            };
            new QWebChannel(qt.webChannelTransport, function(channel) {
                QWebCallback(channel);
            });
            // QWebCallback();
        }
    };
    zywawa.qWebInit();
    zywawa._detect();
    return zywawa;
};



module.exports = bridge();