var express = require('express');
var router = express.Router();

var mongoose=require('mongoose');
var Test=mongoose.model('Test');



/* GET home page. */
router.get('/', function(req, res, next) {
  Test.findOne({name:"test"},function(error,test){
    if(error){
      console.log(error);
    }else if(test){
      res.render('index',{title:test.name});
    }
  })

});

//router.post('/index',indexCtrl.index);

module.exports = router;
