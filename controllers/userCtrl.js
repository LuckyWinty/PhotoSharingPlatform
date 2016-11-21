/**
 * Created by winty on 2016/11/20.
 */
var mongoose = require('mongoose');
require('../models/model');
var Share = mongoose.model('share');

var fs = require('fs');
var Busboy = require('busboy');
var mongo = require('mongodb');
var Grid = require('gridfs-stream');
var db = new mongo.Db('sharePictures', new mongo.Server("127.0.0.1", 27017), {safe: false});
var gfs;
var util = require('util');

db.open(function (err) {
    if (err) {
        throw err;
    }
    gfs = Grid(db, mongo);
});


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
        console.log('sucess to upload!');
        console.log('-----------body: ');
        console.log(util.inspect(body, {showHidden: false, depth: null}));

        var sha = new Share;
        sha.content = body.content;
        sha.images.push(fileId);

        sha.save(function (error, share) {
            var filesIdArray = [];
            if (error) {
                console.log(error);
            } else {
                gfs.files.find({}, {'_id': 1}).sort({uploadDate: -1}).toArray(function (err, filesId) {
                    filesId.forEach(function (item) {
                        filesIdArray.push(item._id);
                    });
                });
                console.log('0--------------------;', filesIdArray);
                res.render('user', {'content': share.content, 'ids': filesIdArray});
            }
        })
    });

    req.pipe(busboy);



}