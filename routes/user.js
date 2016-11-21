var express = require('express');
var router = express.Router();
var userCtrl=require('../controllers/userCtrl');

/* GET users listing. */
router.post('/declare', function (req, res) {
  userCtrl.doDeclare(req, res);
});

module.exports = router;
