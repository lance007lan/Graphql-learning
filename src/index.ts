import "reflect-metadata"
import {MikroORM} from "@mikro-orm/core"
import { ___prod___ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/Post";

const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig);
    orm.getMigrator().up();

    // const newPost: Post = 
    // orm.em.create(Post, {
    //     id: randomInt(100),
    //     title: "this is a test",
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    // });
    // orm.em.persistAndFlush(newPost);

    const app = express();

    const appolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false
        }),
        context: () => ({em: orm.em})
    });


    await appolloServer.start();

    appolloServer.applyMiddleware({ app, cors: {
        origin: "https://studio.apollographql.com",
        credentials: true
    } })
    
    app.listen(3000, () => {
        console.log('server started on localhost:3000');
    })
}

main();


