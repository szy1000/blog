/**
 * util
 */
(function(window) {
    'use strict';

    var util = {};

    // 计算字符串长度，半角2个算1个，向上取整
    util.countWord = function(str) {
        var i;
        var c;
        var len = 0;

        /**
         * 判断字符是全角还是半角
         * 判断字符是全角还是半角
         * @param {Integer} c 字符
         * @return {Boolean} true：半角 false：全角
         */
        function _isDbcCase(c) {
            // 基本拉丁字母（即键盘上可见的，空格、数字、字母、符号）
            if (c >= 32 && c <= 127) {
                return true;
            }
            // 日文半角片假名和符号
            else if (c >= 65377 && c <= 65439) {
                return true;
            }

            return false;
        }

        for (i = 0; i < str.length; i++) {
            c = str.charCodeAt(i);
            if (_isDbcCase(c)) { //半角
                len = len + 1;
            } else { //全角
                len = len + 2;
            }
        }

        return Math.ceil(len / 2); // 半角2个算1个，向上取整
    };

    // preloadMp3
    // 预加载音频
    util.preloadMp3 = function(audios, debug) {
        document.body.addEventListener('touchmove', loadMp3, false);
        function loadMp3() {
            audios[0].load();
            for (var i = 0; i < audios.length; i++) {
                (function(i) {
                    audios[i].addEventListener('canplaythrough', function() {
                        if (debug === true) {
                            console.log(audios[i]);
                        }
                        if (i + 1 < audios.length) {
                            audios[i+1].load();
                        }
                    }, false);
                })(i);
            }
            document.body.removeEventListener('touchmove', loadMp3, false);
        }
    };
    

    
    window.my = window.my || {};
    window.my.util = util;
})(window);