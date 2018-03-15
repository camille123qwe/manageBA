/**
 * Created by xuwf on 2017/3/29.
 */
(function (doc, win) {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                docEl.style.fontSize = 20 * (clientWidth / 375) + 'px';
            };
    } else {
        var container = $(".container");
        container.width(750);
        container.css("margin", "auto");
        var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
                var clientWidth = 750;
                if (!clientWidth) return;
                docEl.style.fontSize = 20 * (clientWidth / 375) + 'px';
            };
    }
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
$(function () {
    //根据门店36id获取门店信息
    //此处需要截取门店36id拼接在路径后
    var src = window.location.href;
    //var src = 'http://merch.diancall.com/modules/share/sharestore/sharestore.html?StoreId=evu7y&from=singlemessage&isappinstalled=1';
    //var src = 'http://merch.diancall.com/modules/share/sharestore/sharestore.html?StoreId=evu4n';
    var storeidstr = src.substr(src.indexOf('?StoreId='), 14);
    var store36id = storeidstr.split("=")[1];
    var taskidstr = src.substr(src.indexOf('?TaskId='), 24);
    var taskid = taskidstr.split("=")[1];
    var storeurl = 'http://merch.diancall.com/pipes/share/findstoreinfo/' + store36id;
    $.get(storeurl, function (res) {
        res = JSON.parse(res);
        $("#addr").text(res.storeaddr);
        var tel = res.storetel || "暂无";
        $("#tel").text(tel);
        if (res.storeface) {
            $(".banner").children('img').attr('src', "http://merch.diancall.com/dir/storeface_900/" + res.storeface);
        } else {
            $(".banner").children('img').attr('src', "js/bg@2x.png");
        }
        // if(res.storeimgs){
        //     var imgarr = res.storeimgs.split(';');
        //     for(var i=0;i<imgarr.length;i++){
        //         $('.banner').append('<div style="width: 18.75rem;min-height: 11.25rem;"><img style="max-width: 100%;max-height: 100%;" src="http://merch.diancall.com/dir/storeimg_720/'+imgarr[i]+'"></div>')
        //     }
        // }
        document.title = res.storename;
        if(localStorage.getItem('storename')){
            localStorage.removeItem('storename');
            localStorage.setItem('storename',res.storename);
        }else{
            localStorage.setItem('storename',res.storename);
        }
       // console.log(localStorage.getItem('storename'));
    });
    //根据门店10进制id获取商品信息
    var storeid = parseInt(store36id, 36);
    var data = {
        storeid: storeid,
        status:[10]
    };
    $.ajax({
        url: "http://merch.diancall.com/pipes/custgoods/query",
        type: "post",
        data: { "bean": JSON.stringify(data) },
        dataType: "JSON",
        error: function (err) {
            console.log(err);
        },
        success: function (res) {
            var arr = res.rows || [];
            //console.log(arr);
            if (res.length == 0) {
                $('.goodsList').html('<p style="padding: 1rem">暂无</p>');
            } else {
                var _html = "";
                var ilength = arr.length;
                if(arr.length>=5){
                    ilength = 5;
                }else{
                    ilength = arr.length;
                }
                for (var i = 0; i < ilength; i++) {
                    var desc = "";
                    if (arr[i].goodsdesc) {
                        desc = arr[i].goodsdesc
                    } else {
                        desc = "暂无描述"
                    }
                    var marketPrice = "";
                    if (arr[i].marketprice) {
                        marketPrice = "￥" + arr[i].marketprice / 100;
                    } else {
                        marketPrice = "暂无市场价";
                    }
                    var storeface = "";
                    if (arr[i].goodsface) {
                        goodsface = "http://merch.diancall.com/pipes/img/goods_900/" + arr[i].goodsface;
                    } else {
                        goodsface = "js/bg@2x.png";
                    }
                    var goodsname = "";
                    if (arr[i].goodsname) {
                        goodsname = arr[i].goodsname;
                    } else {
                        goodsname = "超值超优惠"
                    }
                    var sellprice = "";
                    if(arr[i].sellprice==0){
                        sellprice = "待定"
                    }else{
                        sellprice = '￥'+arr[i].sellprice / 100;
                    }
                    _html += '<li><div><img src="' + goodsface + '" alt="商品图片暂无"></div>' +
                        '<div><h1>' + goodsname + '</h1>' +
                        '<h2>' + desc + '</h2>' +
                        '<h4>' +sellprice+ '<span>' + marketPrice + '</span></h4></div></li>'
                }
                $(".goodsList").children('ul').html(_html);
            }
        }
    });
    //根据门店ID获取优惠券列表
    var quanurl = 'http://merch.diancall.com/pipes/custquan/query/' + store36id;
    $.get(quanurl, function (res) {
        res = JSON.parse(res) || [];
        if (res.length == 0) {
            $(".coupon").css('display', 'none');
            return;
        }
        var _html = "";
        var validtime = "";
        for (var i = 0; i < res.length; i++) {
            if (res[i].endtime == 0) {
                validtime = "自" + time(res[i].starttime) + "起长期永久有效";
            } else {
                validtime = "截止" + time(res[i].endtime);
            }
            _html += '<li><span>' + res[i].quantitle + '</span>' +
                '<span>' + validtime + '</span></li>'
        }
        $(".couponList").children('ul').html(_html);
    });
    function time(date) {
        var year = new Date(date).getFullYear();
        var month = new Date(date).getMonth() + 1;
        var date1 = new Date(date).getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (date1 < 10) {
            date1 = "0" + date1;
        }
        var result = year + "-" + month + "-" + date1;
        return result;
    }
    $("#submit").click(function () {
        location.href = "http://merch.diancall.com/modules/share/shareLogin/shareLogin.html" + "?StoreId=" + store36id + "?TaskId=" + taskid;
    });
  /*
    $('.banner').click(function () {
        location.href = "http://merch.diancall.com/modules/share/shareLogin/shareLogin.html" + "?StoreId=" + store36id + "?TaskId=" + taskid;
    });
    $('.goodsList').on('click','li',function () {
        location.href = "http://merch.diancall.com/modules/share/shareLogin/shareLogin.html" + "?StoreId=" + store36id + "?TaskId=" + taskid;
    });
    $('.couponList').on('click','li',function () {
        location.href = "http://merch.diancall.com/modules/share/shareLogin/shareLogin.html" + "?StoreId=" + store36id + "?TaskId=" + taskid;
    });*/

    //微信接口----------------------------------------------
    function randomString() {
        var $chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
        var maxPos = $chars.length;
        var pwd = '';
        for (i = 0; i < 32; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }
    var timestampNum = randomString();
    src = src.split("#")[0];
    var getsrc = encodeURIComponent(src);
    $.get('/pipes/wechat/getaccesstoken?url='+getsrc+'&noncestr='+timestampNum,function(res){
        res = JSON.parse(res);
        //console.log(res);
        var timestamp = res.timestamp;
        var signature = res.signature;
        var storename = localStorage.getItem('storename');
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wx58861130a10e525b', // 必填，公众号的唯一标识
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
            var lineLink = src;   //网站网址，必须是绝对路径
            var descContent = '强力推荐！客服全程服务到位，还赠送了流量和话费'; //分享给朋友或朋友圈时的文字简介
            var shareTitle = storename;  //分享title
            var appid = 'wx291eff92df433407'; //apiID，可留空
            //分享给朋友
            wx.onMenuShareAppMessage({
                title: storename, // 分享标题
                desc: '强力推荐！客服全程服务到位，还赠送了流量和话费', // 分享描述
                link: lineLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            //分享到朋友圈
            wx.onMenuShareTimeline({
                title: storename, // 分享标题
                desc: '强力推荐！客服全程服务到位，还赠送了流量和话费', // 分享描述
                link: lineLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            //分享到qq
            wx.onMenuShareQQ({
                title: storename, // 分享标题
                desc: '强力推荐！客服全程服务到位，还赠送了流量和话费', // 分享描述
                link: lineLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            //分享到qq空间
            wx.onMenuShareQZone({
                title: storename, // 分享标题
                desc: '强力推荐！客服全程服务到位，还赠送了流量和话费', // 分享描述
                link: lineLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        });
    })

});