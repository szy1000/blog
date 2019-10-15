/**
 * localStorage
 * localStorage和sessionStorage的属性和方法如下：
 * Name    Description
 * length  获取存储的键值对的数量
 * remainingSpace  获取存储空间剩余空间的大小(非标准，仅IE8.0+支持)
 * setItem(key, value) 将value值存储到本地的key字段
 * removeItem(key) 删除指定key本地存储的值
 * getItem(key)    获取指定key本地存储的值
 * clear() 删除localStorage中存储的所有数据
 * key(index)  根据索引获取一个指定位置的键名
 */

(function(window) {
    var local = {};
    var storage = window.localStorage;


    if (typeof storage !== 'object') {
        throw new Error('my.local: window.localStorage is not found');
    }

    local.set = function(key, value) {
        storage.setItem(key, value);
    };
    local.get = function(key) {
        return storage.getItem(key);
    };
    local.clear = function() {
        storage.clear();
    };


    window.my = window.my || {};
    window.my.local = local;
})(window);