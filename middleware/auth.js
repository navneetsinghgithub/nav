const secret_key= "123456"
const jwt= require("jsonwebtoken")
const users_model = require("../model/users_model")

module.exports = {
    auth: async (req,res, next)=>{

        let token
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            try {
                token = req.headers.authorization.split(" ")[1]
                console.log(token,"token")
                const decode = await jwt.verify(token, secret_key)
                console.log(decode,"decode")
                const user = await users_model.findOne({_id: decode._id, loginTime: decode.iat})
                if(user){
                    req.user = user
                    next()
                }
                else{
                    return res.json({
                        message: "Please login first!"
                    })
                }
            } catch (error) {
                console.log("Invalid signature!")
                return res.json({
                    message: "invalid token"
                })
            }
        }
    }
}