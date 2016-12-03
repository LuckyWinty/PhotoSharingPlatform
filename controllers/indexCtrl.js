/**
 * Created by winty on 2016/11/11.
 */

var mongoose = require('mongoose');
require('../models/model');
var Share = mongoose.model('share');

module.exports.showIndex=function(req,res){
    Share.find({})
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
            res.render('index',{'shares':pubShares,'sessionUser':req.session.user,'isIndex':true});
        }
    })
}

module.exports.showHotIndex=function(req,res){
    Share.find({})
        .sort({'likeNum':-1})
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

                res.render('index',{'shares':pubShares,'sessionUser':req.session.user,'isIndex':false,'isActive':1});
            }
        })
}

module.exports.doWeekPage=function(req,res){
    var end = new Date();
    console.log("今天：" + end.toString());
    var start  = getStart(end, 7);
    console.log("一周前：" + start.toString());

    Share.find({created: {$gt: start, $lte: end}})
        .sort({'likeNum':-1})
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

                res.render('index',{'shares':pubShares,'sessionUser':req.session.user,'isIndex':false,'isActive':2});
            }
        })
}

module.exports.doTodayPage=function(req,res){
    var end = new Date();
    console.log("今天：" + end.toString());
    var start  = getStart(end, 1);
    console.log("一天前：" + start.toString());

    Share.find({created: {$gt: start, $lte: end}})
        .sort({'likeNum':-1})
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

                res.render('index',{'shares':pubShares,'sessionUser':req.session.user,'isIndex':false,'isActive':3});
            }
        })
}


function getStart(end, dayNum){
    //时分秒与end一致，先设置
    var start = new Date();
    start.setHours(end.getHours());
    start.setMinutes(end.getMinutes());
    start.setSeconds(end.getSeconds());

    //获取年月日
    var day = end.getDate();
    var month = end.getMonth();
    var year = end.getFullYear();

    if (day-dayNum >= 1) {
        start.setDate(day-dayNum);
        start.setMonth(month);
        start.setFullYear(year);
    }else if(month-1 >= 0) {
        if (isLeapYear(year) === true) {
            var arr = [31,29,31,30,31,30,31,31,30,31,30,31];
        }else{
            var arr = [31,28,31,30,31,30,31,31,30,31,30,31];
        }
        day = arr[month-1] + (day - dayNum);
        start.setDate(day);
        start.setMonth(month-1);
        start.setFullYear(year);
    }else {
        start.setDate(31 + (day - dayNum));
        start.setMonth(11);
        start.setFullYear(year-1);
    }

    return start;
}

function isLeapYear(year){
    if( (year%4==0&&year%100!=0) || (year%400==0) ){
        return true;
    }else{
        return false;
    }
}