/* ═══════════════════════════════════════════════
   THE GENTLEMEN'S CUT — Animations
   ═══════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

// ── LENIS SMOOTH SCROLL ──
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  touchMultiplier: 2,
});

// Connect Lenis to GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ── NAV HIDE ON SCROLL ──
const siteNav = document.getElementById('site-nav');
let lastScrollY = 0;

lenis.on('scroll', ({ scroll }) => {
  if (scroll > 100 && scroll > lastScrollY) {
    siteNav.classList.add('nav-hidden');
  } else {
    siteNav.classList.remove('nav-hidden');
  }
  lastScrollY = scroll;
});

window.addEventListener("load", () => {
  const curtain = document.getElementById('curtain');
  const introSeen = localStorage.getItem('introSeen');

  if (introSeen) {
    // Skip intro — hide curtain, show hero immediately
    curtain.style.display = 'none';
    document.body.style.overflow = 'auto';
    gsap.set(".hero-subtitle", { opacity: 1 });
    gsap.set(".hero-buttons", { opacity: 1, y: 0 });
  } else {
    // First visit — play full intro
    const tl = gsap.timeline();
    tl.timeScale(1.5);

    const MORPH_DURATION = 2;
    const CLOSE_DURATION = 1;
    const CLOSE_ANGLE = 48;
    const smoothEase = "cubic-bezier(0.4, 0, 0.2, 1)";

    gsap.set("#handle-left, #handle-right", { attr: { r: 0 } });
    gsap.set("#pivot", { attr: { r: 0 } });

    tl.to(".curtain-logo", {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out"
    })

      .to("#line-left", {
        attr: { x1: 115, y1: 330, x2: 285, y2: 70 },
        duration: MORPH_DURATION,
        ease: smoothEase
      }, 0.3)

      .to("#line-right", {
        attr: { x1: 115, y1: 70, x2: 285, y2: 330 },
        duration: MORPH_DURATION,
        ease: smoothEase
      }, 0.3)

      .to("#a-crossbar", {
        opacity: 0,
        duration: 0.8,
        ease: "power1.in"
      }, 0.3)

      .to("#handle-left", {
        opacity: 1,
        attr: { r: 16 },
        duration: 0.6,
        ease: "power2.out"
      }, 0.3 + MORPH_DURATION * 0.5)
      .to("#handle-right", {
        opacity: 1,
        attr: { r: 16 },
        duration: 0.6,
        ease: "power2.out"
      }, 0.3 + MORPH_DURATION * 0.5)

      .to("#dot-left", {
        opacity: 1,
        duration: 0.4,
      }, 0.3 + MORPH_DURATION * 0.7)
      .to("#dot-right", {
        opacity: 1,
        duration: 0.4,
      }, 0.3 + MORPH_DURATION * 0.7)

      .to("#pivot", {
        opacity: 1,
        attr: { r: 6 },
        duration: 0.4,
        ease: "power2.out"
      }, 0.3 + MORPH_DURATION * 0.8)

      .to("#blade-left", {
        rotation: -CLOSE_ANGLE,
        svgOrigin: "200 200",
        duration: CLOSE_DURATION,
        ease: "power2.inOut"
      }, 0.3 + MORPH_DURATION)
      .to("#blade-right", {
        rotation: CLOSE_ANGLE,
        svgOrigin: "200 200",
        duration: CLOSE_DURATION,
        ease: "power2.inOut"
      }, "<")

      .to(".curtain-logo", {
        scale: 0.6,
        opacity: 0,
        duration: 0.5,
        ease: "power3.in"
      })

      .to(".panel.left", {
        x: "-8%",
        duration: 0.6,
        ease: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      }, "-=1")
      .to(".panel.right", {
        x: "8%",
        duration: 0.6,
        ease: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      }, "<")

      .to(".panel.left", {
        x: "-110%",
        duration: 0.6,
        ease: "cubic-bezier(0.77, -0.075, 1, 1)"
      })
      .to(".panel.right", {
        x: "110%",
        duration: 0.6,
        ease: "cubic-bezier(0.77, -0.075, 1, 1)"
      }, "<")

      .to(curtain, {
        display: "none",
        duration: 0,
        onComplete: () => {
          document.body.style.overflow = 'auto';
          localStorage.setItem('introSeen', '1');
        }
      })

      .from(".hero-content h1", {
        opacity: 0, y: 60, duration: 1, ease: "power3.out"
      }, "-=0.3")
      .to(".hero-subtitle", {
        opacity: 1, duration: 0.8, ease: "power2.out"
      }, "-=0.5")
      .to(".hero-buttons", {
        opacity: 1, duration: 0.8, y: 0, ease: "power2.out"
      }, "-=0.4");
  }


  // ── HERO PARALLAX ──
  gsap.to(".hero-overlay", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    },
    opacity: 0.95
  });

  // ── SERVICES HORIZONTAL SCROLL ──
  const servicesSection = document.querySelector(".services");
  const track = document.querySelector(".services-track");

  if (servicesSection && track) {
    function updateHorizontalScroll() {
      if (window.innerWidth <= 768) return; // Managed by CSS on mobile

      const rect = servicesSection.getBoundingClientRect();
      const total = servicesSection.offsetHeight;

      // Calculate progress starting when section enters bottom, hitting 1.0 EXACTLY when it begins to un-stick
      const progress = Math.min(
        Math.max((window.innerHeight - rect.top) / total, 0),
        1
      );

      // Add a buffer to maxX so the last card pushes further into the center
      const maxX = track.scrollWidth - window.innerWidth + 250;
      track.style.transform = `translateX(-${progress * maxX}px)`;
    }

    gsap.ticker.add(updateHorizontalScroll);
  }

  // ── SECTION TITLE REVEAL ──
  gsap.utils.toArray(".section-title").forEach(title => {
    const section = title.closest("section") || title;
    gsap.from(title, {
      scrollTrigger: {
        trigger: section,
        start: "top 70%", // Trigger reliably when parent section enters view
        toggleActions: "play none none reverse"
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });
  });

  // ── SECTION TAG REVEAL ──
  gsap.utils.toArray(".section-tag").forEach(tag => {
    const section = tag.closest("section") || tag;
    gsap.from(tag, {
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        toggleActions: "play none none reverse"
      },
      y: 25,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.1
    });
  });

  // ── ABOUT 3D CAROUSEL SCROLL ──
  const carouselAboutSection = document.querySelector(".about");
  const carousel3d = document.querySelector(".carousel3d");

  if (carouselAboutSection && carousel3d) {
    function updateCarousel3D() {
      // Allow rotation to run precisely on mobile too!
      const rect = carouselAboutSection.getBoundingClientRect();
      const total = carouselAboutSection.offsetHeight;

      const progress = Math.min(
        Math.max((window.innerHeight - rect.top) / total, 0),
        1
      );

      const degrees = progress * -288;
      carousel3d.style.transform = `rotateY(${degrees}deg)`;
    }

    gsap.ticker.add(updateCarousel3D);
  }

  // ── ABOUT TEXT SLIDE IN ──
  gsap.from(".about-text p, .about-stats", {
    scrollTrigger: {
      trigger: ".about",
      start: "top 65%",
      toggleActions: "play none none reverse"
    },
    y: 40,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: "power3.out",
    delay: 0.2
  });

  // ── VISIT BLOCKS REVEAL ──
  gsap.utils.toArray(".visit-block").forEach((block, i) => {
    gsap.from(block, {
      scrollTrigger: {
        trigger: block,
        start: "top 85%",
        end: "top 60%",
        scrub: 1
      },
      y: 50,
      opacity: 0,
      ease: "power3.out"
    });
  });

  // ── COUNTER ANIMATION ──
  const counters = document.querySelectorAll("[data-count]");
  counters.forEach((el) => {
    const target = parseInt(el.dataset.count);

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(el, {
          duration: 2,
          ease: "power2.out",
          onUpdate: function () {
            const progress = this.progress();
            const current = Math.ceil(target * progress);
            el.textContent = current >= 1000
              ? (current / 1000).toFixed(1) + "k+"
              : current + "+";
          }
        });
      }
    });
  });

  // ── MAGNETIC BUTTON EFFECT ──
  const btn = document.getElementById("book-now-btn");
  if (btn) {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.2,
        y: y * 0.2,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    });
  }

  // ── SMOOTH SCROLL LINKS (via Lenis) ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        lenis.scrollTo(target);
      }
    });
  });
});