/**
 * Created by winty on 2016/11/12.
 */
var express = require('express');
var router = express.Router();
var indexCtrl=require('../controllers/indexCtrl');
var userCtrl=require('../controllers/userCtrl');

/*登录*/

/* 加载主页 */
router.get('/index', function(req, res, next) {
    indexCtrl.showIndex(req, res);
});

/* 加载个人中心页 */
router.get('/user', function(req, res, next) {
    userCtrl.openCenter(req, res);
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
//加载图片
router.get('/image', function (req, res) {
    userCtrl.getImage(req, res);
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
