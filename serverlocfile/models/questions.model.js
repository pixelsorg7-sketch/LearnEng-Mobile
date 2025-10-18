const mongoose = require('mongoose');
// const Student = require('./student.model');
const {Schema, model} = mongoose


const QuestionSchema = new Schema({

    answermodule:{
        type:Number
    },
    question:{
        type:String
    },
    questionid:{
        type:Number
    },
    questionsetref:{
        type:Number
    },
})

const Question = model('Questions',QuestionSchema);
module.exports = Question;