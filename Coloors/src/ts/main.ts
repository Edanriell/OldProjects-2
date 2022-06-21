import "../css/style.css";
import chroma from "chroma-js";

type Palette = {
	name: string;
	colors: string[];
	nr: number;
};

const colorDivs: NodeListOf<HTMLDivElement> = document.querySelectorAll(".color");
const generateBtn: HTMLButtonElement | null = document.querySelector(".generate");
const sliders: NodeListOf<HTMLInputElement> = document.querySelectorAll("input[type='range']");
const currentHexes: NodeListOf<HTMLHeadingElement> = document.querySelectorAll(".color h2");
const popup: HTMLDivElement | null = document.querySelector(".copy-container");
const adjustButton: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".adjust");
const lockButton: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".lock");
const closeAdjustments: NodeListOf<HTMLButtonElement> =
	document.querySelectorAll(".close-adjustment");
const sliderContainers: NodeListOf<HTMLDivElement> = document.querySelectorAll(".sliders");
const saveBtn: HTMLButtonElement | null = document.querySelector(".save");
const submitSave: HTMLButtonElement | null = document.querySelector(".submit-save");
const closeSave: HTMLButtonElement | null = document.querySelector(".close-save");
const saveContainer: HTMLDivElement | null = document.querySelector(".save-container");
const saveInput: HTMLInputElement | null = document.querySelector(".save-container input");
const libraryContainer: HTMLDivElement | null = document.querySelector(".library-container");
const libraryBtn: HTMLButtonElement | null = document.querySelector(".library");
const closeLibraryBtn: HTMLButtonElement | null = document.querySelector(".close-library");
let initialColors: string[];
let savedPalettes: Palette[] = [];

generateBtn?.addEventListener("click", randomColors);

sliders.forEach((slider: HTMLInputElement) => {
	slider.addEventListener("input", hslControls);
});

colorDivs.forEach((div: HTMLDivElement, index: number) => {
	div.addEventListener("change", () => {
		updateTextUI(index);
	});
});

currentHexes.forEach((hex: HTMLHeadingElement) => {
	hex.addEventListener("click", () => {
		copyToClipboard(hex);
	});
});

popup?.addEventListener("transitionend", () => {
	const popupBox: Element = popup.children[0];
	popup.classList.remove("active");
	popupBox.classList.remove("active");
});

adjustButton.forEach((button: HTMLButtonElement, index: number) => {
	button.addEventListener("click", () => {
		openAdjustmentPanel(index);
	});
});

closeAdjustments.forEach((button: HTMLButtonElement, index: number) => {
	button.addEventListener("click", () => {
		closeAdjustmentPanel(index);
	});
});

lockButton.forEach((button: HTMLButtonElement, index: number) => {
	button.addEventListener("click", (event: any) => {
		lockLayer(event, index);
	});
});

saveBtn?.addEventListener("click", openPalette);

closeSave?.addEventListener("click", closePalette);

submitSave?.addEventListener("click", savePalette);

libraryBtn?.addEventListener("click", openLibrary);

closeLibraryBtn?.addEventListener("click", closeLibrary);

function generateHex(): chroma.Color {
	// const letters: string = "#0123456789ABCDEF";
	// let hash: string = "#";
	// for (let i: number = 0; i < 6; i++) {
	// 	hash += letters[Math.floor(Math.random() * 16)];
	// }
	// return hash;
	const hexColor = chroma.random();
	return hexColor;
}

function randomColors(): void {
	initialColors = [];
	colorDivs.forEach((div: HTMLDivElement, index: number) => {
		const hexText = div.children[0] as HTMLHeadingElement;
		const randomColor: chroma.Color = generateHex();
		if (div.classList.contains("locked")) {
			initialColors.push(hexText.innerText);
			return;
		} else {
			initialColors.push(chroma(randomColor).hex());
		}
		div.style.backgroundColor = randomColor as unknown as string;
		hexText.innerText = randomColor as unknown as string;
		checkTextContrast(randomColor, hexText);
		const color: chroma.Color = chroma(randomColor);
		const sliders: NodeListOf<HTMLInputElement> = div.querySelectorAll(".sliders input");
		const hue: HTMLInputElement = sliders[0];
		const brightness: HTMLInputElement = sliders[1];
		const saturation: HTMLInputElement = sliders[2];
		colorizeSliders(color, hue, brightness, saturation);
	});
	resetInputs();
	adjustButton.forEach((button: HTMLButtonElement, index: number) => {
		checkTextContrast(initialColors[index], button);
		checkTextContrast(initialColors[index], lockButton[index]);
	});
}

function checkTextContrast(
	color: chroma.Color | string,
	text: HTMLHeadingElement | HTMLButtonElement
): void {
	const luminance: number = chroma(color).luminance();
	if (luminance > 0.5) {
		text.style.color = "black";
	} else {
		text.style.color = "white";
	}
}

function colorizeSliders(
	color: chroma.Color,
	hue: HTMLInputElement,
	brightness: HTMLInputElement,
	saturation: HTMLInputElement
): void {
	const noSat: chroma.Color = color.set("hsl.s", 0);
	const fullSat: chroma.Color = color.set("hsl.s", 1);
	const scaleSat: chroma.Scale<chroma.Color> = chroma.scale([noSat, color, fullSat]);
	const midBright: chroma.Color = color.set("hsl.l", 0.5);
	const scaleBright: chroma.Scale<chroma.Color> = chroma.scale(["black", midBright, "white"]);
	saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`;
	brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(0)},${scaleBright(
		0.5
	)}, ${scaleBright(1)})`;
	hue.style.backgroundImage = `
	linear-gradient(to right, rgb(204,75,75),
	rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),
	rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))
	`;
}

function hslControls(event: any): void {
	const index: number =
		+event.target.getAttribute("data-bright") ||
		+event.target.getAttribute("data-sat") ||
		+event.target.getAttribute("data-hue");
	let sliders: NodeListOf<HTMLInputElement> =
		event.target.parentElement.querySelectorAll("input[type='range']");
	const hue: HTMLInputElement = sliders[0];
	const brightness: HTMLInputElement = sliders[1];
	const saturation: HTMLInputElement = sliders[2];
	const bgColor: string = initialColors[index];
	console.log(typeof bgColor);
	let color: chroma.Color = chroma(bgColor as string)
		.set("hsl.s", saturation.value)
		.set("hsl.l", brightness.value)
		.set("hsl.h", hue.value);
	colorDivs[index].style.backgroundColor = color as unknown as string;
	colorizeSliders(color, hue, brightness, saturation);
}

function updateTextUI(index: number): void {
	const activeDiv: HTMLDivElement = colorDivs[index];
	const color: chroma.Color = chroma(activeDiv.style.backgroundColor);
	const textHex: HTMLHeadingElement | null = activeDiv.querySelector("h2");
	const icons: NodeListOf<HTMLButtonElement> = activeDiv.querySelectorAll(".controls button");
	textHex!.innerText = color.hex();
	checkTextContrast(color, textHex!);
	for (const icon of icons) {
		checkTextContrast(color, icon);
	}
}

function resetInputs(): void {
	const sliders: NodeListOf<HTMLInputElement> = document.querySelectorAll(".sliders input");
	sliders.forEach((slider: HTMLInputElement) => {
		if (slider.name === "hue") {
			const hueColor = initialColors[slider.getAttribute("data-hue") as unknown as number];
			const hueValue = chroma(hueColor).hsl()[0];
			slider.value = `${Math.floor(hueValue)}`;
		}
		if (slider.name === "brightness") {
			const brightColor =
				initialColors[slider.getAttribute("data-bright") as unknown as number];
			const brightValue = chroma(brightColor).hsl()[2];
			slider.value = `${Math.floor(brightValue * 100) / 100}`;
		}
		if (slider.name === "saturation") {
			const satColor = initialColors[slider.getAttribute("data-sat") as unknown as number];
			const satValue = chroma(satColor).hsl()[1];
			slider.value = `${Math.floor(satValue * 100) / 100}`;
		}
	});
}

function copyToClipboard(hex: HTMLHeadingElement): void {
	const el: HTMLTextAreaElement = document.createElement("textarea");
	el.value = hex.innerText;
	document.body.append(el);
	el.select();
	document.execCommand("copy");
	document.body.removeChild(el);
	const popupBox = popup?.children[0];
	popup?.classList.add("active");
	popupBox?.classList.add("active");
}

function openAdjustmentPanel(index: number): void {
	sliderContainers[index].classList.toggle("active");
}

function closeAdjustmentPanel(index: number): void {
	sliderContainers[index].classList.remove("active");
}

function lockLayer(event: any, index: number) {
	const lockSVG: HTMLLIElement = event.target.children[0];
	const activeBg: HTMLDivElement = colorDivs[index];
	activeBg.classList.toggle("locked");
	if (lockSVG.classList.contains("fa-lock-open")) {
		event.target.innerHTML = '<i class="fas fa-lock"></i>';
	} else {
		event.target.innerHTML = '<i class="fas fa-lock-open"></i>';
	}
}

function openPalette(): void {
	const popup: Element | undefined = saveContainer?.children[0];
	saveContainer?.classList.add("active");
	popup?.classList.add("active");
}

function closePalette(): void {
	const popup: Element | undefined = saveContainer?.children[0];
	saveContainer?.classList.remove("active");
	popup?.classList.add("remove");
}

function savePalette(): void {
	saveContainer?.classList.remove("active");
	popup?.classList.remove("active");
	const name: string = saveInput!.value;
	const colors: string[] = [];
	currentHexes.forEach((hex: HTMLHeadingElement) => {
		colors.push(hex.innerText);
	});
	let paletteNr: number;
	const paletteObjects: Palette[] = JSON.parse(localStorage.getItem("palettes")!);
	console.log(paletteObjects);
	console.log(paletteObjects);
	if (paletteObjects) {
		paletteNr = paletteObjects.length;
	} else {
		paletteNr = savedPalettes.length;
	}
	const paletteObj: Palette = { name, colors, nr: paletteNr };
	savedPalettes.push(paletteObj);
	saveToLocal(paletteObj);
	saveInput!.value = "";
	const palette: HTMLDivElement = document.createElement("div");
	palette.classList.add("custom-palette");
	const title: HTMLHeadingElement = document.createElement("h4");
	title.innerText = paletteObj.name;
	const preview: HTMLDivElement = document.createElement("div");
	preview.classList.add("small-preview");
	paletteObj.colors.forEach((smallColor: string) => {
		const smallDiv: HTMLDivElement = document.createElement("div");
		smallDiv.style.backgroundColor = smallColor;
		preview.append(smallDiv);
	});
	const paletteBtn: HTMLButtonElement = document.createElement("button");
	paletteBtn.classList.add("pick-palette-btn");
	paletteBtn.classList.add(paletteObj.nr as unknown as string);
	paletteBtn.innerText = "Select";
	paletteBtn.addEventListener("click", (event: any) => {
		closeLibrary();
		const paletteIndex: number = +event.target.classList[1];
		initialColors = [];
		savedPalettes[paletteIndex].colors.forEach((color: string, index: number) => {
			initialColors.push(color);
			colorDivs[index].style.backgroundColor = color;
			const text: Element = colorDivs[index].children[0];
			checkTextContrast(color, text as unknown as HTMLHeadingElement);
			updateTextUI(index);
		});
		resetInputs();
	});
	palette.append(title);
	palette.append(preview);
	palette.append(paletteBtn);
	libraryContainer!.children[0].append(palette);
}

function saveToLocal(paletteObj: Palette): void {
	let localPalettes: string[];
	if (localStorage.getItem("palettes") === null) {
		localPalettes = [];
	} else {
		localPalettes = JSON.parse(localStorage.getItem("palettes")!);
	}
	localPalettes.push(paletteObj as unknown as string);
	localStorage.setItem("palettes", JSON.stringify(localPalettes));
}

function openLibrary(): void {
	const popup: Element = libraryContainer!.children[0];
	libraryContainer?.classList.add("active");
	popup.classList.add("active");
}

function closeLibrary(): void {
	const popup: Element = libraryContainer!.children[0];
	libraryContainer?.classList.remove("active");
	popup.classList.remove("active");
}

function getLocal(): void {
	let localPalettes: string[];
	if (localStorage.getItem("palettes") === null) {
		localPalettes = [];
	} else {
		const paletteObjects = JSON.parse(localStorage.getItem("palettes")!);
		savedPalettes = [...paletteObjects];
		paletteObjects.forEach((paletteObj: Palette) => {
			const palette: HTMLDivElement = document.createElement("div");
			palette.classList.add("custom-palette");
			const title: HTMLHeadingElement = document.createElement("h4");
			title.innerText = paletteObj.name;
			const preview: HTMLDivElement = document.createElement("div");
			preview.classList.add("small-preview");
			paletteObj.colors.forEach((smallColor: string) => {
				const smallDiv: HTMLDivElement = document.createElement("div");
				smallDiv.style.backgroundColor = smallColor;
				preview.append(smallDiv);
			});
			const paletteBtn: HTMLButtonElement = document.createElement("button");
			paletteBtn.classList.add("pick-palette-btn");
			paletteBtn.classList.add(paletteObj.nr as unknown as string);
			paletteBtn.innerText = "Select";
			paletteBtn.addEventListener("click", (event: any) => {
				closeLibrary();
				const paletteIndex: number = +event.target.classList[1];
				initialColors = [];
				paletteObjects[paletteIndex].colors.forEach((color: string, index: number) => {
					initialColors.push(color);
					colorDivs[index].style.backgroundColor = color;
					const text: Element = colorDivs[index].children[0];
					checkTextContrast(color, text as unknown as HTMLHeadingElement);
					updateTextUI(index);
				});
				resetInputs();
			});
			palette.append(title);
			palette.append(preview);
			palette.append(paletteBtn);
			libraryContainer!.children[0].append(palette);
		});
	}
}

// localStorage.clear();

getLocal();
randomColors();
