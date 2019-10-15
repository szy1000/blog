/**
 * com
 * 自定义组件，没有任何依赖项
 *     mask 图片蒙层，点击消失
 *     alert 模拟ios alert
 */

(function(window) {
    var com = {};


    //!!! mask显示的img要求宽度为320px
    /**
     * 蒙层
     * @param  {DOM Elelemt} ele    与蒙层关联的DOM元素
     * @param  {String} imgUrl 蒙层图片url
     * @param  {Integer} height 蒙层图片高度
     * @return
     */
    com.mask = function(ele, imgUrl, height) {
        // 预加载mask图片
        new Image().src = imgUrl;

        // html
        var divMask = document.createElement('div');
        divMask.className = 'mask';
        divMask.style.display = 'none';
        divMask.innerHTML = '<div class="maskImg"></div>';
        document.body.appendChild(divMask);
        // css
        _addCss('.mask { background-color: rgba(0, 0, 0, 0.8); position: fixed; top: 0; left: 0; z-index: 9999;}' +
                '.maskImg { width: 320px; height: ' + height + 'px; background-image: url("' + imgUrl + '");' +
                '-webkit-background-size: 320px ' + height + 'px; background-size: 320px ' + height +
                'px; background-position: 0 0;}');
        // js
        // 注册分享事件
        // 初始化分享引导蒙层
        divMask.style.height = (document.documentElement.clientHeight + 50) + 'px'; // fix 安卓mask盖不住bug，需要与css同步修改
        divMask.style.width = document.documentElement.clientWidth + 'px';
        // 适配
        var w = document.documentElement.clientWidth;
        var scale320 = w / 320;
        _scale(_m$('.maskImg'), '0px', '0px', scale320);

        ele.addEventListener('click', tgMask, false);
        function tgMask() {
            // 点击按钮显示蒙层，点其他地方隐藏
            if (divMask.style.display === 'none') {
                divMask.style.display = 'block';
                // 禁止滚动
                document.ontouchmove = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                };
                document.body.style.overflowY = 'hidden';
                
                // 点击任意位置隐藏
                var _handler = function() {
                    divMask.style.display = 'none';
                    // 允许滚动
                    document.ontouchmove = null;
                    document.body.style.overflowY = 'auto';

                    // 移除事件
                    divMask.removeEventListener('click', _handler, false);
                };
                divMask.addEventListener('click', _handler, false);
            }
        }
    };

    /**
     * alert
     * @param  {String} txt   内容
     * @param  {String} title 可选，标题
     * @param  {String|Array} arrBtnTxt  可选，按钮对象数组，1个按钮，默认文字为"确定"，2个按钮，默认文字为"确定" | "取消"
     * btns = ['ok', 'cancel']
     * @param {Function} callback(res) 可选，alert关闭回调
     * res = {
     *     no: 1 | 2 | 3...
     *     txt: '确认' | '取消' | '自定义文字'...
     * }
     * @return
     */
    var hasInited = false;
    // 初始化html结构和css
    function _init() {
        var str = '';
        if (!hasInited) {
            // html
            str = '<div id="alert">';
            str += '<div id="dialog">';
            str += '<div id="dialogTitle"></div>';
            str += '<div id="dialogTxt"></div>';
            str += '<div id="dialogBtnPanel"></div>';
            str += '</div></div>';

            // 插入body
            var alertWrapper = document.createElement('div');
            alertWrapper.id = 'alertWrapper';
            alertWrapper.innerHTML = str;
            document.body.appendChild(alertWrapper);

            // css
            _addCss('#alert { display: none; width: 100%; position: absolute; top: 0; left: 0; z-index: 999;' +
                'background-color: rgba(0, 0, 0, 0.52);}' +
                '#dialog { width: 280px; border-radius: 10px; position: fixed; left: 50%; top: 150px;' +
                'margin-left: -40%; background-color: #fff; color: #666; font-size: 15px; text-align: center;' +
                'z-index: 1000; padding-top: 20px; color: #000;}' +
                '#dialogTitle { margin-bottom: 10px; font-weight: bold;}' +
                '#dialogTxt { border-bottom: 1px solid #ccc; padding-bottom: 10px;' +
                'padding-left: 10px; padding-right: 10px; }' +
                '#dialogBtnPanel{width:100%;color:#007aff;font-weight:bold;' +
                'display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;}' +
                '.dialogBtn{-webkit-box-flex:1;-moz-box-flex:1;width:20%;-webkit-flex:1;-ms-flex:1;flex:1;' +
                'padding: 15px 0;border-right:1px solid #ccc;' +
                '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;}' +
                '.dialogBtn-last {border: none;}');

            // 更新flag
            hasInited = true;
        }
    }
    // 设置文本内容
    function _setText(title, txt, arrBtnTxt) {
        var str = '';
        if (typeof arrBtnTxt === 'string') {
            str += '<div name="1" class="dialogBtn dialogBtn-last">' + (arrBtnTxt || '确定') + '</div>';
        }
        else if (arrBtnTxt.length && arrBtnTxt.length === 1) {
            str += '<div name="1" class="dialogBtn dialogBtn-last">' + (arrBtnTxt[0] || '确定') + '</div>';
        }
        else if (arrBtnTxt.length && arrBtnTxt.length === 2) {
            str += '<div name="1" class="dialogBtn">' + (arrBtnTxt[0] || '确定') + '</div>';
            str += '<div name="2" class="dialogBtn dialogBtn-last">' + (arrBtnTxt[1] || '取消') + '</div>';
        }
        else {
            for (var i = 0; i < arrBtnTxt.length - 1; i++) {
                str += '<div name="' + (i+1) + '" class="dialogBtn">' + (arrBtnTxt[i] || '按钮') + '</div>';
            }
            str += '<div name="' + (i+1) + '" class="dialogBtn dialogBtn-last">' + (arrBtnTxt[i] || '按钮') + '</div>';
        }
        document.getElementById('dialogBtnPanel').innerHTML = str;  // 按钮文字

        var divTitle = document.getElementById('dialogTitle');
        divTitle.innerHTML = title; // 标题
        if (divTitle.length === 0) {
            divTitle.style.display = 'none';
        }

        document.getElementById('dialogTxt').innerHTML = txt;   // 提示信息
    }
    com.alert = function(txt, title, arrBtnTxt, callback) {
        // 检查参数
        if (typeof txt !== 'string' || txt.length === 0) {
            throw new Error('com.alert: init fail, 2th param is required');
        }

        // html和css
        _init();
        // js
        // 设置文本内容
        _setText(title, txt, arrBtnTxt);
        // 调整位置，禁用页面其它部分
        var divAlert = document.getElementById('alert');
        var dialog = document.getElementById('dialog');
        divAlert.style.height = (document.documentElement.clientHeight + document.body.scrollTop + 220) + 'px';
        // 显示对话框
        divAlert.style.display = 'block';
        // 实现居中
        dialog.style.marginLeft = -1 * (dialog.offsetWidth / 2) + 'px';
        dialog.style.top = document.documentElement.clientHeight / 2 + 'px';
        dialog.style.marginTop = -1 * (dialog.offsetHeight / 2) + 'px';
        // 调整对话框位置
        window.onresize = function() {
            dialog.style.marginLeft = -1 * (dialog.offsetWidth / 2) + 'px';
            dialog.style.top = document.documentElement.clientHeight / 2 + 'px';
            dialog.style.marginTop = -1 * (dialog.offsetHeight / 2) + 'px';
        };
        // 禁止页面滚动
        document.ontouchmove = function(e) {
            e.preventDefault();
            e.stopPropagation();
        };
        document.body.style.overflowY = 'hidden';
        // 点击按钮关闭
        // document.body.addEventListener('click', _close, false);
        divAlert.addEventListener('click', _close, false);
        function _close(e) {
            var target = e.target;

            if (target.className.indexOf('dialogBtn') !== -1) {
                divAlert.style.display = 'none';
                // 恢复页面滚动
                document.ontouchmove = null;
                document.body.style.overflowY = 'auto';
                // 取消点击无效
                // document.body.removeEventListener('click', _close, false);
                divAlert.removeEventListener('click', _close, false);
                e.preventDefault();
                e.stopPropagation();

                // 执行回调
                if (typeof callback === 'function') {
                    callback({
                        no: target.getAttribute('name'),
                        txt: target.innerHTML
                    });
                }
            }
            else {
                // 点击其他位置无效
                e.preventDefault();
                e.stopPropagation();
            }
        }
    };


    function _addCss(str) {
        var node = document.createElement('style');
        node.setAttribute('type', 'text/css');
        
        if (node.styleSheet) { //ie
            node.styleSheet.cssText = str;
        } else if (document.getBoxObjectFor) {
            node.innerHTML = str; //火狐支持直接innerHTML添加样式表字串
        } else {
            node.appendChild(document.createTextNode(str));
        }

        document.getElementsByTagName('head')[0].appendChild(node);
    }

    // scale指定元素
    function _scale(ele, x, y, scale) {
        ele.style.cssText = '-webkit-transform-origin: ' + x + ' ' + y + '; ' +
                    '-ms-transform-origin: ' + x + ' ' + y + '; ' +
                    '-o-transform-origin: ' + x + ' ' + y + '; ' +
                    'transform-origin: ' + x + ' ' + y + '; ' +
                    '-webkit-transform: scale(' + scale + '); ' +
                    '-ms-transform: scale(' + scale + '); ' +
                    '-o-transform: scale(' + scale + '); ' +
                    'transform: scale(' + scale + ');';
    }

    // 查找DOM元素
    function _m$(str) {
        return document.querySelector(str);
    }



    window.my = window.my || {};
    window.my.com = com;
})(window);