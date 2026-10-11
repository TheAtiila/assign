const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  navigation.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
}

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const plannerForm = document.querySelector('#planner-form');
const plannerResult = document.querySelector('#planner-result');

if (plannerForm && plannerResult) {
  const destinationNames = {
    coast: 'Coastal Heritage Route',
    forest: 'Forest and Waterfall Route',
    culture: 'Kumasi Culture Route',
    north: 'Northern Nature Route'
  };

  const activities = {
    coast: ['Tour Cape Coast Castle with a guide', 'Walk the Kakum canopy bridge', 'Spend an evening at the coast'],
    forest: ['Hike to Boti Falls', 'Visit Aburi Botanical Gardens', 'Stop at a local craft market'],
    culture: ['Visit Manhyia Palace Museum', 'Observe kente weaving at Bonwire', 'Explore Kejetia Market with a local guide'],
    north: ['Join a Mole National Park safari', 'Visit Larabanga Mosque respectfully', 'Learn about shea processing in a community group']
  };

  plannerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(plannerForm);
    const destination = data.get('destination');
    const days = Number(data.get('days'));
    const travellers = Number(data.get('travellers'));
    const dailyRate = { budget: 420, comfort: 760, premium: 1300 }[data.get('style')];
    const total = dailyRate * days * travellers;
    const route = activities[destination].slice(0, Math.min(days, 3));

    plannerResult.innerHTML = `
      <h3>${destinationNames[destination]}</h3>
      <p>A ${days}-day outline for ${travellers} traveller${travellers === 1 ? '' : 's'}.</p>
      <ol>${route.map((item, index) => `<li><strong>Day ${index + 1}:</strong> ${item}</li>`).join('')}</ol>
      <p>Use the remaining time for travel, meals and unplanned stops. Confirm transport and entrance fees before departure.</p>
      <div class="budget"><span>Planning estimate</span><strong>GH₵ ${total.toLocaleString()}</strong></div>
    `;
    localStorage.setItem('akwaaba-plan', JSON.stringify({ destination, days, travellers, style: data.get('style') }));
  });

  const saved = JSON.parse(localStorage.getItem('akwaaba-plan') || 'null');
  if (saved) {
    Object.entries(saved).forEach(([key, value]) => {
      const field = plannerForm.elements.namedItem(key);
      if (field) field.value = value;
    });
  }
}

const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    galleryItems.forEach((item) => {
      item.hidden = filter !== 'all' && item.dataset.category !== filter;
    });
  });
});

const lightbox = document.querySelector('.lightbox');
if (lightbox) {
  const lightboxImage = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('p');
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  };

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const image = item.querySelector('img');
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = item.querySelector('span').textContent;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      lightbox.querySelector('button').focus();
    });
  });
  lightbox.querySelector('button').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox(); });
}

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  const status = document.querySelector('#form-status');
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.checkValidity()) {
      status.textContent = 'Please complete all required fields correctly.';
      contactForm.reportValidity();
      return;
    }
    const name = contactForm.elements.namedItem('name').value.trim().split(' ')[0];
    status.textContent = `Thank you, ${name}. Your enquiry has been recorded for this demonstration.`;
    contactForm.reset();
  });
}
