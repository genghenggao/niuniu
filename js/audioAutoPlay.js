function clickMusic() {
    let className = document.getElementById('music_ico').className
    let ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        //在微信中打开
        if (className == null || className == '') {
            WeChat_music('play')
        } else {
            WeChat_music('pause')
        }
    } else {
        if (className == null || className == '') {
            browser_music('play')
        } else {
            browser_music('pause')
        }
    }

}
$(function() {
    let ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        //在微信中打开
        WeChat_music('play')
    } else {
        if (IsPC()) {
            function audioAutoPlay_1() {
                document.getElementById('music_ico').className = 'music_run'
                let audio = document.getElementById('audio');
                audio.play();
                document.removeEventListener('click', audioAutoPlay_1, false);
            }
            document.addEventListener('click', audioAutoPlay_1, false);
        } else {
            function audioAutoPlay_2() {
                document.getElementById('music_ico').className = 'music_run'
                let audio = document.getElementById('audio');
                audio.play();
                document.removeEventListener('touchstart', audioAutoPlay_2, false);
            }
            document.addEventListener('touchstart', audioAutoPlay_2, false);
        }
    }
})
//浏览器播放与暂停
function browser_music(type) {
    var aaa = document.getElementById('audio')
    audio.playbackRate = "1"
    if (type == 'play') {
        document.getElementById('music_ico').className = 'music_run'
        aaa.play()
    }
    if (type == 'pause') {
        document.getElementById('music_ico').className = ''
        aaa.pause()
    }
}
//微信播放与暂停
function WeChat_music(type) {
    if (type == 'play') {
        document.getElementById('music_ico').className = 'music_run'
        var audio = document.getElementById('audio');
        audio.playbackRate = "1"
        if (window.WeixinJSBridge) {
            WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
                audio.play();
            }, false);
        } else {
            document.addEventListener("WeixinJSBridgeReady", function() {
                WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
                    audio.play();
                });
            }, false);
        }
        audio.play();
        return false;
    }
    if (type == 'pause') {
        document.getElementById('music_ico').className = ''
        var audio = document.getElementById('audio');
        audio.playbackRate = "1"
        if (window.WeixinJSBridge) {
            WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
                audio.pause();
            }, false);
        } else {
            document.addEventListener("WeixinJSBridgeReady", function() {
                WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
                    audio.pause();
                });
            }, false);
        }
        audio.pause();
        return false;
    }
}

//是否pc打开
if (!IsPC()) {
    document.getElementById('music_ico').style.width = '50px'
    document.getElementById('music_ico').style.height = '50px'
} else {
    document.getElementById('music_ico').style.width = '40px'
    document.getElementById('music_ico').style.height = '40px'
}

function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"
    ];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    if (window.screen.width >= 768) {
        flag = true;
    }
    return flag;
}