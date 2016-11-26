var express = require('express');
var router = express.Router();
var registCtrl=require('../controllers/registCtrl');
var loginCtrl=require('../controllers/loginCtrl');
var indexCtrl=require('../controllers/indexCtrl');
var userCtrl=require('../controllers/userCtrl');
var errorCtrl=require('../controllers/errorCtrl');
var shareCtrl=require('../controllers/shareCtrl');

/*登录*/
router.get('/login', function(req, res, next) {
    res.render('login');
});
router.post('/index', function(req, res, next) {
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
router.get('/error', function(req, res, next) {
    errorCtrl.doError(req,res);
});

/* 加载分享页 */
router.get('/share', function(req, res, next) {
    shareCtrl.doShare(req,res);
});

/* 发布. */
router.post('/declare', function (req, res) {
    userCtrl.doDeclare(req, res);
});
//加载图片
router.get('/image', function (req, res) {
    userCtrl.getImage(req, res);
});
/* 上传头像 */
router.post('/user', function (req, res) {
    userCtrl.doPortrait(req, res);
});

//点赞
router.post('/doLike',function(req,res){
    shareCtrl.doLike(req,res);
});
//加载后台管理
router.get('/back', function(req, res, next) {
    res.render('backstage');
});
//屏蔽处理
router.get('/user/ignore',function(req,res){
    userCtrl.doIgnore(req,res);
});


module.exports = router;
