class Jsonp {
    private url: string
    private params: any
    private cb: string
    constructor (options: any) {
        this.url = options.url
        this.params = options.params
        this.cb = options.cb
    }
    run () {
        return new Promise<string[]>((resolve, reject) => {
            // 挂载方法
            let script = document.createElement('script')
            ;(<any>window)[this.cb] = function (data: any) {
                resolve(data)
                document.body.removeChild(script)
            }
            // 处理script
            let url = `${this.url}?${this.checkParams().join('&')}`
            console.log(url, 'url')
            script.src = url
            document.body.appendChild(script)
        })
    }
    checkParams (params = this.params, cb = this.cb): Array<string> {
        let arrs = []
        params = {...params, cb}
        for (let key in params) {
            arrs.push(`${key}=${params[key]}`)
        }
        return arrs
    }
}

function jsonp (options: any) {
    let jp = new Jsonp(options)
    return jp.run()
}
