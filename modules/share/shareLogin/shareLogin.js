/**
 * Created by xuwf on 2017/4/21.
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
        var container = $("#container");
        container.width(750);
        container.css("margin","auto");
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
    var storeidstr = src.substr(src.indexOf('?StoreId='),14);
    var store36id = storeidstr.split("=")[1];
    var taskidstr = src.substr(src.indexOf('?TaskId='), 24);
    var taskid = taskidstr.split("=")[1];
    var custuser36idstr= src.substr(src.indexOf('?custuser36id='), 20);
    var custuser36id = custuser36idstr.split("=")[1];
    if(!taskid||taskid.length!=16){
        taskid = "";
    }
    if(!custuser36id){
        custuser36id = '3B2P0H';
    }
    //获取优惠券内容
    $.ajax({
        url:"http://merch.diancall.com/pipes/share/querystorequan/"+store36id,
        //url:"http://192.168.1.128:6001/pipes/share/querystorequan/"+"evu4n",
        type:"post",
        dataType:"JSON",
        data:{},
        success:function(res){
            console.log(res);
            if(res.length==0){
                $("#coupon").find('h2').html("");
            }else {
               // $("#coupon").find("h1").removeClass("nocoupon");
                var obj = res[0] || {};
                var costmoneyneed = "", voicetimes = "", cashvalue = "", fluxpkgid = "", _html = "";
                if (obj.costmoneyneed != 0) {
                    costmoneyneed = "满" + obj.costmoneyneed / 100 + "送";
                } else {
                    costmoneyneed = "消费即送";
                }
                if (obj.voicetimes != 0) {
                    voicetimes = obj.voicetimes / 60 + "分钟通话时长";
                }
                if (obj.cashvalue != 0) {
                    cashvalue = obj.cashvalue / 100 + "元代金券";
                }
                if (obj.fluxpkgid != 0) {
                    if (obj.fluxpkgid == 100001) {
                        fluxpkgid = "30M流量"
                    } else if (obj.fluxpkgid == 100002) {
                        fluxpkgid = "100M流量"
                    } else if (obj.fluxpkgid == 100003) {
                        fluxpkgid = "500M流量"
                    } else if (obj.fluxpkgid == 100004) {
                        fluxpkgid = "1G流量"
                    }
                }

                if(fluxpkgid && !voicetimes && !cashvalue){
                    _html = "";
                }else if (fluxpkgid && !voicetimes && !cashvalue) {
                   // _html = costmoneyneed + "<br>" + voicetimes + "<br>" + fluxpkgid + "<br>" + cashvalue;
                    _html = costmoneyneed+ "<br>" + fluxpkgid;
                } else if (voicetimes && !fluxpkgid && !cashvalue) {
                    //_html = costmoneyneed + "<br>" + fluxpkgid + "<br>" + voicetimes + "<br>" + cashvalue;
                    _html = costmoneyneed + "<br>" + voicetimes;
                } else if (cashvalue && !fluxpkgid && !voicetimes) {
                    _html = costmoneyneed + "<br>" + cashvalue;
                    //_html = costmoneyneed + "<br>" + fluxpkgid + "<br>" + cashvalue + "<br>" + voicetimes;
                } else if (voicetimes && fluxpkgid && !cashvalue) {
                    _html = costmoneyneed+'<br>'+voicetimes+'<br>'+fluxpkgid;
                    //_html = costmoneyneed + "<br>" + fluxpkgid + "<br>" + voicetimes + "<br>" + cashvalue;
                } else if (voicetimes && cashvalue && !fluxpkgid) {
                    _html = costmoneyneed + "<br>" + cashvalue + "<br>" + voicetimes;
                   // _html = costmoneyneed + "<br>" + cashvalue + "<br>" + voicetimes + "<br>" + fluxpkgid;
                } else {
                    _html = costmoneyneed + "<br>" + cashvalue + "<br>" + fluxpkgid + "<br>" + voicetimes;
                }

                if(_html==""){
                    return
                }else{
                    $("#coupon").find('h2').html(_html);
                    $("#coupon").find('p').css('lineHeight','1.5rem');
                }
            }
        },
        error:function(err){
            console.log(err);
        }

    });
    //手机号码输入完成时开始验证
    $("#telinput").on('input',function(){
        var reg = /^1(3|4|5|7|8)\d{9}$/;
        var tel = $("#telinput").val();
        if(tel.length==11){
            if(reg.test(tel)){
                $(".error").hide();
            }else{
                $(".error").show();
            }
        }
    });
    //获取验证码图片
    $("#yzimg").attr("src","http://merch.diancall.com/pipes/validcode/get/"+returnCitySN['cip']);
    //点击刷新验证码图片
    $("#shuaxin,#yzimg").click(function(){
        $(".error3").hide();
        var timestamp = new Date().getTime();
        var src = "http://merch.diancall.com/pipes/validcode/get/"+returnCitySN['cip'];
        $("#yzimg").attr("src",src+"?"+timestamp);
        $("#picyzminput").val("");
    });
    //点击获取验证码
    $(".button").click(function(){
        $(".error2,.error,.error3").hide();
        var reg = /^1(3|4|5|7|8)\d{9}$/;
        var tel = $("#telinput").val();
        var yzmreg = /^\d{4}$/;
        var picyzm = $("#picyzminput").val();
        if(reg.test(tel)){
            if(!yzmreg.test(picyzm)){
                $(".error3").show();
                return;
            }
            $.get("http://merch.diancall.com/pipes/custuser/smscodepost/mobile:"+tel+"/validcode:"+picyzm+"/ip:"+returnCitySN['cip'],function(res){
                res = JSON.parse(res);
                console.log(res.retcode);
                if(res.retcode!=0){
                    if(res.retcode==30020034){
                        $(".error3").text("验证码错误，请重新输入");
                    }else{
                        $(".error3").text(res.retinfo);
                    }
                    $(".error3").show();
                    return;
                }else{
                    $(".error").hide();
                    $(".button").attr('disabled',true);
                    $(".button").addClass('grey');
                    var clock = '';
                    var nums = 60;
                    var btn =  $(".button");
                    btn.html(nums+'秒');
                    clock = setInterval(doLoop, 1000); //一秒执行一次
                    function doLoop()
                    {
                        nums--;
                        if(nums > 0){
                            btn.html(nums+'秒');
                        }else{
                            clearInterval(clock); //清除js定时器
                            btn.removeAttr('disabled');
                            btn.removeClass('grey');
                            btn.html('获取验证码');
                            nums = 60; //重置时间
                        }
                    }
                }
            });

        }else{
            $(".error").show();
        }
    });
    //注册
    $("#submit").click(function(){
        var tel = $("#telinput").val().trim();
        var yzm = $("#yzminput").val().trim();
        var reg = /^1(3|4|5|7|8)\d{9}$/;
        if(!reg.test(tel)){
            $(".error").show();
            return;
        }
        var reg2 = /^\d{6}$/;
        if(!reg2.test(yzm)){
            $(".error2").text("*请输入六位验证码");
            $(".error2").show();
            return;
        }
        var data = {
            mobile:tel,
            vercode:yzm,
            store36id:store36id,
            taskid:taskid
        };
        $.ajax({
            url:"http://merch.diancall.com/pipes/custuser/smscodelogin",
            //url:"http://192.168.1.128:6001/pipes/custuser/smscodelogin",
            type:"POST",
            dataType:"JSON",
            data:{"bean":JSON.stringify(data)},
            error:function (err) {
                console.log(err);
            },
            success:function(res){
                if(res.retcode===0){
                    console.log(res);
                    var data = {"account": tel, "password": 'e10adc3949ba59abbe56e057f20f883e'};
                    location.href= "http://c.diancall.com/diancall_web/www/index.html?fromlogin="+JSON.stringify(data);
                   // location.href = "http://localhost:8100?fromlogin="+JSON.stringify(data);
                }else if(res.retcode===30020026){
                    var data = {"account": tel, "password": 'e10adc3949ba59abbe56e057f20f883e'};
                    $(".error2").text("*验证码无效，请重新获取");
                   // location.href= "http://localhost:8100?fromlogin="+JSON.stringify(data);
                    $('.error2').show();
                }else{
                    var data = {"account": tel, "password": 'e10adc3949ba59abbe56e057f20f883e'};
                    $(".error2").text(res.retinfo);
                    $('.error2').show();
                  //  location.href= "http://localhost:8100?fromlogin="+JSON.stringify(data);
                }
            }
        })
    });
});