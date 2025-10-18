const express = require('express')
const app = express()
const cors = require('cors')



app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const PORT =  5000;
require('./config/mongoose.config')



const AllUserRoutes = require("./routes/student.route");
AllUserRoutes(app);
const AllQuesRoutes = require('./routes/questions.route');
AllQuesRoutes(app);
const AllAnsRoutes = require('./routes/answers.route');
AllAnsRoutes(app);


app.listen(PORT, ()=>{console.log("Server started")})