gsap.registerPlugin(ScrollTrigger);


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

// Close menu if a link is clicked
document.querySelectorAll(".overlay-list a").forEach(link => {
    link.onclick = () => menuTl.reverse();
});


const pill = document.querySelector(".nav-pill");
const links = document.querySelectorAll(".nav-list-desktop ul li a");

function movePill(target) {
  const rect = target.getBoundingClientRect();
  const parentRect = document
    .querySelector(".nav-list-desktop")
    .getBoundingClientRect();

  const x = rect.left - parentRect.left;
  const w = rect.width;
  const h = rect.height;

  const tl = gsap.timeline();

  // Step 1: quick move
  tl.to(pill, {
    x: x,
    duration: 0.18,
    ease: "power2.out"
  });

  // Step 2: stretch effect (subtle)
  tl.to(pill, {
    width: w + 10,          // slight overshoot
    height: h + 4,
    duration: 0.12,
    ease: "power1.out"
  }, "<");

  // Step 3: settle back
  tl.to(pill, {
    width: w,
    height: h,
    duration: 0.18,
    ease: "power3.out"
  });
}

// initial
window.addEventListener("load", () => {
  const active = document.querySelector(".nav-list-desktop a.active");
  if (active) movePill(active);
});

// click
links.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    document
      .querySelector(".nav-list-desktop a.active")
      ?.classList.remove("active");

    link.classList.add("active");

    movePill(link);
  });
});