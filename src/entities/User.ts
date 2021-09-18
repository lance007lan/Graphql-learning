import { PrimaryKey, Property } from "@mikro-orm/core";
import { Field } from "type-graphql";

export class User {
    @Field()
    @PrimaryKey()
    id!: number;

    @Field(() => String)
    @Property({type: "date"})
    createdAt = new Date();

    @Field(() => String)
    @Property({type: "date", onUpdate: () => new Date() })
    updatedAt = new Date();

    @Field()
    @Property({type: "text", unique: true})
    username!: string;

    @Property({type: "text", unique: true})
    password!: string;
}