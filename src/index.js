import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';

const startForm = document.querySelector(`#search-form`);
const galleryImages = document.querySelector(`.gallery`);
const loadBtn = document.querySelector(`.load-more`);
let currentForm = "";
let currentPage = 1;
// let currentList = 40;

function getImages() {
    const BASE_URL = `https://pixabay.com/api/?key=32864806-51f72b6a703d7e1693286dbfa`;
    const OPTS = `&image_type=photo&orientation=horizontal&safesearch=true`;
    const response = axios.get(`${BASE_URL}${OPTS}&per_page=40&page=${currentPage}&q=${currentForm}`);
    return response;
};

startForm.addEventListener(`submit`, submitForm);
// loadBtn.addEventListener(`click`, loadMoreFoo);
function submitForm(e) {
    e.preventDefault();
    resetContainer();
    currentForm = e.currentTarget.elements.searchQuery.value;
    if (currentForm == 0) {
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

function startCreatingGallery(res) {
    console.log(res);
    if (res.totalHits == 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        galleryImages.innerHTML = "";
        return;
    } else if (currentPage === 1) {
        Notiflix.Notify.success("Hooray! We found totalHits images.");
    }
    // loadBtn.classList.remove(`show`);
    res.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
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
    return `<div class="gallery__item"><a href="${largeImageURL}">
    <img class="gallery__item-image" src="${webformatURL}" alt="${tags}" loading="lazy" width="400px" height="300px"></a>
    <ul class="gallery__item-info">
    <li class="gallery__item-desc">Likes<p class="gallery__item-link">${likes}</p></li>
    <li class="gallery__item-desc">Views<p class="gallery__item-link">${views}</p></li>
    <li class="gallery__item-desc">Comments<p class="gallery__item-link">${comments}</p></li>
    <li class="gallery__item-desc">Downloads<p class="gallery__item-link">${downloads}</p></li>
    </ul></div>`
};

// function loadMoreFoo() {}

// const lightbox = new SimpleLightbox('.gallery a', {
//     captionsData: `alt`,
//     captionDelay: 250,
// });
