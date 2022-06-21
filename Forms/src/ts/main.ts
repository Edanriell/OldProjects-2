import "../css/style.css";
import { gsap } from "gsap";

type Container = NodeListOf<HTMLDivElement>;
type Form = HTMLFormElement | null;
type Input = HTMLInputElement | null;
type Line = HTMLElement | null;
type Placeholder = HTMLParagraphElement | null;
type Checkbox = HTMLInputElement | null;
type Timeline = gsap.core.Timeline;
type Button = HTMLButtonElement | null;

const containers: Container = document.querySelectorAll(".input-container");
const form: Form = document.querySelector("form");
const start: string =
	"M0 0.999512C0 0.999512 60.5 0.999512 150 0.999512C239.5 0.999512 300 0.999512 300 0.999512";
const end: string = "M1 0.999512C1 0.999512 61.5 7.5 151 7.5C240.5 7.5 301 0.999512 301 0.999512";
const tl: Timeline = gsap.timeline({ defaults: { duration: 1 } });
const checkbox: Checkbox = document.querySelector(".checkbox");
const tl2: Timeline = gsap.timeline({
	defaults: { duration: 0.5, ease: "power2.easeOut" }
});
const tickMarkPath: any = document.querySelector(".tick-mark path");
const pathLength: number = tickMarkPath?.getTotalLength();
const button: Button = document.querySelector("button");
const tl3: Timeline = gsap.timeline({ defaults: { duration: 0.75, ease: "power2.easeOut" } });

function validateEmail(email: string): boolean {
	const re: RegExp = /\S+@\S+\.\S+/;
	return re.test(email);
}

function validatePhone(phone: string): boolean {
	// eslint-disable-next-line no-useless-escape
	const re: RegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
	return re.test(phone);
}

function colorize(color: string, line: Line, placeholder: Placeholder): void {
	gsap.to(line, { stroke: color, duration: 0.75 });
	gsap.to(placeholder, { color, duration: 0.75 });
}

containers.forEach(container => {
	const input: Input = container.querySelector(".input");
	const line: Line = container.querySelector(".elastic-line");
	const placeholder: Placeholder = container.querySelector(".placeholder");

	input?.addEventListener("focus", () => {
		if (!input.value) {
			tl.fromTo(
				line,
				{ attr: { d: start } },
				{ attr: { d: end }, ease: "power2.easeOut", duration: 0.75 }
			);
			tl.to(line, { attr: { d: start }, ease: "elastic.out(3, 0.5)" }, "<50%");
			tl.to(
				placeholder,
				{
					top: -15,
					left: 0,
					scale: 0.7,
					duration: 0.5,
					ease: "power2.easeOut"
				},
				"<15%"
			);
		}
	});
});

form?.addEventListener("click", () => {
	containers.forEach(container => {
		const input: Input = container.querySelector(".input");
		const line: Line = container.querySelector(".elastic-line");
		const placeholder: Placeholder = container.querySelector(".placeholder");

		if (document.activeElement !== input) {
			if (!input?.value) {
				gsap.to(placeholder, {
					top: 0,
					left: 0,
					scale: 1,
					duration: 0.5,
					ease: "power2.easeOut"
				});
			}
		}

		input?.addEventListener("input", (event: any) => {
			if (event.target.type === "text") {
				const inputText: string = event.target.value;
				if (inputText.length > 2) {
					colorize("#6391E8", line, placeholder);
				} else {
					colorize("#FE8C99", line, placeholder);
				}
			}
			if (event.target.type === "email") {
				const valid: boolean = validateEmail(event.target.value);
				if (valid) {
					colorize("#6391E8", line, placeholder);
				} else {
					colorize("#FE8C99", line, placeholder);
				}
			}
			if (event.target.type === "tel") {
				const valid: boolean = validatePhone(event.target.value);
				if (valid) {
					colorize("#6391E8", line, placeholder);
				} else {
					colorize("#FE8C99", line, placeholder);
				}
			}
		});
	});
});

gsap.set(tickMarkPath, { strokeDashoffset: pathLength, strokeDasharray: pathLength });

checkbox?.addEventListener("click", () => {
	if (checkbox.checked) {
		tl2.to(".checkbox-fill", { top: "0%" });
		tl2.fromTo(tickMarkPath, { strokeDashoffset: pathLength }, { strokeDashoffset: 0 }, "<50%");
		tl2.to(".checkbox-label", { color: "#6391e8" }, "<");
	} else {
		tl2.to(".checkbox-fill", { top: "100%" });
		tl2.fromTo(tickMarkPath, { strokeDashoffset: 0 }, { strokeDashoffset: pathLength }, "<50%");
		tl2.to(".checkbox-label", { color: "#c5c5c5" }, "<");
	}
});

gsap.set("#eye", { transformOrigin: "center" });
gsap.fromTo(
	"#eye",
	{ scaleY: 1 },
	{ scaleY: 0.3, repeat: -1, yoyo: true, repeatDelay: 0.5, ease: "power2.easeOut" }
);
gsap.fromTo(
	"#eyebrow",
	{ y: 0 },
	{ y: -1, repeat: -1, yoyo: true, repeatDelay: 0.5, ease: "power2.easeOut" }
);

button?.addEventListener("click", (event: any) => {
	event.preventDefault();
	tl3.to(".contact-right, .contact-left", {
		y: 30,
		opacity: 0,
		pointerEvents: "none"
	});
	tl3.to("form", { scale: 0.8 }, "<");
	tl3.fromTo(".submitted", { opacity: 0, y: 30 }, { opacity: 1, y: 0 });
	gsap.set("#hand", { transformOrigin: "left" });
	gsap.fromTo(
		"#hand",
		{ rotation: 0, y: 0 },
		{ rotation: -10, y: 2, ease: "elastic(3,0.3)", duration: 2, delay: 1 }
	);
});
