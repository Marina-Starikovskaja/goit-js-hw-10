import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import {findCountry} from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputForm = document.getElementById(`search-box`);
const listEl = document.querySelector(`.country-list`);
inputForm.addEventListener(`input`, debounce(searchCountry, DEBOUNCE_DELAY));


// Создаем функцию поиска страны
function searchCountry(event) {
  const country = event.target.value.trim();

  if (!country || country === ``) {
    listEl.innerHTML = ``;
  }
  findCountry(country)
  .then(data => {
    if(data.status === 404){
    Notiflix.Notify.failure(`Oops, there is no country with that name`)
  }

  renderMarkUp(data);
})
.catch(error => {
    Notiflix.Notify.failure(error)
});

}

function renderMarkUp(listOfCountries) {
    // Если в ответе бэкенд вернул больше чем 10 стран, 
    // в интерфейсе пояляется уведомление о том, что имя должно быть более специфичным. 
  if (listOfCountries.length > 10) {
    Notiflix.Notify.warning('Too many matches found. Please enter a more specific name.');
    return;
  }
    // Если бэкенд вернул от 2-х до 10-х стран,
    // под тестовым полем отображается список найденных стран.
  if (listOfCountries.length < 10 && listOfCountries.length >= 2) {
    listEl.innerHTML = ``;
    // Создание разметки
    const fullListOfCountries = listOfCountries
      .map(
        country =>
            `
            <li class = "country-list-item">
            <img class = "flag" src="${country.flags.svg}" alt="">
            <span>${country.name.official}</span>
            `
      )
      .join('');

    listEl.insertAdjacentHTML(`afterbegin`, fullListOfCountries);
  }
  if (listOfCountries.length === 1) {
    listEl.innerHTML = ``;
    const newCountry = listOfCountries
      .map(
        country =>
            `
            <li>
            <img class="flag--small" src="${country.flags.svg}" alt="">
            <span> ${country.name.official}</span>
            <p>Capital: ${country.capital}</p>
            <p>Population: ${country.population}</p>
            <p>Languages: ${Object.values(country.languages)}</p>
            </li>
            `
      )
      .join('');
    // Добавление разметки в DOM
    listEl.insertAdjacentHTML(`afterbegin`, newCountry);
  }
}