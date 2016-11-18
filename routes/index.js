/**
 * Created by winty on 2016/11/12.
 */
var express = require('express');
var router = express.Router();

/* 加载主页 */
router.get('/index', function(req, res, next) {
    res.render('index');
});

/* 加载个人中心页 */
router.get('/user', function(req, res, next) {
    res.render('user');
});

module.exports = router;
