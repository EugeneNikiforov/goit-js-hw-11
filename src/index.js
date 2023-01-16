import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';
import debounce from "lodash.debounce";

const DEBOUNCE_DELAY = 300;
const startForm = document.querySelector(`#search-form`);
const galleryImages = document.querySelector(`.gallery`);
// const loadBtn = document.querySelector(`.load-more`);
const loadScroll = document.querySelector(`.load-more-scroll`);
let currentForm = ``;
let currentPage = 1;


async function getImages() {
    const BASE_URL = `https://pixabay.com/api/?key=32864806-51f72b6a703d7e1693286dbfa`;
    const OPTS = `&image_type=photo&orientation=horizontal&safesearch=true`;
    const response = await axios.get(`${BASE_URL}${OPTS}&per_page=40&page=${currentPage}&q=${currentForm}`);
    console.log(response.data);
    return response.data;
};

window.addEventListener(`scroll`, debounce(undefinedScroll), DEBOUNCE_DELAY);
startForm.addEventListener(`submit`, submitForm);
// loadBtn.addEventListener(`click`, loadMoreFoo);
function submitForm(e) {
    e.preventDefault();
    resetContainer();
    currentForm = e.currentTarget.elements.searchQuery.value;
    if (currentForm === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return;
    }
    currentPage = 1;
    // loadBtn.style.visibility = "visible";
    getImages().then(startCreatingGallery).catch(error => console.log(error));
};
function resetContainer() {
    return galleryImages.innerHTML = "";
};

function startCreatingGallery(data) {
    const { hits, totalHits } = data;
    if (hits.length === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        galleryImages.innerHTML = "";
        return;
    } else if (currentPage === 1) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
    // loadScroll.classList.remove(`show`);
    hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        galleryImages.insertAdjacentHTML(`beforeend`, markupElements({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }))
    }).join("");
    openingGalleryItem();
};

function openingGalleryItem() {
    const lightbox = new SimpleLightbox('.gallery a', {
        captionsData: `alt`,
        captionDelay: 250,
        captions: true,
    })
    lightbox.refresh();
};

function markupElements({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
    return `<div class="photo-card"><a href="${largeImageURL}">
    <img class="photo-card__image" src="${webformatURL}" alt="${tags}" loading="lazy" width="400" height="300" /></a>
    <ul class="info">
    <li class="info-item__desc">
    Likes
    <p class="info-item">${likes}</p>
    </li>
    <li class="info-item__desc">
    Views
    <p class="info-item">${views}</p>
    </li>
    <li class="info-item__desc">
    Comments
    <p class="info-item">${comments}</p>
    </li>
    <li class="info-item__desc">
    Downloads
    <p class="info-item">${downloads}</p>
    </li>
    </ul></div>`
};

// function loadMoreFoo() {
//     currentPage += 1;
// };

function undefinedScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (clientHeight + scrollTop >= scrollHeight - 5) {
    loadScroll.classList.add(`show`)
    currentPage += 1;
        getImages().then(startCreatingGallery).catch(error => console.log(error));
    return;
    }
};
