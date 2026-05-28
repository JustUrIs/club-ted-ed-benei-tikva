/* ============================================================
   CLUBES TED-ED BENEI TIKVA — choreography
   Stack: Lenis (smooth scroll) + GSAP + ScrollTrigger
   ============================================================ */

(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.body.classList.remove("no-js");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Preloader ----------
  window.addEventListener("load", () => {
    setTimeout(() => document.body.classList.add("loaded"), 350);
  });

  // ---------- Lenis smooth scroll ----------
  let lenis = null;
  if (!prefersReduced && window.Lenis) {
    lenis = new window.Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (window.gsap && window.ScrollTrigger) {
      lenis.on("scroll", window.ScrollTrigger.update);
      window.gsap.ticker.add((time) => lenis.raf(time * 1000));
      window.gsap.ticker.lagSmoothing(0);
    }
  }

  // ---------- NAV: smooth anchor + scrolled state + burger ----------
  const nav = document.getElementById("nav");
  const burger = document.getElementById("navBurger");
  const drawer = document.getElementById("drawer");

  function onScrollNav() {
    if (window.scrollY > 24) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  if (burger && drawer) {
    burger.addEventListener("click", () => {
      const open = drawer.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      drawer.setAttribute("aria-hidden", String(!open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    drawer.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        drawer.classList.remove("is-open");
        burger.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  // anchor smooth scroll using lenis
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -30, duration: 1.3 });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // ---------- guard if GSAP missing ----------
  if (!window.gsap) return;
  const { gsap } = window;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
  const ST = window.ScrollTrigger;

  // ========================================================
  // HERO entry choreography
  // ========================================================
  if (!prefersReduced) {
    const heroTl = gsap.timeline({ delay: 0.7 });
    heroTl
      .to(".hero__circle", {
        scale: 1,
        duration: 1.6,
        ease: "expo.out",
      })
      .from(
        ".hero__eyebrow",
        { opacity: 0, y: 16, duration: 0.7, ease: "power3.out" },
        "-=0.9"
      )
      .to(".hero__eyebrow", { opacity: 1, duration: 0.6 }, "<")
      .to(
        ".hero__title .word",
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.09,
        },
        "-=0.6"
      )
      .to(".hero__sub", { opacity: 1, duration: 0.7, ease: "power2.out" }, "-=0.5")
      .to(".hero__ctas", { opacity: 1, duration: 0.7, ease: "power2.out" }, "-=0.5")
      .to(".hero__scroll", { opacity: 1, duration: 0.6 }, "-=0.3");
  } else {
    gsap.set(".hero__circle", { scale: 1 });
    gsap.set(
      [".hero__eyebrow", ".hero__title .word", ".hero__sub", ".hero__ctas", ".hero__scroll"],
      { opacity: 1, y: 0 }
    );
  }

  // hero circle parallax on scroll
  if (ST && !prefersReduced) {
    gsap.to(".hero__circle", {
      yPercent: -25,
      scale: 0.85,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  // ========================================================
  // MANIFESTO — horizontal pin
  // ========================================================
  if (ST && !prefersReduced && window.innerWidth > 820) {
    const track = document.querySelector(".manifesto__track");
    const panels = gsap.utils.toArray(".manifesto__panel");

    if (track && panels.length) {
      const distance = () => track.scrollWidth - window.innerWidth;

      const horizTween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: ".manifesto__pin",
          start: "top top",
          end: () => "+=" + distance(),
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // pop each panel as it enters viewport center
      panels.forEach((panel) => {
        const line = panel.querySelector(".manifesto__line");
        if (!line) return;
        gsap.fromTo(
          line,
          { opacity: 0.22, scale: 0.92 },
          {
            opacity: 1,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: horizTween,
              start: "left 70%",
              end: "left 35%",
              scrub: true,
            },
          }
        );
      });
    }
  }

  // ========================================================
  // Section heads reveal
  // ========================================================
  if (ST && !prefersReduced) {
    gsap.utils.toArray(".section__head").forEach((head) => {
      const kicker = head.querySelector(".section__kicker");
      const title = head.querySelector(".section__title");
      gsap.from(
        [kicker, title].filter(Boolean),
        {
          opacity: 0,
          y: 32,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: head,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }

  // ========================================================
  // PARA QUIÉN — items
  // ========================================================
  if (ST && !prefersReduced) {
    gsap.from(".para-quien__item", {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "expo.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: ".para-quien__list",
        start: "top 80%",
      },
    });
  }

  // ========================================================
  // LEARN — cards
  // ========================================================
  if (ST && !prefersReduced) {
    gsap.from(".learn__card", {
      opacity: 0,
      y: 36,
      duration: 0.7,
      ease: "expo.out",
      stagger: { amount: 0.6, from: "start" },
      scrollTrigger: {
        trigger: ".learn__grid",
        start: "top 80%",
      },
    });
  }

  // ========================================================
  // TIMELINE — rail draw + dot travel + step reveals
  // ========================================================
  if (ST && !prefersReduced) {
    const rail = document.querySelector(".timeline__rail");
    const fill = document.querySelector(".timeline__rail-fill");
    const dot = document.querySelector(".timeline__rail-dot");

    if (rail && fill && dot) {
      gsap.to(fill, {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline__wrap",
          start: "top 70%",
          end: "bottom 80%",
          scrub: 0.6,
        },
      });
      gsap.to(dot, {
        top: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline__wrap",
          start: "top 70%",
          end: "bottom 80%",
          scrub: 0.6,
        },
      });
    }

    gsap.utils.toArray(".timeline__step").forEach((step) => {
      gsap.from(step, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: {
          trigger: step,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    });
  }

  // ========================================================
  // GALLERY — drag-to-scroll
  // ========================================================
  const strip = document.getElementById("galleryStrip");
  if (strip) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    strip.addEventListener("mousedown", (e) => {
      isDown = true;
      strip.classList.add("is-dragging");
      startX = e.pageX - strip.offsetLeft;
      scrollLeft = strip.scrollLeft;
    });
    strip.addEventListener("mouseleave", () => (isDown = false));
    strip.addEventListener("mouseup", () => (isDown = false));
    strip.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - strip.offsetLeft;
      const walk = (x - startX) * 1.4;
      strip.scrollLeft = scrollLeft - walk;
    });

    if (ST && !prefersReduced) {
      gsap.from(".gallery__item", {
        opacity: 0,
        y: 50,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: {
          trigger: ".gallery__strip",
          start: "top 80%",
        },
      });
    }
  }

  // ========================================================
  // CTA — circle pulse parallax + title char split
  // ========================================================
  if (ST && !prefersReduced) {
    gsap.to(".cta__circle", {
      scale: 1.15,
      ease: "none",
      scrollTrigger: {
        trigger: ".cta",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    const ctaTitle = document.querySelector(".cta__title");
    if (ctaTitle) {
      const text = ctaTitle.innerHTML;
      // split by space but keep <br> and <em>
      const wrap = (html) =>
        html
          .replace(/<br\s*\/?>/gi, "|||BR|||")
          .split(/(<em>.*?<\/em>|\s+)/g)
          .map((tok) => {
            if (!tok || tok === "|||BR|||") return tok === "|||BR|||" ? "<br>" : "";
            if (/^\s+$/.test(tok)) return " ";
            return `<span class="cta__word" style="display:inline-block;opacity:0;transform:translateY(28px)">${tok}</span>`;
          })
          .join("");
      ctaTitle.innerHTML = wrap(text);

      gsap.to(".cta__word", {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ".cta",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    }
  }

  // ========================================================
  // PARTNERS reveal
  // ========================================================
  if (ST && !prefersReduced) {
    gsap.from(".partners__inner > *", {
      opacity: 0,
      y: 28,
      duration: 0.8,
      ease: "expo.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".partners",
        start: "top 75%",
      },
    });
  }

  // ========================================================
  // IG reveal
  // ========================================================
  if (ST && !prefersReduced) {
    gsap.from(".ig__link", {
      opacity: 0,
      y: 30,
      duration: 0.9,
      ease: "expo.out",
      scrollTrigger: {
        trigger: ".ig",
        start: "top 80%",
      },
    });
  }

  // refresh ScrollTrigger after fonts load (avoids layout jumps)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ST && ST.refresh());
  }
})();
