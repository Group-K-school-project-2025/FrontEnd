// Define the emptyCartHTML function
function emptyCartHTML() {
  return `
    <div class="empty-cart-message">
      <img src="images/WhiteFigure1.png" alt="Empty Cart" class="mb-3" style="width: 150px;">
      <p>Sorry, Your cart is currently empty<br></p>
      <a href="Category.html" class="go-shopping">Browse Templates</a>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", async function () {
  const userId = localStorage.getItem('userId');
  const cartItemsFromLocal = JSON.parse(localStorage.getItem('cart')) || [];
  const container = document.querySelector('.cart-items');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  let total = 0;

  if (userId) {
    try {
      const response = await fetch(`https://backend-7hqy.onrender.com/cart/${userId}`);
      const items = await response.json();

      if (!Array.isArray(items) || items.length === 0) {
        showEmptyCart(container, cartTotal, checkoutBtn);
        return;
      }

      items.forEach((item, index) => {
        if (typeof item.price === 'number' && typeof item.quantity === 'number') {
          total += item.price * item.quantity;
          container.appendChild(createCartItemHTML(item.image_url, item.title, item.price, item.quantity, index, true));
        }
      });

      cartTotal.textContent = `€${total.toFixed(2)}`;
    } catch (err) {
      console.error("Error loading cart from database:", err);
      showEmptyCart(container, cartTotal, checkoutBtn);
    }
  } else {
    if (cartItemsFromLocal.length === 0) {
      showEmptyCart(container, cartTotal, checkoutBtn);
      return;
    }

    cartItemsFromLocal.forEach((item, index) => {
      const price = parseFloat(item.price);
      if (!isNaN(price)) {
        total += price;
        container.appendChild(createCartItemHTML(item.img, item.name, price, 1, index, false));
      }
    });

    cartTotal.textContent = `€${total.toFixed(2)}`;
  }
});

// Create a cart item HTML element
function createCartItemHTML(imgSrc, title, price, quantity, index, fromDatabase) {
  const itemDiv = document.createElement('div');
  itemDiv.className = 'cart-item d-flex justify-content-between align-items-center mb-3';
  itemDiv.innerHTML = `
    <img src="${fromDatabase ? `https://backend-7hqy.onrender.com/${imgSrc}` : imgSrc}" alt="${title}" />
    <div>
      <h5>${title}</h5>
      <p>€${price.toFixed(2)} ${quantity > 1 ? `x ${quantity}` : ''}</p>
    </div>
    <button class="btn btn-danger btn-sm" onclick="removeProduct(${index})">✖</button>
  `;
  return itemDiv;
}

// Display empty cart
function showEmptyCart(container, cartTotal, checkoutBtn) {
  container.innerHTML = emptyCartHTML();
  cartTotal.textContent = "€0.00";
  if (checkoutBtn) checkoutBtn.disabled = true;
}

// Function to remove product from the cart (localStorage version)
function removeProduct(index) {
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  cartItems.splice(index, 1); // Remove product
  localStorage.setItem('cart', JSON.stringify(cartItems)); // Update storage
  displayCart(); // Refresh cart view
}

// Display the cart based on localStorage
function displayCart() {
  const container = document.querySelector('.cart-items');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  let total = 0;

  container.innerHTML = '';

  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  if (cartItems.length === 0) {
    showEmptyCart(container, cartTotal, checkoutBtn);
    return;
  }

  cartItems.forEach((item, index) => {
    const price = parseFloat(item.price);
    if (!isNaN(price)) {
      total += price;
      container.appendChild(createCartItemHTML(item.img, item.name, price, 1, index, false));
    }
  });

  cartTotal.textContent = `€${total.toFixed(2)}`;
}

// Sending cart data to the server
async function sendCartToServer(userId) {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

  try {
    for (let item of cartItems) {
      const response = await fetch(`https://backend-7hqy.onrender.com/cart/${userId}`, {  // <<< اینجا هم اصلاح شد
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          templateId: item.id, // Make sure `id` exists
          quantity: item.quantity || 1
        })
      });

      const result = await response.json();
      console.log(result);
    }
  } catch (err) {
    console.error('Error sending cart items to server:', err);
  }
}
