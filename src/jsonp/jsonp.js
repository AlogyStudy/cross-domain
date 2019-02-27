"use strict";
class Jsonp {
    constructor(options) {
        this.url = options.url;
        this.params = options.params;
        this.cb = options.cb;
    }
    run() {
        return new Promise((resolve, reject) => {
            // 挂载方法
            let script = document.createElement('script');
            window[this.cb] = function (data) {
                resolve(data);
                document.body.removeChild(script);
            };
            // 处理script
            let url = `${this.url}?${this.checkParams().join('&')}`;
            console.log(url, 'url');
            script.src = url;
            document.body.appendChild(script);
        });
    }
    checkParams(params = this.params, cb = this.cb) {
        let arrs = [];
        params = Object.assign({}, params, { cb });
        for (let key in params) {
            arrs.push(`${key}=${params[key]}`);
        }
        return arrs;
    }
}
function jsonp(options) {
    let jp = new Jsonp(options);
    return jp.run();
}
