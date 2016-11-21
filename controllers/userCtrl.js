/**
 * Created by winty on 2016/11/20.
 */
var mongoose=require('mongoose');
require('../models/model');
var share=mongoose.model('share');


module.exports.doDeclare=function(req,res){

    //...

console.log(req.body.content);

    share.create({
        content:req.body.content,
        images:{'$addToSet':req.body.pic}
    },function(error,User){
        if(error){
            console.log(error);
        }else{
            res.render('share');
            console.log(User);
            console.log(User.content);
        }
    })
}