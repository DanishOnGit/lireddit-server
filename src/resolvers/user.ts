import { MyContext } from 'src/types';
import {Resolver,InputType, Field, Ctx, Arg, Mutation} from 'type-graphql'
import argon2 from 'argon2'
import { User } from '../entities/User';
//another way to get inputs
@InputType()
class UsernamePasswordInput{
    @Field()
    username:string;

    @Field()
    password:string
}


@Resolver()
export class UserResolver{
    @Mutation(()=>User)
    async register(
        @Arg('options') options:UsernamePasswordInput,
        @Ctx() {em}:MyContext
    ){
        const hashedPassword = await argon2.hash(options.password)
        const user =  em.create(User,{userName:options.username,password:hashedPassword})
        await em.persistAndFlush(user)
        return user
    }
}