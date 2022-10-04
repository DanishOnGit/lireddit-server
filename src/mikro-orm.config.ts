import { Post } from "./entities/Post";
import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

console.log('dirname',__dirname)
export default  {
    migrations:{
        path:path.join(__dirname,"./migrations"),
        pattern:/^[\w-]+\d+\.[tj]s$/,
    },
    entities:[Post],
    dbName:"postgres",
    type:"postgresql",
    user:"postgres",
    password:"D@nny123",
    allowGlobalContext:true,
    debug:!__prod__,
} as Parameters <typeof MikroORM.init>[0] 
