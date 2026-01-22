import { menuArray } from "./assets/product-data";
const productMenu = document.getElementById('product-menu');

function makeMenuItemHtml(menuItem) {
	const {id, name, emoji, ingredients, price} = menuItem;
	const menuItemElement = document.createElement('li');
}