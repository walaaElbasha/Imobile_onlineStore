const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = mongoose.Schema({
    email: {
        type: String,
        required: true

    },
    password: {
        type: String,
        required: true

    },

    adminName: {
        type: String,
    },

    contact: {
        type: Number,
    },

    address: {
        type: String,
    },
    image: {
        type: String,
        default: "/upload/avatar.jpg"
    }
})

adminSchema.methods.hashPassword = function(password) { //bfok el hash bt3 el passowrd 
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
}

adminSchema.methods.comparePassword = function(password) { //bkarn ma bain el password 
    return bcrypt.compareSync(password, this.password);
}


module.exports = mongoose.model('admin', adminSchema);