/**
 * Created by camille on 2016/8/11.
 */
(function(){
    var commonView={
        init:function(){
           /* this.addLoading();
            this.ajaxSetting();
            this.loadingFinish();*/

        },
        setData:function(key,value){
            if(typeof value=="object"){
                value=JSON.stringify(value);
            }
            localStorage.setItem(key,value)
        },
        getData:function(key){
            try{
                var data;
                var value=localStorage.getItem(key);
                data=JSON.parse(value);//将obj转化为json格式
            }catch(e){
                data=value;
            }
            return data;
        },
        rmStorage:function(key){
            localStorage.removeItem(key);
        },
        getWebUrl:function(nameUrl){
            return ""+nameUrl;
        },
        ajax:function(url,data,callback){
            var url=commonView.getWebUrl(url);
            $.ajax({
                url:url,
                data:data,
                type:"post",
                dataType:"json",
                success:function(res){
                    callback(res)
                },
                error:function(){
                    alert("网络异常")
                }
            });
        },
        //加载内容
        addLoading:function(){
            var html='<div id="loading" class="loadingBox"><p>加载中<span id="font-str"></span></p></div>'
            $('body').append(html);
        },
        //开始加载
        loadingStart:function(){
            $("#loading").show();
            var $str=$("#font-str");
            commonView.aa=setInterval(function(){
                $("#font-str").append(".");
                if($str.text().length()>10){
                    $str.text("");
                }
            },50)
        },
        //结束加载
        loadingFinish:function(){
            $("#loading").hide();
            clearInterval(commonView.aa);
        }

    };
    commonView.init();
    window.common=commonView;
})();
