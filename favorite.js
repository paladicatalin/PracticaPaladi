
    document.addEventListener('DOMContentLoaded', function() {
      const favoriteListContainer = document.getElementById('favorite-list');
      let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

      function displayFavorites() {
        favoriteListContainer.innerHTML = '';

        if (favorites.length > 0) {
          favorites.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('favorite-product-card');
            productDiv.innerHTML = `
              <img src="${product.image}" alt="${product.name}" style="max-width: 100%; height: auto;">
              <h3>${product.title || product.name}</h3>
              <p class="price">${product.price ? product.price + ' EUR' : 'Preț indisponibil'}</p>
              <button class="remove-from-favorites" data-product-id="${product.id}">Delete</button>
            `;
            favoriteListContainer.appendChild(productDiv);
          });

          const removeButtons = document.querySelectorAll('.remove-from-favorites');
          removeButtons.forEach(button => {
            button.addEventListener('click', function() {
              const productIdToRemove = parseInt(this.dataset.productId);
              favorites = favorites.filter(item => item.id !== productIdToRemove);
              localStorage.setItem('favorites', JSON.stringify(favorites));
              displayFavorites();
              updateFavoriteCount();
            });
          });
        } else {
          const emptyMessage = document.createElement('p');
          emptyMessage.classList.add('empty-message');
          emptyMessage.textContent = 'You have no products added to your favorites (';
          favoriteListContainer.appendChild(emptyMessage);
        }
      }

      function updateFavoriteCount() {
        const favoriteCountElement = document.querySelector('.favorite-count');
        if (favoriteCountElement) {
          favoriteCountElement.textContent = favorites.length;
          favoriteCountElement.style.display = favorites.length > 0 ? 'inline-flex' : 'none';
        }
      }

      displayFavorites();
      updateFavoriteCount();
    });