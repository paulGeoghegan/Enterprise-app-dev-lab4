const express = require("express");
const mongoose = require("mongoose");
const db = require("./dbManager");

const app = express();
app.use(express.static(__dirname + "/Public"));

app.listen(3000, function() {
	console.log('Server running on port 3000');
});

app.get("/",async function(req,res) {
	await db.getAllItems();
	res.sendFile(__dirname+"/Public/home/index.html")
});

app.get("/getProducts",async function(req,res) {
	const productList = await db.getAllItems();
	res.send(productList);
});