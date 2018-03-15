/**
 * Created by xuwf on 2017/9/26.
 */
function install(data){
    new OpenInstall({
        appKey : "fhgawx",
        /*可选参数，自定义android平台的apk下载文件名，只有apk在openinstall托管时才有效；
         个别andriod浏览器下载时，中文文件名显示乱码，请慎用中文文件名！*/
        apkFileName : "diancall-cust.apk",
        /*可选参数，是否优先考虑拉起app;某些android浏览器无法拉起app(或拉取体验不佳)的情况下，
         将使用H5遮罩的形式提示用户用其他浏览器打开*/
        preferWakeup:true,
        onready : function() {
            var m = this,button = document.getElementsByClassName("openApp");
            for(var i =0;i<button.length;i++){
                button[i].style.visibility="visible";
                button[i].onclick=function(){
                    //500毫秒后app尚未拉起，将安装app，可自定义超时时间，单位为毫秒
                    m.wakeupOrInstall({timeout:2000});
                };

            }
        }
    }, data);
}