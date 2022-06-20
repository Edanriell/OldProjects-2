/* eslint-disable func-names */
import "../css/style.css";

const nav = document.querySelector(".nav-links");
const burger = document.querySelector(".burger");
const links = nav.querySelectorAll("a");

burger.addEventListener("click", function () {
	nav.classList.toggle("nav-open");
	burger.classList.toggle("toggle");
});

links.forEach(function (link) {
	link.addEventListener("click", function () {
		nav.classList.toggle("nav-open");
		burger.classList.toggle("toggle");
	});
});
