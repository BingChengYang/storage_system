const express = require('express')
const router = express.Router()
//const db = require('./db')
const fn = () => {}

var debugMode = 0; // 0 don't show log , 1 show log

// router.get('/api/getArticle', (req, res) => {
//   const _id = req.query.id
//   db.Article.findOne({_id}, (err, doc) => {
//     if (err) {
//       console.log(err)
//     } else if (doc) {
//       res.send(doc)
//     }
//   })
// })

// router.get('/api/getArticles', (req, res) => {
//   db.Article.find(null, 'title date content', (err, doc) => {
//     if (err) {
//       console.log(err)
//     } else if (doc) {
//       res.send(JSON.stringify(doc))
//     }
//   })
// })

// router.post('/api/login', (req, res) => {
//   const {name, pwd} = req.body
//   db.User.findOne({name}, 'pwd', (err, doc) => {
//     switch (true) {
//       case !!err:
//         console.log(err)
//         break
//       case !doc:
//         res.send({state: 0, msg: '账号不存在'})
//         break
//       case doc.pwd === pwd:
//         res.send({state: 1, msg: '登陆成功'})
//         break
//       case doc.pwd !== pwd:
//         res.send({state: 2, msg: '密码错误'})
//         break
//       default :
//         res.send({state: 3, msg: '未知错误'})
//     }
//   })
// })

// router.post('/api/saveArticle', (req, res) => {
//   const id = req.body._id
//   const article = {
//     title: req.body.title,
//     date: req.body.date,
//     content: req.body.content
//   }
//   if (id) {
//     db.Article.findByIdAndUpdate(id, article, fn)
//   } else {
//     new db.Article(article).save()
//   }
//   res.status(200).end()
// })

// router.post('/api/deleteArticle', (req, res) => {
//   db.Article.findByIdAndRemove(req.body.id, fn)
//   res.status(200).end()
// })

// router.post('/api/getLinks', (req, res) => {
//   db.Link.find(null, (err, doc) => {
//     if (err) {
//       console.log(err)
//     } else if (doc) {
//       res.send(doc)
//     }
//   })
// })

// router.post('/api/saveLinks', (req, res) => {
//   const links = req.body || []
//   db.Link.remove(null, fn)
//   const promises = links.map(({name, href}) => new db.Link({name, href}).save())
//   Promise.all(promises)
//     .then(() => res.status(200).end())
//     .catch(() => res.status(500).end())
// })

// router.post('/api/savePwd', (req, res) => {
//   const {name, pwd} = req.body
//   db.User.findOneAndUpdate({name}, {pwd}, fn)
//   res.status(200).end()
// })

router.post('/getStorageList', (req, res) => {
	var pageSize = 10;
	var storageList = [];
	for(var i=0;i<100;i++){
		storageList[i] = {
			"name" : "GGG",
			"brand" : "supreme",
			"price" : (100-i),
			"quantity" : i,
			"size" : "L",
			"color" : "red",
			"imgLink" : ""
			}
	}
	if(debugMode == 1){
		console.log(req.body);
	}
	if(req.body.isSort == true){
		storageList.sort(function(a,b){
			if(req.body.sortKey == "price"){
				keyA = a.price;
				keyB = b.price;
			}else if(req.body.sortKey == "quantity"){
				keyA = a.quantity;
				keyB = b.quantity;
			}

			if(req.body.sortOrder == "descending")
				return keyB - keyA;
			else if(req.body.sortOrder == "ascending")
				return keyA - keyB;
		});
	}

	res.send(
		{ 
			"list":storageList.slice(pageSize*(req.body.page-1), (pageSize*req.body.page)-1),
			"totalDataNum":storageList.length
		}
	);
	
})

module.exports = router