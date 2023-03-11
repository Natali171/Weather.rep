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

function convertToFahrenheitForecast() {
  let minTempElement = document.querySelectorAll(".min-temp");
  minTempElement.forEach((temp) => {
    minTempFahrenheit.push(
      Math.round((+temp.innerHTML.slice(0, -1) * 9) / 5 + 32) + "°"
    );
    minTempFahrenheit.forEach((tempF) => {
      temp.innerHTML = tempF;
    });
  });
  let maxTempElement = document.querySelectorAll(".max-temp");
  maxTempElement.forEach((temp) => {
    maxTempFahrenheit.push(
      Math.round((+temp.innerHTML.slice(0, -1) * 9) / 5 + 32) + "°"
    );
    maxTempFahrenheit.forEach((tempF) => {
      temp.innerHTML = tempF;
    });
  });
}

function displayCelsiusForecast() {
  let minTempElement = document.querySelectorAll(".min-temp");
  for (i = 0; i < 5; i++) {
    minTempElement[i].innerHTML = minTemp[i] + "°";
  }
  let maxTempElement = document.querySelectorAll(".max-temp");
  for (i = 0; i < 5; i++) {
    maxTempElement[i].innerHTML = maxTemp[i] + "°";
  }
}
function convertToFahrenheit() {
  currentTemperature.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);
  celsius.classList.add("active");
  fahrenheit.classList.remove("active");
  celsius.addEventListener("click", displayCelsius);
  convertToFahrenheitForecast();
  fahrenheit.removeEventListener("click", convertToFahrenheit);
}
function displayCelsius() {
  currentTemperature.innerHTML = Math.round(celsiusTemperature);
  celsius.classList.remove("active");
  fahrenheit.classList.add("active");
  let currentCityElement = document.querySelector(".current-city");
  displayCelsiusForecast();
  fahrenheit.addEventListener("click", convertToFahrenheit);
  celsius.removeEventListener("click", displayCelsius);
}
let minTemp = [];
let minTempFahrenheit = [];
let maxTemp = [];
let maxTempFahrenheit = [];
let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", convertToFahrenheit);
let celsius = document.querySelector("#celsius");

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";
  response.data.daily.forEach((day, index) => {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="col">
          <div class="weekday">${formatDay(new Date(day.time * 1000)).slice(
            0,
            3
          )}</div>
          <img
            src=${day.condition.icon_url}
            alt="${day.condition.icon}
            class="weekday-icon"
            width="90px"
          />
          <div class="weekday-temperature">
            <span class="max-temp">${Math.round(
              day.temperature.maximum
            )}°</span> <span class="min-temp">${Math.round(
          day.temperature.minimum
        )}°</span>
          </div>
        </div>`;
      minTemp.push(Math.round(day.temperature.minimum));
      maxTemp.push(Math.round(day.temperature.maximum));
    }
  });
  forecastElement.innerHTML = forecastHTML;
}

function changeWeatherInfo(response) {
  let currentCityElement = document.querySelector(".current-city");
  celsiusTemperature = response.data.temperature.current;
  let overcastElement = document.querySelector(".overcast");
  let currentDescriptionsElement = document.querySelector(
    ".current-descriptions"
  );
  let currentIconElement = document.querySelector("#current-weather-icon");
  currentCityElement.innerHTML = response.data.city;
  currentTemperature.innerHTML = Math.round(response.data.temperature.current);
  overcastElement.innerHTML = response.data.condition.description;
  currentDescriptionsElement.innerHTML = `Pressure: ${response.data.temperature.pressure} hPa<br />
Humidity: ${response.data.temperature.humidity}%<br />
Wind: ${response.data.wind.speed} m/s`;
  currentIconElement.setAttribute("src", response.data.condition.icon_url);
  currentIconElement.setAttribute("alt", response.data.condition.icon);
  celsius.classList.remove("active");
  fahrenheit.classList.add("active");
  celsius.removeEventListener("click", displayCelsius);
  fahrenheit.addEventListener("click", convertToFahrenheit);
}

function handleSubmit(event) {
  event.preventDefault();
  let searchCityElement = document.querySelector("#search-input");
  searchCity(searchCityElement.value);
}

function searchCity(city) {
  let apiKey = "c4b386392fb5t0ca0c484e0cc09aob16";
  let apiUrlCurrent = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;
  let apiUrlForecast = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}`;
  axios.get(apiUrlCurrent).then(changeWeatherInfo);
  axios.get(apiUrlForecast).then(displayForecast);
  minTemp.length = 0;
  maxTemp.length = 0;
}

function handlePosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lat=${lat}&lon=${lon}&key=c4b386392fb5t0ca0c484e0cc09aob16&units=metric`;
  let apiUrlForecast = `https://api.shecodes.io/weather/v1/forecast?lat=${lat}&lon=${lon}&key=c4b386392fb5t0ca0c484e0cc09aob16&units=metric`;
  axios.get(apiUrl).then(changeWeatherInfo);
  axios.get(apiUrlForecast).then(displayForecast);
}
function getPosition() {
  navigator.geolocation.getCurrentPosition(handlePosition);
}

let currentTemperature = document.querySelector("#current-temperature");
let celsiusTemperature;
let searchCityForm = document.querySelector("#search-form");
searchCityForm.addEventListener("submit", handleSubmit);
let currentButton = document.querySelector(".current-button");
currentButton.addEventListener("click", getPosition);
getPosition();

let quickChoice = document.querySelectorAll(".city");
quickChoice.forEach((element) => {
  element.addEventListener("click", () =>
    searchCity(event.srcElement.innerHTML)
  );
});
