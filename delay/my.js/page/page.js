/**
 * page
 * 适配屏幕，参考白树的pageResponse
 */

(function(window) {
    var page = {};
    
    // 适配屏幕，psdWidth可选，默认是
    page.init = function(psdWidth) {
        // 屏幕宽度
        var w = document.documentElement.clientWidth;
        
        var psdW = psdWidth || 320;
        // 容器的class必须为wrapper
        var ele = document.getElementsByClassName('my_page');
        if (ele.length === 0) {
            throw new Error('my.page.init: class name "my_page" is not found');
        }
        else {
            ele = ele[0];
        }

        // 按宽度缩放
        var scaleValue = w / psdW;
        
        var s = ele.style;
        s.width = psdW + 'px';
        s.webkitTransformOrigin = 'top left 0';
        s.transformOrigin = 'top left 0';
        s.webkitTransform = 'scale(' + scaleValue + ')';
        s.transform = 'scale(' + scaleValue + ')';
    };

    window.my = window.my || {};
    window.my.page = page;
    document.addEventListener('DOMContentLoaded', function() {
        page.init();
    }, false);
    window.onresize = function() {
        page.init();
    };
})(window);