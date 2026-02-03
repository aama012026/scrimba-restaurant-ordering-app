import { menuArray } from "./assets/product-data.js";
const productMenu = document.getElementById('product-menu');
const productTemplate = document.getElementById('product-template');
const checkoutSection = document.getElementById('checkout');
const checkoutList = document.getElementById('checkout-list');
const checkoutEntryTemplate = document.getElementById('checkout-entry-template');
const checkoutSumTemplate = document.getElementById('checkout-sum-template');
const paymentDialog = document.getElementById('payment-mockup');
const paymentForm = document.forms["payment-details"];
const btnSubmit = paymentForm.querySelector('button[type="submit"]');
const orderCompleteSection = document.getElementById('order-complete');

const menuElements = [];
const cart = [];

// Infrastrukturen for å converte er ikkje laga,
// men det gir meining å separere representasjon frå verdi.
let currency = '$'
onLoad();
productMenu.addEventListener('click', (e) => {
	if (e.target.classList.contains('add')) {
		addToOrder(e.target.parentElement.dataset.productId, cart);
	}
	else if (e.target.classList.contains('remove')) {
		removeFromOrder(e.target.parentElement.dataset.productId, cart);
	}
})

checkoutSection.addEventListener('click', (e) => {
	if (e.target.classList.contains('remove-simple')) {
		removeFromOrder(e.target.parentElement.dataset.productId, cart);
	}
	else if (e.target.id === "btn-order") {
		paymentDialog.showModal();
	}
})
paymentForm.addEventListener('input', () => {
	btnSubmit.disabled = !paymentForm.checkValidity();
})
paymentDialog.addEventListener('submit', (e) => {
	e.preventDefault();
	cart.forEach((v, i) => cart[i] = 0);
	productMenu.querySelectorAll('button').forEach((el) => el.disabled = true);
	const horizontalRule = document.createElement('hr');
	horizontalRule.classList.add('slim');
	productMenu.appendChild(horizontalRule.cloneNode(true));
	orderCompleteSection.textContent =
	`Thanks, ${paymentForm.elements['card-name'].value}! Your order is on its way!`;
	orderCompleteSection.classList.toggle('not-displayed')
	paymentForm.reset();
	paymentDialog.close();
	renderUpdate(menuArray, menuElements, cart);
})

function onLoad() {
	menuArray.forEach(item => {
		cart[item.id] = 0;
	});
	renderMenuItems(menuArray, menuElements, cart);	
}	
function makeMenuItemFragment(menuItem) {
	const {id, name, emoji, ingredients, price} = menuItem;
	const menuItemFragment = document.importNode(productTemplate.content, true);
	menuItemFragment.querySelector('li').dataset.productId = id;
	menuItemFragment.querySelector('.icon').textContent = emoji;
	menuItemFragment.querySelector('.name').textContent = name;
	menuItemFragment.querySelector('.ingredients').textContent = ingredients.join(', ');
	menuItemFragment.querySelector('.price').textContent = currency + price;
	menuItemFragment.querySelector('.add').ariaLabel = `Add one ${name}`;
	menuItemFragment.querySelector('.remove').ariaLabel = `Remove one ${name}`;
	return menuItemFragment;
}

function makeCheckoutEntryFragment(menuItem, count) {
	const {id, name, price} = menuItem;
	const checkoutEntryFragment = document.importNode(checkoutEntryTemplate.content, true);
	checkoutEntryFragment.querySelector('li').dataset.productId = id;
	checkoutEntryFragment.querySelector('.remove-simple').ariaLabel = `Remove one ${name}`;
	if (count === 1) {
		checkoutEntryFragment.querySelector('.name').textContent = name;
		checkoutEntryFragment.querySelector('.price').textContent = currency + price;

	}
	else {
		checkoutEntryFragment.querySelector('.name').textContent = `${name} (${count})`;
		checkoutEntryFragment.querySelector('.price').textContent = currency + (price * count);
	}
	return checkoutEntryFragment;
}

function makeCheckoutSumFragment(price) {
	const checkoutSumFragment = document.importNode(checkoutSumTemplate.content, true);
	checkoutSumFragment.querySelector('.price').textContent = currency + price;
	return checkoutSumFragment;
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
		renderUpdate(itemArray, elementArray, order)
	});
}

function renderUpdate(menuArray, elementArray, order) {
	elementArray.forEach((element) => {
		const shouldShow = order[element.dataset.productId] > 0 ? 'visible' : 'hidden';
		element.querySelector('.remove').style.visibility = shouldShow;
	})
	checkoutList.innerHTML = '';
	let cartIsEmpty = true;
	let totalPrice = 0;
	order.forEach((count, id) => {
		if (count > 0) {
			const productData = menuArray.find((item) => item.id === id);
			const fragmet = makeCheckoutEntryFragment(productData, count);
			totalPrice += productData.price * count;
			checkoutList.appendChild(fragmet);
			cartIsEmpty = false;
		}
	})
	checkoutSection.style.display = cartIsEmpty ? "none" : "block";
	checkoutList.appendChild(makeCheckoutSumFragment(totalPrice));
}

function addToOrder(productId, order) {
	const previousValue = order[productId];
	order[productId]++;	
	renderUpdate(menuArray, menuElements, cart);
}
function removeFromOrder(productId, order) {
	order[productId]--;
	if (order[productId] <= 0) {
		order[productId] = 0;
	}
	renderUpdate(menuArray, menuElements, cart);
}