var mongoose = require('mongoose');
require('../models/model');
var User = mongoose.model('user');
var moment=require('moment');

module.exports.doBack = function(req, res){
    User.find({"isAdmin":false})
    .sort({'created':-1})
    .exec(function(err, users){
        console.log(users);
        if (err) {
            console.log(err);
            res.render('error', { message:{title: '查找用户出错！',link:'/back'}});
        }else {
            res.render('backstage', {'users': users, 'moment': moment});
        }
    })
};

module.exports.doShield = function(req, res){
    console.log("test88**********"+req.body.userId);
    User.findById(req.body.userId)
    .exec(function(err, user){
        console.log(user);
        if (err) {
            console.log(err);
            res.render('error', { message:{title: '操作出错！',link:'/back'}});
        }else {
            user.isPublic = !user.isPublic;
            user.save(function(err, user){
                if (err) {
                    console.log(err);
                    res.json({
                        "success": 0,
                        "message": "保存出错"
                    });
                }else {
                    res.json({
                        "success": 1,
                        "isPublic": user.isPublic,
                        "message": "保存成功"
                    });
                }
            })
        }

    })
};