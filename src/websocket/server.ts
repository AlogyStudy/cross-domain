import express from 'express'
import webSocket from 'ws'

let wss = new webSocket.Server({port: 1229})

wss.on('connection', function (ws) {
    ws.on('message', function (data) {
        console.log(data)
        ws.send('server.js')
    })
})

