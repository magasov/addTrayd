document.addEventListener('DOMContentLoaded', () => {
    const postAdButton = document.getElementById('postAdButton');
    const postAdSection = document.getElementById('postAdSection');
    const postAdForm = document.getElementById('postAdForm');
    const adsContainer = document.getElementById('adsContainer');
    const modal = document.getElementById('modal');
    const fullDescription = document.getElementById('fullDescription');
    const closeButton = document.querySelector('.close-button');
    const sliderImages = document.querySelector('.slider-images');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    let currentSlideIndex = 0;

    postAdButton.addEventListener('click', () => {
        postAdSection.classList.toggle('hidden');
    });

    postAdForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(postAdForm);

        const response = await fetch('/api/ads', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Успешно');
            postAdForm.reset();
            postAdSection.classList.add('hidden');
            loadAds();
        } else {
            alert('Failed to post ad');
        }
    });

    async function loadAds() {
        const response = await fetch('/api/ads');
        const ads = await response.json();

        adsContainer.innerHTML = '';
        ads.forEach(ad => {
            const adElement = document.createElement('div');
            adElement.classList.add('ad');
            adElement.innerHTML = `
                ${ad.images.length > 0 ? `
                    <div class="slider">
                        <button class="prev">&laquo;</button>
                        <div class="slider-images">
                            ${ad.images.map((image, index) => `
                                <img src="images/${image}" alt="Ad Image" class="${index === 0 ? 'active' : ''}">
                            `).join('')}
                        </div>
                        <button class="next">&raquo;</button>
                    </div>
                ` : ''}
                <div class="cont_two">
                    <h3>${ad.title}</h3>
                    <p>${ad.description.slice(0, 20)}${ad.description.length > 20 ? '...' : ''}</p>
                    <button class="show-more-button" data-full-description="${ad.description}" data-images='${JSON.stringify(ad.images)}'>Показать больше</button>
                    <p>Номер: ${ad.telephone}</p>
                    <p><strong>Категория:</strong> ${ad.category}</p>
                    <h3>${ad.price} ₽</h3>
                </div>
            `;
            adsContainer.appendChild(adElement);
        });

        document.querySelectorAll('.show-more-button').forEach(button => {
            button.addEventListener('click', () => {
                fullDescription.textContent = button.getAttribute('data-full-description');
                const images = JSON.parse(button.getAttribute('data-images'));
                sliderImages.innerHTML = images.map((image, index) => `
                    <img src="images/${image}" alt="Ad Image" class="${index === 0 ? 'active' : ''}">
                `).join('');
                currentSlideIndex = 0;
                modal.classList.remove('hidden');
                modal.style.display = 'block';
            });
        });

        document.querySelectorAll('.slider .prev').forEach(button => {
            button.addEventListener('click', (e) => {
                const slider = e.target.parentElement;
                showPrevSlide(slider);
            });
        });

        document.querySelectorAll('.slider .next').forEach(button => {
            button.addEventListener('click', (e) => {
                const slider = e.target.parentElement;
                showNextSlide(slider);
            });
        });
    }

    function showPrevSlide(slider) {
        const images = slider.querySelectorAll('.slider-images img');
        images[currentSlideIndex].classList.remove('active');
        currentSlideIndex = (currentSlideIndex - 1 + images.length) >= 0 ? (currentSlideIndex - 1 + images.length) % images.length : images.length - 1;
        images[currentSlideIndex].classList.add('active');
    }

    function showNextSlide(slider) {
        const images = slider.querySelectorAll('.slider-images img');
        images[currentSlideIndex].classList.remove('active');
        currentSlideIndex = (currentSlideIndex + 1) % images.length;
        images[currentSlideIndex].classList.add('active');
    }

    closeButton.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    });

    loadAds();
});
