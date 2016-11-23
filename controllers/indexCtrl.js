/**
 * Created by winty on 2016/11/11.
 */
<<<<<<< HEAD
//var mongoose=require('mongoose');
//var Test=mongoose.model('Test');
//
//module.exports.index=function(req,res){
//    Test.findOne({name:"test"},function(error,test){
//        if(error){
//            console.log(error);
//        }else if(test){
//           // res.
//        }
//    })
//}
=======
var mongoose = require('mongoose');
require('../models/model');
var Share = mongoose.model('share');

module.exports.showIndex=function(req,res){
    Share.find({},function(error,sha){
        if(error){
            console.log('.....查找所有分享出错',error);
        }else{
            console.log('------------------查出来的分享：',sha.length);
            res.render('index',{'shares':sha});
        }
    })
}
>>>>>>> e033d0fb34e4f34ec125a1b9eaf3ef5d20145426
