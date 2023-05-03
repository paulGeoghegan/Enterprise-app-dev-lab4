require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

//Creates connection
connectToDB().catch((ex) => console.log(ex));
async function connectToDB() {
	await mongoose.connect("mongodb+srv://"+process.env.dbusername+":"+process.env.dbpassword+"@enterprise-app-dev-lab4.0ypp8d4.mongodb.net/?retryWrites=true&w=majority");
	console.log("Connected to MongoDB")
}
const app = express();
app.use(express.static(__dirname + "/Public"));

app.listen(3000, function() {
	console.log('Server running on port 3000');
});

app.get("/",function(req,res) {
	res.sendFile(__dirname+"/Public/home/index.html")
});
