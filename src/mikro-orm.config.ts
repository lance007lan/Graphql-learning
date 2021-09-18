import { ___prod___ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from '@mikro-orm/core';
import path from "path";
import { User } from "./entities/User";


export default {
    migrations: {
        path: path.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post, User],
    dbName: 'lireddit',
    type: 'postgresql',
    debug: !___prod___,
    user: 'postgres',
    password: 'postgres',
    host: '127.0.0.1'
} as Parameters<typeof MikroORM.init>[0];