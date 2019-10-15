/**
 * touch 不支持ie
 * 
 * dep:
 * 1.my.js DOM Core部分
 * 
 */

(function(window) {
    var touch = {};


    var touchData = {},
        touchTimeout, tapTimeout, swipeTimeout, longTapTimeout, // Timeout ID
        longTapDelay = 750;

    // 判断滑动方向，返回Left, Right, Up, Down
    function swipeDirection(x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >=
            Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
    }

    // 长按
    function longTap() {
        longTapTimeout = null;
        if (touchData.last) {
            touchData.ele.trigger('longTap');
            touchData = {};
        }
    }

    // 取消长按
    function cancelLongTap() {
        if (longTapTimeout) clearTimeout(longTapTimeout);
        longTapTimeout = null;
    }

    // 取消所有
    function cancelAll() {
        if (touchTimeout) clearTimeout(touchTimeout);
        if (tapTimeout) clearTimeout(tapTimeout);
        if (swipeTimeout) clearTimeout(swipeTimeout);
        if (longTapTimeout) clearTimeout(longTapTimeout);
        touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
        touchData = {};
    }

    function _Core(ele) {
        this._ele = ele;
    }
    function m$(strOrEle) {
        if (typeof strOrEle === 'string') {
            return new _Core(document.querySelector);
        }
        else if (typeof strOrEle === 'object') {
            return new _Core(strOrEle);
        }
        else {
            return null;
        }
    }
    _Core.prototype = {
        on: function(type, handler) {
            document.addEventListener(type, handler, false);

            return this;
        },
        ready: function(func) {
            document.addEventListener('DOMContentLoaded', function() {
                func();
            }, false);
        },
        trigger: function(eventName) {
            // create custom event object
            var event = document.createEvent('CustomEvent');
            // init event
            event.initCustomEvent(eventName, true, true);

            // fire
            this._ele.dispatchEvent(event);
        },
        fire: function(event) {
            // fire
            this._ele.dispatchEvent(event);
        }
    };

    // 入口
    m$(document).ready(function() {
        var now, delta, deltaX = 0,
            deltaY = 0,
            firstTouch;

        m$(document)
        // 处理手指接触
        .on('touchstart', function(e) {
            // 获取起点位置数据
            firstTouch = e.touches[0];
            // 重置终点坐标
            if (e.touches && e.touches.length === 1 && touchData.x2) {
                // Clear out touch movement data if we have it sticking around
                // This can occur if touchcancel doesn't fire due to preventDefault, etc.
                touchData.x2 = undefined;
                touchData.y2 = undefined;
            }
            // 判断用户动作类型
            now = Date.now();
            delta = now - (touchData.last || now);   // 距离上次碰触的时间差
            touchData.ele = m$('tagName' in firstTouch.target ?   // 手指碰触的元素
                firstTouch.target : firstTouch.target.parentNode);
            touchTimeout && clearTimeout(touchTimeout);  // 重置touch事件处理器的Timeout ID
            // 记录起点坐标
            touchData.x1 = firstTouch.pageX;
            touchData.y1 = firstTouch.pageY;
            // 判定双击
            if (delta > 0 && delta <= 250) touchData.isDoubleTap = true;
            touchData.last = now;    // 更新上次碰触时间
            // 注册长按事件处理器ID（750ms后触发长按，肯定会在手指离开时判断取消）
            longTapTimeout = setTimeout(longTap, longTapDelay);
        })
        // 处理手指滑动
        .on('touchmove', function(e) {
            // 读出起点坐标
            firstTouch = e.touches[0];
            // 取消长按事件处理器
            cancelLongTap();
            // 记录当前点坐标
            touchData.x2 = firstTouch.pageX;
            touchData.y2 = firstTouch.pageY;
            // 累计滑过的距离
            deltaX += Math.abs(touchData.x1 - touchData.x2);
            deltaY += Math.abs(touchData.y1 - touchData.y2);
        })


        // 处理手指离开
        .on('touchend', function(e) {
            // 取消长按事件处理器
            cancelLongTap();

            // swipe
            // 判定滑动动作（起点 - 终点的横向或者纵向距离超过30px）
            if ((touchData.x2 && Math.abs(touchData.x1 - touchData.x2) > 30) ||
                (touchData.y2 && Math.abs(touchData.y1 - touchData.y2) > 30)) {
                // 注册长按事件处理器ID（立即准备执行长按）
                swipeTimeout = setTimeout(function() {
                    touchData.ele.trigger('swipe');   // 触发长按
                    // 触发向上|下|左|右的长按
                    touchData.ele.trigger('swipe' + (swipeDirection(touchData.x1, touchData.x2, touchData.y1, touchData.y2)));
                    // 清空数据，本次touch结束
                    touchData = {};
                }, 0);
            }

            // normal tap
            // 正常轻触
            else if ('last' in touchData)   // 如果记录了上次接触时间
            // don't fire tap when delta position changed by more than 30 pixels,
            // for instance when moving to a point and back to origin
                // 如果从接触到抬起，中间滑过的横向和纵向距离都不超过30px——是正常轻触
                if (deltaX < 30 && deltaY < 30) {
                    // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
                    // ('tap' fires before 'scroll')
                    // 立即准备执行轻触，不立即执行是为了scroll时能取消执行轻触
                    tapTimeout = setTimeout(function() {
                        // trigger universal 'tap' with the option to cancelTouch()
                        // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
                        // 触发全局tap，cancelTouch()可以取消singleTap，doubleTap事件，以求更快响应轻触
                        var event = new CustomEvent("tap", {
                            detail: {
                                cancelTouch: cancelAll
                            },
                            bubbles: true,
                            cancelable: true
                        });

                        touchData.ele.fire(event);
                        // trigger double tap immediately
                        // 立即触发doubleTap
                        if (touchData.isDoubleTap) {
                            if (touchData.ele) touchData.ele.trigger('doubleTap');
                            touchData = {};
                        }

                        // trigger single tap after 250ms of inactivity
                        // 250ms后触发singleTap
                        else {
                            touchTimeout = setTimeout(function() {
                                touchTimeout = null;
                                if (touchData.ele) touchData.ele.trigger('singleTap');
                                touchData = {};
                            }, 250);
                        }
                    }, 0);
                } else {
                    // 如果是滑了一圈又回到起点，扔掉事件数据，不做处理
                    touchData = {};
                }
                // 重置横向，纵向滑动距离
                deltaX = deltaY = 0;
            })



            // when the browser window loses focus,
            // for example when a modal dialog is shown,
            // cancel all ongoing events
            // 浏览器窗口失去焦点时，取消所有事件处理动作
            .on('touchcancel', cancelAll);




        // scrolling the window indicates intention of the user
        // to scroll, not tap or swipe, so cancel all ongoing events
        // 触发scroll时取消所有事件处理动作
        m$(window).on('scroll', cancelAll);
    });



    // register custom event
    function _registCusEvent(obj) {
        var types = ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
            'doubleTap', 'tap', 'singleTap', 'longTap'];

        for (var i = 0; i < types.length; i++) {
            (function(i) {
                obj[types[i]] = function(handler) {
                    this._ele.addEventListener(types[i], handler, false);
                };
            })(i);
        }
    }


    window.my = window.my || {};
    window.my.touch = touch;

    // if Core is defined, register to support invokation form like 'm$.tap(handler);'
    if (window.my.core && window.my.core.proto) {
        _registCusEvent(window.my.core.proto);
    }
    else {
        new Error('my.touch: my.js is not found');
    }
})(window);