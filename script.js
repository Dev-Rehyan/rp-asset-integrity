document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     STOP DEFAULT ANCHOR JUMP
  ========================================================= */
  function smoothScrollToTarget(targetId) {
    if (targetId === "top") {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      return;
    }

    const target = document.getElementById(targetId);
    if (!target) return;

    const header = document.querySelector(".site-header");
    const offset = header ? header.offsetHeight + 8 : 8;
    const position = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: position,
      behavior: "smooth"
    });
  }

  /* =========================================================
     PRIVACY POPUP
  ========================================================= */
  const privacyPopup = document.getElementById("privacyPopup");
  const acceptPrivacy = document.getElementById("acceptPrivacy");
  const declinePrivacy = document.getElementById("declinePrivacy");

  if (privacyPopup) {
    const privacyChoice = localStorage.getItem("privacyChoice");

    if (privacyChoice === "accepted" || privacyChoice === "declined") {
      privacyPopup.style.display = "none";
    } else {
      privacyPopup.style.display = "block";
    }

    if (acceptPrivacy) {
      acceptPrivacy.addEventListener("click", () => {
        localStorage.setItem("privacyChoice", "accepted");
        privacyPopup.style.display = "none";
      });
    }

    if (declinePrivacy) {
      declinePrivacy.addEventListener("click", () => {
        localStorage.setItem("privacyChoice", "declined");
        privacyPopup.style.display = "none";
      });
    }
  }

  /* =========================================================
     NAVIGATION + BURGER MENU
  ========================================================= */
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  function lockPageScroll() {
    document.body.classList.add("menu-open");
    document.documentElement.classList.add("menu-open");
  }

  function unlockPageScroll() {
    const anyPopupStillOpen = document.querySelector(".site-popup.active, .review-popup.active");
    const menuStillOpen = mainNav && mainNav.classList.contains("open");
    const lightboxStillOpen = document.getElementById("projectLightbox")?.classList.contains("active");

    if (!anyPopupStillOpen && !menuStillOpen && !lightboxStillOpen) {
      document.body.classList.remove("menu-open");
      document.documentElement.classList.remove("menu-open");
    }
  }

  function getHeaderOffset() {
    const header = document.querySelector(".site-header");
    return header ? header.offsetHeight + 8 : 8;
  }

  function syncMenuPosition() {
    const header = document.querySelector(".site-header");
    if (!header || !mainNav) return;

    const headerHeight = header.offsetHeight;
    mainNav.style.top = `${headerHeight}px`;
    mainNav.style.height = `calc(100vh - ${headerHeight}px)`;
  }

  function closeMenu() {
    if (menuToggle && mainNav) {
      menuToggle.classList.remove("active");
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      unlockPageScroll();
    }
  }

  function openMenu() {
    if (menuToggle && mainNav) {
      syncMenuPosition();
      menuToggle.classList.add("active");
      mainNav.classList.add("open");
      menuToggle.setAttribute("aria-expanded", "true");
      lockPageScroll();
    }
  }

  function updateActiveNav() {
  const offset = getHeaderOffset();
  const scrollPosition = window.scrollY + offset + 20;
  const pageBottom = window.innerHeight + window.scrollY;
  const documentHeight = document.documentElement.scrollHeight;

  let currentSectionId = "top";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionId = section.getAttribute("id");

    if (scrollPosition >= sectionTop) {
      currentSectionId = sectionId;
    }
  });

  if (window.scrollY < 60) {
    currentSectionId = "top";
  }

  /* force Contact active when near bottom */
  if (pageBottom >= documentHeight - 80) {
    currentSectionId = "contact";
  }

  navLinks.forEach((link) => {
    link.classList.remove("active");

    const href = link.getAttribute("href");

    if (href === `#${currentSectionId}`) {
      link.classList.add("active");
    }
  });
}

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href) return;

      const targetId = href.replace("#", "");
      if (!targetId) return;

      e.preventDefault();
      closeMenu();
      smoothScrollToTarget(targetId);

      setTimeout(updateActiveNav, 400);
    });
  });

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isOpen = mainNav.classList.contains("open");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  document.addEventListener("click", (e) => {
    if (!menuToggle || !mainNav) return;

    const clickedInsideMenu = mainNav.contains(e.target);
    const clickedToggle = menuToggle.contains(e.target);

    if (!clickedInsideMenu && !clickedToggle && mainNav.classList.contains("open")) {
      closeMenu();
    }
  });

  syncMenuPosition();
  window.addEventListener("scroll", () => {
    updateActiveNav();
    syncMenuPosition();
  });
  window.addEventListener("load", () => {
    updateActiveNav();
    syncMenuPosition();
  });
  window.addEventListener("resize", () => {
    updateActiveNav();
    syncMenuPosition();
  });

  /* =========================================================
     PROJECT LIGHTBOX
  ========================================================= */
  const projectLightbox = document.getElementById("projectLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const projectCards = document.querySelectorAll(".project-card");

  const galleries = {};
  let currentCategory = "";
  let currentIndex = 0;

  projectCards.forEach((card) => {
    const category = card.dataset.category;
    const images = Array.from(card.querySelectorAll(".project-img")).map((img) => ({
      src: img.src,
      alt: img.alt
    }));

    galleries[category] = images;

    card.querySelectorAll(".project-img").forEach((img) => {
      img.addEventListener("click", () => {
        currentCategory = category;
        currentIndex = parseInt(img.dataset.index, 10);

        updateLightboxImage();

        if (projectLightbox) {
          projectLightbox.classList.add("active");
          lockPageScroll();
        }
      });
    });
  });

  function updateLightboxImage() {
    const currentGallery = galleries[currentCategory];
    if (!currentGallery || !currentGallery.length || !lightboxImage) return;

    lightboxImage.src = currentGallery[currentIndex].src;
    lightboxImage.alt = currentGallery[currentIndex].alt;
  }

  function closeLightbox() {
    if (!projectLightbox) return;

    projectLightbox.classList.remove("active");
    unlockPageScroll();
  }

  function showNextImage() {
    const currentGallery = galleries[currentCategory];
    if (!currentGallery || !currentGallery.length) return;

    currentIndex = (currentIndex + 1) % currentGallery.length;
    updateLightboxImage();
  }

  function showPrevImage() {
    const currentGallery = galleries[currentCategory];
    if (!currentGallery || !currentGallery.length) return;

    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    updateLightboxImage();
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", showNextImage);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", showPrevImage);
  }

  if (projectLightbox) {
    projectLightbox.addEventListener("click", (e) => {
      if (e.target === projectLightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (projectLightbox && projectLightbox.classList.contains("active")) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNextImage();
      if (e.key === "ArrowLeft") showPrevImage();
    }
  });

  /* =========================================================
     SHARED POPUP HELPERS
  ========================================================= */
  function openPopup(popup) {
    if (!popup) return;
    popup.classList.add("active");
    lockPageScroll();
  }

  function closePopup(popup) {
    if (!popup) return;
    popup.classList.remove("active");
    unlockPageScroll();
  }

  /* =========================================================
     CONSULTATION / ENQUIRY / BOOKING POPUPS
  ========================================================= */
  const consultationPopup = document.getElementById("consultationPopup");
  const callbackPopup = document.getElementById("callbackPopup");
  const enquiryPopup = document.getElementById("enquiryPopup");
  const bookingPopup = document.getElementById("bookingPopup");

  const openConsultationButtons = document.querySelectorAll(".open-consultation-btn");
  const openEnquiryButtons = document.querySelectorAll(".open-enquiry-btn");
  const openBookingButtons = document.querySelectorAll(".open-booking-btn");
  const openCallbackButton = document.getElementById("openCallbackPopup");
  const closePopupButtons = document.querySelectorAll(".site-popup-close");

  function closeAllPopups() {
    [consultationPopup, callbackPopup, enquiryPopup, bookingPopup].forEach((popup) => {
      if (popup) popup.classList.remove("active");
    });
    unlockPageScroll();
  }

  openConsultationButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeAllPopups();
      openPopup(consultationPopup);
    });
  });

  openEnquiryButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeAllPopups();
      openPopup(enquiryPopup);
    });
  });

  openBookingButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeAllPopups();
      openPopup(bookingPopup);
    });
  });

  if (openCallbackButton) {
    openCallbackButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closePopup(consultationPopup);
      openPopup(callbackPopup);
    });
  }

  closePopupButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const popupId = button.getAttribute("data-close-popup");
      const popup = document.getElementById(popupId);
      closePopup(popup);
    });
  });

  [consultationPopup, callbackPopup, enquiryPopup, bookingPopup].forEach((popup) => {
    if (!popup) return;

    popup.addEventListener("click", (e) => {
      if (e.target === popup) {
        closePopup(popup);
      }
    });
  });

  document.querySelectorAll("[data-close-popup]").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const popupId = button.getAttribute("data-close-popup");
      const popup = document.getElementById(popupId);
      closePopup(popup);
    });
  });

  document.querySelectorAll(".site-popup").forEach((popup) => {
    popup.addEventListener("click", (e) => {
      if (e.target === popup) {
        closePopup(popup);
      }
    });
  });

/* =========================================================
   EMAILJS FORMS
========================================================= */
const EMAILJS_SERVICE_ID = "service_5jox238";
const EMAILJS_TEMPLATE_ID = "template_rhmp061";
// Use ONE EmailJS template for callback, enquiry and booking

function handleEmailForm(formId, popup, successMessage) {
  const form = document.getElementById(formId);

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = form.querySelector("button[type='submit']");
    const originalText = submitButton ? submitButton.textContent : "";

    if (submitButton) {
      submitButton.textContent = "Sending...";
      submitButton.disabled = true;
    }

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        form
      );

      alert(successMessage);
      form.reset();

      if (popup) {
        closePopup(popup);
      }
    } catch (error) {
      console.error(`${formId} failed:`, error);
      alert("Sorry, something went wrong. Please try again or email us directly.");
    } finally {
      if (submitButton) {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    }
  });
}

handleEmailForm(
  "callbackForm",
  callbackPopup,
  "Thank you. Your call back request has been sent."
);

handleEmailForm(
  "enquiryForm",
  enquiryPopup,
  "Thank you. Your enquiry has been sent."
);

handleEmailForm(
  "bookingForm",
  bookingPopup,
  "Thank you. Your booking request has been sent."
);

  /* =========================================================
     REVIEW POPUP
  ========================================================= */
  const openReviewBtn = document.getElementById("openReviewForm");
  const reviewPopup = document.getElementById("reviewPopup");
  const closeReviewBtn = document.getElementById("closeReviewForm");
  const reviewForm = document.getElementById("reviewForm");
  const dateInput = document.querySelector('input[name="date"]');

  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }

  if (openReviewBtn && reviewPopup) {
    openReviewBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openPopup(reviewPopup);
    });
  }

  if (closeReviewBtn && reviewPopup) {
    closeReviewBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closePopup(reviewPopup);
    });
  }

  if (reviewPopup) {
    reviewPopup.addEventListener("click", (e) => {
      if (e.target === reviewPopup) {
        closePopup(reviewPopup);
      }
    });
  }

  if (reviewForm && reviewPopup) {
    reviewForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        await emailjs.sendForm(
          "service_5jox238",
          "template_tptkxqh",
          reviewForm
        );

        alert("Thank you for your review.");
        reviewForm.reset();

        if (dateInput) {
          const today = new Date().toISOString().split("T")[0];
          dateInput.value = today;
        }

        closePopup(reviewPopup);
      } catch (error) {
        console.error("Review submission failed:", error);
        alert("Sorry, something went wrong. Please try again.");
      }
    });
  }

  /* =========================================================
     ESC KEY CLOSE
  ========================================================= */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
      closeAllPopups();
      closeLightbox();
      if (reviewPopup) closePopup(reviewPopup);
    }
  });
});
