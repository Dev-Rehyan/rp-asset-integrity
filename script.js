document.addEventListener("DOMContentLoaded", () => {
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
  const logoLink = document.querySelector('.logo[href="#top"]');
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  function getHeaderOffset() {
    const header = document.querySelector(".site-header");
    return header ? header.offsetHeight + 8 : 8;
  }

  function closeMenu() {
    if (menuToggle && mainNav) {
      menuToggle.classList.remove("active");
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }
  }

  function openMenu() {
    if (menuToggle && mainNav) {
      menuToggle.classList.add("active");
      mainNav.classList.add("open");
      menuToggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open");
    }
  }

  function scrollToSection(targetId) {
    if (targetId === "top") {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      return;
    }

    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;

    const offset = getHeaderOffset();
    const targetPosition =
      targetSection.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });
  }

  function updateActiveNav() {
    if (!navLinks.length || !sections.length) return;

    const offset = getHeaderOffset();
    const scrollPosition = window.scrollY + offset + 20;

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

    navLinks.forEach((link) => {
      link.classList.remove("active");

      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#")) return;

      e.preventDefault();

      const targetId = href.replace("#", "");
      closeMenu();
      scrollToSection(targetId);

      setTimeout(updateActiveNav, 400);
    });
  });

  if (logoLink) {
    logoLink.addEventListener("click", (e) => {
      e.preventDefault();
      closeMenu();
      scrollToSection("top");
    });
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
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

  window.addEventListener("scroll", updateActiveNav);
  window.addEventListener("load", updateActiveNav);
  window.addEventListener("resize", updateActiveNav);

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
          document.body.style.overflow = "hidden";
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
    document.body.style.overflow = "";
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
      if (e.key === "Escape") {
        closeLightbox();
      }

      if (e.key === "ArrowRight") {
        showNextImage();
      }

      if (e.key === "ArrowLeft") {
        showPrevImage();
      }
    }
  });

  /* =========================================================
     SHARED POPUP HELPERS
  ========================================================= */
  function openPopup(popup) {
    if (!popup) return;
    popup.classList.add("active");
    document.body.classList.add("menu-open");
  }

  function closePopup(popup) {
    if (!popup) return;
    popup.classList.remove("active");

    const anyPopupStillOpen = document.querySelector(".site-popup.active, .review-popup.active");
    if (!anyPopupStillOpen && !mainNav?.classList.contains("open")) {
      document.body.classList.remove("menu-open");
    }
  }

  /* =========================================================
     CONSULTATION / ENQUIRY / BOOKING POPUPS
  ========================================================= */
  const consultationPopup = document.getElementById("consultationPopup");
  const callbackPopup = document.getElementById("callbackPopup");
  const enquiryPopup = document.getElementById("enquiryPopup");
  const bookingPopup = document.getElementById("bookingPopup");

  const openConsultationPopup = document.getElementById("openConsultationPopup");
  const openConsultationPopup2 = document.getElementById("openConsultationPopup2");
  const openEnquiryPopup = document.getElementById("openEnquiryPopup");
  const openEnquiryPopup2 = document.getElementById("openEnquiryPopup2");
  const openEnquiryPopup3 = document.getElementById("openEnquiryPopup3");
  const openBookingPopup = document.getElementById("openBookingPopup");
  const openCallbackPopup = document.getElementById("openCallbackPopup");
  const openEnquiryButtons = document.querySelectorAll(".open-enquiry-btn");

  if (openConsultationPopup) {
    openConsultationPopup.addEventListener("click", () => openPopup(consultationPopup));
  }

  if (openConsultationPopup2) {
    openConsultationPopup2.addEventListener("click", () => openPopup(consultationPopup));
  }

  if (openEnquiryPopup) {
    openEnquiryPopup.addEventListener("click", () => openPopup(enquiryPopup));
  }

  if (openEnquiryPopup2) {
    openEnquiryPopup2.addEventListener("click", () => openPopup(enquiryPopup));
  }

  if (openEnquiryPopup3) {
    openEnquiryPopup3.addEventListener("click", () => openPopup(enquiryPopup));
  }

  openEnquiryButtons.forEach((button) => {
    button.addEventListener("click", () => openPopup(enquiryPopup));
  });

  if (openBookingPopup) {
    openBookingPopup.addEventListener("click", () => openPopup(bookingPopup));
  }

  if (openCallbackPopup) {
    openCallbackPopup.addEventListener("click", () => {
      closePopup(consultationPopup);
      openPopup(callbackPopup);
    });
  }

  document.querySelectorAll("[data-close-popup]").forEach((button) => {
    button.addEventListener("click", () => {
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
     CALLBACK FORM
  ========================================================= */
  const callbackForm = document.getElementById("callbackForm");

  if (callbackForm) {
    callbackForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        await emailjs.sendForm(
          "service_5jox238",
          "template_callback",
          callbackForm
        );

        alert("Thank you. Your call back request has been sent.");
        callbackForm.reset();
        closePopup(callbackPopup);
      } catch (error) {
        console.error("Callback form failed:", error);
        alert("Sorry, something went wrong. Please try again.");
      }
    });
  }

  /* =========================================================
     ENQUIRY FORM
  ========================================================= */
  const enquiryForm = document.getElementById("enquiryForm");

  if (enquiryForm) {
    enquiryForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        await emailjs.sendForm(
          "service_5jox238",
          "template_enquiry",
          enquiryForm
        );

        alert("Thank you. Your enquiry has been sent.");
        enquiryForm.reset();
        closePopup(enquiryPopup);
      } catch (error) {
        console.error("Enquiry form failed:", error);
        alert("Sorry, something went wrong. Please try again.");
      }
    });
  }

  /* =========================================================
     BOOKING FORM
  ========================================================= */
  const bookingForm = document.getElementById("bookingForm");

  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        await emailjs.sendForm(
          "service_5jox238",
          "template_booking",
          bookingForm
        );

        alert("Thank you. Your booking request has been sent.");
        bookingForm.reset();
        closePopup(bookingPopup);
      } catch (error) {
        console.error("Booking form failed:", error);
        alert("Sorry, something went wrong. Please try again.");
      }
    });
  }

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
    openReviewBtn.addEventListener("click", () => {
      openPopup(reviewPopup);
    });
  }

  if (closeReviewBtn && reviewPopup) {
    closeReviewBtn.addEventListener("click", () => {
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
});
