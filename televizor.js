
    let defaultImage = "hisense_tv_1.png";

    function previewImage(imageSrc) {
        document.getElementById('mainImage').src = imageSrc;
        document.getElementById('zoomImage').src = imageSrc;
    }

    function resetImage() {
        document.getElementById('mainImage').src = defaultImage;
        document.getElementById('zoomImage').src = defaultImage;
    }

    function setDefaultImage(imageSrc) {
        defaultImage = imageSrc;
        previewImage(imageSrc);
    }

    function zoom(event) {
        let zoomImg = document.getElementById('zoomImage');
        let x = (event.offsetX / event.target.clientWidth) * 100;
        let y = (event.offsetY / event.target.clientHeight) * 100;
        zoomImg.style.display = 'block';
        zoomImg.style.transform = `translate(-${x}%, -${y}%) scale(2)`;
    }

    function hideZoom() {
        document.getElementById('zoomImage').style.display = 'none';
    }

    function selectSize(element) {
        document.querySelectorAll('.size-cell').forEach(cell => cell.classList.remove('selected'));
        element.classList.add('selected');
    }

    document.addEventListener('DOMContentLoaded', function() {
        function isMobile() {
            return window.innerWidth <= 768;
        }

        const menuToggle = document.querySelector('.menu-toggle');
        const navList = document.getElementById('navList');
        const profileIcon = document.querySelector('.profile-icon');
        const dropdown = document.querySelector('.dropdown-content');
        const addToBagButtons = document.querySelectorAll('.add-to-bag');
        const cartLinkTop = document.querySelector('.cart-link');
        const cartCountTop = document.querySelector('.cart-count');
        const cartModal = document.querySelector('.cart-modal');
        const closeButton = cartModal.querySelector('.close-button');
        const cartItemsContainer = cartModal.querySelector('.cart-items');
        const totalPriceDisplay = cartModal.querySelector('.cart-total ');
        const favoriteButtons = document.querySelectorAll('.wishlist-button');
        const favoriteNotification = document.querySelector('.favorite-notification');

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        const warrantyOptions = document.querySelectorAll('.warranty-option input[type="radio"]');
        const productWrapper = document.querySelector('.product-wrapper');
        const priceDisplay = document.querySelector('.price');
        const originalPrice = productWrapper ? parseFloat(productWrapper.dataset.productPrice) : 0;

        const myBagLinkDropdown = document.querySelector('.my-bag-link');

        if (profileIcon && dropdown) {
            profileIcon.addEventListener('click', function(e) {
                e.stopPropagation();

                if (isMobile()) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                } else {
                    window.location.href = 'login.html';
                }
            });

            document.addEventListener('click', function(e) {
                if (!profileIcon.contains(e.target) && !dropdown.contains(e.target)) {
                    if (dropdown.classList.contains('active')) {
                        dropdown.classList.remove('active');
                    }
                }
            });
        }

        if (myBagLinkDropdown && cartModal && dropdown) {
            myBagLinkDropdown.addEventListener('click', function(e) {
                e.preventDefault();
                cartModal.style.display = 'flex';
                dropdown.classList.remove('active');
            });
        }

        function updatePriceWithWarranty() {
            let selectedWarrantyPrice = 0;
            warrantyOptions.forEach(option => {
                if (option.checked) {
                    const label = document.querySelector(`label[for="${option.id}"]`).textContent;
                    const priceMatch = label.match(/(\d+\.?\d*) EUR/);
                    if (priceMatch && priceMatch[1]) {
                        selectedWarrantyPrice = parseFloat(priceMatch[1]);
                    }
                }
            });
            const newPrice = originalPrice + selectedWarrantyPrice;
            if (productWrapper && priceDisplay) {
                 productWrapper.dataset.productPrice = newPrice.toFixed(2);
                 priceDisplay.textContent = newPrice.toFixed(2) + ' EUR';
            }
        }

        warrantyOptions.forEach(option => {
            option.addEventListener('change', updatePriceWithWarranty);
        });

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
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        function handleCartItemAction(event) {
            const button = event.target.closest('.remove-button');
            if (button) {
                const productId = parseInt(button.dataset.id);
                cart = cart.filter(item => item.id !== productId);
                updateCartDisplay();
                return;
            }
            const decreaseButton = event.target.closest('.quantity-button.decrease');
            if (decreaseButton) {
                const productId = parseInt(decreaseButton.dataset.id);
                const item = cart.find(item => item.id === productId);
                if (item && item.quantity > 1) {
                    item.quantity--;
                    updateCartDisplay();
                }
                return;
            }
            const increaseButton = event.target.closest('.quantity-button.increase');
            if (increaseButton) {
                const productId = parseInt(increaseButton.dataset.id);
                const item = cart.find(item => item.id === productId);
                if (item) {
                    item.quantity++;
                    updateCartDisplay();
                }
                return;
            }
        }

        function addToCart(event) {
            const button = event.target;
            const productId = parseInt(button.dataset.productId);
            const currentProductWrapper = button.closest('.product-wrapper');
            
            if (!currentProductWrapper) {
                console.error("Product wrapper not found for Add to Bag button.");
                return;
            }

            const productName = currentProductWrapper.dataset.productName;
            const productPrice = parseFloat(currentProductWrapper.dataset.productPrice);
            const productImage = currentProductWrapper.dataset.productImage;
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ id: productId, name: productName, price: productPrice, quantity: 1, image: productImage });
            }
            updateCartDisplay();
            showNotification('The product has been added to the cart!');
        }

        addToBagButtons.forEach(button => {
            button.addEventListener('click', addToCart);
        });

        if (cartLinkTop && cartModal) {
            cartLinkTop.addEventListener('click', function(e) {
                e.preventDefault();
                cartModal.style.display = 'flex';
            });
        }

        if (closeButton && cartModal) {
            closeButton.addEventListener('click', function() {
                cartModal.style.display = 'none';
            });

            window.addEventListener('click', function(event) {
                if (event.target === cartModal) {
                    cartModal.style.display = 'none';
                }
            });
        }

        if (menuToggle && navList) {
            menuToggle.addEventListener('click', function() {
                navList.classList.toggle('active');
            });
        }

        document.addEventListener('click', function(e) {
            if (menuToggle && navList && !menuToggle.contains(e.target) && !navList.contains(e.target)) {
                navList.classList.remove('active');
            }
        });

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (isMobile()) {
                    navList.classList.remove('active');
                }
            });
        });

        if (cartItemsContainer) {
            cartItemsContainer.addEventListener('click', handleCartItemAction);
            updateCartDisplay();
        }

        function updateFavoriteIcon(productId, isFavorite) {
            const buttons = document.querySelectorAll(`.wishlist-button[data-product-id="${productId}"]`);
            buttons.forEach(button => {
                const icon = button.querySelector('.favorite-icon');
                if (icon) {
                    icon.src = isFavorite ? 'vector-red.svg' : 'Vector.svg';
                }
            });
        }

        function updateFavoriteCount() {
            const favoriteCountHeader = document.querySelector('.icons-container .icon-link[title="Favorites"] img + span');
            if (favoriteCountHeader) {
                favoriteCountHeader.textContent = favorites.length;
            }
        }

        function toggleFavorite(event) {
            const button = event.currentTarget;
            const productId = parseInt(button.dataset.productId);
            const currentProductWrapper = button.closest('.product-wrapper');

            if (!currentProductWrapper) {
                console.error("Product wrapper not found for wishlist button.");
                return;
            }

            const productName = currentProductWrapper.dataset.productName;
            const productPrice = parseFloat(currentProductWrapper.dataset.productPrice);
            const productImage = currentProductWrapper.dataset.productImage;

            const isAlreadyFavorite = favorites.some(item => item.id === productId);

            if (isAlreadyFavorite) {
                favorites = favorites.filter(item => item.id !== productId);
                showNotification('The product has been removed from favorites!');
            } else {
                favorites.push({ id: productId, name: productName, price: productPrice, image: productImage });
                showNotification('The product has been added to favorites!');
            }

            localStorage.setItem('favorites', JSON.stringify(favorites));
            updateFavoriteIcon(productId, !isAlreadyFavorite);
            updateFavoriteCount();
        }

        favoriteButtons.forEach(button => {
            button.addEventListener('click', toggleFavorite);
            const productId = parseInt(button.dataset.productId);
            const isFavorite = favorites.some(item => item.id === productId);
            updateFavoriteIcon(productId, isFavorite);
        });
        updateFavoriteCount();

        function showNotification(message) {
            if (favoriteNotification) {
                favoriteNotification.textContent = message;
                favoriteNotification.classList.add('show');
                favoriteNotification.style.display = 'block';
                setTimeout(() => {
                    favoriteNotification.classList.remove('show');
                    favoriteNotification.style.display = 'none';
                }, 3000);
            }
        }

        const footerCols = document.querySelectorAll('.footer-col');
        const footer = document.querySelector('.footer');

        if (footerCols.length > 0 && footer) {
            let initialFooterHeight = footer.offsetHeight;

            footerCols.forEach(col => {
                const title = col.querySelector('h4');

                if (title) {
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
                                    let currentHeight = 0;
                                    const h4Element = openCol.querySelector('h4');
                                    if (h4Element) {
                                        currentHeight += h4Element.offsetHeight;
                                    }
                                    openCol.querySelectorAll(':not(h4)').forEach(el => {
                                        currentHeight += el.offsetHeight;
                                    });
                                    maxHeight = Math.max(maxHeight, initialFooterHeight + currentHeight + 20);
                                }
                            });
                            footer.style.height = `${maxHeight}px`;
                        }
                    });
                }
            });

            window.addEventListener('resize', function() {
                if (window.innerWidth >= 768) {
                    footer.style.height = '';
                    footerCols.forEach(col => col.classList.remove('open'));
                }
            });
        }
    });
