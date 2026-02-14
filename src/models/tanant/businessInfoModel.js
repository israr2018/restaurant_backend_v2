const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const BusinessInfo=new Schema({
businessTitle:{
    type:String,
    required:[true, 'businessTitle is required field']
},
businessAddress:{
    type:String,
    required:[true, 'businessAddress is required field']
},
mobileNumber:{
    type:String,
    required:[true, 'mobileNumber is required field']
     
},
thanksMessage:{
    type:String
},

printerName:{
    type:String
     
},

});
module.exports=mongoose.model('BusinessInfoModel',BusinessInfo,"business-info");