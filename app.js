// DOM Elements
const navbar = document.getElementById("navbar");
const navMenu = document.getElementById("nav-menu-mobile");
const navHamburger = document.getElementById("nav-hamburger");
const navLinks = document.querySelectorAll(".nav-link");
const contactForm = document.getElementById("contact-form");

// Navigation functionality
class Navigation {
  constructor() {
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupSmoothScrolling();
    this.setupActiveLinks();
    this.setupNavbarScroll();
  }

  // Mobile hamburger menu toggle
  setupMobileMenu() {
    navHamburger.addEventListener("click", () => {
      // Toggle mobile menu visibility
      navMenu.classList.toggle("hidden");
      navMenu.classList.toggle("flex");

      // Toggle hamburger animation
      navHamburger.classList.toggle("open");

      // Prevent body scroll when menu is open
      document.body.style.overflow = navMenu.classList.contains("flex")
        ? "hidden"
        : "";

      // Update aria attributes for accessibility
      const isExpanded = navMenu.classList.contains("flex");
      navHamburger.setAttribute("aria-expanded", isExpanded);
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.add("hidden");
        navMenu.classList.remove("flex");
        navHamburger.classList.remove("open");
        document.body.style.overflow = "";
        navHamburger.setAttribute("aria-expanded", "false");
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !navHamburger.contains(e.target)) {
        navMenu.classList.add("hidden");
        navMenu.classList.remove("flex");
        navHamburger.classList.remove("open");
        document.body.style.overflow = "";
        navHamburger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Smooth scrolling for navigation links
  setupSmoothScrolling() {
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      });
    });
  }

  // Update active navigation link based on scroll position
  setupActiveLinks() {
    const sections = document.querySelectorAll("section[id]");

    window.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY + 100; // Offset for navbar

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");
        const correspondingLink = document.querySelector(
          `a[href="#${sectionId}"]`
        );

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          navLinks.forEach((link) => {
            link.classList.remove("text-lavender", "font-semibold");
            link.classList.add("text-dark-gray");
          });
          if (correspondingLink) {
            correspondingLink.classList.remove("text-dark-gray");
            correspondingLink.classList.add("text-lavender", "font-semibold");
          }
        }
      });
    });
  }

  // Navbar background on scroll
  setupNavbarScroll() {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.style.backgroundColor =
          "rgba(var(--color-surface-rgb, 255, 255, 253), 0.95)";
        navbar.style.boxShadow = "var(--shadow-sm)";
      } else {
        navbar.style.backgroundColor = "var(--color-surface)";
        navbar.style.boxShadow = "none";
      }
    });
  }
}

// Form validation and handling
class ContactFormHandler {
  constructor() {
    this.form = contactForm;
    this.fields = {
      name: document.getElementById("name"),
      email: document.getElementById("email"),
      subject: document.getElementById("subject"),
      message: document.getElementById("message"),
    };
    this.errors = {
      name: document.getElementById("name-error"),
      email: document.getElementById("email-error"),
      subject: document.getElementById("subject-error"),
      message: document.getElementById("message-error"),
    };
    this.init();
  }

  init() {
    this.setupFormValidation();
    this.setupRealTimeValidation();
  }

  // Form submission handling
  setupFormValidation() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();

      const isValid = this.validateForm();

      if (isValid) {
        this.submitForm();
      }
    });
  }

  // Real-time validation on input
  setupRealTimeValidation() {
    Object.keys(this.fields).forEach((fieldName) => {
      const field = this.fields[fieldName];

      field.addEventListener("blur", () => {
        this.validateField(fieldName);
      });

      field.addEventListener("input", () => {
        if (field.classList.contains("error")) {
          this.validateField(fieldName);
        }
      });
    });
  }

  // Validate individual field
  validateField(fieldName) {
    const field = this.fields[fieldName];
    const errorElement = this.errors[fieldName];
    const value = field.value.trim();

    let isValid = true;
    let errorMessage = "";

    switch (fieldName) {
      case "name":
        if (!value) {
          errorMessage = "Name is required";
          isValid = false;
        } else if (value.length < 2) {
          errorMessage = "Name must be at least 2 characters";
          isValid = false;
        }
        break;

      case "email":
        // Fixed email validation regex - more permissive and standard
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!value) {
          errorMessage = "Email is required";
          isValid = false;
        } else if (!emailRegex.test(value)) {
          errorMessage = "Please enter a valid email address";
          isValid = false;
        }
        break;

      case "subject":
        if (!value) {
          errorMessage = "Subject is required";
          isValid = false;
        } else if (value.length < 3) {
          errorMessage = "Subject must be at least 3 characters";
          isValid = false;
        }
        break;

      case "message":
        if (!value) {
          errorMessage = "Message is required";
          isValid = false;
        } else if (value.length < 10) {
          errorMessage = "Message must be at least 10 characters";
          isValid = false;
        }
        break;
    }

    // Update UI based on validation
    if (isValid) {
      field.classList.remove("border-red-500", "focus:ring-red-500");
      field.classList.add("border-green-500", "focus:ring-green-500");
      errorElement.textContent = "";
    } else {
      field.classList.remove("border-green-500", "focus:ring-green-500");
      field.classList.add("border-red-500", "focus:ring-red-500");
      errorElement.textContent = errorMessage;
    }

    return isValid;
  }

  // Validate entire form
  validateForm() {
    let isFormValid = true;

    Object.keys(this.fields).forEach((fieldName) => {
      const fieldValid = this.validateField(fieldName);
      if (!fieldValid) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  // Submit form (simulate submission)
  async submitForm() {
    const submitButton = this.form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Show loading state
    submitButton.textContent = "Sending...";
    submitButton.disabled = true;

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success message
      this.showMessage(
        "Thank you! Your message has been sent successfully.",
        "success"
      );

      // Reset form
      this.form.reset();
      Object.values(this.fields).forEach((field) => {
        field.classList.remove(
          "border-red-500",
          "focus:ring-red-500",
          "border-green-500",
          "focus:ring-green-500"
        );
      });
      Object.values(this.errors).forEach((error) => {
        error.textContent = "";
      });
    } catch (error) {
      // Show error message
      this.showMessage(
        "Sorry, there was an error sending your message. Please try again.",
        "error"
      );
    } finally {
      // Restore button
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  }

  // Show success/error message
  showMessage(text, type) {
    // Remove existing messages
    const existingMessage = document.querySelector(".form-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message element
    const messageElement = document.createElement("div");
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = text;

    // Style the message
    messageElement.style.cssText = `
            padding: var(--space-12) var(--space-16);
            margin-top: var(--space-16);
            border-radius: var(--radius-base);
            font-weight: var(--font-weight-medium);
            ${
              type === "success"
                ? `
                background-color: rgba(var(--color-success-rgb), 0.1);
                color: var(--color-success);
                border: 1px solid rgba(var(--color-success-rgb), 0.2);
            `
                : `
                background-color: rgba(var(--color-error-rgb), 0.1);
                color: var(--color-error);
                border: 1px solid rgba(var(--color-error-rgb), 0.2);
            `
            }
        `;

    // Insert message after form
    this.form.appendChild(messageElement);

    // Auto-remove message after 5 seconds
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.remove();
      }
    }, 5000);
  }
}

// Intersection Observer for animations
class AnimationObserver {
  constructor() {
    this.init();
  }

  init() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-8");
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
      ".skill-category, .timeline-item, .project-card, .cert-item"
    );

    animateElements.forEach((el) => {
      el.classList.add(
        "opacity-0",
        "translate-y-8",
        "transition-all",
        "duration-600",
        "ease-out"
      );
      observer.observe(el);
    });
  }
}

// Progress bar animation
class ProgressBarAnimation {
  constructor() {
    this.init();
  }

  init() {
    const progressBars = document.querySelectorAll(".progress-fill");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const progressBar = entry.target;
            const width = progressBar.style.width;

            // Reset and animate
            progressBar.style.width = "0%";
            setTimeout(() => {
              progressBar.style.width = width;
            }, 300);
          }
        });
      },
      { threshold: 0.5 }
    );

    progressBars.forEach((bar) => observer.observe(bar));
  }
}

// Utility functions
class Utils {
  // Debounce function for performance optimization
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Smooth scroll to top functionality
  static scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Get current section in viewport
  static getCurrentSection() {
    const sections = document.querySelectorAll("section[id]");
    const scrollPosition = window.scrollY + 100;

    for (let section of sections) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        return section.getAttribute("id");
      }
    }
    return null;
  }
}

// Initialize application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  new Navigation();

  if (contactForm) {
    new ContactFormHandler();
  }

  new AnimationObserver();
  new ProgressBarAnimation();

  // Add scroll-to-top functionality for logo
  const logoLink = document.querySelector(".nav-logo a");
  if (logoLink) {
    logoLink.addEventListener("click", (e) => {
      e.preventDefault();
      Utils.scrollToTop();
    });
  }

  // Performance optimization: debounced scroll handler
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
      // Any scroll-based functionality can be added here
    }, 10);
  });

  // Add loading class removal for smoother initial animation
  document.body.classList.add("loaded");
});

// Handle window resize for responsive adjustments
window.addEventListener(
  "resize",
  Utils.debounce(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 600) {
      navMenu.classList.add("hidden");
      navMenu.classList.remove("flex");
      navHamburger.classList.remove("open");
      document.body.style.overflow = "";
      navHamburger.setAttribute("aria-expanded", "false");
    }
  }, 250)
);

// Keyboard navigation support
document.addEventListener("keydown", (e) => {
  // Close mobile menu on Escape key
  if (e.key === "Escape" && navMenu.classList.contains("flex")) {
    navMenu.classList.add("hidden");
    navMenu.classList.remove("flex");
    navHamburger.classList.remove("open");
    document.body.style.overflow = "";
    navHamburger.setAttribute("aria-expanded", "false");
    navHamburger.focus();
  }
});

// Export for potential future use
window.PortfolioApp = {
  Navigation,
  ContactFormHandler,
  AnimationObserver,
  ProgressBarAnimation,
  Utils,
};
