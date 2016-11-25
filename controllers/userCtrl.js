/**
 * Created by winty on 2016/11/20.
 */
var mongoose = require('mongoose');
require('../models/model');
var Share = mongoose.model('share');
var User=mongoose.model('user');

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
    Share.find({'userId':req.query.userId})
        .exec(function(error,sha){
            if(error){
                console.log('.....查找所有分享出错',error);
            }else{
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
                            res.render('user',{'shares':sha,'user':person,'isMyself':isMyself,'moment':moment});
                        }
                    })
            }
        })
}

module.exports.doDeclare = function (req, res) {

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
       console.log(util.inspect(body, {showHidden: false, depth: null}));

        var sha = new Share;
        sha.content = body.content;
        sha.images.push(fileId);
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
                                    res.render('user',{'shares':sha,'user':use,'moment':moment});
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