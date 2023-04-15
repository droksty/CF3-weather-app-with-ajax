var MY_KEY = config.KEY1 // replace with your key or your config.js file linked from html

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ];
// const MONTHS_ABBR = [
//   'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
//   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
// ]

const forecastTableHead = 
`<tr>
  <th>Date</th>
  <th>Time</th>
  <th>Temperature</th>
  <th>Feels</th>
  <th>Humidity</th>
  <th>Weather</th>
  <th>Cloudiness</th>
  <th>Wind</th>
  <th>Rain</th>
  <th>Snow</th>
</tr>`



$(document).ready(function() {
  $('#submitButton').on('click', function() {
    let userInput = $('#userInput').val();

    userInput ? getCityGeolocation(userInput) : functionNotImplYet();
  })
})


function getCityGeolocation(userInput) {
  let ajaxRequest = new XMLHttpRequest();

  ajaxRequest.open('GET', `https://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=1&appid=${MY_KEY}`);
  ajaxRequest.timeout = 5000;
  ajaxRequest.ontimeout = (e) => console.log('GeoCoder API Error');
  ajaxRequest.onreadystatechange = function() {
    if (ajaxRequest.readyState === 4) {
      if (ajaxRequest.status === 200) {
        let theCityObject = JSON.parse(ajaxRequest.responseText);
        displayCityHeading(theCityObject);
        getForecast(theCityObject[0].lat, theCityObject[0].lon);
      } else {
        console.log('GeoCoder API Error');
      }
    }
  }
  
  ajaxRequest.send();
}


function displayCityHeading(cityObj) {
  $('#forecastFor').html(`Forecast for: ${cityObj[0].name}, ${cityObj[0].country}`);
}


function getForecast(lat, lon) {
  let xhr = new XMLHttpRequest();

  xhr.open('GET', `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${MY_KEY}`);
  xhr.timeout = 5000;
  xhr.ontimeout = (e) => console.log('Forecast API Error');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log(JSON.parse(xhr.responseText))
        // $('.result').text(xhr.responseText)
        buildForecastTable(JSON.parse(xhr.responseText));
      } else {
        console.log('Forecast API Error');
      }
    }
  }
  
  xhr.send();
}


function buildForecastTable(forecastData) {
  let forecastTableBody = '';

  for (let row of forecastData.list) {
    let humanDate = new Date(row.dt * 1000);
    let day = DAYS[humanDate.getDay()];
    let date = humanDate.getDate().toString().padStart(2, "0");
    let month = MONTHS[humanDate.getMonth()].toString().padStart(2, "0");
    let hours = `${humanDate.getHours().toString().padStart(2, "0")}:00`;
    let datetimeString = `${day} ${date}/${month}`

    forecastTableBody += 
      `<tr>
        <td>${datetimeString}</td>
        <td>${hours}</td>
        <td>${(row.main.temp).toFixed(0)} °C</td>
        <td>${(row.main.feels_like).toFixed(0)} °C</td>
        <td>${row.main.humidity} %</td>
        <td>${row.weather[0].main}</td>
        <td>${row.clouds.all} %</td>
        <td>${(row.wind.speed).toFixed(1)} m/s</td>
        <td>${row.rain ? row.rain['3h'].toFixed(1) + ' mm' : '-'}</td>
        <td>${row.snow ? row.snow['3h'].toFixed(1) + ' mm': '-'}</td>
      </tr>`
  }
  
  $('thead').html(forecastTableHead)
  $('tbody').html(forecastTableBody);
}