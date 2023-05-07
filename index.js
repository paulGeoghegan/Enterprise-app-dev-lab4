const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const db = require("./dbManager");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/Public"));
app.use(session({
	secret: process.env.appsecret,
	saveUninitialized: true,
	resave: true
}));

app.listen(3000, function() {
	console.log('Server running on port 3000');
});

app.get("/",function(req,res) {
	res.sendFile(__dirname+"/Public/home/index.html")
});

app.post("/",function(req,res) {
	req.session.productId = req.body.productId;
	res.status(200).send("Success");
});

//Deletes a product
app.delete("/deleteProduct",async function(req,res) {
	db.deleteProduct(req.body.productId).catch(function(ex) {
		console.error(ex);
		res.status(500).send(ex);
	});
	res.status(200).send("Success");
});

//Gets one product
app.get("/getProduct",async function(req,res) {
	console.log("id:"+req.session.productId);
	const product = await db.getItem(req.session.productId)
		.catch(function(ex) {
			console.error(ex);
			res.status(500).send(ex);
		});
	res.status(200).send(product);
})

//Gets all products
app.get("/getProducts",async function(req,res) {
	const productList = await db.getAllItems();
	res.send(productList);
});

app.get("/product",function(req,res) {
	res.sendFile(__dirname+"/Public/product/product.html");
});

app.get("/restoreProducts",async function(req,res) {
	await db.restoreProducts().catch(function(ex) {
		console.error(ex);
		res.status(500).send(ex);
	});
	res.status(200).send("success");
});

//Saves a product
app.put("/saveProduct",async function(req,res) {
	let product = req.body;
	//This checks if the product is being created or updated
	if(product.id == 0) {
		await db.newItem(product).catch(function(ex) {
			console.error(ex);
			res.status(500).send(ex)
		});
	}
	else {
		await db.updateItem(product).catch(function(ex) {
			console.error(ex);
			res.status(500).send(ex);
		});
	}
	res.status(200).send("success");
});