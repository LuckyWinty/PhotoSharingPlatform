/**
 * Created by winty on 2016/11/20.
 */
var fs = require('fs');
var Busboy = require('busboy');
var mongo = require('mongodb');
var Grid = require('gridfs-stream');
var db = new mongo.Db('mongoImage', new mongo.Server("127.0.0.1", 27017), {safe: false});
var gfs;
var util = require('util');
var bodyParser = require('body-parser');


module.exports.doDeclare=function(req,res){

}