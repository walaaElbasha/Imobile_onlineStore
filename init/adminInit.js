const admin = require('../models/admin') ;
const mongoose = require('mongoose') ;
mongoose.connect('mongodb://localhost/Shopping-cart' ,{useNewUrlParser : true} ,(error)=>{
  if(error){
    console.log(error)
  }else{
    console.log('Connecting to DB .....')
  }
})
const admins= [  new admin({

    email: "eng.marwamedhat2020@gmail.com",
    password: "123456",

}),
] 
var done = 0 ;
for( var i = 0 ; i < admins.length ; i++){
   admins[i].save((error , doc)=>{
        if(error){
            console.log(error)
        }
        console.log(doc)
        done ++
        if(done === admins.length) { 
            mongoose.disconnect();
        }
    })
}