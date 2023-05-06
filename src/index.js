import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchPhotos } from './fetch';
import './style.css';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');

let page = 1;
let searchQuery = '';

let lightbox = new SimpleLightbox('.gallery li a', {
  captionsData: 'alt',
  captionDelay: 250,
});

formEl.addEventListener('submit', e => {
  e.preventDefault();
  galleryEl.innerHTML = '';
  searchQuery = e.currentTarget.searchQuery.value.trim();

  page = 1;

  fetchPhotos(searchQuery, page)
    .then(data => {
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        renderGallery(data.hits);
      }
    })
    .catch(error => console.log(error));

  formEl.reset();
});

window.addEventListener('scroll', () => {
  const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight > scrollHeight - 5) {
    page += 1;
    fetchPhotos(searchQuery, page)
      .then(data => {
        if (data.hits.length === 0) {
          Notiflix.Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
        }
        renderGallery(data.hits);
      })
      .catch(error => console.log(error));
  }
});

function renderGallery(data) {
  galleryEl.insertAdjacentHTML('beforeend', createGalleryMarkup(data));
  lightbox.refresh();
  galleryEl.addEventListener('click', e => e.preventDefault());
}

function createGalleryMarkup(data) {
  return data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
    <li class="photo-card">
        <a href="${largeImageURL}">
            <img class='img' src="${webformatURL}" data-source="${largeImageURL}" alt="${tags}" loading="lazy" width="300" height="200" />
        </a>
         <ul class="info">
            <li class="info-item">
                <b>Likes</b>
                ${likes}
            </li>
            <li class="info-item">
                <b>Views</b>
                ${views}
            </li>
            <li class="info-item">
                <b>Comments</b>
                 ${comments}
            </li>
            <li class="info-item">
                <b>Downloads</b>
                ${downloads}
            </li>
        </ul>
    </li>`;
      }
    )
    .join('');
}
