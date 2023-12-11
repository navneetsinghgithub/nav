const users_model = require('../model/users_model')
const bcrypt = require('bcrypt')

module.exports = {
    adduser: async (req, res) => {
        try {

            if (req.files && req.files.image) {
                const image = req.files.image;

                if (image) {
                    const file_name_string = image.name;
                    const file_name_array = file_name_string.split(".")
                    const file_ext = file_name_array[file_name_array.length - 1]
                    const letter = "ASDFGB2345ASD45JKWXY";
                    let result = ""
                    while (result.length < 29) {
                        const rand_int = Math.floor(Math.random() * 19 + 2);
                        const rand_chr = letter[rand_int];
                        if (result.substr(-1, 1) !== rand_chr) result += rand_chr;
                    }
                    const resultExt = `${result}.${file_ext}`;
                    const folder = "chatimage"
                    const dataa = await image.mv(`public/images/${folder}/${resultExt}`)
                    const saltround = 10;
                    const password = await bcrypt.hash(req.body.password, saltround)
                    const adduser = await users_model.create({
                        name: req.body.name,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        contact: req.body.contact,
                        password: password,

                        image: resultExt,


                    })

                    return res.json({
                        message: "add user",
                        status: 200,
                        body: adduser,
                    })
                }
            }

            const adduser = await users_model.create({
                name: req.body.name,
                lastname: req.body.lastname,
                email: req.body.email,
                contact: req.body.contact,
                password: req.body.password,
            })

            return res.json({
                message: "add user",
                status: 200,
                body: adduser,
            })


        } catch (error) {
            console.log(error)
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
            console.log(error);S
        }
    },
    login1: async (req, res) => {
        try {
            const loggin = await users_model.findOne({
                email: req.body.email
            })
            if (!loggin) {
                return res.json({
                    message: "unsuccesful",
                    status: 404,
                    body: {}
                })
            }
            else {
                if (loggin.email == req.body.email) {
                    const password = await bcrypt.compare(req.body.password, loggin.password)
                    if (!password) {
                        return res.json({
                            message: "not correct",
                            status: 200,
                            body: {}
                        })

                    } else {
                        return res.json({
                            message: "correct",
                            status: 200,
                            body: loggin
                        })
                    }
                }
            }
    
        } catch(error) {
        console.log(error);
    }
}
}
