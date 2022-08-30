import Notiflix from 'notiflix';
import {list} from './index';
export default function fetchCountries(name) {
  const url = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`;
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        list.innerHTML = '';
        Notiflix.Notify.failure('Oops, there is no country with that name.', {
          width: '360px',
          svgSize: '120px',
        });
      }
      return response.json()
    });
};