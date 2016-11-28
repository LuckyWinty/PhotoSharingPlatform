/**
 * Created by winty on 2016/11/20.
 */
var mongoose = require('mongoose');
var _ = require('underscore');
require('../models/model');
var Share = mongoose.model('share');
var User = mongoose.model('user');

var fs = require('fs');
var Busboy = require('busboy');
var mongo = require('mongodb');
var Grid = require('gridfs-stream');
var db = new mongo.Db('sharePictures', new mongo.Server("127.0.0.1", 27017), {safe: false});
var gfs;
var util = require('util');
var moment=require('moment');

db.open(function (err) {
    if (err) {
        throw err;
    }
    gfs = Grid(db, mongo);
});

module.exports.openCenter=function(req,res){
    var person_={};
    User.findById(req.session.user._id)
        .exec(function(err,perso){
            person_=perso;
     })
    function isLiked(shareId){
        if(req.session.user){
            var myLikes=person_.myLikes.shares;

            for(var i=0;i<myLikes.length;i++){
                if(shareId.toString()==myLikes[i].toString()){
                    return true;
                }
            }
            return false;
        }else{
            return false;
        }
    }
    function isCollected(shareId){
        if(req.session.user){
            var myCollections=person_.myCollections.shares;
            for(var i=0;i<myCollections.length;i++){
                if(shareId.toString()==myCollections[i].toString()){
                    return true;
                }
            }
            return false;
        }else{
            return false;
        }
    }
    Share.find({'userId':req.query.userId})
        .sort({'created': -1})
        .populate('userId')
        .exec(function(error,sha){
            if(error){
                console.log('.....查找所有分享出错',error);
            }else{
                var shareArr = [];
                sha.forEach(function(item,index){
                    if (item.userId.isPublic == true || req.session.user._id == item.userId._id) {
                        shareArr.push(item);
                    }
                })

                User.findById(req.query.userId)
                    .exec(function(err,person){
                        if(err){
                            console.log('查找用户失败！');
                        }else{

                            var isMyself;
                            if(!req.session.user){
                                isMyself=false;
                            }else{
                                isMyself=person._id==req.session.user._id?true:false;
                            }

                            if (isMyself == false && req.session.user) {
                                var isConcern = false;
                                
                                User.findById(req.session.user._id)
                                .exec(function(err,u){
                                    if (err) { console.log(err) }
                                    else{
                                        for (var i = u.myFocus.users.length - 1; i >= 0; i--) {
                                            if (u.myFocus.users[i]._id.toString() === person._id.toString()) {
                                                isConcern = true;
                                                break;
                                            }
                                        }
                                    }
                                    res.render('user',{'shares':shareArr,'user':person,sessionUser:req.session.user,'isMyself':isMyself,'moment':moment,'isConcern':isConcern,'isLiked':isLiked,'isCollected':isCollected});
                                })
                            }else {
                                res.render('user',{'shares':shareArr,'user':person,sessionUser:req.session.user,'isMyself':isMyself,'moment':moment,'isLiked':isLiked,'isCollected':isCollected});
                            }
                        }
                    })
            }
        })
}

module.exports.doDeclare = function (req, res) {
    var person_={};
    User.findById(req.session.user._id)
        .exec(function(err,perso){
            person_=perso;
     })
    function isLiked(shareId){
        if(req.session.user){
            var myLikes=person_.myLikes.shares;

            for(var i=0;i<myLikes.length;i++){
                if(shareId.toString()==myLikes[i].toString()){
                    return true;
                }
            }
            return false;
        }else{
            return false;
        }
    }
    function isCollected(shareId){
        if(req.session.user){
            var myCollections=person_.myCollections.shares;
            for(var i=0;i<myCollections.length;i++){
                if(shareId.toString()==myCollections[i].toString()){
                    return true;
                }
            }
            return false;
        }else{
            return false;
        }
    }

    var busboy = new Busboy({headers: req.headers});
    var fileIds = [];
    var body = {};

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        // console.log('got file', filename, mimetype, encoding);
        fileIds.push(new mongo.ObjectId());
        console.log('got file', fieldname, filename);
        var writeStream = gfs.createWriteStream({
            _id: fileIds[fileIds.length-1],
            filename: filename,
            mode: 'w',
            content_type: mimetype
        });
        file.pipe(writeStream);
    }).on('field', function (key, value) {
        body[key] = value;
    }).on('finish', function () {
        var sha = new Share;
        sha.content = body.content;
        sha.images.push.apply(sha.images, fileIds);
        sha.userId=req.query.userId;

        sha.save(function (error, share) {
            if (error) {
                console.log(error);
            } else {
                Share.find({'userId':req.query.userId}).sort({created:-1})
                    .exec(function(error,sha){
                    if(error){
                        console.log('.....查找所有分享出错',error);
                    }else{
                        User.findById(req.query.userId)
                            .exec(function(err,person){
                                //person.myShares.shares=[];
                            person.myShares.shares.push(share._id);
                            person.save(function(err,use){
                                console.log('....发布后的用户！',use.myShares.shares);
                                if(err){
                                    console.log('....发布失败！');
                                }else{
                                    res.render('user',{'shares':sha,'user':use,sessionUser:req.session.user,'moment':moment,'isLiked':isLiked,'isCollected':isCollected});
                                }
                            })
                        })
                    }
                })
            }
        })
    });

    req.pipe(busboy);

}
module.exports.getImage = function (req, res) {
    var _id = new mongo.ObjectId(req.query.imageId);

    gfs.files.findOne({'_id': _id}, function (err, file) {
        // gfs.files.find({}).toArray(function (err, files) {
        //     console.log(util.inspect(file, {showHidden: false, depth: null}));
        if (err) return res.status(400).send(err);
        if (!file) return res.status(404).send('');

        res.set('Content-Type', file.contentType);
        res.set('Content-Disposition', 'attachment; filename=""');

        var readstream = gfs.createReadStream({
            _id: file._id
        });

        readstream.on("error", function(err) {
            console.log("Got error while processing stream " + err.message);
            res.end();
        });

        readstream.pipe(res);
    });
};

module.exports.doPortrait = function (req, res) {
    var busboy = new Busboy({headers: req.headers});
    var fileId = new mongo.ObjectId();
    var body = {};

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        // console.log('got file', filename, mimetype, encoding);
        console.log('got file', fieldname, filename);
        var writeStream = gfs.createWriteStream({
            _id: fileId,
            filename: filename,
            mode: 'w',
            content_type: mimetype
        });
        file.pipe(writeStream);
    }).on('field', function (key, value) {
        body[key] = value;
    }).on('finish', function () {
        console.log('sucess to upload!');
        console.log('-----------body: ');
        console.log(util.inspect(body, {showHidden: false, depth: null}));

        var u = new Object();
        u.portraitUrl = fileId;
        u._id = body._id;  //测试，数据库已存在
        
        var _user;

        User.findOne({_id: u._id},function(err,user){
            if (err) {
                console.log(err);
            }
            _user = _.extend(user,u);
            _user.save(function(err,user){
                if (err) {
                    console.log(err);
                }
                //console.log("user.userName" + user.userName);
                //console.log("user.password" + user.password);
                //console.log("user._id" + user._id);
                //console.log("user.portraitUrl" + user.portraitUrl);
                res.json({
                    success: 1,
                    img: user.portraitUrl
                });
            })
        })

    });

    req.pipe(busboy);
}

module.exports.doIgnore = function(req, res){
    var userId = req.session.user._id;
    User.findOne({_id: userId},function(err, user){
        if (err) {
            console.log(err);
        }else {
            user.isPublic = !user.isPublic;
            //console.log(user.isPublic);
            user.save(function(err,user){
                if (err) {
                    console.log(err);
                }else {
                    res.json({success: 1, isPublic: user.isPublic});
                }
            })
        }
    })
}

module.exports.doFocus = function(req, res){
    if (req.session.user) {
        var sessionId = req.session.user._id;
        var isConcern = req.body.isConcern;
        var userId = req.body.userId;
        //console.log(sessionId);
        //console.log(userId);
        //console.log(isConcern);
        //console.log(typeof isConcern);

        if (isConcern == "true") {
            User.findById(sessionId)
            .exec(function(err,person){
                console.log(person.myFocus.users);
                if (err) {
                    res.json({"success": 0, "message": "找不到登录用户"});
                }else{    
                    for (var i = person.myFocus.users.length - 1; i >= 0; i--) {
                        if (person.myFocus.users[i]._id.toString() === userId.toString()) {
                            person.myFocus.users.splice(i,1);
                            break;
                        }
                    }
                    person.save(function(err, person){
                        if (err) {
                            res.json({"success": 0, "message": "取消关注失败"});
                        }else {
                            res.json({"success": 1, "isConcern": false, "message": "取消关注成功"})
                        }
                    })
                }
            })
        }else {
            User.findById(sessionId)
            .exec(function(err,person){
                console.log(person.myFocus.users);
                if (err) {
                    res.json({"success": 0, "message": "找不到登录用户"});
                }else {                   
                    User.findById(userId)
                    .exec(function(err,u){
                        person.myFocus.users.push(u);

                        person.save(function(err, person){
                            if (err) {
                                res.json({"success": 0, "message": "关注失败"});
                            }else {
                                res.json({"success": 1, "isConcern": true, "message": "关注成功"})
                            }
                        })
                    })
                    
                }
            })
        }
    }else {
        res.json({"success": 0, "message": "尚未登录"});
    }
}


module.exports.doMyShare = function(req, res){
    if (req.session.user) {
        var person_={};
        User.findById(req.session.user._id)
            .exec(function(err,perso){
                person_=perso;
         })
        function isLiked(shareId){
            if(req.session.user){
                var myLikes=person_.myLikes.shares;

                for(var i=0;i<myLikes.length;i++){
                    if(shareId.toString()==myLikes[i].toString()){
                        return true;
                    }
                }
                return false;
            }else{
                return false;
            }
        }
        function isCollected(shareId){
            if(req.session.user){
                var myCollections=person_.myCollections.shares;
                for(var i=0;i<myCollections.length;i++){
                    if(shareId.toString()==myCollections[i].toString()){
                        return true;
                    }
                }
                return false;
            }else{
                return false;
            }
        }


        User.findById(req.session.user._id)
        .populate('myShares.shares')
        .exec(function(err, user){
            if (err) { console.log(err); }

            var shareArr = [];
            var sharesArr = [];
            //console.log("test77---------------");

            shareArr = user.myShares.shares.slice(0); 
            if (shareArr.length == 0) {
                User.findById(req.session.user._id)
                .exec(function(err, u){
                    if (err) { console.log(err); }
                    res.render('user',{'shares':sharesArr,'user':u,'sessionUser':u,'isMyself':true,'moment':moment,'isLiked':isLiked,'isCollected':isCollected});
                })
            }else {
                dealModule(shareArr,sharesArr,shareArr.length-1,req,res);
            }
        })
    }else {
        res.render('error', {message:{title: '用户登录超时，请再次登录！',link:'/login'}});
    }  
}

module.exports.doMyLike = function(req, res){
    if (req.session.user) {
        var person_={};
        User.findById(req.session.user._id)
            .exec(function(err,perso){
                person_=perso;
         })
        function isLiked(shareId){
            if(req.session.user){
                var myLikes=person_.myLikes.shares;

                for(var i=0;i<myLikes.length;i++){
                    if(shareId.toString()==myLikes[i].toString()){
                        return true;
                    }
                }
                return false;
            }else{
                return false;
            }
        }
        function isCollected(shareId){
            if(req.session.user){
                var myCollections=person_.myCollections.shares;
                for(var i=0;i<myCollections.length;i++){
                    if(shareId.toString()==myCollections[i].toString()){
                        return true;
                    }
                }
                return false;
            }else{
                return false;
            }
        }

        User.findById(req.session.user._id)
        .populate('myLikes.shares')
        .exec(function(err, user){
            if (err) { console.log(err); }

            var shareArr = [];
            var sharesArr = [];
            //console.log("test77---------------");

            shareArr = user.myLikes.shares.slice(0); 
            if (shareArr.length == 0) {
                User.findById(req.session.user._id)
                .exec(function(err, u){
                    if (err) { console.log(err); }
                    res.render('user',{'shares':sharesArr,'user':u,'sessionUser':u,'isMyself':true,'moment':moment,'isLiked':isLiked,'isCollected':isCollected});
                })
            }else {
                dealModule(shareArr,sharesArr,shareArr.length-1,req,res);
            }
        })
    }else {
        res.render('error', {message:{title: '用户登录超时，请再次登录！',link:'/login'}});
    }  
}

module.exports.doMyCollection = function(req, res){
    if (req.session.user) {
        var person_={};
        User.findById(req.session.user._id)
            .exec(function(err,perso){
                person_=perso;
         })
        function isLiked(shareId){
            if(req.session.user){
                var myLikes=person_.myLikes.shares;

                for(var i=0;i<myLikes.length;i++){
                    if(shareId.toString()==myLikes[i].toString()){
                        return true;
                    }
                }
                return false;
            }else{
                return false;
            }
        }
        function isCollected(shareId){
            if(req.session.user){
                var myCollections=person_.myCollections.shares;
                for(var i=0;i<myCollections.length;i++){
                    if(shareId.toString()==myCollections[i].toString()){
                        return true;
                    }
                }
                return false;
            }else{
                return false;
            }
        }

        User.findById(req.session.user._id)
        .populate('myCollections.shares')
        .exec(function(err, user){
            if (err) { console.log(err); }

            var shareArr = [];
            var sharesArr = [];
            //console.log("test77---------------");

            shareArr = user.myCollections.shares.slice(0); 
            if (shareArr.length == 0) {
                User.findById(req.session.user._id)
                .exec(function(err, u){
                    if (err) { console.log(err); }
                    res.render('user',{'shares':sharesArr,'user':u,'sessionUser':u,'isMyself':true,'moment':moment,'isLiked':isLiked,'isCollected':isCollected});
                })
            }else {
                dealModule(shareArr,sharesArr,shareArr.length-1,req,res);
            }
        })
    }else {
        res.render('error', {message:{title: '用户登录超时，请再次登录！',link:'/login'}});
    }  
}

module.exports.doMyComment = function(req, res){
    var person_={};
    User.findById(req.session.user._id)
        .exec(function(err,perso){
            person_=perso;
     })
    function isLiked(shareId){
        if(req.session.user){
            var myLikes=person_.myLikes.shares;

            for(var i=0;i<myLikes.length;i++){
                if(shareId.toString()==myLikes[i].toString()){
                    return true;
                }
            }
            return false;
        }else{
            return false;
        }
    }
    function isCollected(shareId){
        if(req.session.user){
            var myCollections=person_.myCollections.shares;
            for(var i=0;i<myCollections.length;i++){
                if(shareId.toString()==myCollections[i].toString()){
                    return true;
                }
            }
            return false;
        }else{
            return false;
        }
    }

    if (req.session.user) {
        User.findById(req.session.user._id)
        .populate('myComments.shares')
        .exec(function(err, user){
            if (err) { console.log(err); }

            var shareArr = [];
            var sharesArr = [];
            //console.log("test77---------------");

            shareArr = user.myComments.shares.slice(0); 
            if (shareArr.length == 0) {
                User.findById(req.session.user._id)
                .exec(function(err, u){
                    if (err) { console.log(err); }
                    res.render('user',{'shares':sharesArr,'user':u,'sessionUser':u,'isMyself':true,'moment':moment,'isLiked':isLiked,'isCollected':isCollected});
                })
            }else {
                dealModule(shareArr,sharesArr,shareArr.length-1,req,res);
            }
        })
    }else {
        res.render('error', {message:{title: '用户登录超时，请再次登录！',link:'/login'}});
    }  
}

function dealModule(shareArr,sharesArr,index,req,res){
    var person_={};
    User.findById(req.session.user._id)
        .exec(function(err,perso){
            person_=perso;
     })
    function isLiked(shareId){
        if(req.session.user){
            var myLikes=person_.myLikes.shares;

            for(var i=0;i<myLikes.length;i++){
                if(shareId.toString()==myLikes[i].toString()){
                    return true;
                }
            }
            return false;
        }else{
            return false;
        }
    }
    function isCollected(shareId){
        if(req.session.user){
            var myCollections=person_.myCollections.shares;
            for(var i=0;i<myCollections.length;i++){
                if(shareId.toString()==myCollections[i].toString()){
                    return true;
                }
            }
            return false;
        }else{
            return false;
        }
    }
    
    User.findById(shareArr[index].userId)
    .exec(function(err, user){
        if (err) { console.log(err); }
        
        if (user.isPublic == true || req.session.user._id == user._id) {
            shareArr[index].userId = user;
            sharesArr.push(shareArr[index]);
        }

        if (index == 0) {
            //console.log('test77*****************');
            //console.log(sharesArr);
            User.findById(req.session.user._id)
            .exec(function(err, u){
                if (err) { console.log(err); }
                res.render('user',{'shares':sharesArr,'user':u,'sessionUser':u,'isMyself':true,'moment':moment,'isLiked':isLiked,'isCollected':isCollected});
            })    
        }else{
            dealModule(shareArr,sharesArr,index-1,req,res);
        }
    })
}