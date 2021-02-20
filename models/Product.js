const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
    imagePath: {
        type: String,
        required: false
    },

    productName: {
        type: String,
        required: false
    },

    information: {
        require: false,

        type: {

            storageCapacity: Number ,
            numberOfSIM: String , 
            cameraResolution: Number , 
            displaySize : Number ,

        }
    },

    price: {
        type: Number,
        required: true
    },
}) ;


module.exports = mongoose.model ('Product' , productSchema) ;