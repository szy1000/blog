//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;
(function($) {
    var touch = {},
        touchTimeout, tapTimeout, swipeTimeout, longTapTimeout, // Timeout ID
        longTapDelay = 750,
        gesture

    // 判断滑动方向，返回Left, Right, Up, Down
    function swipeDirection(x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >=
            Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
    }

    // 长按
    function longTap() {
        longTapTimeout = null
        if (touch.last) {
            touch.el.trigger('longTap')
            touch = {}
        }
    }

    // 取消长按
    function cancelLongTap() {
        if (longTapTimeout) clearTimeout(longTapTimeout)
        longTapTimeout = null
    }

    // 取消所有
    function cancelAll() {
        if (touchTimeout) clearTimeout(touchTimeout)
        if (tapTimeout) clearTimeout(tapTimeout)
        if (swipeTimeout) clearTimeout(swipeTimeout)
        if (longTapTimeout) clearTimeout(longTapTimeout)
        touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
        touch = {}
    }

    // IE的touch事件？
    function isPrimaryTouch(event) {
        return (event.pointerType == 'touch' ||
            event.pointerType == event.MSPOINTER_TYPE_TOUCH) && event.isPrimary
    }

    // (ie)鼠标事件？
    function isPointerEventType(e, type) {
        return (e.type == 'pointer' + type ||
            e.type.toLowerCase() == 'mspointer' + type)
    }

    // 入口
    $(document).ready(function() {
        var now, delta, deltaX = 0,
            deltaY = 0,
            firstTouch, _isPointerType

        // IE手势
        if ('MSGesture' in window) {
            gesture = new MSGesture()
            gesture.target = document.body
        }

        $(document)
            //处理IE手势结束
            .bind('MSGestureEnd', function(e) {
                var swipeDirectionFromVelocity =
                    e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
                if (swipeDirectionFromVelocity) {
                    touch.el.trigger('swipe')
                    touch.el.trigger('swipe' + swipeDirectionFromVelocity)
                }
            })



        // 处理手指接触
        .on('touchstart MSPointerDown pointerdown', function(e) {
            // 排除非触摸设备
            if ((_isPointerType = isPointerEventType(e, 'down')) &&
                !isPrimaryTouch(e)) return
            // 获取起点位置数据
            firstTouch = _isPointerType ? e : e.touches[0]
            // 重置终点坐标
            if (e.touches && e.touches.length === 1 && touch.x2) {
                // Clear out touch movement data if we have it sticking around
                // This can occur if touchcancel doesn't fire due to preventDefault, etc.
                touch.x2 = undefined
                touch.y2 = undefined
            }
            // 判断用户动作类型
            now = Date.now()
            delta = now - (touch.last || now)   // 距离上次碰触的时间差
            touch.el = $('tagName' in firstTouch.target ?   // 手指碰触的元素
                firstTouch.target : firstTouch.target.parentNode)
            touchTimeout && clearTimeout(touchTimeout)  // 重置touch事件处理器的Timeout ID
            // 记录起点坐标
            touch.x1 = firstTouch.pageX
            touch.y1 = firstTouch.pageY
            // 判定双击
            if (delta > 0 && delta <= 250) touch.isDoubleTap = true
            touch.last = now    // 更新上次碰触时间
            // 注册长按事件处理器ID（750ms后触发长按，肯定会在手指离开时判断取消）
            longTapTimeout = setTimeout(longTap, longTapDelay)
            // 支持IE手势识别
                // adds the current touch contact for IE gesture recognition
            if (gesture && _isPointerType) gesture.addPointer(e.pointerId);
        })


        // 处理手指滑动
        .on('touchmove MSPointerMove pointermove', function(e) {
            // 排除非触摸设备
            if ((_isPointerType = isPointerEventType(e, 'move')) &&
                !isPrimaryTouch(e)) return
            // 读出起点坐标
            firstTouch = _isPointerType ? e : e.touches[0]
            // 取消长按事件处理器
            cancelLongTap()
            // 记录当前点坐标
            touch.x2 = firstTouch.pageX
            touch.y2 = firstTouch.pageY
            // 累计滑过的距离
            deltaX += Math.abs(touch.x1 - touch.x2)
            deltaY += Math.abs(touch.y1 - touch.y2)
        })


        // 处理手指离开
        .on('touchend MSPointerUp pointerup', function(e) {
            // 排除非触摸设备
            if ((_isPointerType = isPointerEventType(e, 'up')) &&
                !isPrimaryTouch(e)) return
            // 取消长按事件处理器
            cancelLongTap()

            // swipe
            // 判定滑动动作（起点 - 终点的横向或者纵向距离超过30px）
            if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
                (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))
                // 注册长按事件处理器ID（立即准备执行长按）
                swipeTimeout = setTimeout(function() {
                touch.el.trigger('swipe')   // 触发长按
                // 触发向上|下|左|右的长按
                touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
                // 清空数据，本次touch结束
                touch = {}
            }, 0)

            // normal tap
            // 正常轻触
            else if ('last' in touch)   // 如果记录了上次接触时间
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
                        var event = $.Event('tap')
                        event.cancelTouch = cancelAll
                        touch.el.trigger(event)

                        // trigger double tap immediately
                        // 立即触发doubleTap
                        if (touch.isDoubleTap) {
                            if (touch.el) touch.el.trigger('doubleTap')
                            touch = {}
                        }

                        // trigger single tap after 250ms of inactivity
                        // 250ms后触发singleTap
                        else {
                            touchTimeout = setTimeout(function() {
                                touchTimeout = null
                                if (touch.el) touch.el.trigger('singleTap')
                                touch = {}
                            }, 250)
                        }
                    }, 0)
                } else {
                    // 如果是滑了一圈又回到起点，扔掉事件数据，不做处理
                    touch = {}
                }
                // 重置横向，纵向滑动距离
                deltaX = deltaY = 0
            })



            // when the browser window loses focus,
            // for example when a modal dialog is shown,
            // cancel all ongoing events
            // 浏览器窗口失去焦点时，取消所有事件处理动作
            .on('touchcancel MSPointerCancel pointercancel', cancelAll)




        // scrolling the window indicates intention of the user
        // to scroll, not tap or swipe, so cancel all ongoing events
        // 触发scroll时取消所有事件处理动作
        $(window).on('scroll', cancelAll)
    })

    // 注册自定义事件
    ;
    ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
        'doubleTap', 'tap', 'singleTap', 'longTap'
    ].forEach(function(eventName) {
        $.fn[eventName] = function(callback) {
            return this.on(eventName, callback)
        }
    })
})(Zepto)
