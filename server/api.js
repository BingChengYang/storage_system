const express = require('express');
const router = express.Router();
const db = require('./db');
const multer  = require('multer');
var async = require('async');
const fn = () => {}
const fs = require('fs');
const path = require('path');
const empty = require('empty-folder');

function move(oldPath, newPath, callback) {

    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === 'EXDEV') {
                copy();
            } else {
                callback(err);
            }
            return;
        }
        callback();
    });

    function copy() {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);

        readStream.on('error', callback);
        writeStream.on('error', callback);

        readStream.on('close', function () {
            fs.unlink(oldPath, callback);
        });

        readStream.pipe(writeStream);
    }
}

var storage = multer.diskStorage({
    //確定圖片存儲的位置
    destination: function (req, file, cb){
        cb(null, './tmpImg')
    },

    //確定圖片存儲時的名字,注意，如果使用原名，可能會造成再次上傳同一張圖片的時候的衝突
    filename: function (req, file, cb){
        cb(null, Date.now()+file.originalname)
    }
});
//生成的專門處理上傳的一個工具，可以傳入storage、limits等配置
var upload = multer({storage: storage});
var oldPath = './tmpImg/';
var newPath = './img/';

var debugMode = 0; // 0 don't show log , 1 show log

/*********************************************************************************************/
/*product table*/
router.post('/insertStorageList', (req, res) => {
	//if(debugMode) console.log(req.body);
	var img = {
		list: []
	};
	for(var i=0; i<req.body.uploadList.length; i++){
		var path_resolve = path.resolve(oldPath, req.body.uploadList[i]); // 解析成絕對路徑
		// 輸出內容：/Users/carlos/Documents/test/other/other.txt
		img.list.push(req.body.pLocation+ req.body.pSize + req.body.pName + req.body.pColor + i + path.extname(path_resolve));
	}
	
	var sql = "INSERT INTO product (pName,pLocation,pType,pCost,pPrice,pQuantity,pSize,pColor,pImg,pNote) VALUES ("+db.escape(req.body.pName)+","+db.escape(req.body.pLocation)+","+db.escape(req.body.pType)+","+db.escape(req.body.pCost)+","+db.escape(req.body.pPrice)+","+db.escape(req.body.pQuantity)+","+db.escape(req.body.pSize)+","+db.escape(req.body.pColor)+","+db.escape(JSON.stringify(img))+","+db.escape(req.body.pNote)+")";
	//if(debugMode) 
		console.log(sql);
	db.query(sql, function (err, result, fields) {
		if (err) throw err;
		if(debugMode) console.log(result);
	});
	new Promise(function(resolve){
		for(var i=0; i<req.body.uploadList.length; i++){
			var oldImg = path.join(__dirname,oldPath, req.body.uploadList[i]);
			var newImg = path.join(__dirname,newPath, img.list[i]);
			move(oldImg,newImg,function(err){
				//console.log(err);
			});
			resolve("done");
		}
	}).then(function(result){
		empty(oldPath, false, (o)=>{
		  	//if(o.error) console.error(err);
		  	//console.log(o.removed);
		  	//console.log(o.failed);
		});
	});
});

router.post('/delStorageList', (req, res) => {
	if(debugMode) console.log(req.body.pid);
	new Promise(function(resolve){
		var sql = "SELECT pImg FROM product WHERE pid = "+db.escape(req.body.pid);
		db.query(sql, function (err, result, fields) {
			// if (err) throw err;
			//if(debugMode === 1) 
				console.log(result);
				var imgList = JSON.parse(result[0].pImg).list;
				for(var i=0; i<imgList.length; i++){
					fs.unlink(path.join(__dirname,newPath, imgList[i]),function(result){});
				}
				resolve("done");
		});
	}).then(function(result){
		var sql = "DELETE FROM product WHERE pid="+db.escape(req.body.pid);
		console.log(sql)
		db.query(sql, function (err, result, fields) {
			// if (err) throw err;
			if(debugMode == 1) console.log(result);
		});
	});
});

router.post('/delImg', (req, res) => {
	var delImg = req.body.delImg;
	var pid = req.body.pid;
	var sql = "SELECT pImg FROM product WHERE pid = "+db.escape(pid);
	new Promise(function(resolve){
		db.query(sql, function (err, result, fields) {
			// if (err) throw err;
			//if(debugMode) console.log(result);	
			var imgList = JSON.parse(result[0].pImg).list;
			var index = imgList.indexOf(delImg);
            if (index > -1) {
               	imgList.splice(index, 1);
            }
            fs.unlink(path.join(__dirname,newPath, delImg),function(result){});
			resolve({
				list: imgList
			});
		});
	}).then(function(result){
		var sql = "UPDATE product SET pImg = " + db.escape(JSON.stringify(result)) + " WHERE pid = " + db.escape(pid);
		db.query(sql, function (err, result, fields) {
			// if (err) throw err;
			if(debugMode === 1) console.log(result);
			res.send({
			  	errCode:0
			});
		});
	});
});

router.post('/updateStorageList', (req, res) => {
	if(debugMode) console.log(req.body.pid);

	var img = JSON.parse(req.body.pImg);
	var oldLength = img.list.length;
	for(var i=0; i<req.body.uploadList.length; i++){
		var path_resolve = path.resolve(oldPath, req.body.uploadList[i]); // 解析成絕對路徑
		// 輸出內容：/Users/carlos/Documents/test/other/other.txt
		var idx = i+oldLength;
		img.list.push(req.body.pLocation+ req.body.pSize +req.body.pName + req.body.pColor + idx + path.extname(path_resolve));
	}
	
	var sql = "UPDATE product SET pName="+db.escape(req.body.pName)+",pLocation="+db.escape(req.body.pLocation)+",pType="+db.escape(req.body.pType)+",pCost="+db.escape(req.body.pCost)+",pPrice="+db.escape(req.body.pPrice)+",pQuantity="+db.escape(req.body.pQuantity)+",pSize="+db.escape(req.body.pSize)+",pColor="+db.escape(req.body.pColor)+",pNote="+db.escape(req.body.pNote)+",pImg="+db.escape(JSON.stringify(img))+" WHERE pid="+db.escape(req.body.pid);
	db.query(sql, function (err, result, fields) {
		if (err) throw err;
		if(debugMode === 1) console.log(result);
	});

	new Promise(function(resolve){
		for(var i=0; i<req.body.uploadList.length; i++){
			var oldImg = path.join(__dirname,oldPath, req.body.uploadList[i]);
			var newImg = path.join(__dirname,newPath, img.list[i+oldLength]);
			move(oldImg,newImg,function(err){
				//console.log(err);
			});
			resolve("done");
		}
	}).then(function(result){
		empty(oldPath, false, (o)=>{
		  	//if(o.error) console.error(err);
		  	//console.log(o.removed);
		  	//console.log(o.failed);
		  	res.send({
			  	errCode:0
			});
		});
	});
});

router.post('/confirmPurchase', (req, res) => {
	var balance = 0;
	var newQuantity = 0;
	db.beginTransaction(function(err){
		if(err) throw err;
		if(req.body.location === '美國'){
			var sql = "SELECT USDollar FROM account WHERE id = 1";
		}else if(req.body.location === '台灣'){
			var sql = "SELECT TWDollar FROM account WHERE id = 1";
		}
		console.log(sql);
		db.query(sql, function (err, result, fields) {
			if (err) throw err;
			console.log(result);
			if(req.body.location === '美國'){
				balance = result[0].USDollar;
			}else if(req.body.location === '台灣'){
				balance = result[0].TWDollar;
			}
			balance = parseInt(balance) - (parseInt(req.body.cost) * parseInt(req.body.quantity));
			console.log(balance);
			if(req.body.location === '美國'){
				var sql = "UPDATE account SET USDollar="+db.escape(balance)+" WHERE id = 1";
			}else if(req.body.location === '台灣'){
				var sql = "UPDATE account SET TWDollar="+db.escape(balance)+" WHERE id = 1";
			}
			console.log(sql);
			db.query(sql, function (err, result, fields) {
				if (err) throw err;
				if(debugMode === 1) console.log(result);
				newQuantity = parseInt(req.body.originQuantity) + parseInt(req.body.quantity);
				var sql = "UPDATE product SET pQuantity = " + db.escape(newQuantity) + " WHERE pid = " + db.escape(req.body.id);
				db.query(sql, function (err, result, fields) {
					if (err) throw err;
					if(debugMode === 1) console.log(result);
					res.send({
						errCode:0
					});
				});
			});
		});
	});
});

router.post('/getStorageList', (req, res) => {

	new Promise(function(resolve,reject){
		var sql = "SELECT * FROM product";
		db.query(sql, function (err, result, fields) {
			if (err) throw err;
			if(debugMode === 1) console.log(result);
			resolve(result);
		});
	}).then(function(storageList){
		
		if(debugMode === 1){
			console.log(req.body);
		}
		if(req.body.isSort === true){
			storageList.sort(function(a,b){
				if(req.body.sortKey === "pPrice"){
					keyA = a.pPrice;
					keyB = b.pPrice;
				}else if(req.body.sortKey === "pQuantity"){
					keyA = a.pQuantity;
					keyB = b.pQuantity;
				}else if(req.body.sortKey === "pCost"){
					keyA = a.pCost;
					keyB = b.pCost;
				}

				if(req.body.sortOrder === "descending")
					return keyB - keyA;
				else if(req.body.sortOrder === "ascending")
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

router.post('/uploadImg', upload.single('file'), function(req, res, next){
	//console.log(req);
    //圖片已經被放入到服務器裏,且req也已經被upload中間件給處理好了（加上了file等信息）
    
    //線上的也就是服務器中的圖片的絕對地址
    var url = req.file.filename;
    res.json({
        code : 200,
        img : url
    })
});

router.post('/addPendingForm', (req, res) => {
	var i =0;
	if(debugMode) console.log(req.body);
	var productList = req.body.productList;
	//console.log(productList[0].shipmentCnt);
	async.forEachOf(productList,function(product,i,cb){
		var sql = "SELECT * FROM product WHERE pid ="+db.escape(product.pid);
		db.query(sql, function (err, result, fields) {
			if (err){ 
				cb(err);
			}else{
				if(debugMode) console.log(result);
				var newQuantity = parseInt(result[0].pQuantity) - parseInt(product.shipmentCnt);
				console.log(newQuantity);
				sql = "UPDATE product SET pQuantity = " + db.escape(newQuantity) +" WHERE pid = "+ db.escape(product.pid);
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
	
	var sql = "INSERT INTO pendinglist (pendingForm,status) VALUES ("+db.escape(JSON.stringify(req.body))+",\'運送中\')";
	//console.log(sql);

	db.query(sql, function (err, result, fields) {
		if (err) throw err;
		if(debugMode) console.log(result);
	});
	
});

router.post('/addSaleForm', (req, res) => {
	var i =0;
	console.log(req.body);
	var productList = req.body.productList;
	//console.log(productList[0].shipmentCnt);
	//db.beginTransaction(function(err){
		//if(err) throw err;
		async.forEachOf(productList,function(product,i,cb){
			var sql = "SELECT * FROM product WHERE pid ="+db.escape(product.pid);
			db.query(sql, function (err, result, fields) {
				if (err){ 
					cb(err);
				}else{
					if(debugMode) console.log(result);
					var newQuantity = parseInt(result[0].pQuantity) - parseInt(product.quantity);
					sql = "UPDATE product SET pQuantity = " + db.escape(newQuantity) +" WHERE pid = "+ db.escape(product.pid);
					db.query(sql, function (err, result, fields) {
						if (err) throw err;
						cb(null);
						if(i === productList.length - 1){
							res.send({
								errCode:0
							});
						}
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

		db.query("INSERT INTO salelist (saleForm,status) VALUES ("+db.escape(JSON.stringify(req.body))+",\'銷售中\')", function (err, result, fields) {
			if (err) throw err;
			///if(debugMode) 
				console.log(result);
		});
	//});
});
/*********************************************************************************************/

/*pending list*/

router.post('/delPendingForm', (req, res) => {

	var sql = "DELETE FROM pendinglist WHERE pendingID ="+db.escape(req.body.pendingID);
	console.log(sql)
	db.query(sql, function (err, result, fields) {
		// if (err) throw err;
		if(debugMode === 1) console.log(result);
	});
});

router.post('/updatePending', (req, res) => {
	var sql = "UPDATE pendinglist SET pendingForm ="+db.escape(JSON.stringify(req.body.form))+" WHERE pendingID = " + db.escape(req.body.id);
	db.query(sql, function (err, result, fields) {
		if (err) throw err;
		if(debugMode === 1) console.log(result);
		res.send({
			errCode:0
		});
	});
});

router.post('/confirmArrive', (req, res) => {
	new Promise(function(resolve){
		var sql = "SELECT * FROM pendinglist WHERE pendingID = " + db.escape(req.body.pendingID);
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
			var sql = "SELECT * FROM product WHERE pName = "+ db.escape(product.name) + "AND pSize = " + db.escape(product.size) + "AND pColor = " + db.escape(product.color) + "AND pLocation = " + db.escape(location);
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
						sql = "UPDATE product SET pQuantity = " + db.escape(newQuantity) +" WHERE pid = "+ db.escape(result[0].pid);
						console.log(sql);
						db.query(sql, function (err, result, fields) {
							if (err) throw err;
							if(debugMode) console.log(result);
							cb(null);
						});	
					}else if(result.length===0){
						sql = "INSERT INTO product (pName,pLocation,pType,pCost,pPrice,pQuantity,pSize,pColor,pImg,pNote) VALUES ("+db.escape(product.name)+","+db.escape(location)+","+db.escape(product.type)+","+db.escape(product.cost)+","+db.escape(product.price)+","+db.escape(product.shipmentCnt)+","+db.escape(product.size)+","+db.escape(product.color)+","+db.escape(product.img)+","+db.escape(product.note)+")";
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
	var sql = "UPDATE pendinglist SET status = \'已抵達\' WHERE pendingID = "+db.escape(req.body.pendingID);
	console.log(sql)
	db.query(sql, function (err, result, fields) {
		if (err) throw err;
		if(debugMode === 1) console.log(result);
	});
});

router.post('/cancelPending', (req, res) => {
	new Promise(function(resolve){
		var sql = "SELECT * FROM pendinglist WHERE pendingID = " + db.escape(req.body.pendingID);
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
			var sql = "SELECT * FROM product WHERE pid = " + db.escape(product.pid);
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
						sql = "UPDATE product SET pQuantity = " + db.escape(newQuantity) +" WHERE pid = "+ db.escape(result[0].pid);
						console.log(sql);
						db.query(sql, function (err, result, fields) {
							if (err) throw err;
							if(debugMode) console.log(result);
							cb(null);
						});	
					}else if(result.length===0){
						sql = "INSERT INTO product (pName,pLocation,pType,pCost,pPrice,pQuantity,pSize,pColor,pImg,pNote) VALUES ("+db.escape(product.name)+","+db.escape(location)+","+db.escape(product.type)+","+db.escape(product.cost)+","+db.escape(product.price)+","+db.escape(product.shipmentCnt)+","+db.escape(product.size)+","+db.escape(product.color)+","+db.escape(product.img)+","+db.escape(product.note)+")";
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
	

	
	var sql = "DELETE FROM pendinglist WHERE pendingID ="+db.escape(req.body.pendingID);
	console.log(sql)
	db.query(sql, function (err, result, fields) {
		// if (err) throw err;
		if(debugMode === 1) console.log(result);
	});
});

router.post('/getPendingList', (req, res) => {

	var sql = "SELECT * FROM pendinglist";
	new Promise(function(resolve){
		db.query(sql, function (err, result, fields) {
			var response = [];
			if (err) throw err;
			if(debugMode === 1) console.log(result);
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

/*********************************************************************************************/

/*dashboard*/
router.post('/updateDollar', (req, res) => {
	var sql = "UPDATE account SET USDollar="+db.escape(req.body.USDollar)+",TWDollar="+db.escape(req.body.TWDollar)+" WHERE id = 1";
	db.query(sql, function (err, result, fields) {
		if (err) throw err;
		if(debugMode === 1) console.log(result);
		res.send({
			errCode:0
		});
	});
});

router.post('/getDollar', (req, res) => {

	var sql = "SELECT * FROM account WHERE id = 1";
	new Promise(function(resolve){
		db.query(sql, function (err, result, fields) {
			var response = {};
			if (err) throw err;
			if(debugMode === 1) console.log(result);
	        response.USDollar = result[0].USDollar;
	        response.TWDollar = result[0].TWDollar;
	        resolve(response);
		});
	}).then(function(response){
		res.send(response);
	});
});
/*********************************************************************************************/
/*saleTable*/
router.post('/getSaleList', (req, res) => {

	var sql = "SELECT * FROM salelist";
	new Promise(function(resolve){
		db.query(sql, function (err, result, fields) {
			var response = [];
			if (err) throw err;
			if(debugMode === 1) console.log(result);
			for(var i=0; i<result.length; i++){ 
	            response[i] = JSON.parse(result[i].saleForm);
	            response[i].saleId = result[i].saleId;
	            response[i].status = result[i].status;
	        }
	        resolve(response);
		});
	}).then(function(response){
		res.send(response);
	});
});

router.post('/delSaleForm', (req, res) => {

	var sql = "DELETE FROM salelist WHERE saleId ="+db.escape(req.body.id);
	console.log(sql)
	db.query(sql, function (err, result, fields) {
		// if (err) throw err;
		if(debugMode === 1) console.log(result);
	});
});

router.post('/confirmSale', (req, res) => {
	var balanceUS = 0;
	var balanceTW = 0;
	new Promise(function(resolve){
		var sql = "SELECT * FROM salelist WHERE saleId = " + db.escape(req.body.id);
		console.log(sql);
		db.query(sql, function (err, result, fields) {
			if (err) throw err;
			if(debugMode) console.log(result);
			//console.log(result);
			resolve(result);
		});
	}).then(function(result){
		var productList = JSON.parse(result[0].saleForm).productList;
		console.log(productList);
		var sql = "SELECT * FROM account WHERE id = 1";
		db.query(sql, function (err, result, fields) {
			if (err) throw err;
			if(debugMode === 1) console.log(result);
			balanceUS = result[0].USDollar;
			balanceTW = result[0].TWDollar;
			new Promise(function(resolve){
				async.forEachOf(productList,function(product,i,cb){
					if(product.location === '美國'){
						balanceUS = parseInt(balanceUS) + (parseInt(product.price) * parseInt(product.quantity));
					}
					if(product.location === '台灣'){
						balanceTW = parseInt(balanceTW) + (parseInt(product.price) * parseInt(product.quantity));
					}
					cb(null);
				},function(err){
					if(err){
			          //handle the error if the query throws an error
			        }else{
			          //whatever you wanna do after all the iterations are done
			        }
				});
				resolve({
					US: balanceUS,
					TW: balanceTW
				});
			}).then(function(result){
				var sql = "UPDATE account SET USDollar="+db.escape(result.US)+", TWDollar = "+db.escape(result.TW)+" WHERE id = 1";
				db.query(sql, function (err, result, fields) {
					if (err) throw err;
					if(debugMode === 1) console.log(result);
				});
			});
		});
	
	});
	var sql = "UPDATE salelist SET status = \'已銷售\' WHERE saleId = "+db.escape(req.body.id);
	console.log(sql)
	db.query(sql, function (err, result, fields) {
		if (err) throw err;
		if(debugMode === 1) console.log(result);
	});
});

router.post('/cancelSale', (req, res) => {
	new Promise(function(resolve){
		var sql = "SELECT * FROM salelist WHERE saleId = " + db.escape(req.body.id);
		console.log(sql);
		db.query(sql, function (err, result, fields) {
			if (err) throw err;
			if(debugMode) console.log(result);
			//console.log(result);
			resolve(result);
		});
	}).then(function(result){
		var productList = JSON.parse(result[0].saleForm).productList;
		async.forEachOf(productList,function(product,i,cb){
			var sql = "SELECT * FROM product WHERE pid = " + db.escape(product.pid);
			console.log(sql);
			db.query(sql, function (err, result, fields) {
				if (err){ 
					cb(err);
				}else{
					if(debugMode) console.log(result);
					console.log(result);
					if(result.length > 0){
						var newQuantity = parseInt(result[0].pQuantity) + parseInt(product.quantity);
						console.log(newQuantity);
						sql = "UPDATE product SET pQuantity = " + db.escape(newQuantity) +" WHERE pid = "+ db.escape(result[0].pid);
						console.log(sql);
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
	

	
	var sql = "DELETE FROM salelist WHERE salelist ="+db.escape(req.body.id);
	console.log(sql)
	db.query(sql, function (err, result, fields) {
		// if (err) throw err;
		if(debugMode === 1) console.log(result);
	});
});
/***********************************************************************************************/

module.exports = router