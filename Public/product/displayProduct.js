let startTime = new Date().getTime();

$.get("/getProduct").done(function(product) {
	let finishTime = new Date().getTime()-startTime;
	let div = $("#productInfo");
	let imagesDiv = $("<div class='imagesDiv'>");
	let imagesNavDiv = $("<div class='navDiv'>");
	div.empty();

	//Adds go back button
	div.append(`<a href="/">Go Back</a>`);

	//Adds images to the page and control dots
	for(let i = 0;i < product.images.length;i++) {
		imagesDiv.append(`
			<div id="image`+(i+1)+`" class="img">
				<img src="`+product.images[i]+`" alt="Image `+(i+1)+` of `+product.title+`" height="100%">
			</div>
		`);
		//Adds navigation dot
		imagesNavDiv.append(`<span id="imageDot`+(i+1)+`" class="navDot" onclick="changeCurrentImage(`+(i+1)+`)">`+(i+1)+`</span>`);
	}
	//Adds previous and next buttons
	imagesNavDiv.append(`
		</br>
		<span class="navButtons" onclick="changeImageUsingArrows(-1)">&#8592;</span>
		<span id="currentSlideNumber">1</span>/`+product.images.length+`
		<span class="navButtons" onclick="changeImageUsingArrows(1)">&#8594;</span>
	`);

	imagesDiv.append(imagesNavDiv);
	div.append(imagesDiv);
	div.append(`
		<div id="infoDiv">
			<h1>`+product.title+`</h1>
			<p>
				`+product.description+`</br>
				RRP: <span class="originalPrice">€`+product.price+`</span> - `+product.discountPercentage+`%</br>
				<span class="saleSpan">Sale Price €`+((product.price/100)*(100-product.discountPercentage)).toFixed(2)+`</span></br>
				Rated: `+product.rating+`/5</br>
				Stock: `+product.stock+`</br>
				Brand: `+product.brand+`</br>
				Category: `+product.category+`</br>
			</p>
		</div>
	`);
	div.append(`<p class="timeToLoad">It took `+finishTime+`ms to load this product</p>`);
	//Sets default image
	changeCurrentImage(1);
});

//Changes image with arrows
function changeImageUsingArrows(num) {
	changeCurrentImage(parseInt($("#currentSlideNumber").text())+num);
}

//Changes the current image
function changeCurrentImage(imageId) {
	let images = $(".img");
	if(imageId<1) {imageId=images.length}
	if(imageId>images.length){imageId=1}
	//Hides all the images
	$(".img").css("display","none");
	//Displays selected image
	$("#image"+imageId).css("display","block");
	$(".navDot").css("background-color","lightgray");
	$("#imageDot"+imageId).css("background-color","black");
	$("#currentSlideNumber").text(imageId);
}