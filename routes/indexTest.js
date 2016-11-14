var express = require('express');
var router = express.Router();

require('../models/model');

var mongoose=require('mongoose');
var Test=mongoose.model('Test');



/* GET home page. */
router.get('/', function(req, res, next) {

  // var doc = {name : 'winty'};
  // Test.create(doc, function(error){
  //   if(error) {
  //     console.log(error);
  //   } else {
  //     console.log('save ok');
  //     res.render('index', { title: 'save ok' });
  //   }
  // });

  Test.findOne({name:"winty"},function(error,test){
     if(error){
      console.log(error);
     }else if(test){
       res.render('indexTest',{title:test.name});
     }else{
       console.log('---------------------');
       console.log(test);
      res.render('indexTest', { title: 'Not fount' });
     }
  })
});

//router.post('/index',indexCtrl.index);

module.exports = router;
