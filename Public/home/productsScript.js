
	let productsTable = $("<table>");
	let productsTableBody = $("<tbody>");
	let productsDiv = $("#productsListDiv");
	let productsPagesDiv = $("<div class='navDiv'>");
let fullProductsList = []
let currentProductsList = [];
let currentPage;

let startTime = new Date().getTime();
$.get("/getProducts").done(function(productsList) {generate(productsList)});

//This will generate the page with default options
function generate(productsList) {
	let finishTime = new Date().getTime()-startTime;
	fullProductsList = productsList;
	currentProductsList = productsList;

	productsDiv.empty();
	//Adds heading to table
	productsTable.append(`<thead><th>Image</th><th>Name</th><th>Price</th><th>Rating</th><th>Stock Level</th><th>Brand</th><th>Category</th><th>Actions</th></thead>`);

	//Adds page numbers
	createPages(productsList);

	productsTable.append(productsTableBody);

	//Adds table to page
	productsDiv.append(productsTable);
	productsDiv.append(productsPagesDiv);
	productsDiv.append(`<p class="timeToLoad">It took `+finishTime+`ms to load our products </p>`);
}

//This function will get a product
function getProduct(productId) {
	let body={
		productId:productId
	};
	$.post("/",body).done(function() {
		window.location.replace("/product");
	});
}

//Adds page numbers and goes to first page
function createPages(productsList) {
	productsPagesDiv.empty();
//Checks how many pages to create
	if(currentProductsList.length%10==0) {numberOfPages=currentProductsList.length/10}
	else{numberOfPages=(currentProductsList.length/10)+1+1}

	//Adds previous page arrow
	productsPagesDiv.append(`<span class="navButtons" tabindex="0" onclick="changePageUsingArrows(-1)">&#8592;</span>`);

	//Loops to create page numbers
	for(let i = 1;i<=numberOfPages;i++) {
		//Adds page Numbers
		productsPagesDiv.append(`<span id="pageNumber`+i+`" class="pageNumber" tabindex="0" onclick="changeCurrentPage(`+i+`)">`+i+`</span>`);
	}

	//Adds next page navigation arrow
	productsPagesDiv.append(`
		<span class="navButtons" tabindex="0" onclick="changePageUsingArrows(1)">&#8594;</span>
	`);

	//Goes to the first page and uses setTimeout to ensure styling is after css has been applied
setTimeout(function(){changeCurrentPage(1)},100);
}

//Function for navigating with arrows
function changePageUsingArrows(num) {
	changeCurrentPage(currentPage+num);
}

//Changes the products to reflect the current page
function changeCurrentPage(pageNumber) {
	let numberOfPages = $(".pageNumber").length;
	if(pageNumber > numberOfPages) {pageNumber=1}
	else if(pageNumber < 1) {pageNumber=numberOfPages}
	productsTableBody.empty();
	//Adds products from current page to page
	for(let i = (pageNumber*10)-10;i<pageNumber*10;i++) {
		productsTableBody.append(`<tr><td class="thumbnailColumn"><img src="`+currentProductsList[i].thumbnail+`" alt="`+currentProductsList[i].title+` thumbnail" width="100%" ></td><td><a tabindex="0" onclick="getProduct(`+currentProductsList[i].id+`)">`+currentProductsList[i].title+`</a></td><td>RRP: <span class="originalPrice">€`+currentProductsList[i].price+`</span> - `+currentProductsList[i].discountPercentage+`%</br><span class="saleSpan">Sale Price: €`+((currentProductsList[i].price/100)*(100-currentProductsList[i].discountPercentage)).toFixed(2)+`</span></td><td>`+currentProductsList[i].rating+`</td><td>`+currentProductsList[i].stock+`</td><td>`+currentProductsList[i].brand+`</td><td>`+currentProductsList[i].category+`</td><td><button class="productActions" onclick="updateProduct(`+currentProductsList[i].id+`)">Update `+currentProductsList[i].title+`</button></br><button class="productActions" onclick="deleteProduct(`+currentProductsList[i].id+`)">Delete `+currentProductsList[i].title+`</button></td></tr>`)
	}

	//Resets page number styles
	$(".pageNumber").css({"background-color":"lightgray","color":"black"});
	//Clears aria-current
	$(".pageNumber").attr("aria-current",false);

	//Changes highlighted number
	$("#pageNumber"+pageNumber).css({"background-color":"black","color":"lightgray"});
	//This lets screen readers know what page is selected
$("#pageNumber"+pageNumber).attr("aria-current",true);
	//Sets page number
	currentPage = pageNumber;

}
