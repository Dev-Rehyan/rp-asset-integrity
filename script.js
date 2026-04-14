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
     SMOOTH SCROLL + ACTIVE NAVIGATION
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

  function closeMobileMenu() {
    if (menuToggle && mainNav) {
      menuToggle.classList.remove("active");
      mainNav.classList.remove("open");
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
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
    const offset = getHeaderOffset();
    const scrollPosition = window.scrollY + offset + 10;

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
      closeMobileMenu();
      scrollToSection(targetId);

      setTimeout(updateActiveNav, 450);
    });
  });

  if (logoLink) {
    logoLink.addEventListener("click", (e) => {
      e.preventDefault();
      closeMobileMenu();
      scrollToSection("top");
    });
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.classList.toggle("active", isOpen);
      document.body.classList.toggle("menu-open", isOpen);
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  window.addEventListener("scroll", updateActiveNav);
  window.addEventListener("load", updateActiveNav);
  window.addEventListener("resize", updateActiveNav);

  /* =========================================================
     PROJECT LIGHTBOX GALLERY
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
    if (!projectLightbox || !projectLightbox.classList.contains("active")) return;

    if (e.key === "Escape") {
      closeLightbox();
    }

    if (e.key === "ArrowRight") {
      showNextImage();
    }

    if (e.key === "ArrowLeft") {
      showPrevImage();
    }
  });

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
      reviewPopup.classList.add("active");
    });
  }

  if (closeReviewBtn && reviewPopup) {
    closeReviewBtn.addEventListener("click", () => {
      reviewPopup.classList.remove("active");
    });
  }

  if (reviewPopup) {
    reviewPopup.addEventListener("click", (e) => {
      if (e.target === reviewPopup) {
        reviewPopup.classList.remove("active");
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

        alert("Thank you for your review!");
        reviewForm.reset();

        if (dateInput) {
          const today = new Date().toISOString().split("T")[0];
          dateInput.value = today;
        }

        reviewPopup.classList.remove("active");
      } catch (error) {
        console.error("Review submission failed:", error);
        alert("Sorry, something went wrong. Please try again.");
      }
    });
  }
});
