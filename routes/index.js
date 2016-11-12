/**
 * Created by winty on 2016/11/12.
 */
var express = require('express');
var router = express.Router();

/* 加载主页 */
router.get('/index', function(req, res, next) {
    res.render('index');
});

module.exports = router;
