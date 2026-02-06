gsap.registerPlugin(ScrollTrigger);
const locoScroll = new LocomotiveScroll({
  el: document.querySelector("#main"),
  smooth: true,

  // for tablet smooth
  tablet: { smooth: true },

  // for mobile
  smartphone: { smooth: true },
});
function locomotiveJS(){

  // const locoScroll = new LocomotiveScroll({
  //   el: document.querySelector("#main"),
  //   smooth: true,

  //   // for tablet smooth
  //   tablet: { smooth: true },

  //   // for mobile
  //   smartphone: { smooth: true },
  // });
  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    // 🧠 ADD THIS PART — detects if transform is used, else use fixed
    pinType: document.querySelector("#main").style.transform
      ? "transform"
      : "fixed",
  });



  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

  ScrollTrigger.refresh();

}
function loadingAnimation() {
  let loadingtimeline = gsap.timeline();

  loadingtimeline
    .from("#page1 .heading h1", {
      y: 600,
      duration: 0.9,
      opacity: 0,
    })
    .from("#page1 nav", {
      opacity: 0,
      duration: 0.5,
    })
    .from("#page1 nav .left h4", {
      y: 10,
      x: 10,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
    })
    .from("#page1 nav .right h3", {
      opacity: 0,
    });
}

// function logoAnimation() {
//   // gsap.to("#page1 .heading", {
//   //   x: -700,
//   //   scale: 0,
//   //   y: -500,
//   //   duration: 2,
//   //   scrollTrigger: {
//   //     trigger: "#page2",
//   //     markers: true,
//   //     // scrub: 1,
//   //     end: "top 60%",
//   //     // pin: true,
//   //   },
//   // });
//   gsap.to(".logo", {
//     opacity: 1,
//     scrollTrigger: {
//       trigger: "#page2",
//       // markers: true,
//       scrub: 1,
//       scroller: "#main",
//       end: "top 60%",
//       // pin: true,
//     },
//   });
// }
function Page4animation(){
  gsap.from("#page4 img.right", {
    opacity: 0,
    // y: 10,
    scrollTrigger: {
      trigger: "#page4",
      scroller: "#main",
      // markers: true,
      start: "top 30%",
      end: "top 25%",
      scrub: true,
    },
  });
  gsap.from("#page4 img.left", {
    opacity: 0,
    // y: 10,
    scrollTrigger: {
      trigger: "#page4",
      scroller: "#main",
      // markers: true,
      start: "top 30%",
      end: "top 25%",
      scrub: true,
    },
  });
  gsap.from("#page4 img.center", {
    opacity: 0,
    // y: 10,
    scrollTrigger: {
      trigger: "#page4",
      scroller: "#main",
      // markers: true,
      start: "top 30%",
      end: "top 25%",
      scrub: true,
    },
  });
}

function footerAnimation(){
  gsap.to("footer", {
    backgroundColor: "#111",
    scrollTrigger: {
      trigger: "footer",
      scroller: "#main",
      start: "top 50%",
      // scrub: true,
    },
  });
  gsap.from("footer h1", {
    opacity: 0,
    scrollTrigger:{
      trigger:"footer",
      scroller: "#main",
      scrub: true,
      start: "top 30%",
    }
  });
}

// function page3MouseHover() {
//   let boxes = document.querySelectorAll("#page3 .second_page3 .box");

//   boxes.forEach((box) => {
//     box.addEventListener("mousemove", function(dets) {
//       let mouseDiv = box.querySelector(".mouse_div");
//       // const scrollY = locoScroll.scroll.instance.scroll.y;
//       gsap.to(mouseDiv, {
//         opacity: 1,
//         x: dets.x-600,
//         y: dets.y ,
//       });
//       // console.log(dets.x);
//     });
//   });
//   boxes.forEach((box) => {
//     box.addEventListener("mouseleave", function () {
//       let mouseDiv = box.querySelector(".mouse_div");
//       gsap.to(mouseDiv, {
//         opacity: 0,
//       });
//     });
//   });
// }

locomotiveJS();
loadingAnimation();
// logoAnimation();
Page4animation();
footerAnimation();
// page3MouseHover();


