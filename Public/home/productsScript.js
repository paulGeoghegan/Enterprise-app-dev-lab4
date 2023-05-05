
let startTime = new Date().getTime();

$.get("/getProducts").done(async function(productsList) {
	let finishTime = new Date().getTime()-startTime;
	let productsTable = $("<table>");
	let productsTableBody = $("<tbody>");
	let productsDiv = $("#productsListDiv");
	productsDiv.empty();
	productsDiv.append(`<p>It took `+finishTime+`ms to load our products </p>`);
	//Adds heading to table
	productsTable.append(`<thead><th>Image</th><th>Name</th><th>Price</th><th>Rating</th><th>Stock Level</th><th>Brand</th><th>Category</th></thead>`);
	productsTable.append(productsTableBody);


	//Loops through products list
	for(let item of productsList) {
		productsTableBody.append(`<tr><td class="thumbnailColumn"><img src="`+item.thumbnail+`" alt="`+item.title+` thumbnail" width="100%" width="100%"></td><td><a tabindex="0" onclick="getProduct(`+item.id+`)">`+item.title+`</a></td><td>RRP: <span class="originalPrice">€`+item.price+`</span> - `+item.discountPercentage+`%</br><span class="saleSpan">Sale Price: €`+((item.price/100)*(100-item.discountPercentage)).toFixed(2)+`</span></td><td>`+item.rating+`</td><td>`+item.stock+`</td><td>`+item.brand+`</td><td>`+item.category+`</td></tr>`)
	}

	//Adds table to page
	productsDiv.append(productsTable);
});

//This function will get a product
function getProduct(productId) {
	let body={
		productId:productId
	};
	$.post("/",body).done(function() {
		window.location.replace("/product");
	});
}