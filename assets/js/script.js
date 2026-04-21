gsap.registerPlugin(ScrollTrigger, SplitText);



  // lenis smooth scroll // ──================== Smooth Scroll (Lenis) ==================──
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


    // Hero section floating cards animation

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.floating-card');
    
    // Create a master timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. Text & Button Entrance
    tl.fromTo(".hero-title", 
        { y: 60, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2 }
    )
    .fromTo(".hero-p", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1 }, 
        "-=0.9" 
    )
    .fromTo(".hero-btn-wrap", 
        { scale: 0.8, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }, 
        "-=0.7"
    )
    // 2. Cards Entrance (Integrated here, removed from the top)
    .fromTo(cards, 
        { opacity: 0, y: 50 }, 
        { 
            opacity: 1, 
            y: 0, 
            stagger: 0.15, 
            duration: 1,
            // 3. Start the floating loop ONLY after the entrance finishes
            onComplete: () => startFloatingLoop(cards)
        }, 
        "-=0.5"
    );

    // Function to handle the infinite float
    function startFloatingLoop(elements) {
        elements.forEach((card, i) => {
            gsap.to(card, {
                y: "-=15",
                duration: 2 + (i * 0.4),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.1 // Slight offset for more organic feel
            });
        });
    }
});



// animated text fade to place
const split = SplitText.create(".split-target", {
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
    trigger: ".split-target",
    start: "top 80%",   // when section hits 80% of viewport
    toggleActions: "play none none none"
  }
});


// navigation 

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

document.getElementById("menuOpen").onclick = () => menuTl.play();
document.getElementById("menuClose").onclick = () => menuTl.reverse();

document.querySelectorAll(".overlay-list a").forEach(link => {
    link.onclick = () => menuTl.reverse();
});


// ================= NAV PILL =================

document.querySelectorAll('.nav-list-desktop ul li a').forEach(link => {
    const hoverTimeline = gsap.timeline({
        paused: true,
        reversed: true,
    });

    hoverTimeline.to(link, {
        duration: 0.6,
        backgroundImage: 'linear-gradient(to right, #FF512F 0%, #DD2476 51%, #FF512F 100%)',
        color: '#fff',
        ease: 'power2.out'
    }).to(link.querySelector("::after"), {
        duration: 0.6,
        opacity: 1,
        transform: 'scale(1)',
        ease: 'power2.out'
    });

    link.addEventListener('mouseenter', () => {
        hoverTimeline.play();
    });

    link.addEventListener('mouseleave', () => {
        hoverTimeline.reverse();
    });

    link.addEventListener('click', () => {
        document.querySelectorAll('.nav-list-desktop ul li a').forEach(item => item.classList.remove('active'));
        link.classList.add('active');
        gsap.to(link, {
            duration: 0.6,
            backgroundImage: 'linear-gradient(to right, #FF512F 0%, #DD2476 51%, #FF512F 100%)',
            color: '#fff',
            ease: 'power3.out'
        });
    });
});

// Accordion service section
document.addEventListener("DOMContentLoaded", () => {

  const items = document.querySelectorAll(".spec-item");
  const mainImg = document.getElementById("mainSpecImage");

  items.forEach(item => {

    const content = item.querySelector(".spec-content");
    const title = item.querySelector(".spec-title");
    const index = item.querySelector(".spec-index");

    // INITIAL STATE
    content.style.height = "0px";
    content.style.opacity = "0";

    // ---------------- CLICK ----------------
    item.addEventListener("click", () => {

      const isActive = item.classList.contains("active");

      // CLOSE ALL
      items.forEach(i => {
        i.classList.remove("active");

        const c = i.querySelector(".spec-content");

        gsap.killTweensOf(c);

        gsap.to(c, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut"
        });

        // RESET GRADIENT
        const t = i.querySelector(".spec-title");
        const ind = i.querySelector(".spec-index");

        gsap.to([t, ind], {
          backgroundPosition: "100% 0%",
          duration: 0.3
        });
      });

      if (isActive) return;

      // OPEN CURRENT
      item.classList.add("active");

      content.style.height = "auto";
      const fullHeight = content.scrollHeight;
      content.style.height = "0px";

      gsap.killTweensOf(content);

      gsap.to(content, {
        height: fullHeight,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        onComplete: () => {
          content.style.height = "auto";
        }
      });

      // SET ACTIVE GRADIENT
      gsap.to([title, index], {
        backgroundPosition: "0% 0%",
        duration: 0.4
      });

      // IMAGE SWITCH
      const img = item.getAttribute("data-image");

      if (img && mainImg) {
        gsap.to(mainImg, {
          opacity: 0,
          scale: 0.95,
          duration: 0.2,
          onComplete: () => {
            mainImg.src = img;

            gsap.to(mainImg, {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              ease: "power2.out"
            });
          }
        });
      }
    });

    // ---------------- HOVER (PREMIUM EFFECT) ----------------
    item.addEventListener("mouseenter", () => {

      if (item.classList.contains("active")) return;

      // index first
      gsap.to(index, {
        backgroundPosition: "0% 0%",
        duration: 0.35,
        ease: "power2.out"
      });

      // then title
      gsap.to(title, {
        backgroundPosition: "0% 0%",
        duration: 0.45,
        delay: 0.08,
        ease: "power2.out"
      });
    });

    item.addEventListener("mouseleave", () => {

      if (item.classList.contains("active")) return;

      gsap.to([title, index], {
        backgroundPosition: "100% 0%",
        duration: 0.4,
        ease: "power2.out"
      });
    });

  });

});


// Creative strategy service section
document.addEventListener('DOMContentLoaded', function () {
  new Splide('#card-slider', {
    type: 'loop',
    perPage: 1.5,
    gap: "30px",
    padding: 30,
    arrows: false,
    pagination: false,

    // IMPORTANT FIX:
    focus: 0,
    drag: 'free', // optional smooth feel

    breakpoints: {
      1024: {
        perPage: 1.2,
      },
      640: {
        perPage: 1,
      },
    },

    // Disable autoScroll
    autoScroll: false, 

    // Disable looping (important)
    loop: false, 

  }).mount(window.splide.Extensions);
});

// toold and technologies section
 const counters = document.querySelectorAll(".counter");

  counters.forEach(el => {
    const target = +el.getAttribute("data-count");
    const suffix = el.getAttribute("data-suffix") || "";

    gsap.fromTo(el,
      { innerText: 0 },
      {
        innerText: target,
        duration: 2,
        ease: "power1.out",
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
        },
        onUpdate: function() {
          el.innerText = Math.ceil(el.innerText) + suffix;
        }
      }
    );
  });

  //  FAQS Section
const items = document.querySelectorAll(".faq-item");

  items.forEach(item => {
    const content = item.querySelector(".faq-content");
    const chevron = item.querySelector(".chevron");

    gsap.set(content, { height: 0 });

    item.addEventListener("click", () => {
      const isOpen = content.classList.contains("open");

      // Close all
      items.forEach(el => {
        const c = el.querySelector(".faq-content");
        const ch = el.querySelector(".chevron");

        gsap.to(c, { height: 0, duration: 0.4, ease: "power2.inOut" });
        gsap.to(ch, { rotate: 0, duration: 0.3 });

        c.classList.remove("open");
      });

      // Open current
      if (!isOpen) {
        gsap.to(content, {
          height: content.scrollHeight,
          duration: 0.4,
          ease: "power2.inOut"
        });

        gsap.to(chevron, { rotate: 180, duration: 0.3 });
        content.classList.add("open");
      }
    });
  });


  // Testimonial splidejs 
  document.addEventListener('DOMContentLoaded', function () {
  const commonOptions = {
    type: 'loop',
    drag: 'free',
    perPage: 3,
    pauseOnHover: true,
    arrows: false,
    pagination: false,
        breakpoints: {
      
      1024: {
        perPage: 2, 
      },
      // Tablet (1024px to 768px)
      768: {
        perPage: 1,  
      },
    },
    gap: '1rem',
  };

  // Top Row moving Right
  new Splide('#top-lane', {
    ...commonOptions,
    autoScroll: {
      speed: 1, // Positive speed
      pauseOnHover: true,
    },
  }).mount(window.splide.Extensions);

  // Bottom Row moving Left
  new Splide('#bottom-lane', {
    ...commonOptions,
    autoScroll: {
      speed: -1, // Negative speed
      pauseOnHover: true,
    },
  }).mount(window.splide.Extensions);
});


// Progress bar
gsap.to(".progress", {
      scrollTrigger: {
        trigger: "body",  // Use 'body' or the top-level container that holds all sections
        start: "top top",
        end: "bottom bottom",
        scrub: true, // Smoothly scrubs the animation based on scroll
        markers: false, // Hide markers
        onEnter: () => gsap.to(".progress-bar", { opacity: 1, duration: 0.3 }), // Fade in when scroll starts
        onLeaveBack: () => gsap.to(".progress-bar", { opacity: 0, duration: 0.3 }), // Fade out when scroll goes back to the top
      },
      width: "100%", // Full width at the bottom of the page
      ease: "none"
    });