gsap.registerPlugin(ScrollTrigger, SplitText);



// ================= LENIS =================
if (typeof Lenis !== "undefined") {
  const lenis = new Lenis({
    duration: 1.4,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1.3,
  });

  if (typeof ScrollTrigger !== "undefined") {
    lenis.on("scroll", ScrollTrigger.update);
  }

  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}



// ================= HERO =================
document.addEventListener("DOMContentLoaded", () => {

  const cards = document.querySelectorAll('.floating-card');
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (document.querySelector(".hero-title")) {
    tl.fromTo(".hero-title",
      { y: 80, opacity: 0, scale: 1.05, filter: "blur(10px)" },
      { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.4, ease: "power4.out" }
    );
  }

  if (document.querySelector(".hero-p")) {
    tl.fromTo(".hero-p",
      { y: 40, opacity: 0, filter: "blur(6px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.1, ease: "power3.out" },
      "-=0.9"
    );
  }

  if (document.querySelector(".hero-btn-wrap")) {
    tl.fromTo(".hero-btn-wrap",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
      "-=0.7"
    );
  }

  if (cards.length) {
    tl.fromTo(cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 1,
        onComplete: () => startFloatingLoop(cards)
      },
      "-=0.5"
    );
  }

  function startFloatingLoop(elements) {
    elements.forEach((card, i) => {
      gsap.to(card, {
        y: "-=15",
        duration: 2 + (i * 0.4),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.1
      });
    });
  }
});



// ================= SPLIT TEXT =================
function initSplitAnimations() {

  if (typeof SplitText === "undefined") return;

  document.querySelectorAll(".split-target").forEach((el) => {

    if (!el) return;

    const split = SplitText.create(el, {
      type: "chars",
      absolute: true
    });

    gsap.from(split.chars, {
      x: () => gsap.utils.random(-200, 200),
      y: () => gsap.utils.random(-200, 200),
      opacity: 0,
      rotation: () => gsap.utils.random(-90, 90),
      stagger: 0.05,
      duration: 2.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
        once: true
      }
    });

  });
}

initSplitAnimations();



// ================= MENU =================
const menuOpen = document.getElementById("menuOpen");
const menuClose = document.getElementById("menuClose");

const menuTl = gsap.timeline({ paused: true, reversed: true });

menuTl.to("#menuOverlay", {
  duration: 0.6,
  y: "0%",
  ease: "power4.inOut"
})
.to(".overlay-list li", {
  duration: 0.4,
  opacity: 1,
  y: 0,
  stagger: 0.1,
  ease: "back.out(1.7)"
}, "-=0.2");

menuOpen?.addEventListener("click", () => menuTl.play());
menuClose?.addEventListener("click", () => menuTl.reverse());

document.querySelectorAll(".overlay-list a").forEach(link => {
  link.onclick = () => menuTl.reverse();
});



// ================= NAV =================
document.querySelectorAll('.nav-list-desktop ul li a').forEach(link => {

  if (!link) return;

  const hoverTimeline = gsap.timeline({ paused: true });

  hoverTimeline.to(link, {
    duration: 0.6,
    backgroundImage: 'linear-gradient(to right, #FF512F 0%, #DD2476 51%, #FF512F 100%)',
    color: '#fff',
    ease: 'power2.out'
  });

  link.addEventListener('mouseenter', () => hoverTimeline.play());
  link.addEventListener('mouseleave', () => hoverTimeline.reverse());
});



// ================= ACCORDION =================
document.addEventListener("DOMContentLoaded", () => {

  const items = document.querySelectorAll(".spec-item");
  const mainImg = document.getElementById("mainSpecImage");

  if (!items.length) return;

  items.forEach(item => {

    const content = item.querySelector(".spec-content");

    if (!content) return;

    gsap.set(content, {
      height: 0,
      opacity: 0,
      filter: "blur(10px)"
    });

    item.addEventListener("click", () => {

      const isActive = item.classList.contains("active");

      // CLOSE ALL
      items.forEach(i => {
        i.classList.remove("active");

        const c = i.querySelector(".spec-content");
        if (!c) return;

        gsap.killTweensOf(c);

        gsap.to(c, {
          height: 0,
          opacity: 0,
          filter: "blur(10px)",
          duration: 0.45,
          ease: "power3.inOut"
        });
      });

      if (isActive) return;

      item.classList.add("active");

      const fullHeight = content.scrollHeight;

      gsap.fromTo(content,
        {
          height: 0,
          opacity: 0,
          filter: "blur(12px)"
        },
        {
          height: fullHeight,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "power3.out",
          onComplete: () => {
            content.style.height = "auto";
          }
        }
      );

      // IMAGE TRANSITION (with blur motion)
      const img = item.getAttribute("data-image");

      if (img && mainImg) {
        gsap.to(mainImg, {
          opacity: 0,
          scale: 0.97,
          filter: "blur(8px)",
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => {
            mainImg.src = img;

            gsap.fromTo(mainImg,
              {
                opacity: 0,
                scale: 1.03,
                filter: "blur(10px)"
              },
              {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.5,
                ease: "power3.out"
              }
            );
          }
        });
      }

    });

  });

});



// ================= SPLIDE (FIXED) =================
document.addEventListener('DOMContentLoaded', function () {

  const el = document.querySelector('#card-slider');
  if (!el || typeof Splide === "undefined") return;

  new Splide('#card-slider', {
    type: 'loop',
    perPage: 1.5,
    gap: "30px",
    padding: 30,
    arrows: false,
    pagination: false,
    focus: 0,
    drag: 'free',
    autoScroll: false,
    loop: false,
  }).mount(window.splide?.Extensions);

});



// ================= COUNTERS =================
document.querySelectorAll(".counter").forEach(el => {

  if (!el) return;

  const target = +el.getAttribute("data-count");
  const suffix = el.getAttribute("data-suffix") || "";

  gsap.fromTo(el,
    { innerText: 0 },
    {
      innerText: target,
      duration: 2,
      snap: { innerText: 1 },
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
      },
      onUpdate: function () {
        el.innerText = Math.ceil(el.innerText) + suffix;
      }
    }
  );
});



// ================= TOOLS =================
if (document.querySelector(".tools-grid")) {
  gsap.from(".tool-item", {
    y: 50,
    opacity: 0,
    scale: 0.95,
    filter: "blur(6px)",
    duration: 0.8,
    stagger: 0.12,
    scrollTrigger: {
      trigger: ".tools-grid",
      start: "top 85%",
    }
  });
}



// ================= FAQ =================
document.querySelectorAll(".faq-item").forEach(item => {

  const content = item.querySelector(".faq-content");
  const inner = item.querySelector(".faq-inner");
  const chevron = item.querySelector(".chevron");

  if (!content || !inner) return;

  gsap.set(content, { height: 0, overflow: "hidden" });
  gsap.set(inner, { y: 15, opacity: 0 });

  item.addEventListener("click", () => {

    const isOpen = content.classList.contains("open");

    document.querySelectorAll(".faq-item").forEach(el => {
      const c = el.querySelector(".faq-content");
      const i = el.querySelector(".faq-inner");
      const ch = el.querySelector(".chevron");

      if (!c || !i) return;

      gsap.to(c, { height: 0 });
      gsap.to(i, { y: 15, opacity: 0 });
      gsap.to(ch, { rotate: 0 });

      c.classList.remove("open");
    });

    if (!isOpen) {
      gsap.to(content, {
        height: content.scrollHeight
      });

      gsap.to(inner, {
        y: 0,
        opacity: 1
      });

      gsap.to(chevron, { rotate: 180 });

      content.classList.add("open");
    }

  });

});



// ================= SPLIDE TESTIMONIAL =================
document.addEventListener('DOMContentLoaded', function () {

  const commonOptions = {
    type: 'loop',
    drag: 'free',
    perPage: 3,
    arrows: false,
    pagination: false,
    gap: '1rem',
  };

  const top = document.querySelector('#top-lane');
  const bottom = document.querySelector('#bottom-lane');

  if (top && window.Splide) {
    new Splide('#top-lane', {
      ...commonOptions,
      autoScroll: { speed: 1 }
    }).mount(window.splide?.Extensions);
  }

  if (bottom && window.Splide) {
    new Splide('#bottom-lane', {
      ...commonOptions,
      autoScroll: { speed: -1 }
    }).mount(window.splide?.Extensions);
  }

});



// ================= PROGRESS =================
gsap.to(".progress", {
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
  },
  width: "100%",
  ease: "none"
});



// ================= PORTFOLIO =================
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

if (filterButtons.length && portfolioItems.length) {

  filterButtons.forEach(button => {

    button.addEventListener('click', function () {

      const filter = this.getAttribute('data-filter');

      // Remove active styles from all buttons
      filterButtons.forEach(btn => {
        btn.classList.remove(
          'active',
          'text-white',
          'bg-gradient-to-r',
          'from-[#FF512F]',
          'via-[#DD2476]',
          'to-[#FF512F]'
        );

        btn.classList.add('bg-white', 'border-gray-200', 'text-gray-800');
      });

      // Add active styles to clicked button
      this.classList.add(
        'active',
        'text-white',
        'bg-gradient-to-r',
        'from-[#FF512F]',
        'via-[#DD2476]',
        'to-[#FF512F]'
      );

      this.classList.remove('bg-white', 'border-gray-200', 'text-gray-800');

      filterPortfolio(filter);
    });
  });
}


// ================= FILTER FUNCTION =================
function filterPortfolio(filter) {

  // fade out first
  gsap.to(portfolioItems, {
    opacity: 0,
    duration: 0.25,
    stagger: 0.05,
    onComplete: () => {

      portfolioItems.forEach(item => {

        const match = filter === 'all' || item.classList.contains(filter);

        if (match) {
          gsap.set(item, { display: 'block' });

          gsap.fromTo(item,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4 }
          );

        } else {
          gsap.set(item, { display: 'none' });
        }

      });

    }
  });
}



// ================= PROCESS SECTION =================
const mm = gsap.matchMedia();

mm.add("(min-width: 768px)", () => {

  const cards = gsap.utils.toArray(".process-card");

  if (!cards.length) return;

  gsap.set(cards, {
    opacity: 0,
    y: 80
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".process-section",
      start: "top top",
      end: "+=2000",
      pin: true,
      scrub: true,
    }
  });

  cards.forEach((card, i) => {
    tl.to(card, {
      opacity: 1,
      y: 0,
      duration: 1
    }, i * 0.8);
  });

});