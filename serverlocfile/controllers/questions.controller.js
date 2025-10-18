const Question = require('../models/questions.model')

//find all questions
const findAllQues = (req,res)=>{
    Question.find()
    .then((allQues)=>{
        res.json({question:allQues})
       
    })
    .catch((err)=>{
        res.json({message:'Something went Wrong with the controller'})
    });
}

//find questions based on set
const findSetQues = (req,res)=>{
    const {questionsetref}=req.body;
    Question.find({questionsetref:questionsetref})

    .then(question => {
        res.json({question})
    })
    .catch(err => {
        console.log("Something wrong generating some questions")
    })
}

module.exports = {findAllQues,findSetQues};