const mongoose = require('mongoose');
const {Schema,model} = mongoose;


const AnswerSchema = new Schema({

    answercount:{
        type:Number
    },
    answermodule:{
       type:Number
    },
    answer:{
        type:String
    },
    iscorrect:{
        type:Boolean
    }
})


const Answer = model('answers',AnswerSchema);
module.exports = Answer;