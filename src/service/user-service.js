import { prismanClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { getUserValidation, loginUserValidation, registerUserValidation, updateUserValidation } from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from 'bcrypt';
import {v4 as uuid} from 'uuid'

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await prismanClient.user.count({
        where : {
            username : user.username
        }
    })

    if(countUser === 1){
        throw new ResponseError(400, "Username is already exist")
    }

    user.password = await bcrypt.hash(user.password, 10)

    return prismanClient.user.create({
        data : user,
        select : {
            username : true,
            name : true
        }
    })

}

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request)

    const user = await prismanClient.user.findUnique({
        where : {
            username : loginRequest.username
        },
        select : {
            username : true,
            password : true
        }
    })

    if(!user){
        throw new ResponseError(401, "Username or password wrong")
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password)
    if(!isPasswordValid){
        throw new ResponseError(401, "Username or password wrong")
    }

    const token = uuid().toString()
    return prismanClient.user.update({
        data : {
            token : token
        },
        where : {
            username : user.username
        },
        select : {
            token : true
        }
    })
}

const get = async (username) => {
    username = validate(getUserValidation, username);

    const user = await prismanClient.user.findUnique({
        where : {
            username : username
        },
        select : {
            username : true,
            name : true
        }
    })

    if(!user){
        throw new ResponseError(404, "user is not fount")
    }

    return user;
}

const update = async (request) => {
    const user = validate(updateUserValidation, request)

    const totalUser = await prismanClient.user.count({
        where : {
            username : user.username
        }
    });

    if(totalUser !== 1){
        throw new ResponseError(404, "user is not found")
    }

    const data = {}
    if(user.name){
        data.name = user.name
    }

    if(user.password){
        data.password = await bcrypt.hash(user.password, 10) 
    }

    return prismanClient.user.update({
        where : {
            username : user.username
        },
        data : data,
        select : {
            username : true,
            name : true
        }
    })

}

const logout = async (username) => {

    username = validate(getUserValidation, username);

    const user = await prismanClient.user.findUnique({
        where : {
            username : username
        }
    })

    if(!user){
        throw new ResponseError(404, "user not fount")
    }

    return prismanClient.user.update({
        where : {
            username : username
        },
        data : {
            token : null
        }
    })

}

export default {
    register,
    login,
    get,
    update,
    logout
}