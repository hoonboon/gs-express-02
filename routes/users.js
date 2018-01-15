var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/list', function (req, res, next) {
  var db = req.db;
  var col = db.get("users");
  col.find({}, {}, function (err, docs) {
    res.json(docs);
  });
});

/* POST to create new user */
router.post('/add', function(req, res) {
  var db = req.db;
  var col = db.get("users");
  col.insert(req.body, function(err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

/* DELETE existing user */
router.delete('/delete/:id', function(req, res) {
  var db = req.db;
  var col = db.get("users");
  var userIdToDelete = req.params.id;
  col.remove({ '_id': userIdToDelete }, function(err) {
    res.send((err === null) ? { msg: '' } : { msg: 'Error: ' + err });
  });
});

module.exports = router;
