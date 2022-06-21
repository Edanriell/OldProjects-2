import "../css/style.css";
import * as ScrollMagic from "scrollmagic";
import gsap, { TweenMax, TimelineMax } from "gsap";
import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap";
import { ScrollMagicPluginIndicator } from "scrollmagic-plugins";
import barba from "@barba/core";

ScrollMagicPluginGsap(ScrollMagic, TweenMax, TimelineMax);
ScrollMagicPluginIndicator(ScrollMagic);

let controller: ScrollMagic.Controller | null;
let slideScene: ScrollMagic.Scene | null;
let pageScene: ScrollMagic.Scene | null;
let detailScene: ScrollMagic.Scene | null;
const mouse: HTMLDivElement | null = document.querySelector(".cursor");
const mouseTxt: HTMLSpanElement | null | undefined = mouse?.querySelector("span");
const burger: HTMLDivElement | null = document.querySelector(".burger");
const logo: HTMLLinkElement | null = document.querySelector("#logo");

function animateSlides(): void {
	controller = new ScrollMagic.Controller();
	const sliders: NodeListOf<HTMLElement> = document.querySelectorAll(".slide");
	const nav: HTMLElement | null = document.querySelector(".nav-header");
	sliders.forEach((slide: HTMLElement, index: number, slides: NodeListOf<HTMLElement>) => {
		const revealImg: HTMLDivElement | null = slide.querySelector(".reveal-img");
		const img: HTMLImageElement | null = slide.querySelector("img");
		const revealText: HTMLDivElement | null = slide.querySelector(".reveal-text");
		const slideTl: gsap.core.Timeline = gsap.timeline({
			defaults: { duration: 1, ease: "power2.inOut" }
		});
		slideTl.fromTo(revealImg, { x: "0%" }, { x: "100%" });
		slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1");
		slideTl.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
		slideTl.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.5"); // Comment out
		slideScene = (
			new ScrollMagic.Scene({
				triggerElement: slide,
				triggerHook: 0.25,
				reverse: false
			}) as any
		)
			.setTween(slideTl)
			// .addIndicators({
			// 	colorStart: "white",
			// 	colorTrigger: "white",
			// 	name: "slide"
			// })
			.addTo(controller);
		const pageTl: gsap.core.Timeline = gsap.timeline();
		let nextSlide: string | HTMLElement =
			slides.length - 1 === index ? "end" : slides[index + 1];
		pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
		pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
		pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");
		pageScene = (
			new ScrollMagic.Scene({
				triggerElement: slide,
				duration: "100%",
				triggerHook: 0
			}) as any
		)
			// .addIndicators({
			// 	colorStart: "white",
			// 	colorTrigger: "white",
			// 	name: "page",
			// 	indent: 200
			// })
			.setPin(slide, { pushFollowers: false })
			.setTween(pageTl)
			.addTo(controller);
	});
}

function cursor(event: any): void {
	mouse!.style.top = event.pageY + "px";
	mouse!.style.left = event.pageX + "px";
}

function activeCursor(event: any): void {
	const item: HTMLElement = event.target;
	if (item.id === "logo" || item.classList.contains("burger")) {
		mouse!.classList.add("nav-active");
	} else {
		mouse!.classList.remove("nav-active");
	}
	if (item.classList.contains("explore")) {
		mouse?.classList.add("explore-active");
		gsap.to(".title-swipe", 1, { y: "0%" });
		mouseTxt!.innerText = "Tap";
	} else {
		mouse?.classList.remove("explore-active");
		gsap.to(".title-swipe", 1, { y: "100%" });
		mouseTxt!.innerText = "";
	}
}

function navToggle(event: any): void {
	if (!event.target.classList.contains("active")) {
		event.target.classList.add("active");
		gsap.to(".line1", 0.5, { rotate: "45", y: 5, background: "black" });
		gsap.to(".line2", 0.5, { rotate: "-45", y: -5, background: "black" });
		gsap.to("#logo", 1, { color: "black" });
		gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%)" });
		document.body.classList.add("hide");
	} else {
		event.target.classList.remove("active");
		gsap.to(".line1", 0.5, { rotate: "0", y: 0, background: "white" });
		gsap.to(".line2", 0.5, { rotate: "0", y: 0, background: "white" });
		gsap.to("#logo", 1, { color: "white" });
		gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%)" });
		document.body.classList.remove("hide");
	}
}

barba.init({
	views: [
		{
			namespace: "home",
			beforeEnter() {
				animateSlides();
				// logo.href = "./index.html"; // remove
			},
			beforeLeave() {
				slideScene?.destroy(true);
				slideScene = null;
				pageScene?.destroy(true);
				pageScene = null;
				controller?.destroy(true);
				controller = null;
			}
		},
		{
			namespace: "fashion",
			beforeEnter() {
				// logo.href = "../index.html"; // remove
				detailAnimation();
				// gsap.fromTo(".nav-header", 1, { y: "100%" }, { y: "0%", ease: "power2.inOut" });
			},
			beforeLeave() {
				controller?.destroy(true);
				controller = null;
				detailScene?.destroy(true);
				detailScene = null;
			}
		}
	],
	transitions: [
		{
			leave({ current }) {
				let done: any = (this as any).async();
				const tl: gsap.core.Timeline = gsap.timeline({
					defaults: { ease: "power2.inOut" }
				});
				tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
				tl.fromTo(".swipe", 0.75, { x: "-100%" }, { x: "0%", onComplete: done }, "-=0.5");
			},
			enter({ next }) {
				let done: any = (this as any).async();
				window.scrollTo(0, 0);
				const tl: gsap.core.Timeline = gsap.timeline({
					defaults: { ease: "power2.inOut" }
				});
				tl.fromTo(
					".swipe",
					1,
					{ x: "0%" },

					{ x: "100%", stagger: 0.2, onComplete: done }
				);
				tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
				tl.fromTo(
					".nav-header",
					1,
					{ y: "-100%" },
					{ y: "0%", ease: "power2.inOut" },
					"-=1.5"
				);
			}
		}
	]
});

function detailAnimation(): void {
	controller = new ScrollMagic.Controller();
	const slides: NodeListOf<HTMLElement> = document.querySelectorAll(".detail-slide");
	slides.forEach((slide: HTMLElement, index: number, slides: NodeListOf<HTMLElement>) => {
		const slideTl: gsap.core.Timeline = gsap.timeline({ defaults: { duration: 1 } });
		let nextSlide: string | HTMLElement =
			slides.length - 1 === index ? "end" : slides[index + 1];
		const nextImg: HTMLImageElement | null = (nextSlide as HTMLElement).querySelector("img");
		slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
		slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=1");
		slideTl.fromTo(nextImg, { x: "50%", rotate: "4" }, { x: "0%", rotate: "0" });
		detailScene = (
			new ScrollMagic.Scene({
				triggerElement: slide,
				duration: "100%",
				triggerHook: 0
			}) as any
		)
			.setPin(slide, { pushFollowers: false })
			.setTween(slideTl)
			// .addIndicators({
			// 	colorStart: "blue",
			// 	colorTrigger: "blue",
			// 	name: "detailScene"
			// })
			.addTo(controller);
	});
}

burger?.addEventListener("click", navToggle);
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);
