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
                res.render('error', { error:{type: '密码错误！',message:'请检查密码是否正确！',href:'/login'}});
            }else{
                indexCtrl.showIndex(req, res);
            }
        }else{
            res.render('error', { error:{type: '该用户不存在！',message:'请先注册！',href:'/regist'}});
        }
    })
};