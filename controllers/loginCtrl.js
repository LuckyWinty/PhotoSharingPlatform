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
            console.log(person);
            if(person.password!=req.body.password){
                console.log(person.password + '--'+ req.body.password);
                res.render('error', {message:{title: '密码不正确，请再次登录!',link:'/login'}});
            }else{
                req.session.user = person;
                if (person.isAdmin == true) {
                    res.redirect('/back');
                    //上句到时要改
                }else {
                    indexCtrl.showIndex(req, res);
                }    
         }
        }else{
            res.render('error', { message:{title: '该用户不存在，请先注册！',link:'/regist'}});
        }
    })
};