/**
 * Country Clean Cleaning Services - Ainslee Thompson
 * Interactive Website Features & Animation Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientBubbles();
  initHeaderScroll();
  initMobileNav();
  initPriceCalculator();
  initBeforeAfterSlider();
  initModals();
  initServiceCardButtons();
});

/* ==========================================================================
   1. Ambient Floating Bubbles Generator
   ========================================================================== */
function initAmbientBubbles() {
  const container = document.getElementById('bubblesContainer');
  if (!container) return;

  // Reduced motion preference check
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const bubbleCount = 14;

  for (let i = 0; i < bubbleCount; i++) {
    createBubble(container, i);
  }
}

function createBubble(container, index) {
  const bubble = document.createElement('div');
  bubble.className = 'ambient-bubble';

  // Randomize size between 16px and 48px
  const size = Math.floor(Math.random() * 32) + 16;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;

  // Randomize horizontal position across viewport (2% - 96%)
  const leftPos = Math.random() * 94 + 2;
  bubble.style.left = `${leftPos}%`;

  // Randomize animation duration (10s - 22s) and delay
  const duration = Math.random() * 12 + 10;
  const delay = Math.random() * 15;
  bubble.style.animationDuration = `${duration}s`;
  bubble.style.animationDelay = `${delay}s`;

  container.appendChild(bubble);
}

/* ==========================================================================
   2. Sticky Header Scroll Effect
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   3. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('menuToggle');
  const drawer = document.getElementById('mobileDrawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    drawer.classList.toggle('active');
  });

  // Close drawer when clicking any link
  const drawerLinks = drawer.querySelectorAll('a, button');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('active');
    });
  });
}

/* ==========================================================================
   4. Interactive Instant Price Estimator
   ========================================================================== */
function initPriceCalculator() {
  const state = {
    serviceType: 'standard', // 'standard' | 'deep' | 'move' | 'rv'
    basePrice: 120,
    beds: 2,
    baths: 2,
    addons: {
      fridge: false,
      oven: false,
      windows: false,
      pet: false
    }
  };

  const serviceNames = {
    standard: 'Standard Home Cleaning',
    deep: 'Deep Cleaning (Top to Bottom)',
    move: 'Move In / Move Out Clean',
    rv: 'RVs & Campers Specialist Clean'
  };

  const baseLabels = {
    standard: 'Standard Clean Base (Up to 2 beds/baths)',
    deep: 'Deep Clean Base (Up to 2 beds/baths)',
    move: 'Move In / Out Base (Up to 2 beds/baths)',
    rv: 'RV / Camper Base Interior Clean'
  };

  // DOM Elements
  const serviceButtons = document.querySelectorAll('.service-picker-btn');
  const bedMinus = document.getElementById('bedMinus');
  const bedPlus = document.getElementById('bedPlus');
  const bedCountEl = document.getElementById('bedCount');
  const bathMinus = document.getElementById('bathMinus');
  const bathPlus = document.getElementById('bathPlus');
  const bathCountEl = document.getElementById('bathCount');
  
  const addonFridge = document.getElementById('addonFridge');
  const addonOven = document.getElementById('addonOven');
  const addonWindows = document.getElementById('addonWindows');
  const addonPet = document.getElementById('addonPet');

  const totalPriceEl = document.getElementById('totalPrice');
  const summaryServiceName = document.getElementById('summaryServiceName');
  const breakdownBaseName = document.getElementById('breakdownBaseName');
  const breakdownBasePrice = document.getElementById('breakdownBasePrice');
  const extraRoomLine = document.getElementById('extraRoomLine');
  const extraRoomLabel = document.getElementById('extraRoomLabel');
  const extraRoomPrice = document.getElementById('extraRoomPrice');
  const addonsLine = document.getElementById('addonsLine');
  const addonsPrice = document.getElementById('addonsPrice');
  const calcBookBtn = document.getElementById('calcBookBtn');

  // Service picker buttons
  serviceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const type = btn.getAttribute('data-type');
      state.serviceType = type;

      if (type === 'standard') state.basePrice = 120;
      else if (type === 'deep') state.basePrice = 180;
      else if (type === 'move') state.basePrice = 190; // Will scale up to $220 max per banner!
      else if (type === 'rv') state.basePrice = 140;

      updateCalculation();
    });
  });

  // Bedroom counter
  if (bedMinus && bedPlus) {
    bedMinus.addEventListener('click', () => {
      if (state.beds > 1) {
        state.beds--;
        bedCountEl.textContent = state.beds;
        updateCalculation();
      }
    });

    bedPlus.addEventListener('click', () => {
      if (state.beds < 6) {
        state.beds++;
        bedCountEl.textContent = state.beds;
        updateCalculation();
      }
    });
  }

  // Bathroom counter
  if (bathMinus && bathPlus) {
    bathMinus.addEventListener('click', () => {
      if (state.baths > 1) {
        state.baths--;
        bathCountEl.textContent = state.baths;
        updateCalculation();
      }
    });

    bathPlus.addEventListener('click', () => {
      if (state.baths < 5) {
        state.baths++;
        bathCountEl.textContent = state.baths;
        updateCalculation();
      }
    });
  }

  // Add-ons checkboxes
  const addonInputs = [
    { el: addonFridge, key: 'fridge' },
    { el: addonOven, key: 'oven' },
    { el: addonWindows, key: 'windows' },
    { el: addonPet, key: 'pet' }
  ];

  addonInputs.forEach(item => {
    if (item.el) {
      item.el.addEventListener('change', (e) => {
        state.addons[item.key] = e.target.checked;
        updateCalculation();
      });
    }
  });

  // Calculation Logic
  function updateCalculation() {
    let total = state.basePrice;
    let extraRoomsTotal = 0;
    let addonsTotal = 0;

    // Room adjustments:
    // Base covers up to 2 beds and 2 baths.
    const extraBeds = Math.max(0, state.beds - 2);
    const extraBaths = Math.max(0, state.baths - 2);

    if (state.serviceType === 'move') {
      // Per banner: Move In / Move Out is "$220 max"
      // Base starts at $190 (for 1-2 bed), adding extra rooms caps strictly at $220.
      extraRoomsTotal = (extraBeds * 15) + (extraBaths * 15);
      total = Math.min(220, state.basePrice + extraRoomsTotal);
    } else if (state.serviceType === 'standard') {
      extraRoomsTotal = (extraBeds * 15) + (extraBaths * 15);
      total += extraRoomsTotal;
    } else if (state.serviceType === 'deep') {
      extraRoomsTotal = (extraBeds * 20) + (extraBaths * 20);
      total += extraRoomsTotal;
    } else if (state.serviceType === 'rv') {
      // RV size variation
      extraRoomsTotal = (extraBeds * 10) + (extraBaths * 10);
      total += extraRoomsTotal;
    }

    // Add-on sums
    if (state.addons.fridge) addonsTotal += 25;
    if (state.addons.oven) addonsTotal += 25;
    if (state.addons.windows) addonsTotal += 20;
    if (state.addons.pet) addonsTotal += 20;

    total += addonsTotal;

    // Update DOM texts
    summaryServiceName.textContent = serviceNames[state.serviceType];
    breakdownBaseName.textContent = baseLabels[state.serviceType];
    breakdownBasePrice.textContent = `$${state.basePrice}`;

    if (extraRoomsTotal > 0) {
      extraRoomLine.style.display = 'flex';
      if (state.serviceType === 'move' && total >= 220) {
        extraRoomLabel.textContent = `Room Adjustment (Capped at banner max)`;
        extraRoomPrice.textContent = `+$${Math.min(30, extraRoomsTotal)}`;
      } else {
        extraRoomLabel.textContent = `Additional Beds/Baths (${extraBeds + extraBaths} extra)`;
        extraRoomPrice.textContent = `+$${extraRoomsTotal}`;
      }
    } else {
      extraRoomLine.style.display = 'none';
    }

    if (addonsTotal > 0) {
      addonsLine.style.display = 'flex';
      addonsPrice.textContent = `+$${addonsTotal}`;
    } else {
      addonsLine.style.display = 'none';
    }

    // Animate price tally
    animatePrice(total);

    // Sync with modal
    window.currentCalculatedQuote = {
      service: serviceNames[state.serviceType],
      totalPrice: total,
      beds: state.beds,
      baths: state.baths
    };
  }

  function animatePrice(newPrice) {
    totalPriceEl.textContent = newPrice;
    totalPriceEl.classList.add('bump');
    setTimeout(() => {
      totalPriceEl.classList.remove('bump');
    }, 200);
  }

  // Book with estimate button
  if (calcBookBtn) {
    calcBookBtn.addEventListener('click', () => {
      openBookingModal(window.currentCalculatedQuote);
    });
  }

  // Initial calculation run
  updateCalculation();
}

/* ==========================================================================
   5. Interactive Before & After Slider
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('comparisonSlider');
  const beforeBox = document.getElementById('beforeBox');
  const handle = document.getElementById('sliderHandle');
  if (!container || !beforeBox || !handle) return;

  let isDragging = false;

  const updateSlider = (clientX) => {
    const rect = container.getBoundingClientRect();
    let offsetX = clientX - rect.left;

    // Constrain within bounds 0% to 100%
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;

    const percentage = (offsetX / rect.width) * 100;
    beforeBox.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
    handle.setAttribute('aria-valuenow', Math.round(percentage));
  };

  // Mouse Events
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Events for Mobile & Tablets
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) updateSlider(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches[0]) updateSlider(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Keyboard navigation for accessibility
  handle.addEventListener('keydown', (e) => {
    const currentVal = parseInt(handle.getAttribute('aria-valuenow') || '50', 10);
    let newVal = currentVal;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      newVal = Math.max(0, currentVal - 5);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      newVal = Math.min(100, currentVal + 5);
    }

    if (newVal !== currentVal) {
      e.preventDefault();
      beforeBox.style.width = `${newVal}%`;
      handle.style.left = `${newVal}%`;
      handle.setAttribute('aria-valuenow', newVal);
    }
  });
}

/* ==========================================================================
   6. Modals (Official Banner Lightbox & Booking Dialog)
   ========================================================================== */
function initModals() {
  // Banner Lightbox
  const openBannerBtn = document.getElementById('openBannerBtn');
  const heroBannerThumb = document.getElementById('heroBannerThumbnail');
  const bannerCardClick = document.getElementById('bannerCardClick');
  const bannerModal = document.getElementById('bannerModal');
  const closeBannerModal = document.getElementById('closeBannerModal');
  const bannerBackdrop = document.getElementById('bannerBackdrop');

  const openBanner = () => {
    if (!bannerModal) return;
    bannerModal.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const closeBanner = () => {
    if (!bannerModal) return;
    bannerModal.hidden = true;
    document.body.style.overflow = '';
  };

  if (openBannerBtn) openBannerBtn.addEventListener('click', openBanner);
  if (heroBannerThumb) heroBannerThumb.addEventListener('click', openBanner);
  if (bannerCardClick) bannerCardClick.addEventListener('click', openBanner);
  if (closeBannerModal) closeBannerModal.addEventListener('click', closeBanner);
  if (bannerBackdrop) bannerBackdrop.addEventListener('click', closeBanner);

  // Booking Modal
  const bookingModal = document.getElementById('bookingModal');
  const closeBookingModal = document.getElementById('closeBookingModal');
  const bookingBackdrop = document.getElementById('bookingBackdrop');
  const bookingTriggers = document.querySelectorAll('.open-booking-trigger');

  bookingTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const preselect = btn.getAttribute('data-preselect');
      openBookingModal(window.currentCalculatedQuote, preselect);
    });
  });

  const closeBooking = () => {
    if (!bookingModal) return;
    bookingModal.hidden = true;
    document.body.style.overflow = '';
  };

  if (closeBookingModal) closeBookingModal.addEventListener('click', closeBooking);
  if (bookingBackdrop) bookingBackdrop.addEventListener('click', closeBooking);

  // Close modals on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeBanner();
      closeBooking();
    }
  });

  // Handle Booking Form Submit
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName').value;
      const phone = document.getElementById('clientPhone').value;
      const service = document.getElementById('clientService').value;

      // Provide instant friendly feedback
      bookingForm.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem;">
          <div style="font-size: 3.5rem; margin-bottom: 0.85rem;">💖</div>
          <h3 style="font-family: var(--font-heading); font-size: 1.8rem; color: var(--text-main); margin-bottom: 0.5rem;">
            Thank you, ${escapeHtml(name)}!
          </h3>
          <p style="font-size: 1.05rem; color: var(--text-body); max-width: 420px; margin: 0 auto 1.5rem auto;">
            Ainslee has received your request for <strong>${escapeHtml(service)}</strong>. She will call or text you at <strong>${escapeHtml(phone)}</strong> shortly to lock in your preferred date and time!
          </p>
          <a href="https://www.facebook.com/country.cleaning.service.2026" target="_blank" class="btn btn-facebook">
            Say Hello on Facebook
          </a>
        </div>
      `;
    });
  }
}

function openBookingModal(quoteInfo, preselectType) {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;

  const serviceSelect = document.getElementById('clientService');
  const estimateTag = document.getElementById('bookingEstimateTag');
  const modalCalcPrice = document.getElementById('modalCalcPrice');
  const notesField = document.getElementById('clientNotes');

  if (preselectType === 'rv') {
    if (serviceSelect) serviceSelect.value = 'RV / Camper Detailing';
  } else if (quoteInfo && quoteInfo.service) {
    if (serviceSelect) {
      if (quoteInfo.service.includes('Standard')) serviceSelect.value = 'Standard Cleaning ($120)';
      else if (quoteInfo.service.includes('Deep')) serviceSelect.value = 'Deep Cleaning ($180)';
      else if (quoteInfo.service.includes('Move')) serviceSelect.value = 'Move In / Out ($220 max)';
      else if (quoteInfo.service.includes('RV')) serviceSelect.value = 'RV / Camper Detailing';
    }
  }

  if (quoteInfo && quoteInfo.totalPrice) {
    if (estimateTag && modalCalcPrice) {
      estimateTag.style.display = 'block';
      modalCalcPrice.textContent = `$${quoteInfo.totalPrice} (${quoteInfo.beds} beds, ${quoteInfo.baths} baths)`;
    }
    if (notesField && !notesField.value) {
      notesField.value = `Estimated quote from website: $${quoteInfo.totalPrice} for ${quoteInfo.beds} beds & ${quoteInfo.baths} baths.`;
    }
  }

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

/* ==========================================================================
   7. Service Card Buttons
   ========================================================================== */
function initServiceCardButtons() {
  const selectBtns = document.querySelectorAll('.select-service-calc');
  selectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceType = btn.getAttribute('data-service');
      const targetBtn = document.querySelector(`.service-picker-btn[data-type="${serviceType}"]`);
      if (targetBtn) {
        targetBtn.click();
      }
      const calcSection = document.getElementById('calculator');
      if (calcSection) {
        calcSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}
