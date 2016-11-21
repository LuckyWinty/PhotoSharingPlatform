var express = require('express');
var router = express.Router();
var userCtrl=require('../controllers/userCtrl');

/* 加载主页 */
router.get('/index', function(req, res, next) {
    res.render('index');
});

/* 加载个人中心页 */
router.get('/user', function(req, res, next) {
    res.render('user');
});

/* 加载ceshi */
router.get('/ceshi', function(req, res, next) {
    res.render('test');
});

/* 加载分享页 */
router.get('/share', function(req, res, next) {
    res.render('share');
});

/* 发布. */
router.post('/declare', function (req, res) {
    userCtrl.doDeclare(req, res);
});


module.exports = router;
