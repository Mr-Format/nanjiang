"use strict";
document.write("<script language=javascript src='./lib/transform.js'></script>");
new Promise(function(resolved, rejected) {
    $.ajax({
        url: "https://www.zmlxj.com/api.php/SpotsRace/get_map_data_by_label",
        data: {
            token: getCookie("dali_token"),
            id: 1248,
            park_id: 1,
        },
        success: function success(res) {
            resolved(res.data);
        },
        error: function error(_error) {
            console.log(_error);
            rejected(_error);
        },
        method: "POST"
    });
}).then(function(windowData) {
        var point_list = []; // 跟导航有关

        var map_name = "";
        var map_lat = "";
        var map_lng = "";
        var music = document.getElementById("bgMusic"); // 切换语言大方法

        var language_list = {
            id: [0, 1],
            route: ["线路", "Route"],
            language: ["中文", "EN"],
            shopping: ["购物", "Shop"],
            to: ["去这里", "Nav"],
            merchant: ["商区", "CBD"],
            introduce: ["解说", "Talk"],
            menu: [
                [],
                []
            ],
            contitle: [
                [],
                []
            ],
            audio: [
                [],
                []
            ]
        };
        var cur_language = {
            id: 0,
            route: "线路",
            language: "中文",
            shopping: "购物",
            to: "去这里",
            merchant: "商区",
            introduce: "解说",
            menu: [],
            contitle: [],
            audio: []
        }; // 存tip数据
        // 存音频数据

        windowData.point_list.forEach(function(item, index1) {
            var obj = {};
            obj.number = index1;
            obj.id = item.id;
            obj.top = item.y_;
            obj.left = item.x_;
            obj.type = item.type_;
            obj.icon_url = item.iconUrl;
            obj.con_image = item.newUrl;
            obj.con_text = item.spots_name;
            obj.zhtitle = item.spots_name;
            obj.entitle = item.enTitle;
            obj.nav = item.is_only_nav;
            obj.jump_url = item.url;
            obj.lng = item.lng;
            obj.lat = item.lat;

            point_list.push(obj);
            language_list.contitle[0][index1] = item.spots_name;
            language_list.contitle[1][index1] = item.enTitle;
            cur_language.contitle[index1] = item.spots_name;
            language_list.audio[0][index1] = item.zhAudioUrl == "" ? null : item.zhAudioUrl;
            language_list.audio[1][index1] = item.enAudioUrl == "" ? null : item.enAudioUrl;
            cur_language.audio[index1] = item.zhAudioUrl == "" ? null : item.zhAudioUrl;
        });
        //console.log("tip的数据:");
        //console.log(point_list); // 初次渲染的比例数据
        console.log("窗体的高度：" + document.querySelector("body").offsetHeight, "宽度：" + document.querySelector("body").offsetWidth);
        var offsetWidth = document.querySelector("body").offsetWidth;
        var offsetHeight = document.querySelector("body").offsetHeight;
        var FIRST_PERCENT = parseFloat(document.querySelector("body").offsetHeight / windowData.map_data.r_index);
        FIRST_PERCENT = mobile_active ? FIRST_PERCENT : document.documentElement.offsetWidth / windowData.map_data.l_index;
        console.log("- FIRST_PERCENT: " + FIRST_PERCENT); // 沿用之前的img_index

        var img_index = {
            url: windowData.map_data.map_,
            width: FIRST_PERCENT * windowData.map_data.l_index,
            height: FIRST_PERCENT * windowData.map_data.r_index,
            min: 0.98,
            max: 2.2,
            order: point_list, //所有的点位
            route: windowData.root_list, //路线
            advertisment: windowData.advert_list[0] //广告管理
        };
        //console.log("img_index数据:");
        //console.log(img_index); // init页面大方法
        // 渲染路线
        // 预加载图片大方法

        function preloadImg(list, imgs) {
            var def = $.Deferred(),
                len = list.length;
            $(list).each(function(i, e) {
                var img = new Image();
                img.src = e;

                if (img.complete) {
                    imgs[i] = img;
                    len--;

                    if (len == 0) {
                        def.resolve();
                    }
                } else {
                    img.onload = function(j) {
                        return function() {
                            imgs[j] = img;
                            len--;

                            if (len == 0) {
                                def.resolve();
                            }
                        };
                    }(i);

                    img.onerror = function() {
                        len--;
                        console.log("fail to load image");
                    };
                }
            });
            return def.promise();
        }

        var preloadImgUrls = [],
            //此处省略一万个字符
            imgs = [];
        var oRouteUl = document.querySelector(".road_box_content");
        /*
        img_index.route.forEach(function (item) {
          preloadImgUrls.push(item.newUrl);
          var oli = document.createElement("li");
          oli.classList.add("road_box_content_li");
          oli.setAttribute("data", item.id);
          oli.setAttribute("img_url", item.newUrl);
          oli.innerText = item.title;
          oli.addEventListener("click", function (e) {
            e.stopPropagation();
            console.log(e.target.getAttribute("img_url"));

            if ($(this).hasClass("content_li_active")) {
              $(this).removeClass("content_li_active");
              $(".one").css({
                backgroundImage: "url(" + img_index.url + ")"
              });
            } else {
              if ($(".tipactive")) {
                $(".tipactive").removeClass("tipactive");
                $(".sliderGo").hide();
              }

              $(".one").css({
                backgroundImage: "url(" + this.getAttribute("img_url") + ")"
              });
              $(".road_box_content_li").removeClass("content_li_active");
              $(this).addClass("content_li_active");
            }
          });
          oRouteUl.appendChild(oli);
        });*/
        preloadImgUrls.push(img_index.url); // 放广告

        try {
            $(".advertisment img").attr("src", img_index.advertisment.newUrl);
            $(".advertisment").css("display", "block");
        } catch (err) {
            $(".advertisment").css("display", "none");
        } // 红包弹窗


        $(".advertisclose").click(function() {
            $(".advertisment").css("display", "none");
            $(".block").LoadingOverlay("show", true);
            $.when(preloadImg(preloadImgUrls, imgs)).done(function() {
                //预加载结束
                $(".block").LoadingOverlay("hide", true);
            });
        });

        if ($(".advertisment").css("display") == "none") {
            $(".block").LoadingOverlay("show", true);
            $.when(preloadImg(preloadImgUrls, imgs)).done(function() {
                $(".block").LoadingOverlay("hide", true);
            });
        }

        $(".advertisment img").click(function() {
            window.location.href = img_index.advertisment.url || "#";
        }); // 初始化

        //外部容器滚动
        var block = {
            "top": 0,
            "left": 0
        }


        var IMG_REAL_HEIGHT = img_index.height;
        var IMG_REAL_WIDTH = img_index.width;
        $(".one").css({
            width: IMG_REAL_WIDTH,
            height: IMG_REAL_HEIGHT,
            "font-size": 120 * FIRST_PERCENT + "px",
            background: "url(" + img_index.url + ")",
            "background-size": "contain",
            "background-repeat": "no-repeat",
            // transform: "scale(1)"
            // "position": "absolute"
            //添加中心点
            //transformOrigin:(IMG_REAL_WIDTH /2,IMG_REAL_HEIGHT /2)
        }); // 放置小图标


        //$(".block").scrollTop($(".one").height()* block.top);
        //第一次打开显示的正中心
        $(".block").scrollLeft((IMG_REAL_WIDTH - offsetWidth) / 2);

        for (var j = 0; j < img_index.order.length; j++) {
            (function() {
                var str = "<div value=" + j + " class='tip'></div>"; // console.log(str);

                $(".one").append(str);
            })(j);
        } // 改小图标样式


        for (var h = 0; h < img_index.order.length; h++) {
            (function() {
                $(".tip").eq(h).attr("con_text", img_index.order[h].con_text).attr("entitle", img_index.order[h].entitle).attr("zhtitle", img_index.order[h].zhtitle).attr("con_image", img_index.order[h].con_image).attr("type", img_index.order[h].type).attr("jump_id", img_index.order[h].id).attr("nav", img_index.order[h].nav).attr("lng", img_index.order[h].lng).attr("lat", img_index.order[h].lat).attr("jump_url", img_index.order[h].jump_url).attr("url", img_index.order[h].jump_url).css({
                    position: "absolute",
                    width: "0.2rem",
                    height: "0.2rem",
                    top: img_index.order[h].top * FIRST_PERCENT + "px",
                    left: img_index.order[h].left * FIRST_PERCENT + "px",
                    backgroundImage: "url(" + img_index.order[h].icon_url + ")",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat"
                });

            })(h);


        }

        function changeMicro(index, sign) {
            index = index * 1; // 如果没有解说

            if ($(".con_micro").hasClass("micro_on") || sign === false) {
                // 关闭音乐
                // 停止
                music.pause();
                music.currentTime = 0; // 换颜色

                $(".con_micro").removeClass("micro_on").addClass("micro_off");
            } else {
                // 播放
                // console.log(cur_language.audio[index]);
                music.src = cur_language.audio[index];
                music.play(); // 换颜色

                $(".con_micro").removeClass("micro_off").addClass("micro_on");
            }
        } // 点击解说


        $(".con_micro").click(function(ev) {
            ev.stopPropagation();
            changeMicro($('.tipactive').attr('value'));
        });
        $(".close").click(function(ev) {
            ev.stopPropagation();
            $(".sliderGo").hide();
            $(".sliderGo2").hide();
            $("#menu").show();
            changeMicro($(".tipactive").attr("value"), false);
            $(".tipactive").removeClass("tipactive");
        });
        $(".cancel").click(function(ev) {
            $(".mapBox").hide();
            $(".sliderGo").hide();
            $(".sliderGo2").hide();
            $(".menu").show();
        });
        /*
        $(".con_go").click(function () {
          //原来的逻辑,跳转到商户详情
          if ($(this).attr("nav") == 0) {
            window.location.href = $(".con_go").attr("jump_url");
            return;
          } else {
            $(".mapBox").show();
          }
          //现在需要直接打开导航

        });*/
        //点击手指进入的页面,通过type进行判断
        $(".finger").click(function() {

            if ($(this).attr("type") == "6" || $(this).attr("type") == "7") {
                //厕所和停车场,没有详情
            } else {
                //跳转到详情页面
                if ($(this).attr("jump_url")) {
                    //跳转到指定的URL
                    window.location.href = $(this).attr("jump_url");
                } else {
                    window.location.href = './shop_info.html?id=' + $(this).attr("id") + '&title=' + $(this).attr("title");

                }
                return;
            }

        });

        $(".mapli").click(function() {
            var url = "http://uri.amap.com/navigation//uri.amap.com/navigation?to=" + map_lng + "," + map_lat + "," + map_name + "&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0";
            window.location.href = url;
        }); // 关闭路线

        function closeRoute() {
            $(".road_box").removeClass("road_box_active").attr("src", "./data/xianlu.png");
        } // reload页面大方法


        function renderPage() {
            // document.title
            document.title = windowData.map_data.label_name; // 点击渲染出来的一个个小厕所
            // 点击小图标
            var map_title_h1 = `<h1>${windowData.map_data.label_name}</h1>`;
            $('.map_title').html(map_title_h1);
            $(".tip").click(function(ev) {
                ev.stopPropagation(); //这个很重要阻止向上冒泡实践传递
                var $tip = $(this); // 告诉close要关闭哪一个tip

                $(".close").attr("value", $tip.attr("value"));
                $(".sliderGo").hide();
                $(".sliderGo2").hide();
                closeRoute();

                if ($tip.hasClass("tipactive")) {
                    //console.log("tip-active");
                    $(".tipactive").removeClass("tipactive"); //底部菜单逻辑

                    $(".menu").show();
                    $(".sliderGo").hide();
                    $(".sliderGo2").hide();
                } else {
                    //console.log("tip-inactive");
                    $(".tipactive").removeClass("tipactive");
                    $tip.addClass("tipactive");
                    $(".menu").hide();
                    $(".con_micro").attr("cur_audio", cur_language.audio[$tip.attr("value") * 1]);
                    $(".con_image")[0].src = $tip.attr("con_image");
                    $(".con_title").text(cur_language.contitle[$tip.attr("value") * 1]); // 判断有无音频

                    if (!cur_language.audio[$tip.attr("value") * 1]) {
                        $(".con_playbutton").hide();
                    } else {
                        $(".con_playbutton").show();
                    }
                    $(".sliderGo2").show();
                    //console.log(cur_language);
                    var nav = $tip.attr("nav");
                    $(".con_go").attr("jump_url", $tip.attr("jump_url"));
                    $(".con_go").attr("nav", nav).attr("lng", $tip.attr("lng")).attr("lat", $tip.attr("lat"));

                    var type_ = $tip.attr("type");

                    $(".finger_").attr("type", type_);
                    var jump_url = $tip.attr("jump_url");
                    $(".finger_").attr("jump_url", jump_url);
                    var id_ = $tip.attr("jump_id");
                    $(".finger_").attr("id", id_);
                    $(".finger_").attr("title", $tip.attr("con_text"));

                    if (type_ == 7 || type_ == 6) {
                        //厕所和停车场不做详情
                        $(".finger_").removeClass("finger");
                    } else {

                        $(".finger_").addClass("finger");
                    }

                    if (nav == 0) {
                        if ($tip.attr("jump_url")) {
                            $(".con_go").attr("jump_url", $tip.attr("jump_url"));
                        } else {
                            $(".con_go").attr("jump_url", "./merchants.html?id=" + $tip.attr("jump_id"));
                        }

                        $(".con_go").attr("data-text", cur_language.to);
                    } else {
                        $(".con_go").attr("data-text", cur_language.to);
                    }

                    // $(".con_micro").attr("data-text", cur_language.introduce);
                    var map_item = windowData.point_list[parseInt($tip.attr("value"), 10)];
                    map_name = map_item.spots_name;
                    map_lat = map_item.lat;
                    map_lng = map_item.lng;
                }
            });
            // 3、渲染出底部的菜单栏

            windowData.bottom_menu_list.forEach(function(item, index) {
                language_list.menu[0][index] = item.title;
                language_list.menu[1][index] = item.enTitle;
                cur_language.menu[index] = item.title;
                //再创建一个div
                var div_ = document.createElement("div");
                div_.classList.add("menu_div_");
                div_.setAttribute("index", index);
                div_.setAttribute("is_click_bottom_menu", item.is_click_bottom_menu);

                //创建一个关闭的按钮
                /*
                var close_div = document.createElement("div");
                close_div.classList.add("close_menu");
                var cm_span = document.createElement("span");
                cm_span.innerText = "关闭";
                close_div.appendChild(cm_span);
                div_.appendChild(close_div);*/

                var ogm = document.createElement("div");
                ogm.setAttribute("index", index);
                ogm.setAttribute("is_click_bottom_menu", item.is_click_bottom_menu);

                ogm.classList.add("gm-flex");
                var oimg = document.createElement("img");
                oimg.src = item.iconUrl || "";
                oimg.width = "10";
                oimg.height = "10";
                oimg.style.marginRight = "3px";
                ogm.appendChild(oimg);
                var ospan = document.createElement("span");
                ospan.innerText = item.title;
                ogm.appendChild(ospan);
                var oul = document.createElement("ul");
                oul.setAttribute("is_click_bottom_menu", item.is_click_bottom_menu); // 如果is_click_bottom_menu = 2 那么就设置跳转的url
                oul.setAttribute("index", index);
                if (item.is_click_bottom_menu == "2") {
                    oul.setAttribute("is_click_bottom_menu_url", item.is_click_bottom_menu_url);
                } // 点击后可能的popper 如果is_click_bottom_menu = 1 那么就只要等于bottom_menu_list里面相同id的那一个li了


                var to_be_render_list = item.list;

                if (item.is_click_bottom_menu == "1") {
                    to_be_render_list = to_be_render_list.filter(function(ite) {
                        return ite.id == item.id[0];
                    });
                } // 点击后可能的popper 如果is_click_bottom_menu = 0 那么就全部丢进去


                to_be_render_list.forEach(function(sub_item) {
                    var oli = document.createElement("li"); // todo
                    // var oimg = document.createElement("img");
                    // oimg.src = "./images/toilet_icon.png";

                    var oa = document.createElement("a");
                    oa.innerText = sub_item.title;
                    oli.setAttribute("data", sub_item.id); // oli.appendChild(oimg);
                    oli.setAttribute("type", item.id[0]);
                    oli.setAttribute("zhAudioUrl", sub_item.zhAudioUrl);
                    oli.setAttribute("lng", sub_item.lng);
                    oli.setAttribute("lat", sub_item.lat);
                    oli.setAttribute("newUrl", sub_item.newUrl);
                    oli.setAttribute("url", sub_item.url);
                    oli.appendChild(oa);
                    oul.appendChild(oli);

                });
                //ogm.appendChild(oul);
                div_.appendChild(oul);
                document.querySelector("#menu").appendChild(div_);
                document.querySelector("#menu").appendChild(ogm);
            });
            //  底部菜单栏的点击事件

            $(".gm-flex").click(function(ev) {
                ev.stopPropagation();

                // 恢复样子
                $(".one").css({
                    transform: "scale(1)",
                    // transformOrigin: "top left"
                });
                $(".tip").css({
                    transform: "scale(1)"
                })
                scaleValue = 1;
                initScale = 1;

                var omenu = $(this).parent();
                var oul = $(this).find("ul");

                var is_click_bottom_menu = $(this).attr("is_click_bottom_menu");
                var index = $(this).attr("index");
                console.log("is_click_bottom_menu:" + is_click_bottom_menu + "index:" + index);
                //菜单索
                var div_ = $(".menu_div_");
                switch (is_click_bottom_menu) {
                    case "0":
                        for (var i = 0; i < windowData.bottom_menu_list.length; i++) {
                            if (index == i) {
                                div_.eq(index).toggle(300);
                            } else {
                                div_.eq(i).toggle(false);
                            }
                        }

                        //oul.toggle(300);

                        break;
                    case "1":
                        if ($(this).hasClass("bottom_menu_active")) {
                            $(this).removeClass("bottom_menu_active");
                        } else {
                            omenu.find(".gm-flex").removeClass("bottom_menu_active");
                            $(this).addClass("bottom_menu_active");
                        }

                        oul.find("li").trigger("click");
                        break;

                    case "2":
                        window.location.href = is_click_bottom_menu_url;
                        break;

                    default:


                        break;
                }
            });
            // 点击菜单筛选出同类的

            $("#menu li").click(function(ev) {
                ev.stopPropagation(); //这个很重要阻止向上冒泡实践传递
                var title = $(this).text();
                //console.log(title);
                var id = this.getAttribute("data");
                var type = this.getAttribute("type");
                var zhAudioUrl = this.getAttribute("zhAudioUrl");
                var lng = this.getAttribute("lng");
                var lat = this.getAttribute("lat");
                var newUrl = this.getAttribute("newUrl");
                var url = this.getAttribute("url");

                $(".menu").hide();
                $(".con_micro").attr("cur_audio", zhAudioUrl);
                $(".con_image")[0].src = newUrl;
                $(".con_title").text(title); // 判断有无音频

                if (type == 6 || type == 7) {
                    $(".con_playbutton").hide();
                } else {
                    if (zhAudioUrl) {
                        $(".con_playbutton").show();
                    } else {
                        $(".con_playbutton").hide();
                    }
                }
                $(".sliderGo2").show();
                //console.log(cur_language);
                var nav = 1; //$tip.attr("nav");
                $(".con_go").attr("jump_url", id);
                $(".con_go").attr("nav", nav).attr("lng", lng).attr("lat", lat);


                $(".finger").attr("type", type);

                $(".finger").attr("id", id);
                $(".finger").attr("title", title);
                $(".finger").attr("jump_url", url);

                if (type == 7 || type == 6) {
                    //厕所和停车场不做详情
                    $(".finger_").removeClass("finger");
                } else {

                    $(".finger_").addClass("finger");
                }


                /*
                event.stopPropagation();
                var id = this.getAttribute("data"); //选择的ID
                  var type = this.getAttribute("type");

                var $selectors = $("[type=" + type + "]");
                console.log("输出："+$selectors);
                var oli = $(this);
                var oGmflex = oli.parent().parent();

                if (!oGmflex.hasClass("bottom_menu_active")) {
                  $(".tip").show();
                } else {
                  $(".tip").hide();
                  $("#menu ul").hide();
                  $selectors.show();
                }
                */
            });
            // 4、点击 "路线" 图片

            $(".road_box").click(function(ev) {
                $(".sliderGo").hide();
                $(".mapBox").hide();

                if ($(this).hasClass("road_box_active")) {
                    // $(".content_li_active").removeClass("content_li_active");
                    $(".road_box").removeClass("road_box_active").attr("src", "./data/xianlu.png"); // 路线

                    $(".road_box_content").hide();
                } else {
                    $(".road_box").addClass("road_box_active").attr("src", "./data/xianlu1.png");
                    $(".road_box_content").show(); // 路线

                    $(".road_box_content").show();
                }
            }); // 点击前往购物

            $(".shopBox").click(function() {
                window.location.href = windowData.shopUrl;
            });
        }

        renderPage();

        function changeLanguage() {
            if (cur_language.id === 0) {
                Object.keys(language_list).forEach(function(name) {
                    console.log(language_list[name][1]);
                    cur_language[name] = language_list[name][1];
                });
            } else {
                Object.keys(language_list).forEach(function(name) {
                    console.log(language_list[name][0]);
                    cur_language[name] = language_list[name][0];
                });
            }

            $(".road_text").text(cur_language["route"]);
            $(".language_text").text(cur_language["language"]);
            $(".shop_text").text(cur_language["shopping"]); // console.log(cur_language);

            cur_language.menu.forEach(function(title, idx) {
                $(".gm-flex span")[idx].innerText = title;
            });
        } // 点击切换语言


        $(".languageBox").click(function(ev) {
            window.location.href = './shop_list.html';
            /*--原来的中英文切换
            changeLanguage();

            if (cur_language.id === 0) {
              // 全部换成中文
              $(this).find("img").attr("src", "data/ch.png");
            } else {
              // 全部换成英文
              $(this).find("img").attr("src", "data/en.png");
            }
            */
        });
        var pinchImg = document.querySelector("body");
        //var pinchCenter = document.querySelector(".centerpoint");
        var pinchOne = document.querySelector('.one');
        // var pinchIco = document.querySelectorAll(".tip")

        var initScale = 1;
        var scaleValue = 1;
        var start = [];
        var scaleCenter = {};
        //下面两个是20190620增加的
        var oneOffsetBlockX = 0;
        var oneOffsetBlockY = 0;
        Transform(pinchOne);
        // Transform(pinchIco);

        new AlloyFinger(pinchOne, {

            multipointStart: function(evt) {

                // 通过evt.touches拿到前两个手指的坐标去计算中心坐标
                var centerX = (evt.touches[0].pageX + evt.touches[1].pageX) / 2;
                var centerY = (evt.touches[0].pageY + evt.touches[1].pageY) / 2;
                //  Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置
                var cr = pinchOne.getBoundingClientRect();
                // 重置 originX 和 originY　到两手指的中心
                var img_centerX = cr.left + cr.width / 2;
                var img_centerY = cr.top + cr.height / 2;
                var offX = centerX - img_centerX;
                var offY = centerY - img_centerY;
                var preOriginX = pinchOne.originX
                var preOriginY = pinchOne.originY
                pinchOne.originX = offX / pinchOne.scaleX;
                pinchOne.originY = offY / pinchOne.scaleY;

                pinchOne.translateX += offX - preOriginX * pinchOne.scaleX;
                pinchOne.translateY += offY - preOriginY * pinchOne.scaleX;


                initScale = pinchOne.scaleX;

            },

            pinch: function(evt) {

                scaleValue = initScale * evt.zoom;


                if (scaleValue < img_index.min) {
                    scaleValue = img_index.min;
                }

                if (scaleValue > img_index.max) {
                    scaleValue = img_index.max;
                }

                pinchOne.scaleX = pinchOne.scaleY = scaleValue;
                // pinchIco.scaleX = pinchIco.scaleY = 1/scaleValue;

                self.setState({
                    initScale: initScale * tempo
                });
            },


            multipointEnd: function() {
                var oldValue = 1;
                /* if (scaleValue <= 1) {
                    oldValue = 1;
                } else {
                    oldValue = 0.5;
                } */
                $(".tip").css({
                    transform: "scale(".concat(oldValue / scaleValue, ")")

                });
                window.setTimeout(function() {
                    stickEffect(pinchOne);
                }, 100);
            },

            pressMove: function(evt) {
                // pinchOne.scaleX = pinchOne.scaleY = 1.5;

                /*  var w = parseFloat(pinchOne.style.width)
                 var winWidth = window.innerWidth;
                 var skWidth = w * pinchOne.scaleX;
                 var h = parseFloat(pinchOne.style.height)
                 var winHeight = window.innerHeight;
                 var skHeight = h * pinchOne.scaleY;

                 console.log($(".one").offset().left) */



                pinchOne.translateX += evt.deltaX;
                pinchOne.translateY += evt.deltaY;

                /*                 if (pinchOne.translateX > (skWidth - winWidth) / 2) {
                                    pinchOne.translateX = (skWidth - winWidth) / 2
                                } else if (pinchOne.translateX < -(skWidth - winWidth) / 2) {
                                    pinchOne.translateX = -(skWidth - winWidth) / 2
                                }
                                if (pinchOne.translateY > (skHeight - winHeight) / 2) {
                                    pinchOne.translateY = (skHeight - winHeight) / 2
                                } else if (pinchOne.translateY < -(skHeight - winHeight) / 2) {
                                    pinchOne.translateY = -(skHeight - winHeight) / 2
                                }
                 */



                // console.log(pinchOne.translateX)

                evt.preventDefault();
            }
        });



        function stickEffect(pinchOne) {
            // 超出屏幕外，吸附动效返回
            // 当前屏幕位置
            var left = $(".one").offset().left;
            var top = $(".one").offset().top;
            // 图片宽高
            var imgWidth = $(".one").width();
            var imgHeight = $(".one").height();
            // 屏幕宽高，高度=屏幕高度
            var winWidth = window.innerWidth;
            var winHeight = window.innerHeight;

            var skWidth = $(".one").width() * pinchOne.scaleX;
            var skHeight = $(".one").height() * pinchOne.scaleY;
            var setLeft = left;
            var setTop = top;

            // alert(pinchOne.translateX)

            // alert(skWidth - imgWidth)
            // alert(left)
            if (left > 0 || top > 0 || skWidth + left < winWidth || skHeight + top < winHeight) {
                //console.log("超出屏幕范围");
                if (left > 0) {
                    setLeft = 0;
                }
                if (top > 0) {
                    setTop = 0;
                }
                if (skWidth + left < winWidth) {
                    setLeft = -(skWidth - winWidth);
                }
                if (skHeight + top < winHeight) {
                    setTop = -(skHeight - winHeight);
                }

                // console.log("before，top：" + $("#testImg").offset().top, "left：", $("#testImg").offset().left);
                // console.log("stickEffect，top：" + Math.ceil(setTop), "left：", Math.ceil(setLeft));

                $(".one").offset({
                    top: Math.ceil(setTop),
                    left: Math.ceil(setLeft)
                });
            }
        }


    },
    function(err) {
        console.error(err);
    });