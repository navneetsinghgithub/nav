const { tokenGenerate } = require('../jwt/jwtToken');
const users_model = require('../model/users_model')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

module.exports = {
    adduser: async (req, res) => {
        try {
            let resultExt = "";
            let imageFilePath = "";

            if (req.files && req.files.image) {
                const image = req.files.image;
                const fileExt = image.name.split(".").pop();
                const letter = "ASDFGB2345ASD45JKWXY";

                while (resultExt.length < 29) {
                    const randInt = Math.floor(Math.random() * 19 + 2);
                    const randChr = letter[randInt];

                    if (resultExt.substr(-1, 1) !== randChr) {
                        resultExt += randChr;
                    }
                }

                resultExt = `${resultExt}.${fileExt}`;
                const folder = "chatimage";
                imageFilePath = `public/images/${folder}/${resultExt}`;
                await image.mv(imageFilePath);
            }

            const saltround = 10;
            const password = await bcrypt.hash(req.body.password, saltround);

            const otp = Math.floor(1000 + Math.random() * 1100);

            const transport = nodemailer.createTransport({
                host: "sandbox.smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: "fc9cf37b147594",
                    pass: "692d2d59fe7312"
                }
            });

            const info = await transport.sendMail({
                from: "admin@admin.com",
                to: req.body.email,
                subject: "Forget Password Link",
                text: "This is your link",
                html: `${otp}`,
            });
            const adduser = await users_model.create({
                name: req.body.name,
                lastname: req.body.lastname,
                email: req.body.email,
                contact: req.body.contact,
                password: password,
                image: imageFilePath ? resultExt : "",
                otp: otp,
            });


            const token = await tokenGenerate(adduser._id);

            const updateResult = await users_model.findByIdAndUpdate(
                { _id: adduser._id },
                {
                    token: token.token,
                    loginTime: token.time,
                },
                { new: true }
            );

            return res.json({
                message: "add user",
                status: 200,
                body: updateResult,
            });
        } catch (error) {
            console.error(error);

        }

    },

    finduser: async (req, res) => {
        try {
            const finduser = await users_model.find()


            return res.json({
                message: "find user",
                status: 200,
                body: finduser,
            })
        } catch (error) {

        }
    },
    find_single_user: async (req, res) => {
        try {
            const find_single_user = await users_model.find({ _id: req.params.id })


            return res.json({
                message: "find_single_user",
                status: 200,
                body: find_single_user,
            })
        } catch (error) {

        }
    },
    deleteuser: async (req, res) => {

        try {

            console.log(req.params.id, '>>>>>>>>>');
            const deleteuser = await users_model.deleteOne({
                _id: req.params.id
            })


            return res.json({
                message: "deleteuser ",
                status: 200,
                body: deleteuser,
            })
        } catch (error) {

        }
    },
    updateuser: async (req, res) => {
        try {


            const updateuser = await users_model.updateOne({
                _id: req.body.id
            },
                {
                    password: req.body.password,
                    contact: req.body.contact, email: req.body.email
                },
                { new: true })

            return res.json({
                message: "update user",
                status: 200,
                body: updateuser,
            })
        } catch (error) {

        }
    },

    //  imageupload:async (req,res)=>{
    //   try {
    //     if(req.files && req.files.image){
    //         const image=req.files.image;

    //         if (image) {
    //             const file_name_string=image.name;
    //             const file_name_array=file_name_string.split(".");
    //             const file_ext=file_name_array[file_name_array.length-1];
    //             const letter="ABCD23455678EFGHJKWL567890UVX";
    //             let result=""

    //         while(result.length<29){
    //             const rand_int=Math.floor(Math.random()* 19 +2);
    //             const rand_chr=letter[rand_int];
    //             if(result.substr(-1,1) !== rand_chr)result+=rand_chr;
    //         }
    //         const resultExt=`${result}.${file_ext}`;

    //         const folder="chatimage"
    //         image.mv(`public/images/${folder}/${resultExt}`, function(err){
    //             if(err){
    //                 throw err;
    //             }
    //             return res.json({
    //                 message:"done",
    //                 status:200,
    //                 body:resultExt
    //             })
    //         })
    //     }
    // }

    //   } catch (error) {
    //     console.log(error);
    //   }
    //  },

    imgupload: async (req, res) => {
        try {

            if (req.files && req.files.image) {
                const image = req.files.image;

                if (image) {
                    const file_name_string = image.name;
                    const file_name_array = file_name_string.split(".");
                    const file_ext = file_name_array[file_name_array.length - 1];
                    const letter = "ASDFGHJ123456WERTY56CXY";
                    let result = ""
                    while (result.length < 29) {
                        const rand_int = Math.floor(Math.random() * 19 + 2);
                        const rand_chr = letter[rand_int];
                        if (result.substr(-1, 1) !== rand_chr) result += rand_chr;
                    }
                    const resultExt = `${result}.${file_ext}`;
                    const folder = "chatimage";
                    image.mv(`public/images/${folder}/${resultExt}`, function (err) {
                        if (err) {
                            throw err;
                        }
                        return res.json({
                            message: "succes",
                            status: 200,
                            body: resultExt
                        })
                    })
                }
            }

        } catch (error) {
            console.log(error);
        }
    },
    login: async (req, res) => {
        try {
            const logins = await users_model.findOne({
                email: req.body.email
            })
            if (!logins) {
                return res.json({
                    message: "unsuccessful",
                    status: 404,
                    body: {}
                })
            }
            else {

                if (logins.email == req.body.email) {

                    const password = await bcrypt.compare(req.body.password, logins.password)

                    if (!password) {
                        return res.json({
                            message: "Password is not correct",
                            status: 400,
                            body: {}
                        })
                    }
                    else {
                        return res.json({
                            message: "Successfully login",
                            status: 200,
                            body: logins
                        })
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    login1: async (req, res) => {
        try {

            const loggin = await users_model.findOne({
                email: req.body.email
            })
            console.log(loggin, "loggin")
            if (!loggin) {
                return res.json({
                    message: "Email or password is not correct",
                    status: 404,
                    body: {}
                })
            }
            else {
                if (loggin.email == req.body.email) {
                    const password = await bcrypt.compare(req.body.password, loggin.password)
                    if (!password) {
                        // console.log("dfg");
                        return res.json({
                            message: "not correct",
                            status: 200,
                            body: {}
                        })

                    } else {
                        const token = await tokenGenerate(loggin._id);

                        const updateResult = await users_model.findByIdAndUpdate(
                            { _id: loggin._id },
                            {
                                token: token.token,
                                loginTime: token.time,
                            },
                            { new: true }
                        );

                        return res.json({
                            message: "add user",
                            status: 200,
                            body: updateResult,
                        });
                    }
                }
            }

        } catch (error) {
            console.log(error);
        }
    },


  

}
