
$(function () {
        var flag = localStorage.getItem("flag");
        var token = localStorage.getItem('token');
        $.ajaxSettings.async = false;
        if (flag && token) {
            var nowtime = parseInt(new Date().getTime() / 1000);
            flag = flag + 19 * 60 * 60;
            if (nowtime >= flag) {
                $.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx291eff92df433407&secret=ece2c106716f4f52dac75ff181a6f3cd', function (res) {
                    console.log(res.access_token);
                    var flagtime = parseInt(new Date().getTime() / 1000);
                    localStorage.setItem('flag', flagtime);
                    localStorage.setItem('token', res.access_token);
                    token = res.access_token;
                });
            }
        } else {
            $.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx291eff92df433407&secret=ece2c106716f4f52dac75ff181a6f3cd', function (res) {
                console.log(res.access_token);
                var flagtime = parseInt(new Date().getTime() / 1000);
                localStorage.setItem('flag', flagtime);
                localStorage.setItem('token', res.access_token);
                flag = flagtime;
                token = res.access_token;
            });
        }
        $.ajaxSettings.async = true;
        ticket();
    function ticket(){
        $.ajaxSettings.async = false;
        var ticket = localStorage.getItem("ticket");
        var ticketime = localStorage.getItem("ticketime");
        if (ticket&&ticket!="undefined") {
            var nowtime = parseInt(new Date().getTime() / 1000);
            ticketime = ticketime + 19 * 60 * 60;
            if (nowtime >= ticketime) {
                $.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + token + "&type=jsapi", function (res) {
                    ticket = res.ticket;
                    var ticketime = parseInt(new Date().getTime() / 1000);
                    localStorage.setItem('ticketime', ticketime);
                    localStorage.setItem('ticket', res.ticket);
                });
            }
        } else {
            $.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + token + "&type=jsapi", function (res) {
                console.log(res);
                ticket = res.ticket;
                if(res.ticket==undefined){
                    return
                }
                var ticketime = parseInt(new Date().getTime() / 1000);
                localStorage.setItem('ticketime', ticketime);
                localStorage.setItem('ticket', res.ticket);
            });
        }
        $.ajaxSettings.async = true;
        sharewx();
        function sharewx(){
            function randomString() {
                var $chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
                var maxPos = $chars.length;
                var pwd = '';
                for (i = 0; i < 32; i++) {
                    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
                }
                return pwd;
            }
            var timestamp = new Date().getTime();
            var timestampNum = randomString();
            var string1 = "jsapi_ticket="+ticket+"&noncestr="+timestampNum+"&timestamp="+timestamp+"&url="+window.location.href;
            var signature = hex_sha1(string1);
            var storename = localStorage.getItem('storename');
            wx.config({
                debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: 'wx291eff92df433407', // 必填，公众号的唯一标识
                timestamp: timestamp, // 必填，生成签名的时间戳
                nonceStr: timestampNum, // 必填，生成签名的随机串
                signature: signature,// 必填，签名，见附录1
                jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareAppMessage', 'onMenuShareQQ'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.checkJsApi({
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                success: function (res) {
                    // 以键值对的形式返回，可用的api值true，不可用为false
                    // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                }
            });
            wx.ready(function () {
                var imgUrl = $(".banner").find('img').attr('src');  //图片LOGO注意必须是绝对路径
                var lineLink = location.href;   //网站网址，必须是绝对路径
                var descContent = '强力推荐！客服全程服务到位，还赠送了流量和话费'; //分享给朋友或朋友圈时的文字简介
                var shareTitle = storename;  //分享title
                var appid = 'wx291eff92df433407'; //apiID，可留空

                function shareFriend() {
                    WeixinJSBridge.invoke('sendAppMessage', {
                        "appid": appid,
                        "img_url": imgUrl,
                        "img_width": "200",
                        "img_height": "200",
                        "link": lineLink,
                        "desc": descContent,
                        "title": shareTitle
                    }, function (res) {
                        //_report('send_msg', res.err_msg);
                    })
                }
                function shareTimeline() {
                    WeixinJSBridge.invoke('shareTimeline', {
                        "img_url": imgUrl,
                        "img_width": "200",
                        "img_height": "200",
                        "link": lineLink,
                        "desc": descContent,
                        "title": shareTitle
                    }, function (res) {
                        //_report('timeline', res.err_msg);
                    });
                }
                function shareWeibo() {
                    WeixinJSBridge.invoke('shareWeibo', {
                        "content": descContent,
                        "url": lineLink
                    }, function (res) {
                        //_report('weibo', res.err_msg);
                    });
                }
                // 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
                document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
                    // 发送给好友
                    WeixinJSBridge.on('menu:share:appmessage', function (argv) {
                        shareFriend();
                    });
                    // 分享到朋友圈
                    WeixinJSBridge.on('menu:share:timeline', function (argv) {
                        shareTimeline();
                    });
                    // 分享到微博
                    WeixinJSBridge.on('menu:share:weibo', function (argv) {
                        shareWeibo();
                    });
                }, false);
            });
        }
    }
});
