
document.addEventListener("DOMContentLoaded", function () {
  // scroll spy
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav-links a[href^='#']");

  var setActiveLink = function (sectionId) {
    navLinks.forEach(function (link) {
      var linkTarget = link.getAttribute("href").replace("#", "");

      if (linkTarget === sectionId) {
        link.classList.add("active", "text-primary");
        link.setAttribute("aria-current", "true");
      } else {
        link.classList.remove("active", "text-primary");
        link.removeAttribute("aria-current");
      }
    });
  };

  var scrollSpyObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    {
      rootMargin: "-40% 0px -55% 0px",
      threshold: 0,
    }
  );

  sections.forEach(function (section) {
    scrollSpyObserver.observe(section);
  });

  // dark mode and light mode 
  var htmlElement = document.documentElement;
  var themeToggleButton = document.getElementById("theme-toggle-button");
  var THEME_STORAGE_KEY = "portfolio-theme";

  var applyTheme = function (theme) {
    if (theme === "dark") {
      htmlElement.classList.add("dark");
      themeToggleButton.setAttribute("aria-pressed", "true");
    } else {
      htmlElement.classList.remove("dark");
      themeToggleButton.setAttribute("aria-pressed", "false");
    }
  };

  // dark mode restore or light mode
  var savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme) {
    applyTheme(savedTheme);
  }

  themeToggleButton.addEventListener("click", function () {
    var isDark = htmlElement.classList.contains("dark");
    var newTheme = isDark ? "light" : "dark";

    applyTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  });

  

  // navs
  var filterButtons = document.querySelectorAll(".portfolio-filter");
  var portfolioItems = document.querySelectorAll(".portfolio-item");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var selectedFilter = button.getAttribute("data-filter");

      // btn active
      filterButtons.forEach(function (btn) {
        btn.classList.remove(
          "active",
          "bg-linear-to-r",
          "from-primary",
          "to-secondary",
          "text-white"
        );
        btn.classList.add(
          "bg-white",
          "dark:bg-slate-800",
          "text-slate-600",
          "dark:text-slate-300"
        );
        btn.setAttribute("aria-pressed", "false");
      });

      button.classList.add(
        "active",
        "bg-linear-to-r",
        "from-primary",
        "to-secondary",
        "text-white"
      );
      button.classList.remove(
        "bg-white",
        "dark:bg-slate-800",
        "text-slate-600",
        "dark:text-slate-300"
      );
      button.setAttribute("aria-pressed", "true");

      // إظهار/إخفاء الكاردز حسب الفلتر
      portfolioItems.forEach(function (item) {
        var itemCategory = item.getAttribute("data-category");

        if (selectedFilter === "all" || itemCategory === selectedFilter) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    });
  });





  //Carousel
  var carouselTrack = document.getElementById("testimonials-carousel");
  var testimonialCards = document.querySelectorAll(".testimonial-card");
  var nextButton = document.getElementById("next-testimonial");
  var prevButton = document.getElementById("prev-testimonial");
  var indicators = document.querySelectorAll(".carousel-indicator");

  var currentIndex = 0;
  var autoplayInterval = null;
  var AUTOPLAY_DELAY = 5000;

  // responsev
  var getVisibleCardsCount = function () {
    if (window.innerWidth >= 1024) {
      return 3;
    } else if (window.innerWidth >= 640) {
      return 2;
    }
    return 1;
  };

  var getMaxIndex = function () {
    var visibleCount = getVisibleCardsCount();
    var maxIndex = testimonialCards.length - visibleCount;
    return maxIndex < 0 ? 0 : maxIndex;
  };

  var updateIndicators = function () {
    indicators.forEach(function (indicator, idx) {
      if (idx === currentIndex) {
        indicator.classList.add("bg-accent");
        indicator.classList.remove("bg-slate-400", "dark:bg-slate-600");
        indicator.setAttribute("aria-selected", "true");
      } else {
        indicator.classList.remove("bg-accent");
        indicator.classList.add("bg-slate-400", "dark:bg-slate-600");
        indicator.setAttribute("aria-selected", "false");
      }
    });
  };

  var goToSlide = function (index) {
    var maxIndex = getMaxIndex();

    if (index < 0) {
      index = maxIndex;
    } else if (index > maxIndex) {
      index = 0;
    }

    currentIndex = index;

    var cardWidthPercent = 100 / getVisibleCardsCount();
    var offsetPercent = currentIndex * cardWidthPercent;

    carouselTrack.style.transform = "translateX(" + offsetPercent + "%)";

    updateIndicators();
  };

  var startAutoplay = function () {
    stopAutoplay();
    autoplayInterval = setInterval(function () {
      goToSlide(currentIndex + 1);
    }, AUTOPLAY_DELAY);
  };

  var stopAutoplay = function () {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  };

  nextButton.addEventListener("click", function () {
    goToSlide(currentIndex + 1);
    startAutoplay();
  });

  prevButton.addEventListener("click", function () {
    goToSlide(currentIndex - 1);
    startAutoplay();
  });

  indicators.forEach(function (indicator) {
    indicator.addEventListener("click", function () {
      var targetIndex = parseInt(indicator.getAttribute("data-index"), 10);
      goToSlide(targetIndex);
      startAutoplay();
    });
  });

  carouselTrack.addEventListener("mouseenter", stopAutoplay);
  carouselTrack.addEventListener("mouseleave", startAutoplay);

  window.addEventListener("resize", function () {
    goToSlide(currentIndex);
  });

  goToSlide(0);
  startAutoplay();

//  sidebar + themes
  var settingsToggleButton = document.getElementById("settings-toggle");
  var settingsSidebar = document.getElementById("settings-sidebar");
  var closeSettingsButton = document.getElementById("close-settings");
  var resetSettingsButton = document.getElementById("reset-settings");
  var fontOptions = document.querySelectorAll(".font-option");
  var themeColorsGrid = document.getElementById("theme-colors-grid");

  var FONT_STORAGE_KEY = "portfolio-font";
  var COLOR_STORAGE_KEY = "portfolio-color-theme";
  var DEFAULT_FONT = "tajawal";

  //open sidbar
  var openSidebar = function () {
    settingsSidebar.classList.remove("translate-x-full");
    settingsSidebar.setAttribute("aria-hidden", "false");
    settingsToggleButton.setAttribute("aria-expanded", "true");
  };

  var closeSidebar = function () {
    settingsSidebar.classList.add("translate-x-full");
    settingsSidebar.setAttribute("aria-hidden", "true");
    settingsToggleButton.setAttribute("aria-expanded", "false");
  };

  settingsToggleButton.addEventListener("click", function () {
    var isOpen = !settingsSidebar.classList.contains("translate-x-full");
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  closeSettingsButton.addEventListener("click", closeSidebar);

  // close seting sidebar
  document.addEventListener("click", function (event) {
    var isClickInsideSidebar = settingsSidebar.contains(event.target);
    var isClickOnToggleButton = settingsToggleButton.contains(event.target);
    var isSidebarOpen = !settingsSidebar.classList.contains("translate-x-full");

    if (isSidebarOpen && !isClickInsideSidebar && !isClickOnToggleButton) {
      closeSidebar();
    }
  });

  // fonts select
  var fontClassesList = ["font-alexandria", "font-tajawal", "font-cairo"];

  var applyFont = function (fontName) {
    fontClassesList.forEach(function (fontClass) {
      document.body.classList.remove(fontClass);
    });
    document.body.classList.add("font-" + fontName);

    fontOptions.forEach(function (option) {
      var isSelected = option.getAttribute("data-font") === fontName;
      option.classList.toggle("active", isSelected);
      option.classList.toggle("border-primary", isSelected);
      option.setAttribute("aria-checked", isSelected ? "true" : "false");
    });
  };

  fontOptions.forEach(function (option) {
    option.addEventListener("click", function () {
      var selectedFont = option.getAttribute("data-font");
      applyFont(selectedFont);
      localStorage.setItem(FONT_STORAGE_KEY, selectedFont);
    });
  });

  // colors theme
  var colorPresets = [
    { name: "بنفسجي", primary: "#6366f1", secondary: "#8b5cf6", accent: "#ec4899" },
    { name: "أزرق", primary: "#3b82f6", secondary: "#0ea5e9", accent: "#06b6d4" },
    { name: "أخضر", primary: "#10b981", secondary: "#14b8a6", accent: "#84cc16" },
    { name: "برتقالي", primary: "#f97316", secondary: "#f59e0b", accent: "#eab308" },
    { name: "وردي", primary: "#ec4899", secondary: "#f43f5e", accent: "#d946ef" },
    { name: "أحمر", primary: "#ef4444", secondary: "#f97316", accent: "#fb7185" },
    { name: "تركواز", primary: "#06b6d4", secondary: "#0ea5e9", accent: "#22d3ee" },
    { name: "كحلي", primary: "#4f46e5", secondary: "#6366f1", accent: "#3b82f6" },
  ];

  var applyColorTheme = function (preset) {
    var root = document.documentElement;
    root.style.setProperty("--color-primary", preset.primary);
    root.style.setProperty("--color-secondary", preset.secondary);
    root.style.setProperty("--color-accent", preset.accent);

    // color switch
    var allSwatches = themeColorsGrid.querySelectorAll(".theme-color-swatch");
    allSwatches.forEach(function (swatch) {
      var isSelected = swatch.getAttribute("data-color-name") === preset.name;
      swatch.classList.toggle("ring-2", isSelected);
      swatch.classList.toggle("ring-offset-2", isSelected);
      swatch.classList.toggle("ring-slate-900", isSelected);
      swatch.classList.toggle("dark:ring-white", isSelected);
    });
  };

  // color theme
  colorPresets.forEach(function (preset) {
    var swatchButton = document.createElement("button");
    swatchButton.type = "button";
    swatchButton.className =
      "theme-color-swatch w-full aspect-square rounded-xl transition-transform duration-200 hover:scale-110";
    swatchButton.style.background =
      "linear-gradient(135deg, " + preset.primary + ", " + preset.secondary + ", " + preset.accent + ")";
    swatchButton.setAttribute("data-color-name", preset.name);
    swatchButton.setAttribute("aria-label", "لون الثيم: " + preset.name);

    swatchButton.addEventListener("click", function () {
      applyColorTheme(preset);
      localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(preset));
    });

    themeColorsGrid.appendChild(swatchButton);
  });

  // saved page
  var savedFont = localStorage.getItem(FONT_STORAGE_KEY) || DEFAULT_FONT;
  applyFont(savedFont);

  var savedColorTheme = localStorage.getItem(COLOR_STORAGE_KEY);
  if (savedColorTheme) {
    applyColorTheme(JSON.parse(savedColorTheme));
  }

  // reset btn
  resetSettingsButton.addEventListener("click", function () {
    localStorage.removeItem(FONT_STORAGE_KEY);
    localStorage.removeItem(COLOR_STORAGE_KEY);

    applyFont(DEFAULT_FONT);

    var root = document.documentElement;
    root.style.removeProperty("--color-primary");
    root.style.removeProperty("--color-secondary");
    root.style.removeProperty("--color-accent");

    var allSwatches = themeColorsGrid.querySelectorAll(".theme-color-swatch");
    allSwatches.forEach(function (swatch) {
      swatch.classList.remove("ring-2", "ring-offset-2", "ring-slate-900", "dark:ring-white");
    });
  });

  // scroll to top btn
  var scrollToTopButton = document.getElementById("scroll-to-top");
  var SCROLL_SHOW_THRESHOLD = 400;

  window.addEventListener("scroll", function () {
    if (window.scrollY > SCROLL_SHOW_THRESHOLD) {
      scrollToTopButton.classList.remove("opacity-0", "invisible");
      scrollToTopButton.classList.add("opacity-100", "visible");
    } else {
      scrollToTopButton.classList.add("opacity-0", "invisible");
      scrollToTopButton.classList.remove("opacity-100", "visible");
    }
  });

  scrollToTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});



// =================================================================
// Smooth Scroll مع حساب ارتفاع الـ Navbar الثابت (Fixed Header)
// =================================================================
var headerElement = document.getElementById("header");

navLinks.forEach(function (link) {
  link.addEventListener("click", function (event) {
    var targetId = link.getAttribute("href");

    // لو الرابط بيشاور على Section في نفس الصفحة بس
    if (targetId.startsWith("#")) {
      var targetSection = document.querySelector(targetId);

      if (targetSection) {
        event.preventDefault();

        var headerHeight = headerElement.offsetHeight;
        var targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    }
  });
});