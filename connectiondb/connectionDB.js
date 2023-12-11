const mongoose =require('mongoose')

module.exports=()=>{
    mongoose.connect('mongodb+srv://first:first@cluster0.uiawcor.mongodb.net/demo').then((result)=>{
        console.log('>>succesful connected>>');
    }).catch((error)=>{
        console.log('error',error);
    })
}