/**
 * Created by winty on 2016/11/20.
 */
var mongoose=require('mongoose');
var share=mongoose.model('share');


module.exports.doDeclare=function(req,res){

    //...


    share.create({
        content:req.body.content,
        images:req.body.pic
    },function(error,User){
        if(error){
            console.log(error);
        }else{
            res.render('login', { title: '注册成功，欢迎登录' });
        }
    })
}