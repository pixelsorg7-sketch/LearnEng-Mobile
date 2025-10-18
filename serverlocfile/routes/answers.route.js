const AnsController = require('../controllers/answers.controller');

module.exports = app =>{
    app.get('/getallanswer',AnsController.findAllAns)
    app.post('/getspecificanswer',AnsController.findSetAns)
}