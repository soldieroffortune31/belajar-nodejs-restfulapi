import { prismanClient } from "../application/database.js";

export const authMiddleWare = async (req, res, next) => {
    const token = req.get("Authorization");
    if(!token){
        return res.status(401).json({
            errors : "Unauthorized"
        })
    }

    const user = await prismanClient.user.findFirst({
        where : {
            token : token
        }
    })

    if(!user){
        return res.status(401).json({
            errors : "Unauthorized"
        })
    }

    req.user = user;
    next()
}