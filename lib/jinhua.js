/**
 * Created by Administrator on 2016/8/15.
 */
//判断pc Or 移动端
var mouse_touch = {
    start: "",
    move: "",
    end: "",
    active: false,
//    第一次滑动的时候的left
    left: 0
};
//当前页面语言标识,默认中文
var l_type="chs";
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
//android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
// ios终端
if (isiOS) {
    mouse_touch.start = "touchstart";
    mouse_touch.move = "touchmove";
    mouse_touch.end = "touchend";
} else {
    if (isAndroid) {
        mouse_touch.start = "touchstart";
        mouse_touch.move = "touchmove";
        mouse_touch.end = "touchend";
    }
    else {
        alert("请在手机上打开");
        pc = true;
        $("#container").css({"min-width": "800px"})
        mouse_touch.start = "mousedown";
        mouse_touch.move = "mousemove";
        mouse_touch.end = "mouseup";
        $(".sliderGo").css({
            "margin-left": ($(document).width() - $(".sliderGo").width()) / 2,
            "margin-right": ($(document).width() - $(".sliderGo").width()) / 2,
        })
    }
}
//有数据之后将语音隐藏的复原。看一下
var param={
    "headurl":"http://daoyou.worldmaipu.com/",
    "hidurl":"http://daoyou.worldmaipu.com/web/share!detail.action?hotId="
};
//滑动出现按钮
var flow=false;
var response2;
var width=0.5;
//外部容器滚动
var block={
    "top":0,
    "left":0
}
var un=0;
var size="1";
var roadgo=[[1000,1200],[1200,1500],[1626,1996]];
var img=["./data/road1.png","./data/road3.png","./data/road7.png"]
var arryLeft=[];
var arryTop=[];

var language="chs";
var str='';
var images=[];
var date=Date.parse(new Date());
var response;
var latitude=[];
var longitude=[];
var nameT=[];
var hid=[];
var dataMp3=[];

//英文版
var num=0;
var enu_images=[];
var enu_latitude=[];
var enu_longitude=[];
var enu_nameT=[];
var enu_hid=[];
var enu_dataMp3=[];
function changewidth(s){
    block.top=$(".block").scrollTop()/$(".one").height();
    block.left=$(".block").scrollLeft()/$(".one").width();
    $(".one").css(
        {
            "width":img_index.width*s,
            "height":img_index.height *s
        });


    $(".block").scrollTop($(".one").height()* block.top);
    $(".block").scrollLeft($(".one").width()* block.left);
    $.each($(".one>div.tip"),function(i){
        $(".one>div.tip").eq(i).css({
            "left":arryLeft[i]*s,
            "top":arryTop[i]*s
        })
    })
}
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
var new_type=GetQueryString("l_type")?GetQueryString("l_type"):1;
console.log(new_type);

//下一次的数据注意中英文的l_type
$.ajax({
    type : "get",
    url :"http://daoyou.worldmaipu.com/api/v1/map_view!GetSingleSecentWebs.action?hid=4659",
    //url:"http://daoyou.worldmaipu.com/api/v1/visitor_view!GetSingleSecent.action?hid=4659&tempDate=20150101000000&appId=1",
    //浦江4659
    dataType : "jsonp",
    //dataType : "json",
    data:'',
    jsonp: "callback",//服务端用于接收callback调用的function名的参数
    success : function(data){
        response=data;
        var str2="";
        //document.title = "麦扑旅游—" + response.data.scenic.name;
        document.title = "浦江旅游";
        if(response.data.scenic.full_view_url&&response.data.scenic.full_view_url!=null){
            $("#fullviewA").attr("href",response.data.scenic.full_view_url);
        }
        $.each(response.data.scenic.pointses,function(i){
                //l_type=1为中文
                if(response.data.scenic.pointses[i].type==1||response.data.scenic.pointses[i].type==2){
                    if(response.data.scenic.pointses[i].l_type=="1"){
                        lkeys="chs";
                        images.push(response.data.scenic.pointses[i].thumbImg);
                        longitude.push(response.data.scenic.pointses[i].longitude);
                        latitude.push(response.data.scenic.pointses[i].latitude);
                        nameT.push(response.data.scenic.pointses[i].chs_name);
                        hid.push(response.data.scenic.pointses[i].hid);
                        var url = response.data.scenic.pointses[i].audio;
                        if(url){
                            var mindex = response.data.scenic.pointses[i].audio.split(".");
                            var mp3 = mindex[0] + ".mp3";
                            dataMp3.push(param.headurl + mp3);
                        }
                        else{
                            dataMp3.push("");
                        }
                    }
                    else{
                        if(response.data.scenic.pointses[i].l_type=="2"){
                            lkeys="enu";
                            enu_images[num]=response.data.scenic.pointses[i].thumbImg;
                            enu_longitude[num]=response.data.scenic.pointses[i].longitude;
                            enu_latitude[num]=response.data.scenic.pointses[i].latitude;
                            enu_nameT[num]=response.data.scenic.pointses[i].chs_name;
                            enu_hid[num]=response.data.scenic.pointses[i].hid;
                            var url = response.data.scenic.pointses[i].audio;
                            if(url){
                                var mindex =  response.data.scenic.pointses[i].audio.split(".");
                                var mp3 =mindex[0]
                                    +".mp3";
                                enu_dataMp3[un]=param.headurl + mp3;
                                un+=+1;
                            }
                            else{
                                enu_dataMp3[num]="";
                            }
                            num++;
                        }
                    }
                }
            }
        )
        reset();

    },
    error:function(a,b,c){
        alert(a+"++"+b+"++"+c);
    }
})

var lkeys="";
$(function(){
    if(new_type==2){
        $(".language_box").removeClass("language_box_active");
        $(".language_box2").addClass("language_box_active");
        language="enu";
        changeL(language);
    }
    $(".ulBox").css("width",$("body").width()-$(".mapBtn").width());
    $(".ulBox ul").css("width",$(".toilet").width()*7);
    $(document).on("click",".road_box",function(){
        if(language=="chs"){
            $(this).get(0).src="./data/Group.png";
        }
        else {
            $(this).get(0).src="./data/en/line_en_a.png";
        }
        $(this).addClass("road_active").removeClass("road_box");

        $(".line_box").show();
    })
    $(document).on("click",".road_active",function(){
        $(".line_box").hide();
        $(".full").hide();
        $(this).addClass("road_box").removeClass("road_active");
        if(language=="chs"){
            $(this).get(0).src="./data/Mmap_btn_line.png";
        }
        else {
            $(this).get(0).src="./data/en/line_en.png";
        }

    })
    $(document).on("click",".line3",function(){
        $(".full").css({
            "background":"url(./data/road1.png)",
            "background-repeat":"no-repeat",
            "background-size":"cover",
        }).show();
        $(".block").scrollLeft((roadgo[0][0]-$("body").width())*width);
        $(".block").scrollTop((roadgo[0][1]-$("body").height())*width);
        $(".line_box").hide();
    });
    $(document).on("click",".line7",function(){
        $(".full").css({
            "background":"url(./data/road2.png)",
            "background-repeat":"no-repeat",
            "background-size":"cover",
        }).show();
        $(".block").scrollLeft((roadgo[1][0]-$("body").width())*width);
        $(".block").scrollTop((roadgo[1][1]-$("body").height())*width);
        $(".line_box").hide();
    });
    $(document).on("click",".line4",function(){
        $(".full").css({
            "background":"url(./data/road3.png)",
            "background-repeat":"no-repeat",
            "background-size":"cover",
        }).show();
        $(".block").scrollLeft((roadgo[2][0]-$("body").width())*width);
        $(".block").scrollTop((roadgo[2][1]-$("body").height())*width);
        $(".line_box").hide();
    })
    $(".one").css({
        "width":img_index.width,
        "height":img_index.height,
        "background":"url(" + img_index.url + ")",
        "background-size":"cover",
        "background-repeat":"no-repeat",

    })

    $("#missImg").hide();
    $("#zhezhao").css({"background":"url(./play.svg)",
        "background-repeat":"no-repeat",
        "background-position":"45%,center"});

    //双语切换
    $(document).on("click",".language",function(){
        switch ($(".language").attr("state")){
            case "close1":
                //初始化出现的
                $(".language").animate({"left":"1.8rem"}).attr("state","open");
                break;
            case "close2":
                $(".language").animate({"left":"1.8rem"}).attr("state","open");
                break;
            case "open":
                $(".language").animate({"left":"5.8rem"}).attr("state","close2");
                break;
            default:
                alert("请刷新当前页面");
                break;
        }
    });
    $(".language_box").click(function(e){
        e.stopPropagation();
        var l_sign= $(this).attr("data");
        language=l_sign;
        $(".language_box").removeClass("language_box_active");
        $(this).addClass("language_box_active");
        $(".language").attr("data",l_sign).animate({"left":"5.8rem"}).attr("state","close2");
        //    刷新当前页面信息
        changeL(language)
    })



});
function changeL(sign){
    $(".tipactive").removeClass("tipactive");
    $(".sliderGo").hide();
    switch (sign){
        case "chs":
            $(".line3").text("经典景区线");
            $(".line7").text("文化寻踪线");
            $(".line4").text("轻度假慢生活线");
            $(".goTo").css({
                "background":"url(./data/Mmap_btn_gps.png)",
                "background-size":"contain",
                "background-repeat":"no-repeat"
            });
            $(".guide").css({
                "background":"url(./data/img/Mmap_btn_guide.png)",
                "width":"0.9rem",
                "height":"0.52rem",
                "background-size":"cover",
            });
            $(".toilet").css({
                "background":"url(./data/img/Mmap_btn_toilte.png)",
                "width":"1.14rem",
                "height":"0.52rem",
                "background-size":"cover",
            });
            $(".park").css({
                "background":"url(./data/img/Mmap_btn_park.png)",
                "width":"1.14rem",
                "height":"0.52rem",
                "background-size":"cover",
            });
            $(".cate").css({
                "background":"url(./data/img/Mmap_btn_food.png)",
                "width":"0.92rem",
                "height":"0.5rem",
                "background-size":"cover",
            });
            $(".stay").css({
                "background":"url(./data/img/Mmap_btn_hotel.png)",
                "width":"0.92rem",
                "height":"0.5rem",
                "background-size":"cover",
            });
            $(".shop").css({
                "background":"url(./data/img/Mmap_btn_shop.png)",
                "width":"0.92rem",
                "height":"0.5rem",
                "background-size":"cover",
            });
            $(".road_box").attr("src","./data/Mmap_btn_line.png");
            $("#fullview").attr("src","./data/Mmap_btn_overrallview.png");
            $("#btn_ticket").attr("src","./data/btn_ticket.png");
            $("#btn_techan").attr("src","./data/techan.png");
            $(".btntext").text("手绘图");
            break;

        case "enu":
            $(".line3").text("classical");
            $(".line7").text("cultural");
            $(".line4").text("slow life");
            $(".goTo").css({
                "background":"url(./data/en/en_go.png)",
                "background-size":"contain",
                "background-repeat":"no-repeat"
            });
            $(".btntext").text("view");
            $(".road_box").attr("src","./data/en/line_en.png");
            $("#fullview").attr("src","./data/en/vr_en.png");
            $("#btn_ticket").attr("src","./data/en/btn_ticket_en.png");
            $("#btn_techan").attr("src","./data/en/techan_en.png");
            $(".guide").css({
                "background":"url(./data/en/Slice9.png)",
                "width":"0.72rem",
                "height":"0.52rem",
                "background-size":"cover",
            });
            $(".toilet").css({
                "background":"url(./data/en/Slice11.png)",
                "width":"0.72rem",
                "height":"0.52rem",
                "background-size":"cover",
            });
            $(".park").css({
                "background":"url(./data/en/Slice12.png)",
                "width":"0.94rem",
                "height":"0.52rem",
                "background-size":"cover",
            });
            $(".cate").css({
                "background":"url(./data/en/Slice7.png)",
                "width":"0.72rem",
                "height":"0.52rem",
                "background-size":"cover",
            });
            $(".stay").css({
                "background":"url(./data/en/Slice8.png)",
                "width":"0.72rem",
                "height":"0.52rem",
                "background-size":"cover",
            });
            $(".shop").css({
                "background":"url(./data/en/Slice10.png)",
                "width":"0.72rem",
                "height":"0.52rem",
                "background-size":"cover",
            });
            break;
    }
}
function reset(){
    //document.title=response.data.scenic.name;
    $(".sliderGo").css("left",($("body").width()-$(".sliderGo").width())/2);
    //$(".block").scrollTop("50%");
    //$(".block").scrollLeft("50%");
    //$(".block").scrollLeft("670");
    for(var j=0;j<latitude.length;j++){
        var str="<div value='" +
            j +
            "' class='tip' data='" +
            dataMp3[j]+
            "'></div>" ;
        $(".one").append(str);
    };

    for(var h=0;h<img_index.order.length;h++){
        //if(h==0){
        //    $(".tip").eq(h).css({
        //        "background":"url(./data/center.png) ",
        //        "background-repeat":"no-repeat",
        //        "background-size": "cover",
        //        "width":img_index.tip.width,
        //        "height":img_index.tip.height,
        //        "top":img_index.order[h].top,
        //        "left":img_index.order[h].left,
        //    })
        //}
        //else{
        $(".tip").eq(h).css({
            "width":img_index.tip.width,
            "height":img_index.tip.height,
            "top":img_index.order[h].top,
            "left":img_index.order[h].left,
        })
        //}

    }
    $(".tip").eq(7).css({
        "display":"none"
    });
    $(".tip").eq(8).css({
        "display":"none"
    });
    $(".tip").eq(9).css({
        "display":"none"
    });
    $(".tip").eq(11).css({
        "display":"none"
    });

    $(".tip").eq(12).css({
        "display":"none"
    });

    $(".tip").eq(13).css({
        "display":"none"
    });

    $(".tip").eq(16).css({
        "display":"none"
    });
    $(".tip").eq(16).css({
        "display":"none"
    });
    $(".tip").eq(17).css({
        "display":"none"
    });
    $(".tip").eq(20).css({
        "display":"none"
    });
    $(".tip").eq(23).css({
        "display":"none"
    });
    $(".tip").eq(24).css({
        "display":"none"
    });

    $(".tip").eq(26).css({
        "display":"none"
    });
    $(".tip").eq(28).css({
        "display":"none"
    });
    $(".tip").eq(33).css({
        "display":"none"
    });
    $(".tip").eq(34).css({
        "display":"none"
    });
    $(".tip").eq(39).css({
        "display":"none"
    });
    $(".tip").eq(42).css({
        "display":"none"
    });
    $(".tip").eq(46).css({
        "display":"none"
    });
    $(".tip").eq(47).css({
        "display":"none"
    });
    $(".tip").eq(48).css({
        "display":"none"
    });
    $(".tip").eq(53).css({
        "display":"none"
    });
    $(".tip").eq(54).css({
        "display":"none"
    });
    $(".tip").eq(56).css({
        "display":"none"
    });
    $(".tip").eq(61).css({
        "display":"none"
    });
    $(".tip").eq(62).css({
        "display":"none"
    });
    $(".tip").eq(70).css({
        "display":"none"
    });
    for(var i=0;i<$(".tip").length;i++){
        arryLeft[i]=parseInt( $(".one>div.tip").eq(i).css("left"));
        arryTop[i]=parseInt( $(".one>div.tip").eq(i).css("top"))
    }
    console.log(arryLeft);
    changewidth(0.5);
    $(".one").show();
    $(".block").scrollLeft("670");

}




//确定景点
var viewID;
var txt;
$(document).on("click",".tip",function(){
    $(".language").animate({"left":"5.8rem"}).attr("state","close2");
    //if($(this).attr("value")=="0"){
    //    window.location.href="http://121.40.133.252/upload_resource/mpweb/map/newMap.html?parameter=4484_13552454547_PEPIUTGB";
    //}
    //else{
    if($(this).hasClass("tipactive")){
        $(".tipactive").removeClass("tipactive");
        document.getElementById("myaudio").pause();
        $(".sliderGo").hide();
    }
    else{
        $(".tipactive").removeClass("tipactive");
        $(this).addClass("tipactive");
        $("#zhezhao").css({"background":"url(./play.svg)",
            "background-repeat":"no-repeat",
            "background-position":"45%,center"});
        $(".sliderGo").show();

        viewID=$(this).attr("value");
        var audio=document.getElementById("myaudio");

        $(".listenBox img")[0].src=param.headurl+images[parseInt($(this).attr("value"))];
        //之后enu对调，是中文名字
        //中文
        if(language=="chs"){
            $("#gogo").get(0).href=param.hidurl+hid[parseInt(viewID)];
            $(".goHead").text(nameT[parseInt(viewID)]);
            $(this).get(0).data=dataMp3[parseInt(viewID)];
            audio.src=dataMp3[parseInt(viewID)];
        }
        else{
            $("#gogo").get(0).href=param.hidurl+enu_hid[parseInt(viewID)]
                +"&lky=enu"
            ;
            if(enu_nameT[parseInt(viewID)].split(",").length>1){
                $(".goHead").text(enu_nameT[parseInt(viewID)].split(",")[0]);
            }else{
                $(".goHead").text(enu_nameT[parseInt(viewID)]);
            }

            $(this).attr("data",enu_dataMp3[parseInt(viewID)]);
            audio.src=enu_dataMp3[parseInt(viewID)];
        }
    }
    //}
})
$(".listenBox").click(function(){
    if(document.getElementById("myaudio").paused){
        $("#zhezhao").css({"background":"url(./pause.svg)",
            "background-repeat":"no-repeat",
            "background-position":"45%,center"});
        document.getElementById("myaudio").play();
    }
    else{
        $("#zhezhao").css({"background":"url(./play.svg)",
            "background-repeat":"no-repeat",
            "background-position":"45%,center"});
        document.getElementById("myaudio").pause();
    }
})
//有英文版的时候改一下enu_name
$(".goTo").click(function(){
    if(language=="enu"){
        var url =" http://uri.amap.com/navigation//uri.amap.com/navigation?to=" +
            longitude[viewID]+
            "," +
            latitude[viewID]+
            "," +
            enu_nameT[parseInt(viewID)]+
            "&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0"
        //var url=" http://apis.map.qq.com/uri/v1/routeplan?type=drive" +
        //    "&to=" +  enu_nameT[parseInt(viewID)] +
        //    "&tocoord=" +
        //    latitude[viewID]+
        //    "," +
        //    longitude[viewID]+
        //    "&policy=1"
        window.location.href=url;
    }
    else{if(language=="chs"){
        if($(".tipactive").attr("value")=="0"){
            window.location.href="http://121.40.133.252/upload_resource/mpweb/map/newMap.html?parameter=4484_13552454547_PEPIUTGB";
        }else{
            var url =" http://uri.amap.com/navigation//uri.amap.com/navigation?to=" +
                longitude[viewID]+
                "," +
                latitude[viewID]+
                "," +
                nameT[parseInt(viewID)]+
                "&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0"
            //var url=" http://apis.map.qq.com/uri/v1/routeplan?type=drive" +
            //    "&to=" +  nameT[parseInt(viewID)] +
            //    "&tocoord=" +
            //    latitude[viewID]+
            //    "," +
            //    longitude[viewID]+
            //    "&policy=1"
            window.location.href=url;
        }

    }}

    //console.log(url);
})
//点击切换中英文
$(".btntranlate").click(function(){
    $(".sliderGo").hide();
    $(".tipactive").removeClass("tipactive");
//    效果
//    转化到英文
    if($(".btntranlate").attr("data")=="chs"){
        //$(".btnText").text("英")
        //    .css("left","0.15rem");
        //$(".china").css("left","0.7rem");
        $(".btntranlate").css({
            "background":"url(./data/enu.png)",
            "background-repeat":"no-repeat",
            "background-size":"cover"
        })
        $(".btntranlate").attr("data","enu");

        //    功能
        language="enu";
        //$(".tip").remove();

    }
    else{
        $(".btntranlate").css({
            "background":"url(./data/chs.png)",
            "background-repeat":"no-repeat",
            "background-size":"cover"
        })
        $(".btntranlate").attr("data","chs");

        language="chs";
    }

//    功能
})
//点击路线
$(".road1").on("touchstart",function(){
    var s=parseInt($(this).attr("data"));
    if($(this).hasClass("roadActivity")){
        $(".roadActivity").removeClass("roadActivity");
        $(".full").hide();
    }
    else{
        //if(width>=1){
        console.log(roadgo[s][0]*parseInt(width)-$("body").width())
        $(".block").scrollLeft((roadgo[s][0]-$("body").width())*parseInt(width));
        $(".block").scrollTop((roadgo[s][1]-$("body").height())*parseInt(width));
        $(".roadActivity").removeClass("roadActivity");
        $(this).addClass("roadActivity");
        $(".full").css({"background":"url('" +
        img[s]+
        "')",
            "background-size":"cover"
        })
            .show();
        //}

    }

})
//点击放大缩小

$(".addSize").click(function(){
    $(".roadActivity").removeClass("roadActivity");
    $(".full").hide();
    if(width<4){
        width=width+1;
        changewidth(width);
        $(".removeSize").css({
            "background":"url(./data/remove.png)",
            "background-repeat":"no-repeat",
            "background-size":"cover"
        })
        $(".addSize").css({
            "background":"url(./data/add.png)",
            "background-repeat":"no-repeat",
            "background-size":"cover"
        })
    }
    else{
        $(".addSize").css({
            "background":"url(./data/add2.png)",
            "background-repeat":"no-repeat",
            "background-size":"cover"
        })
    }
})
$(".removeSize").click(function(){
    $(".roadActivity").removeClass("roadActivity");
    $(".full").hide();
    if(width>1){
        width=width-1;
        changewidth(width);
        $(".removeSize").css({
            "background":"url(./data/remove.png)",
            "background-repeat":"no-repeat",
            "background-size":"cover"
        })
        $(".addSize").css({
            "background":"url(./data/add.png)",
            "background-repeat":"no-repeat",
            "background-size":"cover"
        })
    }
    else{
        $(".removeSize").css({
            "background":"url(./data/remove2.png)",
            "background-repeat":"no-repeat",
            "background-size":"cover"
        })
    }
})
$(document).on("click",".ulBox li",function(){
    $(".active").removeClass("active");
    $(this).addClass("active");
    if(language=="chs") var l_type_sort=1;
    else var l_type_sort=2;

    switch ($(this).attr("data")){
        case "导游":
            break;
        case "卫生间":
            window.location.href="./pujiang/map.html?hid=4659&order=1&l_type="+l_type_sort;
            break;
        case "停车场":
            window.location.href="./pujiang/map.html?hid=4659&order=2&l_type="+l_type_sort;
            break;
        case "餐饮":
            window.location.href="./pujiang/map.html?hid=4659&order=3&l_type="+l_type_sort;
            break;
        case "住宿":
            window.location.href="./pujiang/map.html?hid=4659&order=3&l_type="+l_type_sort;
            break;
    }
});
$(document).on(mouse_touch.start,".mapBtn",function(){
    window.location.href="./pujiang/map.html?hid=4659&order=1&l_type="+l_type_sort;
});