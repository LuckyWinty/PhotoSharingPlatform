/**
 * Created by winty on 2016/11/25.
 */

var mongoose = require('mongoose');
require('../models/model');
var Share = mongoose.model('share');
var moment=require('moment');
var User=mongoose.model('user');

module.exports.doShare=function(req,res){
    Share.findOne({'_id':req.query.shareId})
        .populate('userId')
        .exec(function(error,sha){
        if(error){
            console.log('.....查找一个分享出错',error);
        }else{
            var info= {
             isLike: false,
             isCollect:true
           }

            for(var i=0;i<sha.userId.myLikes.shares.length;i++){
                if(sha.userId.myLikes.shares[i]==sha._id){
                    info.isLike=true;
                    break;
                }
            }
            //for(var i=0;i<sha.userId.myCollections.shares.length;i++){
            //    if(sha.userId.myCollections.shares[i]==sha._id){
            //        info.isCollect=true;
            //        break;
            //    }
            //}
            res.render('share',{'share':sha,'user':sha.userId,'info':info,'moment':moment});
        }
    })
}

module.exports.doLike=function(req,res){
var likeNum=0;
    if(req.body.isLike=='1'){
        Share.findById({'_id':req.body.shareId})
            .exec(function(error,sha) {
               if(error){
                   res.json({success:0,message:'点赞失败'});
               }else{
                   likeNum=sha.likeNum;
                   sha.likeNum=likeNum++;
                   console.log('111111111111~~~~'+sha.likeNum,likeNum);
                   sha.save(function(err,share){
                       if(err){
                           res.json({success:0,message:'点赞失败'});
                       }else{
                           likeNum=share.likeNum;
                           console.log('1111oooooo1~~~~'+share.likeNum,likeNum);
                           console.log(req.session.user._id,req.body.userId);
                           User.findById({'_id':req.session.user._id})
                               .exec(function(err,person){
                                   person.myLikes.shares.push(req.body.shareId);
                                   person.save(function(err,use){
                                       if(err){
                                           res.json({success:0,message:'点赞失败'});
                                       }else{
                                           res.json({success:1,isLike:1,likeNum:likeNum,message:'点赞成功'});
                                       }
                                   })
                               })
                       }
                   })
               }
            })
    }else{
        res.json({success:1,isLike:0,message:'取赞成功'});
    }
}