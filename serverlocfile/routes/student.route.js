const UserController = require('../controllers/student.controller');

module.exports = app =>{
    app.get('/api/user',UserController.findAllStud);
    app.get('/api/test',UserController.testconnection);
    app.post('/insert',UserController.InsertStud);
    app.post('/getoneUser',UserController.findOneStud);
    app.put('/UpdateUser',UserController.editStud);
    app.post('/deleteoneUser',UserController.deleteOneStud);
    
}