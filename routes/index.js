var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Special Assignment', success: req.session.success, errors: req.session.errors });
//   req.session.errors=null
// });

// router.post('/submit', function(req, res, next) {
//   req.check('name', 'Invalid name').isLength({min: 2});
//   req.check('quantity', 'Invalid number ').isInt({min:0});

//   var errors = req.validationErrors()
//   if(errors){
//     req.session.errors = errors
//     req.session.success=false
//   }else{
//     req.session.success=true
//   }
//   res.redirect("/")
// })


var url = 'mongodb://YoanaChurkina:Kremena01@yoanachurkina-shard-00-00.u9ka4.mongodb.net:27017,yoanachurkina-shard-00-01.u9ka4.mongodb.net:27017,yoanachurkina-shard-00-02.u9ka4.mongodb.net:27017/SpecialAssignment?ssl=true&replicaSet=atlas-2uh8se-shard-0&authSource=admin&retryWrites=true&w=majority';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/get-data', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, dataBase) {
    assert.equal(null, err);
    var cursor = dataBase.collection('leaderboards').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      dataBase.close();
      res.render('index', {student: resultArray});
    });
  });
});

router.post('/insert', function(req, res, next) {
  var student = {
    name: req.body.name,
    points: req.body.points
  };
  mongo.connect(url, function(err, dataBase) {
    assert.equal(null, err);
    dataBase.collection('leaderboards').insertOne(student, function(err, result) {
      assert.equal(null, err);
      console.log('Student inserted');
      dataBase.close();
    });
  });

  res.redirect('/');
});

router.post('/update', function(req, res, next) {
  var student = {
    name: req.body.name,
    points: req.body.points
  };
  var id = req.body.id;

  mongo.connect(url, function(err, dataBase) {
    assert.equal(null, err);
    dataBase.collection('leaderboards').updateOne({"_id": objectId(id)}, {$set: student}, function(err, result) {
      assert.equal(null, err);
      console.log('Student updated');
      dataBase.close();
    });
  });
  res.redirect('/');
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;

  mongo.connect(url, function(err, dataBase) {
    assert.equal(null, err);
     dataBase.collection('leaderboards').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      console.log('Student deleted');
      dataBase.close();
    });
  });
  res.redirect('/');
});

router.post('/ascending', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, dataBase) {
    assert.equal(null, err);
    var cursor = dataBase.collection('leaderboards').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
      resultArray.sort(function (a, b) {
        return a.points - b.points;
    });
    }, function() {
      dataBase.close();
      res.render('index', {student: resultArray});
    });
  });
});

router.post('/descending', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, dataBase) {
    assert.equal(null, err);
    var cursor = dataBase.collection('leaderboards').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
      resultArray.sort(function (a, b) {
        return b.points - a.points;
    });
    }, function() {
      dataBase.close();
      res.render('index', {student: resultArray});
    });
  });
});

router.post('/find-one', function(req, res, next) {
  var resultArray = [];
  var id = req.body.id;
  mongo.connect(url, function(err, dataBase) {
    assert.equal(null, err);
    var cursor = dataBase.collection('leaderboards').find({"_id": objectId(id)});
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      dataBase.close();
      res.render('index', {student: resultArray});
    });
  });
});

module.exports = router;
 