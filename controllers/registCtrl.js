/**
 * Created by winty on 2016/11/23.
 */
var mongoose = require('mongoose');
require('../models/model');
var User = mongoose.model('user');

module.exports.doRegist=function(req,res){
    console.log(req.body.account);
    User.findOne({userName:req.body.account},function(error,person){
        if(error){
            console.log(error);
        }else if(person){
            res.render('error', { message:{title: '该用户已存在！直接登录吧！',link:'/login'}});
        }else{
            User.create({
                userName:req.body.account,
                password:req.body.password
            },function(error,User){
                if(error){
                    console.log(error);
                }else{
                    res.render('login', { title: '注册成功，欢迎登录' });
                }
            })
        }
    })
}

