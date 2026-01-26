import { menuArray } from "./assets/product-data.js";
const productMenu = document.getElementById('product-menu');
const productTemplate = document.getElementById('product-template');
const menuElements = [];
const cart = [];

// Infrastrukturen for å converte er ikkje laga,
// men det gir mening å separere representasjon frå verdi.
let currency = '$'
onLoad();
productMenu.addEventListener('click', (e) => {
	if (e.target.classList.contains('add')) {
		addToOrder(e.target.parentElement.dataset.productId, cart);
	}
	else if (e.target.classList.contains('remove')) {

	}
})

function onLoad() {
	menuArray.forEach(item => {
		cart[item.id] = 0;
	});
	renderMenuItems(menuArray, menuElements, cart);	
}	
function makeMenuItemFragment(menuItem) {
	const {id, name, emoji, ingredients, price} = menuItem;
	const menuItemElement = document.importNode(productTemplate.content, true);
	menuItemElement.querySelector('li').dataset.productId = id;
	menuItemElement.querySelector('.img').textContent = emoji;
	menuItemElement.querySelector('.name').textContent = name;
	menuItemElement.querySelector('.ingredients').textContent = ingredients.join(', ');
	menuItemElement.querySelector('.price').textContent = currency + price;
	return menuItemElement;
}

function renderMenuItems(itemArray, elementArray, order) {
	const horizontalRule = document.createElement('hr');
	horizontalRule.classList.add('slim');

	productMenu.innerHTML = null;
	itemArray.forEach((item, i) => {
		// Fragmentet blir brukt opp ved append. Vi hukar tak i li i staden som ein referanse.
		const fragment = makeMenuItemFragment(item);
		const liElement = fragment.querySelector('li');
		productMenu.appendChild(fragment);
		elementArray[item.id] = liElement;
		if (i != itemArray.length-1) {
			productMenu.appendChild(horizontalRule.cloneNode(true));
		}
		renderUpdate(elementArray, order)
	});
}
//Noko funkar ikkje, mogleg det framleis er fragment/element-feil.
function renderUpdate(menuElements, order) {
	menuElements.forEach((element) => {
		const shouldShow = order[element.dataset.productId] > 0 ? 'visible' : 'hidden';
		element.querySelector('.remove').style.visibility = shouldShow;
	})
}

function addToOrder(productId, order) {
	const previousValue = order[productId];
	order[productId]++;	
	if (previousValue <= 0) {
		renderUpdate(menuElements, cart);
	}
}
function removeFromOrder(productId, order) {
	order[productId]--;
	if (order[productId] <= 0) {
		order[productId] = 0;
		renderUpdate();
	}
}