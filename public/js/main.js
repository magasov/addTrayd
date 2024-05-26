document.addEventListener('DOMContentLoaded', () => {
    const postAdButton = document.getElementById('postAdButton');
    const postAdSection = document.getElementById('postAdSection');
    const postAdForm = document.getElementById('postAdForm');
    const adsContainer = document.getElementById('adsContainer');

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
            alert('Ad posted successfully');
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
          ${ad.images.map(image => `
          <div class="cont_one">
          <img src="images/${image}" alt="Ad Image">`).join('')}
          </div>
         
          <div class="cont_two">
            <h3>${ad.title}</h3>
            <p>${ad.description}</p>
            <p><strong>Категория:</strong> ${ad.category}</p>
            <h3>${ad.price} ₽</h3>
          </div>
        `;
            adsContainer.appendChild(adElement);
        });
    }

    loadAds();
});
