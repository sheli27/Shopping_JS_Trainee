//status - 1 (shoplist) | 2 - (done) | 3 - (deleted)
//https://ospanel.io/
add.addEventListener("click",addItem);
edit.addEventListener("click",editItem);
let maxKey = 0;
let actionkey = 0;
let summa = 0;
drow();

function clearInputs(){
	nameItem.value = "";
	quant.value = "";
	price.value = "";
}

function changeStatus(status,key){
	let item = JSON.parse(localStorage.getItem(key));
	item = createObj(item.name,item.quant,item.price,status);
	localStorage.setItem(key,JSON.stringify(item));
}

function createObj(name,quant,price,status){
	let item = {
		name: name,
		quant: quant,
		price: price,
		status: status,
	}
	return item;
}

function editItem(){
	let item = createObj(nameItem.value,quant.value,price.value,1);
	localStorage.setItem(actionkey,JSON.stringify(item));
	drow();
	clearInputs();
	edit.classList.add("hidden");
}

function drowFooter(summa){
	let tr = document.createElement("tr");
	tr.className = "foot";

	let td = document.createElement("td");
	td.setAttribute("colspan",3);
	tr.append(td);

	let td2 = document.createElement("td");
	td2.innerHTML = "Total:";
	tr.append(td2);

	let td3 = document.createElement("td");
	td3.innerHTML = summa + " BYN";
	tr.append(td3);

	return tr;
}

function drowRow(key,buttonsHTML){

	let item = JSON.parse(localStorage.getItem(key));
	let data = [key,item.name,item.quant,item.price,buttonsHTML];

	let tr = document.createElement("tr");

	for (let i = 0; i<data.length; i++) {
		let td = document.createElement("td");
		td.innerHTML = data[i];
		tr.append(td);
	}

	return tr;
}

function drowActionButtons(status,key){
	let buttonsHTML = "";
	if (status===1) {
		buttonsHTML = `
		<button class="abutton green" key="${key}" action="done">+</button>
		<button class="abutton yellow" key="${key}" action="edit">/</button>
		<button class="abutton red" key="${key}" action="deleted">X</button>`;
	}
	if (status===2) {
		buttonsHTML = `<button class="abutton red" key="${key}" action="deleted">X</button>`;
	}
	if (status===3) {
		buttonsHTML = `
		<button class="abutton green" key="${key}" action="done">+</button>
		<button class="abutton red" key="${key}" action="remove">X</button>`;
	}
	return buttonsHTML;
}

function changeStatusPage(status){
	switch (status) {
	    case 1:
	    	statuspage.innerHTML = "Shopping List";
	    break;
	    case 2:
	    	statuspage.innerHTML = "Done List";
	    break;
	    case 3:
	    	statuspage.innerHTML = "Deleted List";
	    break;
	}
}

function drow(status){
	if (status===undefined) status = 1;
	changeStatusPage(status);
	summa = 0;
	main.innerHTML = "";
	for (let i = 0; i<localStorage.length; i++){
		let key = localStorage.key(i);
		let item = JSON.parse(localStorage.getItem(key));

		let buttonsHTML = drowActionButtons(status,key);

		if (item.status === status) {
			summa += item.quant*item.price;
			main.append(drowRow(key,buttonsHTML));
		}
	}

	main.append(drowFooter(summa));
}

menu.onclick = function(event){
	let target = event.target;
	if(target.tagName != "BUTTON") return;
	if (target.hasAttribute("status")) {
		let status = +target.getAttribute("status");
		if (status===1) drow(1);
		if (status===2) drow(2);
		if (status===3) drow(3);
	}
}

document.onclick = function(event){
	let target = event.target;
	if(target.tagName != "BUTTON") return;

	if (target.hasAttribute("key")) {

		let key = +target.getAttribute("key");
		actionkey = key;

		if (target.hasAttribute("action")) {

			switch (target.getAttribute("action")) {
			    case "edit":
			    	let item = JSON.parse(localStorage.getItem(actionkey));
					nameItem.value = item.name;
					quant.value = item.quant;
					price.value = item.price;
					edit.classList.remove("hidden");
			    break;
			    case "done":
			    	changeStatus(2,key);
			    	drow();
			    break;
			    case "deleted":
			    	changeStatus(3,key);
			    	drow();
			    break;
			    case "remove":
			    	localStorage.removeItem(key);
			    	drow();
			    break;
			}

		}
	}
}

function getMaxKey(){
	for (let i = 0; i<localStorage.length; i++){
		let key = localStorage.key(i);
		key = parseInt(key);
		if (key>maxKey) {
			maxKey = key;
		}
	}
	maxKey++;
}

function addItem() {
	getMaxKey();
	let item = createObj(nameItem.value,quant.value,price.value,1);
	localStorage.setItem(maxKey,JSON.stringify(item));
	drow();
	clearInputs();
}

