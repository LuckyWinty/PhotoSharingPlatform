/**
 * Created by winty on 2016/11/12.
 */
var express = require('express');
var router = express.Router();

/* 加载主页 */
router.get('/index', function(req, res, next) {
    res.render('index');
});

/* 加载ceshi */
router.get('/ceshi', function(req, res, next) {
    res.render('test');
});

/* 加载分享页 */
router.get('/share', function(req, res, next) {
    res.render('share');
});



module.exports = router;
