
let startTime = new Date().getTime();

$.get("/getProducts").done(async function(productsList) {
	let finishTime = new Date().getTime()-startTime;
	const productsTable = $("table");
	let productsDiv = $("#productsListDiv");
	productsDiv.empty();
	productsDiv.append(`<p>It took `+finishTime+`ms to load our products </p>`);
	//Adds heading to table
	productsTable.append(`<thead><th>Image</th><th>Name</th><th>Price</th><th>Rating</th><th>Stock Level</th><th>Brand</th><th>Category</th></thead>`);

	//Adds table to page
	productsDiv.append(productsTable);
});