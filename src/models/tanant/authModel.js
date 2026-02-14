
const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const UserSchema=new Schema({
username:{
    type:String,
    required:[true, 'username is required field']
},
password:{
    type:String,
    required:[true, 'password is required field']
},
role:{
    type:String,
    enum:['waiter','admin'],
    default:'waiter'
     
}

});
module.exports=mongoose.model('AuthModel',UserSchema,"users");