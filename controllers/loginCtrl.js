/**
 * Created by winty on 2016/11/23.
 */
var mongoose = require('mongoose');
require('../models/model');
var User = mongoose.model('user');
var indexCtrl=require('../controllers/indexCtrl');

module.exports.doLogin = function(req, res){
    User.findOne({userName:req.body.account},function(error,person){
        if(error){
            console.log(error);
        }else if(person){
            if(person.password!=req.body.password){
                res.render('error', {message:{title: '该用户不存在！请先注册,',link:'/regist'}});
            }else{
                req.session.user = person;
                indexCtrl.showIndex(req, res);
            }
        }else{
            res.render('error', { message:{title: '该用户不存在！请先注册,',link:'/regist'}});
        }
    })
};