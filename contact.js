function initMap() {
    const ceitiLocation = { lat: 46.985486, lng: 28.870102 };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: ceitiLocation,
    });

    new google.maps.Marker({
        position: ceitiLocation,
        map: map,
        title: "Center of Excellence in Informatics and Information Technologies (CEITI)",
    });
}

document.addEventListener('DOMContentLoaded', function() {
    function isMobile() {
        return window.innerWidth <= 768;
    }

    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.getElementById('navList');
    const profileIcon = document.querySelector('.profile-icon');
    const dropdown = document.querySelector('.dropdown-content');
    const myBagLinkDropdown = document.querySelector('.my-bag-link');
    const navLinks = document.querySelectorAll('.nav-link');

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (name === '') {
                alert('Please enter your name.');
                return;
            }
            if (email === '') {
                alert('Please enter your email address.');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            if (message === '') {
                alert('Please enter your message.');
                return;
            }

            alert('Your message has been sent successfully!');
            contactForm.reset();
        });
    }

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            if (dropdown) dropdown.classList.remove('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (isMobile() && navList) {
                navList.classList.remove('active');
            }
        });
    });

    if (profileIcon && dropdown) {
        profileIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            if (isMobile()) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                if (navList) navList.classList.remove('active');
            } else {
                window.location.href = 'login.html';
            }
        });
    }

    if (myBagLinkDropdown) {
        myBagLinkDropdown.addEventListener('click', function(e) {
            if (isMobile() && dropdown) {
                dropdown.classList.remove('active');
            }
        });
    }

    document.addEventListener('click', function(e) {
        if (dropdown && profileIcon && !dropdown.contains(e.target) && !profileIcon.contains(e.target)) {
            dropdown.classList.remove('active');
        }
        if (navList && menuToggle && !navList.contains(e.target) && !menuToggle.contains(e.target)) {
            navList.classList.remove('active');
        }
    });

    const footerCols = document.querySelectorAll('.footer-col');

    if (footerCols.length > 0) {
        footerCols.forEach(col => {
            const title = col.querySelector('h4');
            const content = col.querySelector('.footer-col-content');

            if (title && content) {
                title.addEventListener('click', function() {
                    if (isMobile()) {
                        footerCols.forEach(otherCol => {
                            if (otherCol !== col && otherCol.classList.contains('open')) {
                                otherCol.classList.remove('open');
                            }
                        });
                        col.classList.toggle('open');
                    }
                });
            }
        });

        window.addEventListener('resize', function() {
            if (!isMobile()) {
                footerCols.forEach(col => col.classList.remove('open'));
            }
        });
    }
});