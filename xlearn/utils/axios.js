"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var instance = axios_1.default.create({
    baseURL: "".concat(process.env.NEXT_PUBLIC_CONTENT_HOST),
});
exports.default = instance;
