import express from 'express'
import * as core from "express-serve-static-core"

let app = express()

app.get('/say', function (req: core.Request, res: core.Response) {
    let { wd, cb } = req.query
    console.log(wd, 'wd')
    res.end(`${cb}('b')`)
})

app.listen(1229)
