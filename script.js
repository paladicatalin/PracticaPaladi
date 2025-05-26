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
  let cart = [];
  let favorites = [];

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
    const productImage = productCard.querySelector('.product-image img').src;

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
    });
  });

  const sliderImages = document.querySelector('.slider-images');
  const slides = document.querySelectorAll('.slider-image');
  const prevButton = document.querySelector('.slider-nav.prev');
  const nextButton = document.querySelector('.slider-nav.next');
  const indicators = document.querySelectorAll('.indicator');
  let currentIndex = 0;
  let slideInterval;
  const totalSlides = slides.length;

  function initSlider() {
    showSlide(currentIndex);
    startAutoSlide();
  }

  function startAutoSlide() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 6000);
  }

  function showSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;

    sliderImages.style.transform = `translateX(-${currentIndex * 100}%)`;

    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === currentIndex);
    });
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  nextButton.addEventListener('click', function() {
    nextSlide();
    startAutoSlide();
  });

  prevButton.addEventListener('click', function() {
    prevSlide();
    startAutoSlide();
  });

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', function() {
      showSlide(index);
      startAutoSlide();
    });
  });

  let touchStartX = 0;
  let touchEndX = 0;

  sliderImages.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    clearInterval(slideInterval);
  }, {passive: true});

  sliderImages.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoSlide();
  }, {passive: true});

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
    }
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
      prevSlide();
      startAutoSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      startAutoSlide();
    }
  });


  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      showSlide(currentIndex);
    }, 250);
  });

  cartItemsContainer.addEventListener('click', handleCartItemAction);

  initSlider();
  updateCartDisplay();
});

let i = 0, cloned = false, interval;

function autoScroll() {
  const c = document.querySelector('.brands-container');
  if (!c) return;
  let logos = c.querySelectorAll('.brand-logo');

  if (window.innerWidth <= 768 && !cloned) {
    logos.forEach(l => c.appendChild(l.cloneNode(true)));
    cloned = true;
    logos = c.querySelectorAll('.brand-logo');
    const w = logos[0].offsetWidth;

    interval = setInterval(() => {
      i++;
      c.scrollTo({ left: i * w, behavior: 'smooth' });
      if (i >= logos.length / 2) setTimeout(() => (c.scrollLeft = 0, i = 0), 400);
    }, 2000);
  }

  if (window.innerWidth > 768 && cloned) {
    clearInterval(interval);
    i = 0;
    const all = [...logos];
    all.slice(all.length / 2).forEach(l => l.remove());
    cloned = false;
  }
}

window.addEventListener('load', autoScroll);
window.addEventListener('resize', autoScroll);


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

function initFavorites() {
 
  const favoriteButtons = document.querySelectorAll('.wishlist-icon');
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  

  favoriteButtons.forEach(button => {
    const productId = button.dataset.productId;
    const favoriteIcon = button.querySelector('.favorite-icon');
 
    const isInFavorites = favorites.some(item => item.id === parseInt(productId));
    if (isInFavorites) {
      favoriteIcon.setAttribute('src', 'vector-red.svg');
    }

    button.addEventListener('click', function(event) {
      event.preventDefault();

      const favoriteIcon = button.querySelector('.favorite-icon');
      const originalSrc = 'Vector.svg';
      const redSrc = 'vector-red.svg';
  
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
document.addEventListener('DOMContentLoaded', () => {
    const produseSite = [
        {
            nume: "Televizor LED Smart HISENSE 50A6N, Ultra HD 4K, HDR, 126cm",
            imagine: "img3.png",
            pret: "240 EUR",
            link: "televizor.html"
        },
        {
            nume: "ARCTIC APLM1WFSU1210W washing machine, 8 kg, 1200rpm, Class A, white",
            imagine: "img2.png",
            pret: "220 EUR",
            link: "samsung-qled-55.html"
        },
        {
            nume: "Refrigerator GORENJE RK4182PW4, 269 l, H 180 cm, Class E, white",
            imagine: "img1.png",
            pret: "300 EUR",
            link: "frigider-bosch.html"
        }
        // ... adaugă alte produse aici ...
    ];

    const searchBar = document.getElementById('searchBar');
    if (!searchBar) return; 

    const rezultateCauta = document.createElement('div');
    rezultateCauta.id = 'rezultateCauta';
    rezultateCauta.style.position = 'absolute';
    rezultateCauta.style.backgroundColor = 'white';
    rezultateCauta.style.border = '1px solid #ddd';
    rezultateCauta.style.maxHeight = '300px';
    rezultateCauta.style.overflowY = 'auto';
    rezultateCauta.style.zIndex = '1000';
    rezultateCauta.style.display = 'none';

    searchBar.parentNode.insertBefore(rezultateCauta, searchBar.nextSibling);

    const updateResultsWidth = () => {
        rezultateCauta.style.width = `${searchBar.offsetWidth}px`;
        rezultateCauta.style.left = `${searchBar.offsetLeft}px`; 
    };
    updateResultsWidth(); 
    window.addEventListener('resize', updateResultsWidth); 

    searchBar.addEventListener('input', () => {
        const termenCautat = searchBar.value.trim().toLowerCase();
        rezultateCauta.innerHTML = ''; 

        if (termenCautat.length === 0) {
            rezultateCauta.style.display = 'none';
            return;
        }

        const produsePotrivite = produseSite.filter(produs =>
            produs.nume.toLowerCase().includes(termenCautat)
        );

        if (produsePotrivite.length > 0) {
            produsePotrivite.forEach(produs => {
                const elementProdus = document.createElement('a');
                elementProdus.href = produs.link;
                elementProdus.classList.add('produs-cautare-item'); 

                elementProdus.innerHTML = `
                    <img src="${produs.imagine}" alt="${produs.nume}">
                    <div>
                        <p class="nume-produs">${produs.nume}</p>
                        <p class="pret-produs">${produs.pret}</p>
                    </div>
                `;
                rezultateCauta.appendChild(elementProdus);
            });
            rezultateCauta.style.display = 'block';
        } else {
            rezultateCauta.style.display = 'none';
        }
    });

    searchBar.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const termenCautat = searchBar.value.trim();
            rezultateCauta.style.display = 'none'; 

            if (termenCautat) {
                window.location.href = `cauta.html?q=${encodeURIComponent(termenCautat)}`;
            }
        }
    });

    document.addEventListener('click', (event) => {
        if (!searchBar.contains(event.target) && !rezultateCauta.contains(event.target)) {
            rezultateCauta.style.display = 'none';
        }
    });
});