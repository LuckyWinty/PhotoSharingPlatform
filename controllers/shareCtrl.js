/**
 * Created by winty on 2016/11/25.
 */

var mongoose = require('mongoose');
require('../models/model');
var Share = mongoose.model('share');
var moment=require('moment');

module.exports.doShare=function(req,res){
    console.log('.....500')
    Share.findOne({'_id':req.query.shareId})
        .populate('userId')
        .exec(function(error,sha){
        if(error){
            console.log('.....查找一个分享出错',error);
        }else{
            console.log('...',sha,'----------',sha.userId,'%%%%%%%%%%%%%%%%',moment);
            res.render('share',{'share':sha,'user':sha.userId,'moment':moment});
        }
    })
}

