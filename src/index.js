import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import findCountry from './fetchCountries';

const DEBOUNCE_DELAY = 300;

document.querySelector('#search-box').addEventListener('input', debounce(onInputListen, DEBOUNCE_DELAY));
export const list = document.querySelector('.country-list');



// Создаем функцию поиска страны
function onInputListen(evt) {
  const inputValue = evt.target.value.trim();
  if (!inputValue) {
    list.innerHTML ='';
    return;
  };

  findCountry(inputValue).then(data => {
    createMarkup(data)
  })
};


function createMarkup(listOfCountries) {
    // Если в ответе бэкенд вернул больше чем 10 стран, 
    // в интерфейсе пояляется уведомление о том, что имя должно быть более специфичным. 
  if (listOfCountries.length > 10) {
    return Notiflix.Notify.warning('Too many matches found. Please enter a more specific name.');
    // return;
  }
    // Если бэкенд вернул от 2-х до 10-х стран,
    // под тестовым полем отображается список найденных стран.
  if (listOfCountries.length >2 && listOfCountries.length < 10) {
  
    // Создание разметки
    const markup = listOfCountries.map(({flags:{svg}, name:{official}}) => {
        return `<li class="country-list-item">
        <h2><img src="${svg}" alt="${official}" class = "flag"> ${official}</h2>
        </li>` 
      }).join('');
    
    list.innerHTML = markup;
  }

  if (listOfCountries.length === 1) {  
    const markup = listOfCountries.map(({flags:{svg}, name:{official}, capital, population, languages}) => {
        return `<li> 
         <h2><img src="${svg}" alt="${official}" class = "flag--small"> ${official}</h2>
         <p><b>Capital:</b> ${capital}</p>
         <p><b>Population:</b> ${population}</p>
         <p><b>Languages:</b> ${Object.values(languages)}</p>
       </li>` 
      }).join('');
    list.innerHTML = markup;
  }
}