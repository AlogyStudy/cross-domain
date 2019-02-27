"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
let wss = new ws_1.default.Server({ port: 1229 });
wss.on('connection', function (ws) {
    ws.on('message', function (data) {
        console.log(data);
        ws.send('server.js');
    });
});
