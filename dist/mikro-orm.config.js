"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("./entities/Post");
const constants_1 = require("./constants");
const path_1 = __importDefault(require("path"));
console.log('dirname', __dirname);
exports.default = {
    migrations: {
        path: path_1.default.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post_1.Post],
    dbName: "postgres",
    type: "postgresql",
    user: "postgres",
    password: "D@nny123",
    allowGlobalContext: true,
    debug: !constants_1.__prod__,
};
//# sourceMappingURL=mikro-orm.config.js.map