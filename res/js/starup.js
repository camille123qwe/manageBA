$(document).ready(function () {

    $.get("/base.html", {}, function (data) {
        $("#footer").html('<span>Copyright &copy; 2017. 深圳红柚子科技 </span>' + data);
    });
    var maincontainer = $('#maincontainer');
    window.openModule = function (url, moduleid) {
        if (!url) return;
        $.get(url, {}, function (data) {
            maincontainer.html(data);
            if(window.localStorage) localStorage.setItem("storage_moduleid", moduleid);
        });
    };
    //-------------------------- status ----------------------------------------------------------
    window.defStatusRender = function (value, type, full) {
        if (value === 10) return "<font color=green>正常</font>";
        if (value === 20) return "<font color=#FF00FF>待审批</font>";
        if (value === 40) return "冻结";
        if (value === 50) return "隐藏";
        if (value === 60) return "关闭";
        if (value === 70) return "<font color=red>过期</font>";
        if (value === 80) return "<font color=red>删除</font>";
        return "<font color=red>未知</font>";
    };
    //-------------------------- topbar ----------------------------------------------------------
    var topbarhtml = [];
    topbarhtml.push('<div class="topbar-left"><div class="text-center"><a href="/index.html" class="logo">店呼商家管理平台</a></div></div>');
    topbarhtml.push('<div class="pull-left menu-toggle" style="display: none"><i class="fa fa-bars"></i></div>');
    topbarhtml.push('<ul class="nav navbar-nav  top-right-nav hidden-xs">');
    topbarhtml.push('   <li class="dropdown profile-link hidden-xs">');
    topbarhtml.push('       <div class="clearfix" id="curruserel">');
    //userinfo
    if (window.system_merchuser && system_merchuser.merchuserid) {
        topbarhtml.push('       <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown"> \
                                    <img src="/res/images/user.png" alt="" class="pull-left" style="width:36px;height:36px;"> \
                                    <span>' + system_merchuser.username + '<br><em>' + system_merchuser.account + '</em></span>    \
                                </a> \
                                <ul class="dropdown-menu profile-drop"> \
                                    <li><a data-toggle="modal" data-target="#dialog-user-changepwd">设 置</a></li> \
                                    <li id="user-logout-btn"><a href="javascript:void(0)">注 销</a></li> \
                                </ul>');
    }
    topbarhtml.push('       </div>');
    topbarhtml.push('   </li>');
    topbarhtml.push('   <li class=" hidden-xs" style="width: 3rem;">&nbsp;</li>');
    topbarhtml.push('</ul>');
    $("#topbar").html(topbarhtml.join(''));
    //-------------------------- side-menu ----------------------------------------------------------
    //menu data
    var winhref = '' + window.location.href;
    var hasactived = false;
    var currmenu = null;
    var oldmoduleid = window.localStorage ? Number(localStorage.getItem("storage_moduleid") || "1") : 1;
    var recursmenu = function (menuhtml, onemenu, index) {
        if(onemenu.hidden) return;
        if (onemenu.active) hasactived = true;
        if (onemenu.children && onemenu.children.length) {
            var subhref = false;
            var subminhtml = [];
            for (var j = 0; j < onemenu.children.length; j++) {
                subhref |= recursmenu(subminhtml, onemenu.children[j], index + 1);
            }
            if (subhref) onemenu.active = true;

            menuhtml.push('<li ' + (onemenu.active ? ' class="active"' : '') + '><a href="javascript:openModule(\'' + (onemenu.url || '') + '\',' + onemenu.moduleid + ');"><i class="fa ' + onemenu.iconCls + '"></i> <span>' + onemenu.text + '</span><span class="fa arrow"></span></a>');
            menuhtml.push('    <ul class="nav nav-' + (index + 1) + '-level collapse">');
            menuhtml.push(subminhtml.join(''));
            menuhtml.push('    </ul>');
            menuhtml.push('</li>');
            return subhref;
        } else {
            var rs = (onemenu.url && winhref.indexOf(onemenu.url) >= 0)
                    || winhref.indexOf('?' + onemenu.moduleid) >= 0
                    || winhref.indexOf('#' + onemenu.moduleid) >= 0
                    || oldmoduleid == onemenu.moduleid;
            if (rs) {
                onemenu.active = true;
                currmenu = onemenu;
            }
            menuhtml.push('<li ' + (onemenu.active ? ' class="active"' : '') + '><a ' + (onemenu.active ? ' id="_leftmenu_sublink_active"' : '') + ' href="javascript:openModule(\'' + (onemenu.url || '') + '\',' + onemenu.moduleid + '); "><i class="fa ' + onemenu.iconCls + '"></i> <span>' + onemenu.text + '</span></a></li>');
            return rs;
        }
    };
    var menuhtml = [];
    menuhtml.push('<ul class="metismenu clearfix" id="menu" style="display: none">');
    //menuhtml.push('    <li class="first_active"><a href="/index.html"><i class="fa fa-home"></i>  <span>工作台首页</span></a></li>');

    for (var i = 0; window.system_sysmenus && i < system_sysmenus.length; i++) {
        hasactived |= recursmenu(menuhtml, system_sysmenus[i], 1);
    }
    menuhtml.push('</ul>');
    $("#side-menu").html(menuhtml.join('').replace('first_active', hasactived ? '' : 'active'));
    $("#sidebar-toggle").bind("click", function () {
        $(".sidebar").toggleClass("active");
    });
    $(".menu-toggle").bind("click", function () {
        $("body").toggleClass("widescreen");
    });
    //slim
    $('.nicescroll').slimScroll({
        height: '100%',
        railOpacity: 0.9
    });
    //metis menu
    $("#menu").metisMenu();
    $(".content-page,.side-menu").equalize({});
    $('#_leftmenu_sublink_active').focus();
    //tooltips
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();
    });

    if (currmenu) openModule(currmenu.url);
});