var MY_KEY = config.KEY1 // replace with your key or your config.js file linked from html

$(document).ready(function() {
  $('.btn').on('click', function() {
    let theCity = $('.city').val();

    theCity ? getCityGeolocation(theCity) : aFunctionThatKindlyAsksTheUserToActuallyEnterACity();
  })
})


function getCityGeolocation(city) {
  let ajaxRequest = new XMLHttpRequest();

  ajaxRequest.open('GET', `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${MY_KEY}`);
  ajaxRequest.timeout = 5000;
  ajaxRequest.ontimeout = (e) => console.log('GeoCoder API Error');
  ajaxRequest.onreadystatechange = function() {
    if (ajaxRequest.readyState === 4) {
      if (ajaxRequest.status === 200) {
        let cityGeolocationObj = JSON.parse(ajaxRequest.responseText);
        getWeatherForecast(cityGeolocationObj[0].lat, cityGeolocationObj[0].lon);
      } else {
        console.log('GeoCoder API Error');
      }
    }
  }
  
  ajaxRequest.send();
}


function getWeatherForecast(lat, lon) {
  let xhr = new XMLHttpRequest();

  xhr.open('GET', `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${MY_KEY}`);
  xhr.timeout = 5000;
  xhr.ontimeout = (e) => console.log('Forecast API Error');

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log(JSON.parse(xhr.responseText))
        // $('.result').text(xhr.responseText)
        buildForecast(JSON.parse(xhr.responseText));
      } else {
        console.log('Forecast API Error');
      }
    }
  }
  
  xhr.send();
}


function buildForecast(forecast) {
  let theString = '';

  for (let row of forecast.list) {
    theString += `<tr>
                    <td>${row.dt}</td>
                    <td>${row.main.temp}</td>
                    <td>${row.main.feels_like}</td>
                    <td>${row.main.humidity}</td>
                    <td>${row.weather[0].main}</td><td>${row.weather[0].description}</td>
                    <td>${row.clouds.all}</td>
                    <td>${row.wind.speed}</td>
                    <td>${row.rain ? row.rain['3h'] : '-'}</td>
                    <td>${row.snow ? row.snow['3h'] : '-'}</td>
                  </tr>`
  }
  
  $('tbody').html(theString);
}