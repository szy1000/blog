(function(window) {
    var my = {};

    // client width, height
    my.w = document.documentElement.clientWidth;
    my.h = document.documentElement.clientHeight;

    // redirect
    my.to = function(url) {
        window.location.href = url;
    };

    // isArray
    my.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };

    

    // Core
    function _Core(ele) {
        this._ele = ele;

        this.node = ele;
    }
    _Core.prototype = {
        // DOM Action
        
        // get DOM node object
        get: function() {
            return this._ele;
        },
        // bind event handler
        on: function(handler, type) {
            var ele = this._ele;

            if (typeof type === 'string') {
                ele.addEventListener(type, handler, false);
            }
            else {
                ele.addEventListener('click', handler, false);
            }

            return this;
        },
        // unbind event handler
        off: function(handler, type) {
            var ele = this._ele;

            if (typeof type === 'string') {
                ele.removeEventListener(type, handler, false);
            }
            else {
                ele.removeEventListener('click', handler, false);
            }

            return this;
        },

        // attr
        attr: function(attr, value) {
            var ele = this._ele;

            if (typeof value === 'string') {
                ele.setAttribute(attr, value);
            }
            else {
                return ele.getAttribute(attr);
            }

            return this;
        },

        // addClass
        addClass: function(className) {
            var ele = this._ele;

            if (ele.className.length === 0) {
                ele.className = className;
            }
            else if (ele.className.indexOf(className) === -1) {
                ele.className += (' ' + className);
            }

            return this;
        },
        // rmClass
        rmClass: function(className) {
            var ele = this._ele;

            var strClass = ele.className;
            var pos = strClass.indexOf(className);
            
            if (pos !== -1) {
                if (strClass.charAt(pos - 1) === ' ') {
                    ele.className = strClass.substring(0, pos - 1) + strClass.substring(pos + className.length);
                }
                else {
                    ele.className = strClass.substring(0, pos) + strClass.substring(pos + className.length);
                }
            }

            return this;
        },
        // hasClass
        hasClass: function(className) {
            var ele = this._ele;

            return ele.className.indexOf(className) !== -1;
        },
        // toggleClass
        tgClass: function(className) {
            if (this.hasClass(className)) {
                this.rmClass(className);
            }
            else {
                this.addClass(className);
            }
        },

        // css
        css: function(key, value) {
            var ele = this._ele;

            if (typeof value === 'string') {
                ele.style[key] = value;
            }
            else {
                return ele.style[key];
            }

            return this;
        },
        // scale
        // x, y, z可选，默认值为0
        scale: function(scaleValue, x, y, z) {
            var s = this._ele.style;
            x = x || 0;
            y = y || 0;
            z = z || 0;

            s.webkitTransformOrigin = x + ' ' + y + ' ' + z;
            s.transformOrigin = x + ' ' + y + ' ' + z;
            s.webkitTransform = 'scale(' + scaleValue + ')';
            s.transform = 'scale(' + scaleValue + ')';
        },
        // rotate
        // x, y, z可选，默认值为0
        rotate: function(deg, x, y, z) {
            if ((deg + '').indexOf('deg') === -1) {
                throw new Error('my.rotate: first param has to be a string like \'15deg\'');
            }

            var s = this._ele.style;
            x = x || 0;
            y = y || 0;
            z = z || 0;

            s.webkitTransformOrigin = x + ' ' + y + ' ' + z;
            s.transformOrigin = x + ' ' + y + ' ' + z;
            s.webkitTransform = 'rotate(' + deg + ')';
            s.transform = 'rotate(' + deg + ')';
        },

        // _search
        _search: function(ele, tagOrClass) {
            // class
            if (tagOrClass.indexOf('.') !== -1) {
                if (ele.className.indexOf(tagOrClass.substring(1)) !== -1) {
                    return ele;
                }
            }
            // tag
            else {
                if (ele.nodeName === tagOrClass.toUpperCase()) {
                    return ele;
                }
            }

            return null;
        },
        // left
        left: function(tagOrClass) {
            var ele = this._ele;
            var res = null;

            for (ele = ele.previousSibling; ele !== null; ele = ele.previousSibling) {
                res = this._search(ele, tagOrClass);
                if (res !== null) {
                    break;
                }
            }

            return res;
        },
        // right
        right: function(tagOrClass) {
            var ele = this._ele;
            var res = null;

            for (ele = ele.nextSibling; ele !== null; ele = ele.nextSibling) {
                res = this._search(ele, tagOrClass);
                if (res !== null) {
                    break;
                }
            }

            return res;
        },
        // leftest
        leftest: function(tagOrClass) {
            var ele = this._ele.parentNode.firstChild;
            var res = null;

            for (; ele !== null; ele = ele.nextSibling) {
                res = this._search(ele, tagOrClass);
                if (res !== null) {
                    break;
                }
            }

            return res;
        },
        // rightest
        rightest: function(tagOrClass, returnAll) {
            var ele = this._ele.parentNode.lastChild;
            var res = null;

            for (; ele !== null; ele = ele.previousSibling) {
                res = this._search(ele, tagOrClass);
                if (res !== null) {
                    break;
                }
            }

            return res;
        },

        // show
        show: function() {
            this._ele.style.display = '';

            return this;
        },
        // hide
        hide: function() {
            this._ele.style.display = 'none';
            
            return this;
        }
    };



    window.my = my;
    window.m$$ = function(str) {
        return document.querySelectorAll(str);
    };
    window.m$ = function(strOrEleOrFunc) {
        if (typeof strOrEleOrFunc === 'string') {
            return new _Core(document.querySelector(strOrEleOrFunc));
        }
        else if (typeof strOrEleOrFunc.nodeName === 'string'){
            // wrap dom element
            return new _Core(strOrEleOrFunc);
        }
        else if (typeof strOrEleOrFunc === 'function') {
            // dom ready
            document.addEventListener('DOMContentLoaded', strOrEleOrFunc, false);
        }
    };
    // 支持扩展
    window.my.core = {
        //!! 访问Core的原型，不建议使用
        proto: _Core.prototype,

        extend: function(attr, value) {
            _Core.prototype[attr] = value;
        }
    };
})(window);