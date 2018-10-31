const express = require('express');
const router = express.Router();
const db = require('./db');
var async = require('async');
const fn = () => {}

var debugMode = 0; // 0 don't show log , 1 show log

router.post('/addPendingForm', (req, res) => {
	var i =0;
	if(debugMode) console.log(req.body);
	var productList = req.body.productList;
	//console.log(productList[0].shipmentCnt);
	async.forEachOf(productList,function(product,i,cb){
		var sql = "SELECT * FROM product WHERE pid ="+product.pid;
		db.query(sql, function (err, result, fields) {
			if (err){ 
				cb(err);
			}else{
				if(debugMode) console.log(result);
				var newQuantity = parseInt(result[0].pQuantity) - parseInt(product.shipmentCnt);
				console.log(newQuantity);
				sql = "UPDATE product SET pQuantity = " + newQuantity +" WHERE pid = "+ product.pid;
				db.query(sql, function (err, result, fields) {
					if (err) throw err;
					if(debugMode) console.log(result);
					cb(null);
				});	
			}
		});
	},function(err){
		if(err){
          //handle the error if the query throws an error
        }else{
          //whatever you wanna do after all the iterations are done
        }
	});
	
	var sql = "INSERT INTO pendinglist (pendingForm,status) VALUES (\'"+JSON.stringify(req.body)+"\',\'運送中\')";
	//console.log(sql);

	db.query(sql, function (err, result, fields) {
		if (err) throw err;
		if(debugMode) console.log(result);
	});
	
});

router.post('/insertStorageList', (req, res) => {
	if(debugMode) console.log(req.body);
	
	var sql = "INSERT INTO product (pName,pLocation,pSeason,pType,pCost,pPrice,pQuantity,pSize,pColor,pImg,pNote) VALUES (\'"+req.body.pName+"\',\'"+req.body.pLocation+"\',\'"+req.body.pSeason+"\',\'"+req.body.pType+"\',\'"+req.body.pCost+"\',\'"+req.body.pPrice+"\',\'"+req.body.pQuantity+"\',\'"+req.body.pSize+"\',\'"+req.body.pColor+"\',\'"+req.body.pImg+"\',\'"+req.body.pNote+"\')";
	if(debugMode) console.log(sql);
	db.query(sql, function (err, result, fields) {
		if (err) throw err;
		if(debugMode) console.log(result);
	});
});

router.post('/delStorageList', (req, res) => {
	if(debugMode) console.log(req.body.pid);
	
	var sql = "DELETE FROM product WHERE pid="+req.body.pid;
	console.log(sql)
	db.query(sql, function (err, result, fields) {
		// if (err) throw err;
		if(debugMode == 1) console.log(result);
	});
});

router.post('/delPendingForm', (req, res) => {

	var sql = "DELETE FROM pendinglist WHERE pendingID ="+req.body.pendingID;
	console.log(sql)
	db.query(sql, function (err, result, fields) {
		// if (err) throw err;
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

router.post('/confirmArrive', (req, res) => {
	new Promise(function(resolve){
		var sql = "SELECT * FROM pendinglist WHERE pendingID = " + req.body.pendingID;
		console.log(sql);
		db.query(sql, function (err, result, fields) {
			if (err) throw err;
			if(debugMode) console.log(result);
			//console.log(result);
			resolve(result);
		});
	}).then(function(result){
		var productList = JSON.parse(result[0].pendingForm).productList;
		//console.log(productList);
		var location = JSON.parse(result[0].pendingForm).destination;
		//console.log(location);
		async.forEachOf(productList,function(product,i,cb){
			var sql = "SELECT * FROM product WHERE pName = \'"+ product.name + "\'AND pSize = \'" + product.size + "\'AND pColor = \'" + product.color + "\'AND pLocation = \'" + location + "\'";
			console.log(sql);
			db.query(sql, function (err, result, fields) {
				if (err){ 
					cb(err);
				}else{
					if(debugMode) console.log(result);
					console.log(result);
					if(result.length>0){
						var newQuantity = parseInt(result[0].pQuantity) + parseInt(product.shipmentCnt);
						console.log(newQuantity);
						sql = "UPDATE product SET pQuantity = " + newQuantity +" WHERE pid = "+ result[0].pid;
						console.log(sql);
						db.query(sql, function (err, result, fields) {
							if (err) throw err;
							if(debugMode) console.log(result);
							cb(null);
						});	
					}else if(result.length==0){
						sql = "INSERT INTO product (pName,pLocation,pSeason,pType,pCost,pPrice,pQuantity,pSize,pColor,pImg,pNote) VALUES (\'"+product.name+"\',\'"+location+"\',\'"+product.season+"\',\'"+product.type+"\',\'"+product.cost+"\',\'"+product.price+"\',\'"+product.shipmentCnt+"\',\'"+product.size+"\',\'"+product.color+"\',\'"+product.img+"\',\'"+product.note+"\')";
						db.query(sql, function (err, result, fields) {
							if (err) throw err;
							if(debugMode) console.log(result);
							cb(null);
						});	
					}
				}
			});
		},function(err){
			if(err){
	          //handle the error if the query throws an error
	        }else{
	          //whatever you wanna do after all the iterations are done
	        }
		});
	});
	

	
	var sql = "UPDATE pendinglist SET status = \'已抵達\' WHERE pendingID = "+req.body.pendingID;
	console.log(sql)
	db.query(sql, function (err, result, fields) {
		if (err) throw err;
		if(debugMode == 1) console.log(result);
	});
});

router.post('/cancelPending', (req, res) => {
	new Promise(function(resolve){
		var sql = "SELECT * FROM pendinglist WHERE pendingID = " + req.body.pendingID;
		console.log(sql);
		db.query(sql, function (err, result, fields) {
			if (err) throw err;
			if(debugMode) console.log(result);
			//console.log(result);
			resolve(result);
		});
	}).then(function(result){
		var productList = JSON.parse(result[0].pendingForm).productList;
		//console.log(productList);
		var location = JSON.parse(result[0].pendingForm).destination;
		//console.log(location);
		async.forEachOf(productList,function(product,i,cb){
			var sql = "SELECT * FROM product WHERE pid = " + product.pid;
			console.log(sql);
			db.query(sql, function (err, result, fields) {
				if (err){ 
					cb(err);
				}else{
					if(debugMode) console.log(result);
					console.log(result);
					if(result.length>0){
						var newQuantity = parseInt(result[0].pQuantity) + parseInt(product.shipmentCnt);
						console.log(newQuantity);
						sql = "UPDATE product SET pQuantity = " + newQuantity +" WHERE pid = "+ result[0].pid;
						console.log(sql);
						db.query(sql, function (err, result, fields) {
							if (err) throw err;
							if(debugMode) console.log(result);
							cb(null);
						});	
					}else if(result.length==0){
						sql = "INSERT INTO product (pName,pLocation,pSeason,pType,pCost,pPrice,pQuantity,pSize,pColor,pImg,pNote) VALUES (\'"+product.name+"\',\'"+location+"\',\'"+product.season+"\',\'"+product.type+"\',\'"+product.cost+"\',\'"+product.price+"\',\'"+product.shipmentCnt+"\',\'"+product.size+"\',\'"+product.color+"\',\'"+product.img+"\',\'"+product.note+"\')";
						db.query(sql, function (err, result, fields) {
							if (err) throw err;
							if(debugMode) console.log(result);
							cb(null);
						});	
					}
				}
			});
		},function(err){
			if(err){
	          //handle the error if the query throws an error
	        }else{
	          //whatever you wanna do after all the iterations are done
	        }
		});
	});
	

	
	var sql = "DELETE FROM pendinglist WHERE pendingID ="+req.body.pendingID;
	console.log(sql)
	db.query(sql, function (err, result, fields) {
		// if (err) throw err;
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

router.post('/getPendingList', (req, res) => {

	var sql = "SELECT * FROM pendinglist";
	new Promise(function(resolve){
		db.query(sql, function (err, result, fields) {
			var response = [];
			if (err) throw err;
			if(debugMode == 1) console.log(result);
			for(var i=0; i<result.length; i++){ 
	            response[i] = JSON.parse(result[i].pendingForm);
	            response[i].pendingID = result[i].pendingID;
	            response[i].status = result[i].status;
	        }
	        resolve(response);
		});
	}).then(function(response){
		res.send(response);
	});
});

module.exports = router