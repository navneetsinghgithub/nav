const users_model = require("../model/users_model")
const jwt = require("jsonwebtoken")

module.exports = {
    tokenGenerate: async (id) => {
        try {
            const SecretKey = "123456";

            const token = await jwt.sign({ _id: id }, SecretKey);

            const decode = await jwt.verify(token, SecretKey);


            const time = Math.floor(Date.now() / 1000);
            await users_model.findByIdAndUpdate(
                { _id: decode._id },
                { loginTime: decode.iat, token: token },
                { new: true }
            );

            return { token: token, time: time };
        } catch (error) {
            console.error(error);
        }

    }
}