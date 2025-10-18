const QuesController = require('../controllers/questions.controller');

module.exports = app =>{
    app.get('/questionallget',QuesController.findAllQues)
    app.post('/questionsetget',QuesController.findSetQues)
}