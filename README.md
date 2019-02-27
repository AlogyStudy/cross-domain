
## 同源策略

同域：`协议`，`域名`，`端口`三个都需要一致。

跨域：三个有一个不同，就表示跨域。

## 浏览器不支持跨域

- `cookie`, `LocalStorage`
- `DOM`元素也有同源策略(`iframe`)
- `ajax`

## 实现跨域

为什么在不支持跨域的情况下，需要实现跨域？

- 前后端的项目放在不同项目下，二个项目需要通信。
- 需求（二个页面之间需要通信）

跨域方法：
1. jsonp
2. cors: 后端配置响应头
3. postMessage: 二个页面之间的通信
4. document.domain
5. window.name
6. location.hash
7. http-proxy
8. nginx
9. websocket

常用的方法：`cors`, `postMessage`, `proxy`

> jsonp

- 创建`script`标签
- 请求后台`jsonp`接口
- 定义后台接口函数名，函数参数返回的数据

原理：
```javascript
<script>
    function show (data) {
        console.log(data, 'data')
    }
</script>
<script src="https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=a&cb=show"></script>
```

缺点：
- 只能发送`get`请求，不支持其它http请求
- 不安全，容易`xss`攻击

使用框架中的基本用法:
```javascript
// 定义
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
            script.src = `${this.url}?${this.checkParams().join('&')}`;
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

// 调用
jsonp({
    url: '',
    params: {wd: 'a'},
    cb: 'show'
}).then(data => {
    console.log(data)
})
```

`jsonp`后端写法：
```typescript
import express from 'express'
import * as core from "express-serve-static-core"

let app = express()

app.get('/say', function (req: core.Request, res: core.Response) {
    let { wd, cb } = req.query
    console.log(wd, 'wd')
    res.end(`${cb}('b')`) // 执行方法并添加函数参数
})

app.listen(1229)
```

> cors

服务端配置

```typescript
import express from 'express'
import * as core from 'express-serve-static-core'

// 白名单
let whitList = ['http://127.0.0.1:1229']

let app = express()

// 添加拦截
app.use(function (req: core.Request, res: core.Response, next: core.NextFunction) {
    let origin = req.headers.origin
    if (whitList.includes(origin)) {
        // 设置哪个源可以通过
        res.setHeader('Access-Control-Allow-Origin', origin) // 设置源
        res.setHeader('Access-Control-Allow-Headers', 'name') // 请求头携带参数
        res.setHeader('Access-Control-Allow-Methods', ['PUT', 'GET', 'POST']) // 多个方式请求
        res.setHeader('Access-Control-Max-Age', 6) // put试探性options请求  检测存活时间
        res.setHeader('Access-Control-Allow-Credentials', 'true') // 允许携带cookie // 配置为boolean值，但是ts中为字符串，改为字符串的boolean值
        res.setHeader('Access-Control-Expose-Headers', 'name,age') // 告知浏览器获取response头字段`name`的安全，有效
        if (req.method === 'OPTIONS') {
            res.send() // OPTIONS不做处理,直接返回
        }
    }
    next()
})

app.use(express.static(__dirname))

app.get('/getData', function (req: core.Request, res: core.Response) {
    console.log(req.headers, 'headres')
    res.setHeader('name', 'server2')
    res.send('getData')
})

app.put('/getData', function (req: core.Request, res: core.Response) {
    console.log(req.headers, 'headres')
    res.send('getData')
})

app.listen(1230)
```

> postMessage

安全地实现跨源通信

对于两个不同页面的脚本，只有当执行它们的页面位于具有相同的协议（通常为https），端口号（443为https的默认值），以及主机  (两个页面的模数 Document.domain设置为相同的值) 时，这两个脚本才能相互通信。

二个页面，二个域之间的通信，不是数据通信，而是二个页面之间的通信。


- iframe
- window.open()
- window.href

`a.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    a page
    <iframe src="http://127.0.0.1:1230/b.html" frameborder="0" id="frame" onload="load()"></iframe>

    <script>
        function load () {
            let frame = document.querySelector('#frame')
            frame.contentWindow.postMessage('postMsg', 'http://127.0.0.1:1230')
            window.onmessage = function (ev) {
                console.log(ev.data, 'evdata a page')
            }
        }
    </script>

</body>
</html>
```

`b.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    b page

    <script>
        window.onmessage = function (ev) {
            console.log(ev.data, 'evdata b page')
            ev.source.postMessage('msgNo', ev.origin)
        }
    </script>

</body>
</html>
```

> document.domain

设置相同的`document.domain = 'local1.com'`

`a.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    a page
    
    <!-- 域名：一级域名，二级域名 -->
    <!-- www.baidu.com， image.baidu.com 默认情况下没有办法通信 -->
    <!-- a.html 是通过http://a.local1.com:1230/a.html 访问 -->
    
    <iframe src="http://b.local1.com:1230/b.html" frameborder="0" onload="load()" id="frame"></iframe>
    <script>
        document.domain = 'local1.com'
        function load () {
            let frame = document.querySelector('#frame')
            console.log(frame.contentWindow.a, 'frame.contentWindow.a')
        }
    </script>

</body>
</html>
```
`b.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    b page

    <script>
        document.domain = 'local1.com'
        var a = 100
    </script>
</body>
</html>
```

缺点：一级域名，二级域名获取数据，使用场景比较少。

> window.name

二个页面，二个域，利用中间页传递消息。
中间页的条件需要保持在同一个域名下。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <!-- a.html和b.html是同域的 http://127.0.0.1:1229
    c是独立的 http://127.0.0.1:1230

    需求：a.html获取c.html的页面值
    a.html先引用c.html， c.html把值放到window.name上，把a.html引用的地址改到b.html -->

    a page

    <iframe src="http://127.0.0.1:1230/c.html" frameborder="0" id="frame" onload="load()"></iframe>

    <script>
        let first = true
        function load () {
            if (first) {
                let frame = document.querySelector('#frame')
                frame.src = 'http://127.0.0.1:1229/b.html'
                first = false
            } else {
                console.log(frame.contentWindow.name, 'frame.contentWindow.name')
            }
        }
    </script>
</body>
</html>
```

> location.hash

解决完全跨域情况下的脚本置换问题

缺点：
- 数据暴露
- 数据容量
- 类型

```html
<!-- 路径后面的hash值可以用来通信 -->

<!-- a.html和b.html是同域的 http://127.0.0.1:1229
c是独立的 http://127.0.0.1:1230

需求：a.html获取c.html的页面值
a.html给c.html传一个hash值，c.html收到hash值后，c.html把hash值传递给b.html，b.html将结果放到a.html的hash值上 -->

<!-- a.html -> c.html -> b.html -> a.html -->
```

> http-proxy

- `webpack`
- `http-proxy`包/工具

> nginx

- 下载
- 配置`nginx.conf`

配置`location`段，或者`Server`段服务器
```
location ~.*\.json {
    root json;
    add_header "Access-Control-Allow-Origin" "*"
}
```

> websocket

- 高级API，不兼容。
- 一般使用`socket.io`库

使用到`ws`包
```
yarn add ws -D
```

`websocket`与`http`区别：
- 内部都是`tcp/ip`
- `websocket`是单向
- `http`是双向
