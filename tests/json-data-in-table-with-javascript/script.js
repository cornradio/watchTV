
fetch("products.json")//fetching the json file
.then(function(response){
	return response.json();//returning the response as json
})
.then(function(products){//using the json data
	let placeholder = document.querySelector("#data-output");//selecting the placeholder id
	let out = ""; //output template variable
	for(let product of products){//looping through the products
		out += `
			<tr>
				<td> <img src='${product.image}'> </td>
				<td>${product.name}</td>
				<td>${product.price}</td>
				<td>${product.inventory}</td>
				<td>${product.productCode}</td>
			</tr>
		`;
	}

	placeholder.innerHTML = out;//outputting the data to the placeholder
});