function formatDay(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[date.getDay()];

  return day;
}

function formatTime(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${date.getHours()}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${date.getMinutes()}`;
  }

  return `${hours}:${minutes}`;
}

let day = document.querySelector(".current-day");
day.innerHTML = formatDay(new Date());
let time = document.querySelector("#time");
time.innerHTML = formatTime(new Date());

let city = "vinnytsia";
let apiKey = "bc2cd97eaa209e7d22d8f3c84081655f";
let curtemperature;
let temperature = document.querySelector("#current-temperature");
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
let currentCity = document.querySelector(".current-city");
let weatherEmoji = document.querySelector(".current-weather-emoji");
let currenWeatherDescriptions = document.querySelector(".current-descriptions");
let overcast = document.querySelector(".overcast");
let weatherIcons = {
  "01": "☀️",
  "02": "🌤️",
  "03": "☁️",
  "04": "☁️",
  "09": "🌧️",
  10: "🌧️",
  11: "⛈️",
  13: "🌨️",
  50: "🌫️",
};

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);

function searchCity(event) {
  event.preventDefault();
  let searchCity = document.querySelector("#search-input");
  city = searchCity.value.charAt(0).toUpperCase() + searchCity.value.slice(1);
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(changeWeather);
}

function changeWeather(response) {
  if (typeof response === "object") {
    currentCity.innerHTML = city;
    curtemperature = response.data.main.temp;
    temperature.innerHTML = Math.round(curtemperature);
    let pressure = response.data.main.pressure;
    let humidity = response.data.main.humidity;
    let wind = response.data.wind.speed;
    weatherEmoji.innerHTML =
      weatherIcons[response.data.weather[0].icon.slice(0, 2)];
    currenWeatherDescriptions.innerHTML = `Pressure: ${pressure} hPa <br />Humidity: ${humidity}% <br />Wind: ${wind} m/s`;
    overcast.innerHTML = response.data.weather[0].main;
    celsius.removeEventListener("click", convertCelsius);
    fahrenheit.addEventListener("click", convertFahrenheit);
    console.log(typeof response);
  }
}

//Geolocation
function changetoCurrent(response) {
  city = response.data.name;
  currentCity.innerHTML = response.data.name;
  axios.get(apiUrl).then(changeWeather);
}
function callCurrent() {
  navigator.geolocation.getCurrentPosition(getCurrentPosition);
}
function getCurrentPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(changetoCurrent);
}
let currentButton = document.querySelector(".current-button");
currentButton.addEventListener("click", callCurrent);
navigator.geolocation.getCurrentPosition(getCurrentPosition);
// Conver Units

function convertFahrenheit() {
  curtemperature = Math.round((curtemperature * 9) / 5 + 32);
  temperature.innerHTML = curtemperature;
  fahrenheit.removeEventListener("click", convertFahrenheit);
  celsius.addEventListener("click", convertCelsius);
}
function convertCelsius() {
  curtemperature = Math.round(((+curtemperature - 32) * 5) / 9);
  temperature.innerHTML = curtemperature;
  celsius.removeEventListener("click", convertCelsius);
  fahrenheit.addEventListener("click", convertFahrenheit);
}
let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", convertFahrenheit);
let celsius = document.querySelector("#celsius");
