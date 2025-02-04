import { prismanClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { registerUserValidation } from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from 'bcrypt';

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

export default {
    register
}