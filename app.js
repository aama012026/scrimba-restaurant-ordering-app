import { menuArray } from "./assets/product-data.js";
const productMenu = document.getElementById('product-menu');
const productTemplate = document.getElementById('product-template');

console.log(productTemplate)

function makeMenuItemHtml(menuItem) {
	const {id, name, emoji, ingredients, price} = menuItem;
	const menuItemElement = document.importNode(productTemplate.content, true);
	menuItemElement.querySelector('.img').textContent = emoji;
	menuItemElement.querySelector('.name').textContent = name;
	menuItemElement.querySelector('.ingredients').textContent = ingredients.join(', ');
	menuItemElement.querySelector('.price').textContent = price;
	return menuItemElement;
}

function renderMenuItems(itemArray) {
	itemArray.forEach(item => {
		productMenu.appendChild(makeMenuItemHtml(item));
	});
}

renderMenuItems(menuArray);