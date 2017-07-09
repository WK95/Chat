var express = require('express');
var router = express.Router();
var Mg = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://127.0.0.1:27017/stu';


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// router.get('/chat',(req,res)=>{
//   res.render('chat');
// });
//主页提交,登录匹配
router.get('/chat',(req,res)=>{
	var data = req.query;
	var findDB = (db,callback)=>{
    var cursor = db.collection('one').find({"name":data.name,"password":data.password});
    cursor.each((err,doc)=>{
      assert.equal(err,null);
      if (doc !== null){
        res.render('chat');
        console.log(doc);
        return 0;
      } else if(doc === null){
        res.render('error');
        callback();
      }
    });
  };
  Mg.connect(url,(err,db)=>{
    assert.equal(null,err);
    console.log("Connect correctly to server.");
    findDB(db,()=>{
      console.log("init ok");
      db.close();
    });
  });

});


//主页跳注册
router.get('/zhuce',(req,res)=>{
	res.render("zhuce");
});
//注册提交
router.post('/one',(req,res)=>{

  var datas = req.body;

  if (datas.name !== "" || datas.password !== ""){
    Mg.connect(url,(err,db)=>{
      console.log('Connect correctly to server.');
      db.collection('one').insertOne(datas,
        (err,result)=>{
          assert.equal(err,null);
          console.log('Inserted a document into name collection.');
          // callback();
          // console.log(datas);
        });
        db.close();
      });
      res.render('one');
  } else {
    res.render('error');
  };
});

//忘记密码
router.get('/forget',(req,res)=>{
  res.render('forget');
});
//重置跳主页登录
router.post('/',(req,res)=>{
  var data = req.body;
  // console.log("--------");
  // console.log(data);

  var updateDB = (db,callback)=>{
    db.collection('one').updateOne(
      {"name":data.name},
      {$set:{"password":data.password}
    },(err,result)=>{
      console.log("hi");
      callback();
    });
  };
  Mg.connect(url,(err,db)=>{
    assert.equal(null,err);
    console.log("Connected correctly to server.");
    updateDB(db,()=>{
      db.close();
    });
  });
  res.render('index');
});


//错误页面跳转主页
router.get('/',(req,res)=>{
  res.render('index');
});

module.exports = router;
