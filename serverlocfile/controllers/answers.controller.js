const Answer = require('../models/answers.model');


//findallans
const findAllAns = (req,res)=>{
    Answer.find()
    .then((allAns)=>{
        res.json({answer:allAns})
       
    })
    .catch((err)=>{
        res.json({message:'Something went Wrong with the controller'})
    });
}


//find answer set based on question
const findSetAns = (req,res)=>{
    const {answermodule}=req.body;
    Answer.find({answermodule:answermodule})

    .then(answer => {
        res.json({answer})
    })
    .catch(err => {
        console.log("Something wrong generating some answersz")
        console.log(err)
    })
}


module.exports = {findAllAns,findSetAns};
