import "../css/style.css";
import "../sounds/clap-808.wav";
import "../sounds/clap-analog.wav";
import "../sounds/clap-crushed.wav";
import "../sounds/clap-fat.wav";
import "../sounds/clap-slapper.wav";
import "../sounds/clap-tape.wav";
import "../sounds/cowbell-808.wav";
import "../sounds/crash-808.wav";
import "../sounds/crash-acoustic.wav";
import "../sounds/crash-noise.wav";
import "../sounds/crash-tape.wav";
import "../sounds/hihat-808.wav";
import "../sounds/hihat-acoustic01.wav";
import "../sounds/hihat-acoustic02.wav";
import "../sounds/hihat-analog.wav";
import "../sounds/hihat-digital.wav";
import "../sounds/hihat-dist01.wav";
import "../sounds/hihat-dist02.wav";
import "../sounds/hihat-electro.wav";
import "../sounds/hihat-plain.wav";
import "../sounds/hihat-reso.wav";
import "../sounds/hihat-ring.wav";
import "../sounds/kick-808.wav";
import "../sounds/kick-acoustic01.wav";
import "../sounds/kick-acoustic02.wav";
import "../sounds/kick-big.wav";
import "../sounds/kick-classic.wav";
import "../sounds/kick-cultivator.wav";
import "../sounds/kick-deep.wav";
import "../sounds/kick-dry.wav";
import "../sounds/kick-electro01.wav";
import "../sounds/kick-electro02.wav";
import "../sounds/kick-floppy.wav";
import "../sounds/kick-gritty.wav";
import "../sounds/kick-heavy.wav";
import "../sounds/kick-newwave.wav";
import "../sounds/kick-oldschool.wav";
import "../sounds/kick-plain.wav";
import "../sounds/kick-slapback.wav";
import "../sounds/kick-softy.wav";
import "../sounds/kick-stomp.wav";
import "../sounds/kick-tape.wav";
import "../sounds/kick-thump.wav";
import "../sounds/kick-tight.wav";
import "../sounds/kick-tron.wav";
import "../sounds/kick-vinyl01.wav";
import "../sounds/kick-vinyl02.wav";
import "../sounds/kick-zapper.wav";
import "../sounds/openhat-808.wav";
import "../sounds/openhat-acoustic01.wav";
import "../sounds/openhat-analog.wav";
import "../sounds/openhat-slick.wav";
import "../sounds/openhat-tight.wav";
import "../sounds/perc-808.wav";
import "../sounds/perc-chirpy.wav";
import "../sounds/perc-hollow.wav";
import "../sounds/perc-laser.wav";
import "../sounds/perc-metal.wav";
import "../sounds/perc-nasty.wav";
import "../sounds/perc-short.wav";
import "../sounds/perc-tambo.wav";
import "../sounds/perc-tribal.wav";
import "../sounds/perc-weirdo.wav";
import "../sounds/ride-acoustic01.wav";
import "../sounds/ride-acoustic02.wav";
import "../sounds/shaker-analog.wav";
import "../sounds/shaker-shuffle.wav";
import "../sounds/shaker-suckup.wav";
import "../sounds/snare-808.wav";
import "../sounds/snare-acoustic01.wav";
import "../sounds/snare-acoustic02.wav";
import "../sounds/snare-analog.wav";
import "../sounds/snare-big.wav";
import "../sounds/snare-block.wav";
import "../sounds/snare-brute.wav";
import "../sounds/snare-dist01.wav";
import "../sounds/snare-dist02.wav";
import "../sounds/snare-dist03.wav";
import "../sounds/snare-electro.wav";
import "../sounds/snare-lofi01.wav";
import "../sounds/snare-lofi02.wav";
import "../sounds/snare-modular.wav";
import "../sounds/snare-noise.wav";
import "../sounds/snare-pinch.wav";
import "../sounds/snare-punch.wav";
import "../sounds/snare-smasher.wav";
import "../sounds/snare-sumo.wav";
import "../sounds/snare-tape.wav";
import "../sounds/snare-vinyl01.wav";
import "../sounds/snare-vinyl02.wav";
import "../sounds/tom-808.wav";
import "../sounds/tom-acoustic01.wav";
import "../sounds/tom-acoustic02.wav";
import "../sounds/tom-acoustic02.wav";
import "../sounds/tom-analog.wav";
import "../sounds/tom-chiptune.wav";
import "../sounds/tom-fm.wav";
import "../sounds/tom-lofi.wav";
import "../sounds/tom-rototom.wav";
import "../sounds/tom-short.wav";

class DrumKit {
	public pads: NodeListOf<HTMLDivElement>;
	public playBtn: HTMLButtonElement | null;
	public currentKick: string;
	public currentSnare: string;
	public currentHihat: string;
	public kickAudio: HTMLAudioElement | null;
	public snareAudio: HTMLAudioElement | null;
	public hihatAudio: HTMLAudioElement | null;
	private index: number;
	private bpm: number;
	private isPlaying: any;
	public selects: NodeListOf<HTMLSelectElement> | null;
	public muteBtns: NodeListOf<HTMLButtonElement> | null;
	public tempoSlider: HTMLInputElement | null;

	constructor() {
		this.pads = document.querySelectorAll(".pad");
		this.playBtn = document.querySelector(".play");
		this.currentKick = "../sounds/kick-classic.wav";
		this.currentSnare = "../sounds/snare-acoustic01.wav";
		this.currentHihat = "../sounds/hihat-acoustic01.wav";
		this.kickAudio = document.querySelector(".kick-sound");
		this.snareAudio = document.querySelector(".snare-sound");
		this.hihatAudio = document.querySelector(".hihat-sound");
		this.index = 0;
		this.bpm = 150;
		this.isPlaying = null;
		this.selects = document.querySelectorAll("select");
		this.muteBtns = document.querySelectorAll(".mute");
		this.tempoSlider = document.querySelector(".tempo-slider");
	}

	public activePad(): void {
		console.log(this);
		(this as unknown as HTMLDivElement).classList.toggle("active");
	}

	private repeat(): void {
		let step: number = this.index % 8;
		const activeBars: NodeListOf<HTMLDivElement> = document.querySelectorAll(`.b${step}`);
		activeBars.forEach(bar => {
			bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`;
			if (bar.classList.contains("active")) {
				if (bar.classList.contains("kick-pad")) {
					this.kickAudio!.currentTime = 0;
					this.kickAudio?.play();
				}
				if (bar.classList.contains("snare-pad")) {
					this.snareAudio!.currentTime = 0;
					this.snareAudio?.play();
				}
				if (bar.classList.contains("hihat-pad")) {
					this.hihatAudio!.currentTime = 0;
					this.hihatAudio?.play();
				}
			}
		});
		this.index++;
	}

	public start(): void {
		const interval: number = (60 / this.bpm) * 1000;
		if (this.isPlaying) {
			clearInterval(this.isPlaying);
			this.isPlaying = null;
		} else {
			this.isPlaying = setInterval(() => {
				this.repeat();
			}, interval);
		}
	}

	public updateBtn(): void {
		if (!this.isPlaying) {
			this.playBtn!.innerText = "Stop";
			this.playBtn?.classList.add("active");
		} else {
			this.playBtn!.innerText = "Play";
			this.playBtn?.classList.remove("active");
		}
	}

	public changeSound(event: any): void {
		const selectionName: string = event.target.name;
		console.log(selectionName);
		const selectionValue: string = event.target.value;
		console.log(selectionValue);
		switch (selectionName) {
			case "kick-select":
				this.kickAudio!.src = selectionValue;
				break;
			case "snare-select":
				this.snareAudio!.src = selectionValue;
				break;
			case "hihat-select":
				this.hihatAudio!.src = selectionValue;
				break;
		}
	}

	public mute(event: any): void {
		const muteIndex: string = event.target.getAttribute("data-track");
		event.target.classList.toggle("active");
		if (event.target.classList.contains("active")) {
			switch (muteIndex) {
				case "0":
					this.kickAudio!.volume = 0;
					break;
				case "1":
					this.snareAudio!.volume = 0;
					break;
				case "2":
					this.hihatAudio!.volume = 0;
					break;
			}
		} else {
			switch (muteIndex) {
				case "0":
					this.kickAudio!.volume = 1;
					break;
				case "1":
					this.snareAudio!.volume = 1;
					break;
				case "2":
					this.hihatAudio!.volume = 1;
					break;
			}
		}
	}

	public changeTempo(event: any): void {
		const tempoText: HTMLParagraphElement | null = document.querySelector(".tempo-nr");
		tempoText!.innerText = event.target.value;
	}

	public updateTempo(event: any): void {
		this.bpm = event.target.value;
		clearInterval(this.isPlaying);
		this.isPlaying = null;
		const playBtn: HTMLButtonElement | null = document.querySelector(".play");
		if (playBtn?.classList.contains("active")) {
			this.start();
		}
	}
}

const drumKit = new DrumKit();

drumKit.pads.forEach(pad => {
	pad.addEventListener("click", drumKit.activePad);
	pad.addEventListener("animationend", function () {
		this.style.animation = "";
	});
});

drumKit.playBtn?.addEventListener("click", function () {
	drumKit.updateBtn();
	drumKit.start();
});

drumKit.selects?.forEach(select => {
	select.addEventListener("change", function (event: any) {
		drumKit.changeSound(event);
	});
});

drumKit.muteBtns?.forEach(btn => {
	btn.addEventListener("click", function (event) {
		drumKit.mute(event);
	});
});

drumKit.tempoSlider?.addEventListener("input", function (event) {
	drumKit.changeTempo(event);
});

drumKit.tempoSlider?.addEventListener("change", function (event) {
	drumKit.updateTempo(event);
});
