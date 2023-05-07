
	let productsTable = $("<table>");
	let productsTableBody = $("<tbody>");
	let productsDiv = $("#productsListDiv");
	let productsPagesDiv = $("<div class='navDiv'>");
let fullProductsList = []
let currentProductsList = [];
let currentPage;

let startTime = new Date().getTime();
$.get("/getProducts").done(function(productsList) {
	fullProductsList = productsList;
	generate(productsList)
});

//This will generate the page with default options
function generate(productsList) {
	let finishTime = new Date().getTime()-startTime;
	currentProductsList = productsList;

	productsDiv.empty();
	productsTable.empty();
	//Adds heading to table
	productsTable.append(`<thead><th>Image</th><th>Name</th><th>Price</th><th>Rating</th><th>Stock Level</th><th>Brand</th><th>Category</th><th>Actions</th></thead>`);

	//Adds page numbers
	createPages(productsList);

	productsTable.append(productsTableBody);

	//Adds divs to page
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
	else{numberOfPages=(currentProductsList.length/10)+1}

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
	let currentLimit;
	let numberOfPages = $(".pageNumber").length;
	if(pageNumber > numberOfPages) {pageNumber=1}
	else if(pageNumber < 1) {pageNumber=numberOfPages}
	productsTableBody.empty();
	//Checks how many products should be on the current page
	if(pageNumber == numberOfPages) {currentLimit=((pageNumber-1)*10)+(currentProductsList.length%10)}
	else{currentLimit=(pageNumber*10)}
	//Adds products from current page to page
	for(let i = (pageNumber*10)-10;i<currentLimit;i++) {
		productsTableBody.append(`<tr><td class="thumbnailColumn"><img src="`+currentProductsList[i].thumbnail+`" alt="`+currentProductsList[i].title+` thumbnail" width="100%" ></td><td><a tabindex="0" onclick="getProduct(`+currentProductsList[i].id+`)">`+currentProductsList[i].title+`</a></td><td>RRP: <span class="originalPrice">€`+currentProductsList[i].price+`</span> - `+currentProductsList[i].discountPercentage+`%</br><span class="saleSpan">Sale Price: €`+((currentProductsList[i].price/100)*(100-currentProductsList[i].discountPercentage)).toFixed(2)+`</span></td><td>`+currentProductsList[i].rating+`</td><td>`+currentProductsList[i].stock+`</td><td>`+currentProductsList[i].brand+`</td><td>`+currentProductsList[i].category+`</td><td><button class="productActions" onclick="updateProduct(`+i+`)">Update `+currentProductsList[i].title+`</button></br><button class="productActions" onclick="deleteProduct(`+currentProductsList[i].id+`)">Delete `+currentProductsList[i].title+`</button></td></tr>`)
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

//Restores all products to their default values
function restoreProducts() {
	$.get("/restoreProducts").done(function() {
		startTime = new Date().getTime();
		$.get("/getProducts").done(function(productsList) {
			fullProductsList = productsList;
			generate(productsList)
		}).fail(function(ex) {
			console.error(ex);
			alert("Sorry we couldn't get our products");
		})
	}).fail(function(ex) {
		console.error(ex);
		alert("Sorry something went wrong trying to reset the products list")
	});
}


function updateProduct(id) {
	generateForm(currentProductsList[id]);
}

function deleteProduct(id) {
	let body={
		productId:id
	};
	$.ajax({
		url:"/deleteProduct",
		type:"DELETE",
		data:body
	}).done(function() {
		let url = $(location).attr("href");
		if(url.split("/")[-1] != "product") {
$.get("/getProducts").done(function(productsList) {
			fullProductsList = productsList;
			generate(productsList)
		});
	}
		else {
			$.get("/");
		}
	}).fail(function(ex) {
		console.log("failed");
	});
}

//This will add a form to the page
function generateForm(product={id:0,title:"",description:"",price:0,discountPercentage:0,rating:1,stock:0,brand:"",category:"",thumbnail:"https://",images:["https://","https://"]}) {
	$(".formModalDiv").empty();
	$(".formModalDiv").append(`
		<form class="productForm">
			<span class="closeForm" tabindex="0" onclick="closeForm()">&times;</span>
			<input id="productId" type="hidden" value="`+product.id+`">
			<label for="productTitle">Name:</label>
			<input id="productTitle" type="text" value="`+product.title+`" required></br>
			<label for="productDescription">Description:</label>
			<input id="productDescription" type="text" value="`+product.description+`" required></br>
			<label for="productPrice">Price: €</label>
			<input id="productPrice" type="number" value="`+product.price+`" min="0" step="0.01" required></br>
			<label for="productDiscountPercentage">Discount:</label>
			<input id="productDiscountPercentage" type="number" value="`+product.discountPercentage+`" min="0" max="100" step="0.01">%</br>
			<label for="productRating">Rating:</label>
			<input id="productRating" type="number" value="`+product.rating+`" min="1" max="5" step="0.01" required>/5</br>
			<label for="productStock">Stock:</label>
			<input id="productStock" type="number" value="`+product.stock+`" min="0" required></br>
			<label for="productBrand">Brand:</label>
			<input id="productBrand" type="text" value="`+product.brand+`" required></br>
			<label for="productCategory">Category:</label>
			<input id="productCategory" type="text" value="`+product.category+`"></br>
			<label for="productThumbnail">Thumbnail:</label>
			<input id="productThumbnail" type="url" value="`+product.thumbnail+`" required></br>
			<label for="productImages">Images:</label>
			<input id="productImages" type="text" value="`+product.images.join()+`" required></br></br>
			<input type="button" value="Save" onclick="saveProduct()">
			<input type="reset">
		</form>
	`);
	//Makes div visible
	$(".formModalDiv").css({"display":"flex"});
	//Moves users focus to form
	$("#productTitle").focus();
	//Sets validation rules
	$(".productForm").validate({
		rules:{
			productTitle:"required",
			productDescription:"required",
			productPrice:{
				required:true,
				min:0,
				step:0.01,
			},
			productDiscountPercentage:{
				min:0,
				max:100,
				step:0.01,
			},
			productRating:{
				required:true,
				min:1,
				max:5,
			},
			productStock:{
				required:true,
				min:0,
			},
			productBrand:"required",
			productThumbnail:{
				required:true,
				url:true,
			},
			productImages:"required",
		}
});
}

	//Defines function for when form is submitted
function saveProduct() {
	//Checks if form is valid
	if(!$(".productForm").valid()) {
		return;
	}

	let product={
		id:$("#productId").val(),
		title:$("#productTitle").val(),
		description:$("#productDescription").val(),
		price:$("#productPrice").val(),
		discountPercentage:$("#productDiscountPercentage").val(),
		rating:$("#productRating").val(),
		stock:$("#productStock").val(),
		brand:$("#productBrand").val(),
		category:$("#productCategory").val(),
		thumbnail:$("#productThumbnail").val(),
		images:$("#productImages").val()
	}
	//Sends put request
	$.ajax({
		url:"/saveProduct",
		type:"PUT",
		data:product
	}).done(function() {
		startTime = new Date().getTime();
		$.get("/getProducts").done(function(productsList) {
			fullProductsList = productsList;
			alert("Your product was saved!");
			closeForm();
			generate(productsList)
		});
	}).fail(function(ex) {
		console.error(ex);
		alert("Sorry something went wrong while saving your product");
	})
}


//This will add a form to the page
function addFilterForm() {
	$(".formModalDiv").empty();
	$(".formModalDiv").append(`
		<form class="productForm">
			<span class="closeForm" tabindex="0" onclick="closeForm()">&times;</span>
			<label for="brandDropDown">Brand:</label>
			<select id="brandDropDown"></select></br>
			<label for="categoryDropDown">Category:</label>
			<select id="categoryDropDown"></select></br></br>
			<input type="button" value="Search" onclick="filterProducts()">
			<input type="reset">
		</form>
	`);
	//Adds dropdown options
	addOptions();
	//Makes div visible
	$(".formModalDiv").css({"display":"flex"});
	//Moves users focus to form
	$("#brandDropDown").focus();
}

//Adds the option elements to dropdowns for filtering
function addOptions() {
	//Gets filter options
	let brandOptionsSet = new Set(fullProductsList.map(product => product.brand));
	let brandOptions = [...brandOptionsSet];
	brandOptions.sort((a,b) => {
		return a.localeCompare(b,undefined,{sensitivity:"base"});
	});
	//Makes sure the all option is always at the start
	brandOptions.unshift("All");
	let categoryOptionsSet = new Set(fullProductsList.map(product => product.category));
	let categoryOptions = [...categoryOptionsSet];
	categoryOptions.sort((a,b) => {
		return a.localeCompare(b,undefined,{sensitivity:"base"});
	});
	categoryOptions.unshift("All");
	//Adds brand options
	for(let brand of brandOptions) {
		$("#brandDropDown").append(new Option(brand));
	}
	//Adds category options
	for(let category of categoryOptions) {
		$("#categoryDropDown").append(new Option(category));
	}
}

//Defines function for when form is submitted
function filterProducts() {
	startTime = new Date().getTime();
	let brandOption = $("#brandDropDown").val()
	let categoryOption = $("#categoryDropDown").val();
	let productsList = [];
	if(brandOption=="All" && categoryOption=="All") {
		//Gets all products
		productsList = fullProductsList;
	}
	if(brandOption!="All") {
		productsList = fullProductsList.filter(product => product.brand == brandOption);
	}
	else {
		//This sets the array to contain every element so the next check can work
		productsList = fullProductsList;
	}
	if(categoryOption!="All") {
		productsList = productsList.filter(product => product.category == categoryOption);
	}
	//Closes form
	closeForm();
	//Filters
	generate(productsList);

}

//Hides the form and modal
function closeForm() {
	$(".formModalDiv").css({"display":"none"});
}