"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
let app = express_1.default();
app.get('/say', function (req, res) {
    let { wd, cb } = req.query;
    console.log(wd, 'wd');
    res.end(`${cb}('b')`);
});
app.listen(1229);
