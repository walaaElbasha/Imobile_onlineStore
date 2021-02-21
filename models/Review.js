const mongoose = require('mongoose');
const schema = mongoose.Schema ;


const reviewSchema = mongoose.Schema({
   
    user : {
        type : String ,
        required : true ,
    } ,

    productId : {
        type : String ,
        required : true ,
    }  ,

    commentBody : {
        type : String ,
        required : false ,
    } ,

    rate : {
        type : Number ,
        required : true ,
    } ,

    


}) ;


module.exports = mongoose.model ('Review' , reviewSchema) ;