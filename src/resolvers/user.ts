import argon2 from 'argon2'
import { MyContext } from 'src/types';
import {Resolver,InputType, Field, Ctx, Arg, Mutation, ObjectType} from 'type-graphql'
import { User } from '../entities/User';
//another way to get inputs
@InputType()
class UsernamePasswordInput{
    @Field()
    username:string;

    @Field()
    password:string
}

@ObjectType()
class FieldError{
    @Field()
    field:string
    @Field()
    message:string
}

@ObjectType()
class UserResponse{
    @Field(()=>[FieldError],{nullable:true})
    errors?:FieldError[];

    @Field(()=>User,{nullable:true})
    user?:User;
}

@Resolver()
export class UserResolver{
    @Mutation(()=>UserResponse)
    async register(
        @Arg('options') options:UsernamePasswordInput,
        @Ctx() {em}:MyContext
    ):Promise<UserResponse>{
        if(options.username.length<=2){
            return {
                errors:[
                    {
                        field:'username',
                        message:'length must be greater than 2'
                    }
                ]
            }
        }
        if(options.password.length<=3){
            return {
                errors:[
                    {
                        field:'password',
                        message:'length must be greater than 3'
                    }
                ]
            }
        }
        const hashedPassword = await argon2.hash(options.password)
        const user =  em.create(User,{userName:options.username,password:hashedPassword})
        try{
            await em.persistAndFlush(user)
        }catch(err){
            if(err.code==='23505' ||err.detail.includes("already exists")){
                return {
                    errors:[
                        {
                            field:'username',
                            message:'username already exists'
                        }
                    ]
                }
            }
        }
        return {
            user
        }
    }

    @Mutation(()=>UserResponse)
    async login(
        @Arg('options') options:UsernamePasswordInput,
        @Ctx() {em}:MyContext
    ): Promise<UserResponse>{
        const user = await em.findOne(User,{userName:options.username})
        if(!user){
            return {
                errors:[
                    {
                        field:"username",
                        message:"username does not exist"
                    }
                ]
            }
        }
        const isPasswordCorrect= await argon2.verify(user.password,options.password);
        if(!isPasswordCorrect){
            return {
                errors:[
                    {
                        field:"password",
                        message:"incorrect password"
                    }
                ]
            }
        }
        return {
            user
        }
    }
}