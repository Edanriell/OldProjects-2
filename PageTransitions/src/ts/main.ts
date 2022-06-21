import "../css/style.css";
import barba from "@barba/core";
import { gsap } from "gsap";

type Timeline = gsap.core.Timeline;
type Gradient =
	| "linear-gradient(260deg, #b75d62, #754d4f)"
	| "linear-gradient(260deg, #5d8cb7, #4c4f70)"
	| "linear-gradient(260deg, #b27a5c, #7f5450)";
type Product = HTMLDivElement | null;
type Text = HTMLDivElement | null;
type Circle = HTMLElement | null;
type Arrow = HTMLElement | null;

const tlLeave: Timeline = gsap.timeline({
	defaults: { duration: 0.75, ease: "power2.easeOut" }
});
const tlEnter: Timeline = gsap.timeline({
	defaults: { duration: 0.75, ease: "power2.easeOut" }
});

function productEnterAnimation(next: any, done: any): void {
	tlEnter.fromTo(next, { y: "100%" }, { y: "0%" });
	tlEnter.fromTo(
		".card",
		{ opacity: 0, y: 50 },
		{ opacity: 1, y: 0, stagger: 0.1, onComplete: done }
	);
}

function productLeaveAnimation(current: any, done: any): void {
	tlLeave.fromTo(current, { y: "0%" }, { y: "100%", onComplete: done });
}

function getGradient(name: any): Gradient {
	// eslint-disable-next-line default-case
	switch (name as any) {
		case "handbag":
			return "linear-gradient(260deg, #b75d62, #754d4f)";
		case "boot":
			return "linear-gradient(260deg, #5d8cb7, #4c4f70)";
		case "hat":
			return "linear-gradient(260deg, #b27a5c, #7f5450)";
	}
}

const leaveAnimation = (current: any, done: any): Timeline => {
	const product: Product = current.querySelector(".image-container");
	const text: Text = current.querySelector(".showcase-text");
	const circles: Circle = current.querySelectorAll(".circle");
	const arrow: Arrow = current.querySelector(".showcase-arrow");
	return (
		tlLeave.fromTo(arrow, { opacity: 1, y: 0 }, { opacity: 0, y: 50, onComplete: done }),
		tlLeave.fromTo(product, { y: 0, opacity: 1 }, { y: 100, opacity: 0 }, "<"),
		tlLeave.fromTo(text, { y: 0, opacity: 1 }, { opacity: 0, y: 100 }, "<"),
		tlLeave.fromTo(
			circles,
			{ y: 0, opacity: 1 },
			{
				y: -200,
				opacity: 0,
				stagger: 0.15,
				ease: "back.out(1.7)",
				duration: 1
			},
			"<"
		)
	);
};

const enterAnimation = (current: any, done: any, gradient: any) => {
	const product: Product = current.querySelector(".image-container");
	const text: Text = current.querySelector(".showcase-text");
	const circles: Circle = current.querySelectorAll(".circle");
	const arrow: Arrow = current.querySelector(".showcase-arrow");
	return (
		tlEnter.fromTo(arrow, { opacity: 0, y: 50 }, { opacity: 1, y: 0, onComplete: done }),
		tlEnter.to("body", { background: gradient }, "<"),
		tlEnter.fromTo(product, { y: -100, opacity: 0 }, { y: 0, opacity: 1 }, "<"),
		tlEnter.fromTo(text, { y: 100, opacity: 0 }, { opacity: 1, y: 0 }, "<"),
		tlEnter.fromTo(
			circles,
			{ y: -200, opacity: 0 },
			{
				y: 0,
				opacity: 1,
				stagger: 0.15,
				ease: "back.out(1.7)",
				duration: 1
			},
			"<"
		)
	);
};

barba.init({
	preventRunning: true,
	transitions: [
		{
			name: "default",
			once(data: any) {
				const done: any = this.async();
				const next: HTMLElement = data.next.container;
				const gradient: Gradient = getGradient(data.next.namespace);
				gsap.set("body", { background: gradient });
				enterAnimation(next, done, gradient);
			},
			leave(data: any) {
				const done: any = this.async();
				const current: HTMLElement = data.current.container;
				leaveAnimation(current, done);
			},
			enter(data: any) {
				const done: any = this.async();
				const next: HTMLElement = data.next.container;
				const gradient: Gradient = getGradient(data.next.namespace);
				enterAnimation(next, done, gradient);
			}
		},
		{
			name: "product-transition",
			sync: true,
			from: { namespace: ["handbag", "product"] },
			to: { namespace: ["product", "handbag"] },
			enter(data: any) {
				const done: any = this.async();
				const next: HTMLElement = data.next.container;
				productEnterAnimation(next, done);
			},
			leave(data: any) {
				const done: any = this.async();
				const current: HTMLElement = data.current.container;
				productLeaveAnimation(current, done);
			}
		}
	]
});
