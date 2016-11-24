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
            res.render('index',{'shares':sha,'user':req.session.user});
        }
    })
}

