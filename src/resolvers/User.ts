import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from "argon2"


@InputType()
class UsernamePasswordInput {

    @Field()
    username: string;
    @Field()
    password: string;
}

@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => User, {nullable: true})
    user?: User;
    
}



@Resolver()
export class UserResolver {

    @Query(() => [User])
    users(@Ctx() {em}: MyContext): Promise<User[]> {
        return em.find(User, {});
    }

    @Mutation(() => UserResponse)
    async register(@Ctx() {em}: MyContext, @Arg("user") inputOptions: UsernamePasswordInput): 
        Promise<UserResponse> {
        const user = em.create(User, {
            username: inputOptions.username, 
            password: await argon2.hash(inputOptions.password)
        });


        try {
            await em.persistAndFlush(user);
            
            return {
                user: await em.findOne(User, {username: user.username}) as User
            }
        } catch {
            return {
                errors: [{
                    field: "username",
                    message: "duplicated username"
                }]
            };
        }
    }


    @Mutation(() => UserResponse)
    async login(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() {em}: MyContext
    ): Promise<UserResponse> {


        console.log(`looking for user: ${options.username}`);
        const user = await em.findOne(User, {username: options.username});

        console.log(`find user: ${user}`);
        if (!user) {
            return {
                errors: [{
                    field: 'username',
                    message: 'that username does not exist'
                }]
            }
        }

        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "incorrect password"
                    }
                ]
            }
        }

        

        return {
            user: user
        }
    }

}