"use strict";

var u = navigator.userAgent;
var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; // 禁止safari 用户自动缩放！！ meta无效
// document.addEventListener('gesturestart', function (event) {
//   event.preventDefault();
// });

var box = document.querySelector("body");
box.addEventListener("gesturestart", gesture, false);
box.addEventListener("gesturechange", gesture, false);
box.addEventListener("gestureend", gesture, false); // box.addEventListener("touchstart", gesture, false);// 这个控制台会报错 说是这个touchstart 传true不能preventDefaut()
var mobile_active = false;
var wx_active = 0;

function gesture(event) {
    event.preventDefault();
}

var browser = {
    versions: function() {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        return {
            //移动终端浏览器版本信息
            trident: u.indexOf("Trident") > -1,
            //IE内核
            presto: u.indexOf("Presto") > -1,
            //opera内核
            webKit: u.indexOf("AppleWebKit") > -1,
            //苹果、谷歌内核
            gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1,
            //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/),
            //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            //ios终端
            android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1,
            //android终端或uc浏览器
            iPhone: u.indexOf("iPhone") > -1,
            //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf("iPad") > -1,
            //是否iPad
            webApp: u.indexOf("Safari") == -1 //是否web应该程序，没有头部与底部

        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};

if (browser.versions.mobile) {
    mobile_active = true; //判断是否是移动设备打开。browser代码在下面

    var ua = navigator.userAgent.toLowerCase(); //获取判断用的对象

    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        //在微信中打开
        wx_active = 1;
        // alert('open in weixin')

    }

    if (ua.match(/WeiBo/i) == "weibo") { //在新浪微博客户端打开
    }

    if (ua.match(/QQ/i) == "qq") { //在QQ空间打开
    }

    if (browser.versions.ios) { //是否在IOS浏览器打开
        //$(document).one("touchstart",function(){
        //    var audio = document.getElementById('bg_music');
        //    audio.play();
        //});
    }

    if (browser.versions.android) {}
} else {
    mobile_active = false; // alert("为了您的体验，请使用移动端使用！");
    //否则就是PC浏览器打开
}

function debounce(func, wait, immediate) {
    var timeout;
    return function executedFunction() {
        var context = this;
        var args = arguments;

        var later = function later() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };

        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

;

function makeRandomString(num) {
    // 所以如果想得到一长串的随机字符，则需使用一个 > 10 且是奇数的参数，另外根据长度自行使用slice(2, n)截取
    return Math.random().toString(13).slice(2, num + 2);
} //设置cookie


function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + (expiredays == null ? "" : ";expires=" + exdate.toGMTString());
} //取回cookie


function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");

        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }

    return "";
} // https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart


if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0; //floor if number or convert non-number to 0;

        padString = String(typeof padString !== 'undefined' ? padString : ' ');

        if (this.length > targetLength) {
            return String(this);
        } else {
            targetLength = targetLength - this.length;

            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }

            return padString.slice(0, targetLength) + String(this);
        }
    };
}

var formateDateA_outStr = function formateDateA_outStr()
    /* instance of date */
    {
        var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
        // console.log(`- date[Date] prepare to formateDateA{yyyy-mm-dd HH:MM:DD}: ${date}`)
        var str = date.getFullYear() + "-" + (date.getMonth() + 1 + "").padStart(2, "0") + "-" + (date.getDate() + "").padStart(2, "0") + " " + (date.getHours() + "").padStart(2, "0") + ":" + (date.getMinutes() + "").padStart(2, "0") + ":" + (date.getSeconds() + "").padStart(2, "0");
        return str; // 2019-01-30 19:18:34
    };

var RAND_STRING = makeRandomString(10);
var dali_token = getCookie("dali_token");
// console.log(dali_token);
var today_date = formateDateA_outStr().slice(0, 10).replace(/-/g, ""); // 20190328
// console.log(today_date);

if (dali_token == "") {
    setCookie("dali_token", today_date + "_" + RAND_STRING, 10);
} else if (dali_token.split("_")[0] !== today_date) {
    setCookie("dali_token", today_date + "_" + dali_token.split("_")[1], 10);
} else {}