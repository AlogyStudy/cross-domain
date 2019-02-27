import express from 'express'
import * as core from 'express-serve-static-core'

// 白名单
let whitList = ['http://127.0.0.1:1229']

let app = express()

// 添加拦截
app.use(function (req: core.Request, res: core.Response, next: any) {
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
