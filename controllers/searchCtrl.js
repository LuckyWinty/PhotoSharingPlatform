/**
 * Created by winty on 2016/11/29.
 */
var mongoose = require('mongoose');
require('../models/model');
var Share = mongoose.model('share');
var moment=require('moment');
var User=mongoose.model('user');

module.exports.showResult=function(req,res){
    var person_={};
    User.findById(req.session.user._id)
        .exec(function(err,perso){
            person_=perso;
        });
    function isLiked(shareId){
        if(req.session.user){
            var myLikes=person_.myLikes.shares;

            for(var i=0;i<myLikes.length;i++){
                if(shareId.toString()==myLikes[i].toString()){
                    return true;
                }
            }
            return false;
        }else{
            return false;
        }
    }
    function isCollected(shareId){
        if(req.session.user){
            var myCollections=person_.myCollections.shares;
            for(var i=0;i<myCollections.length;i++){
                if(shareId.toString()==myCollections[i].toString()){
                    return true;
                }
            }
            return false;
        }else{
            return false;
        }
    }

    var str=req.body.searchWords;
    var pattern=new RegExp("^.*"+str+".*$");

    Share.find({content:pattern})
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
                console.log('-----------------------'+sha);
                res.render('searchResult',{'shares':pubShares,'sessionUser':req.session.user,moment:moment,'isLiked':isLiked,'isCollected':isCollected});
            }
        })
}

