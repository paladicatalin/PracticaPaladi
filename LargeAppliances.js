document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    const sortRadios = document.querySelectorAll('input[name="sort_order"]');
    const saleRadios = document.querySelectorAll('input[name="sale_filter"]');
    const priceSliderMin = document.getElementById('priceSliderMin');
    const priceSliderMax = document.getElementById('priceSliderMax');
    const minPriceValue = document.getElementById('minPriceValue');
    const maxPriceValue = document.getElementById('maxPriceValue');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const dealsGrid = document.querySelector('.deals-grid');

    let products = Array.from(productCards).map(card => ({
        element: card,
        name: card.dataset.productName.toLowerCase(),
        price: parseFloat(card.dataset.productPrice),
        oldPrice: parseFloat(card.dataset.oldPrice) || parseFloat(card.dataset.productPrice),
        isOnSale: card.querySelector('.old-price') !== null
    }));

    function filterAndSortProducts() {
        const sortOrder = document.querySelector('input[name="sort_order"]:checked')?.value || '';
        const saleFilter = document.querySelector('input[name="sale_filter"]:checked')?.value || 'all';
        const minPrice = parseInt(priceSliderMin.value);
        const maxPrice = parseInt(priceSliderMax.value);

        let filteredProducts = products.filter(product => {
            const priceInRange = product.price >= minPrice && product.price <= maxPrice;
            let saleMatch = true;
            if (saleFilter === 'yes') {
                saleMatch = product.isOnSale;
            } else if (saleFilter === 'no') {
                saleMatch = !product.isOnSale;
            }
            return priceInRange && saleMatch;
        });

        if (sortOrder === 'nameAsc') {
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === 'nameDesc') {
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortOrder === 'priceAsc') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'priceDesc') {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        dealsGrid.innerHTML = '';

        if (filteredProducts.length === 0) {
            const noProductsMessage = document.createElement('div');
            noProductsMessage.classList.add('no-products-message');
            noProductsMessage.textContent = 'No products found matching your filters.';
            noProductsMessage.style.textAlign = 'center';
            noProductsMessage.style.padding = '20px';
            dealsGrid.appendChild(noProductsMessage);
        } else {
            filteredProducts.forEach(product => {
                dealsGrid.appendChild(product.element);
            });
        }
    }

    priceSliderMin.addEventListener('input', function() {
        minPriceValue.textContent = this.value + ' EUR';
        filterAndSortProducts();
    });

    priceSliderMax.addEventListener('input', function() {
        maxPriceValue.textContent = this.value + ' EUR';
        filterAndSortProducts();
    });

    sortRadios.forEach(radio => {
        radio.addEventListener('change', filterAndSortProducts);
    });

    saleRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            products = Array.from(productCards).map(card => ({
                element: card,
                name: card.dataset.productName.toLowerCase(),
                price: parseFloat(card.dataset.productPrice),
                oldPrice: parseFloat(card.dataset.oldPrice) || parseFloat(card.dataset.productPrice),
                isOnSale: card.querySelector('.old-price') !== null
            }));
            filterAndSortProducts();
        });
    });

    clearFiltersBtn.addEventListener('click', function() {
        sortRadios.forEach(radio => radio.checked = false);
        const allProductsRadio = document.getElementById('allProducts');
        if (allProductsRadio) {
            allProductsRadio.checked = true;
        }
        priceSliderMin.value = 0;
        priceSliderMax.value = 500;
        minPriceValue.textContent = '0 EUR';
        maxPriceValue.textContent = '500 EUR';

        dealsGrid.innerHTML = '';
        products.forEach(product => {
            dealsGrid.appendChild(product.element);
        });
    });

    products.forEach(product => {
        dealsGrid.appendChild(product.element);
    });

    products = Array.from(productCards).map(card => ({
        element: card,
        name: card.dataset.productName.toLowerCase(),
        price: parseFloat(card.dataset.productPrice),
        oldPrice: parseFloat(card.dataset.oldPrice) || parseFloat(card.dataset.productPrice),
        isOnSale: card.querySelector('.old-price') !== null
    }));
});

function initFavorites() {

  const favoriteButtons = document.querySelectorAll('.wishlist-icon');
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];


  favoriteButtons.forEach(button => {
    const productId = button.dataset.productId;
    const favoriteIcon = button.querySelector('.favorite-icon');

    const isInFavorites = favorites.some(item => item.id === parseInt(productId));
    if (isInFavorites) {
      favoriteIcon.setAttribute('src', 'Vector-red.svg');
    }

    button.addEventListener('click', function(event) {
      event.preventDefault();

      const favoriteIcon = button.querySelector('.favorite-icon');
      const originalSrc = 'Vector.svg';
      const redSrc = 'Vector-red.svg';

      const productCard = button.closest('.product-card');
      const productId = parseInt(button.dataset.productId);
      const productName = productCard.dataset.productName;
      const productPrice = parseFloat(productCard.dataset.productPrice);
      const productImage = productCard.querySelector('.product-image img').src;
      const productTitle = productCard.querySelector('.product-title').textContent.trim();

      const existingItemIndex = favorites.findIndex(item => item.id === productId);

      if (existingItemIndex === -1) {

        favorites.push({
          id: productId,
          name: productName,
          title: productTitle,
          price: productPrice,
          image: productImage
        });
        favoriteIcon.setAttribute('src', redSrc);
        showNotification('The product has been added to favorites!');
      } else {

        favorites.splice(existingItemIndex, 1);
        favoriteIcon.setAttribute('src', originalSrc);
        showNotification('The product has been removed from favorites!');
      }

      localStorage.setItem('favorites', JSON.stringify(favorites));


      updateFavoriteCount();
    });
  });


  updateFavoriteCount();
}


function showNotification(message) {

  let notification = document.querySelector('.favorite-notification');

  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'favorite-notification';
    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.style.display = 'block';

  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.style.display = 'none';
    }, 300);
  }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
  initFavorites();

});

document.addEventListener('DOMContentLoaded', function() {
    const filterToggleIconMobile = document.querySelector('.filter-icon-mobile');
    const filterSectionMobile = document.querySelector('.filter-section');
    const filterCloseButtonMobile = filterSectionMobile.querySelector('.filter-close-button');

    if (filterToggleIconMobile && filterSectionMobile && filterCloseButtonMobile) {
        filterToggleIconMobile.addEventListener('click', function() {
            filterSectionMobile.classList.add('active');
        });

        filterCloseButtonMobile.addEventListener('click', function() {
            filterSectionMobile.classList.remove('active');
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.getElementById('navList');
    const profileIcon = document.querySelector('.profile-icon');
    const dropdown = document.querySelector('.dropdown-content');
    const addButtons = document.querySelectorAll('.add-to-bag');
    const cartLinkTop = document.querySelector('.cart-link');
    const cartCountTop = document.querySelector('.cart-count');
    const cartModal = document.querySelector('.cart-modal');
    const closeButton = cartModal.querySelector('.close-button');
    const cartItemsContainer = cartModal.querySelector('.cart-items');
    const totalPriceDisplay = cartModal.querySelector('.total-price');
    const favoriteButtons = document.querySelectorAll('.wishlist-icon');
    const favoriteNotification = document.querySelector('.favorite-notification');
    let cart = [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalQuantity = 0;
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price} EUR</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-button decrease" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-button increase" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-button" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
            total += item.price * item.quantity;
            totalQuantity += item.quantity;
        });
        totalPriceDisplay.textContent = total.toFixed(2) + ' EUR';
        cartCountTop.textContent = totalQuantity;
    }

    function handleCartItemAction(event) {
        const button = event.target.closest('.remove-button');
        if (button) {
            const productId = parseInt(button.dataset.id);
            const indexToRemove = cart.findIndex(item => item.id === productId);
            if (indexToRemove !== -1) {
                cart.splice(indexToRemove, 1);
                updateCartDisplay();
            }
        }
        const decreaseButton = event.target.closest('.quantity-button.decrease');
        if (decreaseButton) {
            const productId = parseInt(decreaseButton.dataset.id);
            const item = cart.find(item => item.id === productId);
            if (item && item.quantity > 1) {
                item.quantity--;
                updateCartDisplay();
            }
        }
        const increaseButton = event.target.closest('.quantity-button.increase');
        if (increaseButton) {
            const productId = parseInt(increaseButton.dataset.id);
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity++;
                updateCartDisplay();
            }
        }
    }

    function addToCart(event) {
        const button = event.target;
        const productId = parseInt(button.dataset.productId);
        const productCard = button.closest('.product-card');
        const productName = productCard.dataset.productName;
        const productPrice = parseFloat(productCard.dataset.productPrice);
        const productImage = productCard.dataset.productImage;
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id: productId, name: productName, price: productPrice, quantity: 1, image: productImage });
        }
        updateCartDisplay();
        showNotification('The product has been added to the cart!');
    }

    addButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    cartLinkTop.addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.style.display = 'flex';
    });

    closeButton.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
        if (event.target === filterSectionMobile) {
            filterSectionMobile.classList.remove('active');
        }
    });

    function isMobile() {
        return window.innerWidth <= 768;
    }

    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        navList.classList.toggle('active');
    });

    profileIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        if (isMobile()) {
            e.preventDefault();
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        } else {
            window.location.href = 'login.html';
        }
    });

    const myBagLinkDropdown = document.querySelector('.my-bag-link');
    if (myBagLinkDropdown) {
        myBagLinkDropdown.addEventListener('click', function(e) {
            if (isMobile()) {
                e.preventDefault();
                cartModal.style.display = 'flex';
                dropdown.style.display = 'none';
            } else {

            }
        });
    }

    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target) && !profileIcon.contains(e.target)) {
            dropdown.style.display = 'none';
        }
        if (!navList.contains(e.target) && !menuToggle.contains(e.target)) {
            navList.classList.remove('active');
        }
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            if (isMobile()) {
                navList.classList.remove('active');
            }
        });
    });

    cartItemsContainer.addEventListener('click', handleCartItemAction);
    updateCartDisplay();
});

document.addEventListener('DOMContentLoaded', function() {
    const filterToggleIcon = document.querySelector('.filter-title');
    const filterGroups = document.querySelectorAll('.filter-group');
    const clearFiltersBtn = document.getElementById('clearFilters');

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function toggleFilters() {
        if (isMobile()) {
            filterGroups.forEach(group => {
                if (group.style.display === 'none' || group.style.display === '') {
                    group.style.display = 'block';
                    if (clearFiltersBtn) clearFiltersBtn.style.display = 'block';
                } else {
                    group.style.display = 'none';
                    if (clearFiltersBtn) clearFiltersBtn.style.display = 'none';
                }
            });
        }
    }

    function initializeFilterDisplay() {
        if (isMobile()) {
            filterGroups.forEach(group => {
                group.style.display = 'none';
            });
            if (clearFiltersBtn) clearFiltersBtn.style.display = 'none';
        } else {
            filterGroups.forEach(group => {
                group.style.display = 'block';
            });
            if (clearFiltersBtn) clearFiltersBtn.style.display = 'block';
        }
    }

    initializeFilterDisplay();

    if (filterToggleIcon) {
        filterToggleIcon.addEventListener('click', toggleFilters);
    }
    window.addEventListener('resize', initializeFilterDisplay);
});


document.addEventListener('DOMContentLoaded', function() {
  const footerColumns = document.querySelectorAll('.footer-column h3');

  footerColumns.forEach(title => {
    title.addEventListener('click', function() {
      if (window.innerWidth < 768) {
        this.parentNode.classList.toggle('open');
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const footerCols = document.querySelectorAll('.footer-col');
  const footer = document.querySelector('.footer');
  const initialFooterHeight = footer.offsetHeight;

  footerCols.forEach(col => {
    const title = col.querySelector('h4');
    const content = col.querySelectorAll(':not(h4)');

    title.addEventListener('click', function() {
      if (window.innerWidth < 768) {
        footerCols.forEach(otherCol => {
          if (otherCol !== col) {
            otherCol.classList.remove('open');
          }
        });

        col.classList.toggle('open');

        let maxHeight = initialFooterHeight;
        footerCols.forEach(openCol => {
          if (openCol.classList.contains('open')) {
            let currentHeight = openCol.querySelector('h4').offsetHeight;
            openCol.querySelectorAll(':not(h4)').forEach(el => {
              currentHeight += el.offsetHeight;
            });
            maxHeight = Math.max(maxHeight, initialFooterHeight + currentHeight + 20); 
          }
        });
        footer.style.height = `${maxHeight}px`;
      }
    });
  });

  window.addEventListener('resize', function() {
    if (window.innerWidth >= 768) {
      footer.style.height = `${initialFooterHeight}px`;
      footerCols.forEach(col => col.classList.remove('open'));
    }
  });
});

