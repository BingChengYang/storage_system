const express = require('express');
const router = express.Router();
const db = require('./db');
const fn = () => {}

var debugMode = 1; // 0 don't show log , 1 show log

router.post('/delStorageList', (req, res) => {
	if(debugMode) console.log(req.body.pid);
	
	var sql = "DELETE FROM product WHERE pid="+req.body.pid;
	console.log(sql)
	db.query(sql, function (err, result, fields) {
		if (err) throw err;
		if(debugMode == 1) console.log(result);
	});
});

router.post('/updateStorageList', (req, res) => {
	if(debugMode) console.log(req.body.pid);
	
	var sql = "UPDATE product SET pName=\'"+req.body.pName+"\',pLocation=\'"+req.body.pLocation+"\',pSeason=\'"+req.body.pSeason+"\',pType=\'"+req.body.pType+"\',pCost="+req.body.pCost+",pPrice="+req.body.pPrice+",pQuantity="+req.body.pQuantity+",pSize=\'"+req.body.pSize+"\',pColor=\'"+req.body.pColor+"\' WHERE pid="+req.body.pid;
	console.log(sql)
	db.query(sql, function (err, result, fields) {
		if (err) throw err;
		if(debugMode == 1) console.log(result);
	});
});

router.post('/getStorageList', (req, res) => {

	new Promise(function(resolve,reject){
		var sql = "SELECT * FROM product";
		db.query(sql, function (err, result, fields) {
			if (err) throw err;
			if(debugMode == 1) console.log(result);
			resolve(result);
		});
	}).then(function(storageList){
		
		if(debugMode == 1){
			console.log(req.body);
		}
		if(req.body.isSort == true){
			storageList.sort(function(a,b){
				if(req.body.sortKey == "pPrice"){
					keyA = a.pPrice;
					keyB = b.pPrice;
				}else if(req.body.sortKey == "pQuantity"){
					keyA = a.pQuantity;
					keyB = b.pQuantity;
				}else if(req.body.sortKey == "pCost"){
					keyA = a.pCost;
					keyB = b.pCost;
				}

				if(req.body.sortOrder == "descending")
					return keyB - keyA;
				else if(req.body.sortOrder == "ascending")
					return keyA - keyB;
			});
		}

		res.send(
			{ 
				"list":storageList
			}
		);
	});
	
});

module.exports = router