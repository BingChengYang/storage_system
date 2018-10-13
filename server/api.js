const express = require('express');
const router = express.Router();
const db = require('./db');
const fn = () => {}

var debugMode = 1; // 0 don't show log , 1 show log

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