import "../css/style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Timeline = gsap.core.Timeline;
type Watch = NodeListOf<HTMLImageElement>;
type Gallery = HTMLDivElement | null;
type Slide = NodeListOf<HTMLDivElement>;

const swatches: Watch = document.querySelectorAll(".swatches img");
const gallery: Gallery = document.querySelector(".phone-gallery");
const slides: Slide = document.querySelectorAll(".phone-gallery-container");

let currentSwatch: string = "blue";
let topIndex: number = 2;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tlIntro: Timeline = gsap.timeline({
	scrollTrigger: {
		trigger: ".first-page",
		start: "0%",
		end: "100%",
		pin: true,
		pinSpacing: false
	}
});

const tlH: Timeline = gsap.timeline({
	scrollTrigger: {
		trigger: ".second-page",
		markers: { startColor: "blue", endColor: "blue" },
		scrub: true,
		start: "-40%",
		end: "40%"
	}
});

const tlHRemove: Timeline = gsap.timeline({
	scrollTrigger: {
		trigger: ".second-page",
		markers: { startColor: "pink", endColor: "pink" },
		scrub: true,
		start: "-20%",
		end: "60%"
	}
});

const tlSplit: Timeline = gsap.timeline({
	scrollTrigger: {
		trigger: ".third-page",
		start: "-25%",
		end: "30%",
		markers: true,
		scrub: true
	}
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tlSplitPin: Timeline = gsap.timeline({
	scrollTrigger: {
		trigger: ".third-page",
		pin: true,
		pinSpacing: false,
		start: "0%",
		end: "100%"
	}
});

const tlVideo: Timeline = gsap.timeline({
	scrollTrigger: {
		trigger: ".fifth-page",
		start: "0%",
		end: "150%",
		scrub: true,
		pin: true
	}
});

const tlParallax: Timeline = gsap.timeline({
	scrollTrigger: {
		trigger: ".sixth-page",
		start: "-25%",
		end: "50%",
		scrub: true
	}
});

tlH.fromTo(
	".highlight",
	{ color: "rgba(255,255,255, 0.4" },
	{ color: "rgba(255,255,255, 1", stagger: 1 }
);

tlHRemove.to(".highlight", { color: "rgba(255,255,255, 0.4", stagger: 1 });

tlSplit.fromTo(".large-phone", { x: "40%" }, { x: "20%" });
tlSplit.fromTo(".small-phone", { x: "-40%" }, { x: "-20%" }, "<");
tlSplit.fromTo(".product-text-left", { x: 50, opacity: 0 }, { opacity: 1, x: 0 }, "<");
tlSplit.fromTo(".product-text-right", { x: -50, opacity: 0 }, { opacity: 1, x: 0 }, "<");

swatches.forEach((swatch: HTMLImageElement, index: number) => {
	const coord: number = slides[index].getBoundingClientRect().left;

	swatch.addEventListener("click", (event: any) => {
		const swatchName: string = event.target.getAttribute("swatch");
		const closeUp: HTMLImageElement = document.querySelector(`.${swatchName}`);
		if (currentSwatch === swatchName) return;

		gsap.set(closeUp, { zIndex: topIndex });
		gsap.fromTo(closeUp, { opacity: 0 }, { opacity: 1, duration: 1 });

		gsap.to(gallery, { x: -coord, duration: 1, ease: "back.out(1)" });
		topIndex++;
		currentSwatch = swatchName;
	});
});

tlVideo.fromTo(".product-video", { currentTime: 0 }, { currentTime: 3, duration: 1 });

tlVideo.fromTo(
	".product-info-container h3",
	{ opacity: 0 },
	{ opacity: 1, stagger: 0.25, duration: 0.5 },
	"<"
);

tlParallax.fromTo(".photo-description", { y: 0 }, { y: -80 });
tlParallax.fromTo(".portrait-container", { y: 0 }, { y: -80 }, "<");
tlParallax.fromTo(".phone-video", { y: 0 }, { y: -200 }, "<");
