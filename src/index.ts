import { MikroORM } from "@mikro-orm/core"
import { __prod__ } from "./constants"
import mikroOrmConfig from "./mikro-orm.config";
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";


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
          resolvers:[HelloResolver],
          validate:false
        })
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