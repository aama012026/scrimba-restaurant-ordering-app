import { menuArray } from "./assets/product-data.js";
const productMenu = document.getElementById('product-menu');
const productTemplate = document.getElementById('product-template');

// Infrastrukturen for å converte er ikkje laga,
// men det gir mening å separere representasjon frå verdi.
let currency = '$'

console.log(productTemplate)

function makeMenuItemHtml(menuItem) {
	const {id, name, emoji, ingredients, price} = menuItem;
	const menuItemElement = document.importNode(productTemplate.content, true);
	menuItemElement.querySelector('.img').textContent = emoji;
	menuItemElement.querySelector('.name').textContent = name;
	menuItemElement.querySelector('.ingredients').textContent = ingredients.join(', ');
	menuItemElement.querySelector('.price').textContent = currency + price;
	return menuItemElement;
}

function renderMenuItems(itemArray) {
	const horizontalRule = document.createElement('hr');
	horizontalRule.classList.add('slim');
	itemArray.forEach((item, i) => {
		productMenu.appendChild(makeMenuItemHtml(item));
		console.log(i);
		console.log(itemArray.length);
		if (i != itemArray.length-1) {
			productMenu.appendChild(horizontalRule.cloneNode(true));
		}
	});
}

renderMenuItems(menuArray);