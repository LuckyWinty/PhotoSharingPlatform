/**
 * Created by winty on 2016/11/25.
 */

var mongoose = require('mongoose');
require('../models/model');
var Share = mongoose.model('share');
var moment = require('moment');
var User = mongoose.model('user');
var Comment = mongoose.model('comment');

module.exports.doShare = function (req, res) {
    Share.findOne({'_id': req.query.shareId})
        .populate('userId')
        .populate('comment.userId')
        .exec(function (error, sha) {
            if (error) {
                console.log('.....查找一个分享出错', error);
            } else {
                var info = {
                    isLike: false,
                    isCollect: false
                }
                if (req.session.user) {
                    User.findOne({'_id': req.session.user._id})
                        .exec(function (err, user) {
                            for (var i = 0; i < user.myLikes.shares.length; i++) {
                                if (user.myLikes.shares[i].toString() == sha._id.toString()) {
                                    info.isLike = true;
                                    break;
                                }
                            }
                            for (var i = 0; i < user.myCollections.shares.length; i++) {
                                if (user.myCollections.shares[i].toString() == sha._id.toString()) {
                                    info.isCollect = true;
                                    break;
                                }
                            }
                        })
                }
                res.render('share', {'share': sha, 'user': sha.userId, 'info': info, 'moment': moment,'sessionUser':req.session.user});
            }
        })
}

module.exports.doLike = function (req, res) {
    if (req.session.user) {
        var likeNum = 0;
        if (req.body.isLike == '1') {
            Share.findById({'_id': req.body.shareId})
                .exec(function (error, sha) {
                    if (error) {
                        res.json({success: 0, message: '点赞失败'});
                    } else {
                        likeNum = sha.likeNum;
                        sha.likeNum = ++likeNum;
                        sha.save(function (err, share) {
                            if (err) {
                                res.json({success: 0, message: '点赞失败'});
                            } else {
                                likeNum = share.likeNum;
                                User.findOne({_id: req.session.user._id})
                                    .exec(function (err, person) {
                                        person.myLikes.shares.push(req.body.shareId);
                                        person.save(function (err, use) {
                                            if (err) {
                                                res.json({success: 0, message: '点赞失败'});
                                            } else {
                                                res.json({success: 1, isLike: 1, likeNum: likeNum, message: '点赞成功'});
                                            }
                                        })
                                    })
                            }
                        })
                    }
                })
        } else {
            Share.findById({'_id': req.body.shareId})
                .exec(function (error, sha) {
                    if (error) {
                        res.json({success: 0, message: '消赞失败'});
                    } else {
                        likeNum = sha.likeNum;
                        sha.likeNum = --likeNum;
                        console.log('111111111111~~~~' + sha.likeNum, likeNum);
                        sha.save(function (err, share) {
                            if (err) {
                                res.json({success: 0, message: '消赞失败'});
                            } else {
                                likeNum = share.likeNum;
                                User.findOne({_id: req.session.user._id})
                                    .exec(function (err, person) {
                                        for (var i = 0; i < person.myLikes.shares.length; i++) {
                                            if (person.myLikes.shares[i].toString() == sha._id.toString()) {
                                                person.myLikes.shares.splice(i, 1);
                                                break;
                                            }
                                        }
                                        person.save(function (err, use) {
                                            if (err) {
                                                res.json({success: 0, message: '消赞失败'});
                                            } else {
                                                res.json({success: 1, isLike: 0, likeNum: likeNum, message: '消赞成功'});
                                            }
                                        })
                                    })
                            }
                        })
                    }
                })
        }
    } else {
        render('error',{message:{type:'尚未登录！',link:'/login'}})
    }
}

//评论
module.exports.doComment = function (req, res) {
    Share.findById({'_id': req.body.shareId})
        .exec(function (error, sha) {
            if (error) {
                res.json({success: 0, message: '评论失败！'});
            } else {
                var com = new Comment;
                com.content = req.body.comment;
                com.userId = req.body.userId;
                sha.comment.push(com);
                sha.save(function (err, share) {
                    if (err) {
                        res.json({success: 0, message: '评论失败'});
                    } else {
                        User.findOne({_id: req.body.userId})
                            .exec(function (err, person) {
                                person.myComments.shares.push(req.body.shareId);
                                person.save(function (err, use) {
                                    if (err) {
                                        res.json({success: 0, message: '评论失败'});
                                    } else {
                                        res.json({success: 1, user: use, comment: com, message: '评论成功'});
                                    }
                                })
                            })
                    }
                })
            }
        })
}