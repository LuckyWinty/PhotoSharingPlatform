/**
 * Created by winty on 2016/11/11.
 */

var mongoose = require('mongoose');
require('../models/model');
var Share = mongoose.model('share');

module.exports.showIndex=function(req,res){
    Share.find({})
        .sort({'created':-1})
        .populate('userId')
        .exec(function(error,sha){
        if(error){
            console.log('.....查找所有分享出错',error);
        }else{
            var pubShares=[];
            sha.forEach(function(item,index,arr){
                if(item.userId.isPublic==true){
                    pubShares.push(item);
                }
            })

            res.render('index',{'shares':pubShares,'sessionUser':req.session.user});
        }
    })
}

module.exports.showHotIndex=function(req,res){
    Share.find({})
        .sort({'likeNum':-1})
        .populate('userId')
        .exec(function(error,sha){
            if(error){
                console.log('.....查找所有分享出错',error);
            }else{
                var pubShares=[];
                sha.forEach(function(item,index,arr){
                    if(item.userId.isPublic==true){
                        pubShares.push(item);
                    }
                })

                res.render('index',{'shares':pubShares,'sessionUser':req.session.user});
            }
        })
}
