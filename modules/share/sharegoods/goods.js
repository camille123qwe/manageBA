/**
 * Created by xuwf on 2017/3/30.
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
    //判断是移动端还是PC端
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
        var mc_container = $(".mc_container");
        container.width(750);
        container.css("margin","auto");
        mc_container.width(750);
        mc_container.css('left','50%');
        mc_container.css('marginLeft',"-375px");
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
$(function(){
    var src = window.location.href;
    //var src = 'http://merch.diancall.com/pipes/share/findgoodsinfo?StoreId=evu78?GoodsId=1njcnt';
    var storeidstr = src.substr(src.indexOf('?StoreId='),14);
    var store36id = storeidstr.split("=")[1];
    var goods36str = src.substr(src.indexOf('?GoodsId='),15);
    var goods36id = goods36str.split("=")[1];
    var taskidstr = src.substr(src.indexOf('?TaskId='), 24);
    var taskid = taskidstr.split("=")[1];
    //获取商品详情信息 此处需截取商品的36id
    //var goodsurl = 'http://merch.diancall.com/pipes/share/findgoodsinfo/'+goods36id;
    var goodsurl = 'http://merch.diancall.com/pipes/custgoods/find/'+goods36id;
    var storeinfourl = 'http://merch.diancall.com/pipes/share/findstoreinfo/'+store36id;
    $.get(storeinfourl,function(res){
         res = JSON.parse(res);
        $("#shopName").text(res.storename);
        $("#shopaddr").text(res.storeaddr)
    });
    $.ajaxSettings.async = false;
    $.get(goodsurl,function(res){
        res = JSON.parse(res);
        $(".banner").find('img').attr("src","http://merch.diancall.com/pipes/img/goods_900/"+res.goodsface);
        if(res.goodsimgs){
            $(".banner").empty();
            var imgarr = res.goodsimgs.split(';');
            for(var i=0;i<imgarr.length;i++){
                $('.banner').append('<div style="width: 18.75rem;min-height: 11.25rem;"><img style="max-width: 100%;max-height: 100%;" src="http://merch.diancall.com/pipes/img/goods_900/'+imgarr[i]+'"></div>')
            }
        }
        if(res.sellprice==0){
            $('#sellprice').find('span').text("待定");
        }else{
            $('#sellprice').find('span').text("￥"+res.sellprice/100);
        }
        var marketPrice = "";
        if(res.marketprice){
            if(res.sellprice>=res.marketprice){
                    marketPrice = "";
            }else{
                marketPrice = "<i style='padding-right: 0.5rem;font-style: normal'>市场价</i>￥"+'<span>'+res.marketprice/100+'</span>';
            }
        }else{
            marketPrice = "";
        }
        $(".headfooter").find("h1").html(res.goodsname);
        if(res.goodsdesc){
            $(".goodsdesc").find('p').html(res.goodsdesc);
        }else{
            $("#goodsdescdiv").hide();
        }
        $('#marketprice').html(marketPrice);
        if(res.detail==undefined){
            $('.goodsDetail').find('p').html("暂无商品详情");
        }else{
            $('.goodsDetail').find('p').html(res.detail);
        }
        localStorage.setItem('goodsname',res.goodsname);
    });
    $.ajaxSettings.async = true;
    //根据门店ID获取优惠券列表 此处需截取门店的36id
    var storeurl = 'http://merch.diancall.com/pipes/custquan/query/'+store36id;
    $.get(storeurl,function(res){
        res = JSON.parse(res)||[];
        if(res.length==0){
            $(".discount").css('display','none');
        }else{
            var _html ="";
            var validtime = "";
            for(var i=0;i<res.length;i++){
                if (res[i].endtime == 0) {
                    validtime = "自" + time(res[i].starttime) + "起长期永久有效";
                } else {
                    validtime = time(res[i].starttime) + "至" + time(res[i].endtime);
                }
                _html+='<li><div><p>'+res[i].quantitle+'</p>'+
                    '<span>'+validtime+'</span></div>';
                //'<div><button data-value="http://merch.diancall.com/pipes/salequan/find/'+res[i].quanid+'" class="quanbutton">获取优惠</button></div></li>'
            }
            $(".discountList").children('ul').html(_html);
        }
    });
    //点击关闭按钮或任意蒙层处关闭二维码页面
    $('.close').click(function () {
        $('.mc_container').css("display","none");
        $('body').css('overflow','auto');
    });
    $(".mc_container").click(function () {
        $('.mc_container').css("display","none");
        $('body').css('overflow','auto');
    });
    //点击获取优惠按钮出现二维码
/*    $(".discountList").on('click','.quanbutton',function(){
        var quaninfo = $(this).data('value');
        $('.mc_container').css("display","block");
        $('.mc_container').css("height",$(".container").height());
        $('body').css('overflow','hidden');
        $('#qrcode').html("");
        $("#qrcode").qrcode({
            background: "#ffffff", //背景颜色
            foreground: "#000", //前景颜色
            text:quaninfo
        });
    });*/
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
    $("#submit").click(function(){
        location.href = "http://merch.diancall.com/modules/share/shareLogin/shareLogin.html"+"?StoreId="+store36id+"?TaskId="+taskid;
    });
    $(".discountList").on('click','li',function(){
        location.href = "http://merch.diancall.com/modules/share/shareLogin/shareLogin.html"+"?StoreId="+store36id+"?TaskId="+taskid;
    });
   /* $(".footer").click(function(){
        location.href = "http://merch.diancall.com/modules/share/shareLogin/shareLogin.html"+"?StoreId="+store36id+"?TaskId="+taskid;
    });
    $(".banner").click(function(){
        location.href = "http://merch.diancall.com/modules/share/shareLogin/shareLogin.html"+"?StoreId="+store36id+"?TaskId="+taskid;
    });
  */

    //-------------------weixinjiekup--------------------
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
    $.get('http://merch.diancall.com/pipes/wechat/getaccesstoken?url='+getsrc+'&noncestr='+timestampNum,function(res){
        res = JSON.parse(res);
        //console.log(res);
        var timestamp = res.timestamp;
        var signature = res.signature;
        var goodsname = localStorage.getItem('goodsname');
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
            var shareTitle = goodsname;  //分享title
            var appid = 'wx291eff92df433407'; //apiID，可留空
            //分享给朋友
            wx.onMenuShareAppMessage({
                title: goodsname, // 分享标题
                desc: '价格实惠，还获得了神秘礼品，赚到了，分享给你们', // 分享描述
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
                title: goodsname, // 分享标题
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
                title: goodsname, // 分享标题
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
                title: goodsname, // 分享标题
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






