const User = require('../models/student.model');


const testconnection = (req,res)=>{
    res.json({status:"Okay connection"})
}
//findallusers
const findAllStud = (req,res)=>{
    User.find()
    .then((allUsers)=>{
        res.json({users:allUsers})
       
    })
    .catch((err)=>{
        res.json({message:'Something went Wrong with the controller'})
    });
}

//edit student

const editStud = (req,res)=>{

    const {username,firstname,lastname,schoolID,section,gradelevel,password}=req.body;
    
    User.findOneAndUpdate(
        {schoolID: schoolID},
        req.body,
        {new: true, runValidators:true}
    ).then((updated)=>{
        res.send(console.log("stud updated"))
        // res.json({users:updated})
    })
    .catch((err)=>[
        res.send(console.log("Something wrong with updating student" + err))
    ])
}

//insertusers
const InsertStud = (req,res)=>{

    const {username,firstname,lastname,schoolID,section,gradelevel,password}=req.body;

    // User.findOne({username:username})
    // .then((ifhavedup)=>{
        
    //   console.log("POPO")
    // })
    // .catch(err=>{
    //     console.log(err)
    // })

    User.create({
        username:username,
        firstname:firstname,
        lastname:lastname,
        schoolID:schoolID,
        section:section,
        gradelevel:gradelevel,
        password:password
    })
    .then((newUsers)=>{
        res.json({users:newUsers,status:"Alright"})
        res.send(console.log("stud created"))
    })
    .catch((err)=>{
        res.json({message:'Something went Wrong with creating'})
        res.send("There's something wrong on creating acc")
    });
}



//find one user w/ password

const findOneStud=(req,res)=>{
    const {username,password}=req.body;
    User.findOne({username:username})
    .then(user => {
        if(user){
        if(user.password === password){
            res.json(user)
            // console.log(user.username)
           
        }
        else{
            res.json("Blocked Account")
            console.log("Wrongpass")
        }
    
       }

       else{
        console.log("Account doest exist")
      

       }

    });
}


    
//delete user

const deleteOneStud=(req,res)=>{

    const {schoolID}=req.body;

    User.deleteOne({schoolID:schoolID})

    .then((response)=>{
          res.json({response:response})
    })
    .catch((err)=>{
        console.log(err)
    })

}



module.exports = {findOneStud,InsertStud,testconnection,findAllStud,editStud,deleteOneStud};