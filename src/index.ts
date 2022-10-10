import 'reflect-metadata';
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from './resolvers/user';
import session from "express-session";
import connectRedis from 'connect-redis';
import redis from 'redis';

const RedisStore = connectRedis(session)
const redisClient = redis.createClient()

app.use(
  session({
    store: new RedisStore({ client:redisClient }),
    saveUninitialized: false,
    secret: "keyboard cat",
    resave: false,
  })
)

const main=async()=>{
  //db connection
    const orm = await MikroORM.init(mikroOrmConfig);
    await orm.getMigrator().up();

    //server start
    const app = express();
    app.get('/',(_,res)=>{
      res.status(200).json('Succesfully connected')
    })

    const apolloServer =  new ApolloServer({
        schema: await buildSchema({
          resolvers:[HelloResolver,PostResolver,UserResolver],
          validate:false
        }),
        context:()=>({em:orm.em})
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({
      app,
    });
    
    app.listen(4000,()=>{
      console.log('Server started on localhost:4000')
    })
}
main().catch((err)=>console.log(err))