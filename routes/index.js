var express = require('express');
var router = express.Router();
var registCtrl=require('../controllers/registCtrl');
var loginCtrl=require('../controllers/loginCtrl');
var indexCtrl=require('../controllers/indexCtrl');
var userCtrl=require('../controllers/userCtrl');

/*登录*/
router.get('/login', function(req, res, next) {
    res.render('login');
});
router.post('/doLogin', function(req, res, next) {
    loginCtrl.doLogin(req,res);
});
//注册
router.post('/doRegist', function(req, res, next) {
    registCtrl.doRegist(req,res);
});
router.get('/regist', function(req, res, next) {
    res.render("regist");
})
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

module.exports = router;
