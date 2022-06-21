import "../css/style.css";

const auth: string = "563492ad6f917000010000010b8d4075e6d6461e87338cf29a717e0a";
const gallery: HTMLDivElement | null = document.querySelector(".gallery");
const searchInput: HTMLInputElement | null = document.querySelector(".search-input");
const form: HTMLFormElement | null = document.querySelector(".search-form");
const more: HTMLButtonElement | null = document.querySelector(".more");
let page: number = 1;
let searchValue: string;
let fetchLink: string;
let currentSearch: string;

searchInput?.addEventListener("input", updateInput);
form?.addEventListener("submit", (event: any) => {
	event.preventDefault();
	currentSearch = searchValue;
	searchPhotos(searchValue);
});
more?.addEventListener("click", loadMore);

function updateInput(event: any): void {
	searchValue = event.target.value;
}

async function fetchApi(url: string): Promise<object> {
	const dataFetch: Response = await fetch(url, {
		method: "GET",
		headers: {
			Accept: "application/json",
			Authorization: auth
		}
	});
	const data: object = await dataFetch.json();
	return data;
}

function generatePictures(data: any): void {
	data.photos.forEach((photo: any) => {
		const galleryImg: HTMLDivElement = document.createElement("div");
		galleryImg.classList.add("gallery-img");
		galleryImg.innerHTML = `
        <div class="gallery-info">
            <p>${photo.photographer}</p>
            <a href=${photo.src.original}>Download</a>
        </div>
        <img src=${photo.src.large}></img>
        `;
		gallery?.append(galleryImg);
	});
}

async function curatedPhotos(): Promise<void> {
	fetchLink = "https://api.pexels.com/v1/curated?per_page=15&page=1";
	const data: object = await fetchApi(fetchLink);
	generatePictures(data);
}

async function searchPhotos(query: string): Promise<void> {
	clear();
	fetchLink = `https://api.pexels.com/v1/search?query=${query}+query&per_page=15&page=1`;
	const data: object = await fetchApi(fetchLink);
	generatePictures(data);
}

function clear(): void {
	gallery!.innerHTML = "";
	searchInput!.value = "";
}

async function loadMore(): Promise<void> {
	page++;
	if (currentSearch) {
		fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=15&page=${page}`;
	} else {
		fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
	}
	const data: object = await fetchApi(fetchLink);
	generatePictures(data);
}

curatedPhotos();
