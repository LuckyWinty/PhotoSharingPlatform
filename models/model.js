/**
 * Created by winty on 2016/11/11.
 */
var mongoose=require('mongoose');
var dbUrl=require('../configure/urlConfigures');

var testSchema=new mongoose.Schema({
    name:String
});

mongoose.model('Test',testSchema);