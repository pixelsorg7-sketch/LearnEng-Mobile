const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const StudentSchema = new Schema({

    username:{
        type:String
    },
    firstname:{
        type:String
    },
    lastname:{
        type:String
    },
    schoolID:{
        type:Number
    },
    
    password:{
        type:String
    },
    section:{
        type:String
    },
    gradelevel:{
       type:Number
    },

});

const Student = model('Students',StudentSchema);

module.exports = Student;