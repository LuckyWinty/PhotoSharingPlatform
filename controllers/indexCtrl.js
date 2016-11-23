/**
 * Created by winty on 2016/11/11.
 */
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
