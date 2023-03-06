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

let currentTemperature;

function convertFahrenheit() {
  let curTemperature = Math.round((currentTemperature.innerHTML * 9) / 5 + 32);
  currentTemperature.innerHTML = curTemperature;
  fahrenheit.removeEventListener("click", convertFahrenheit);
  celsius.addEventListener("click", convertCelsius);
}
function convertCelsius() {
  let curTemperature = Math.round(
    ((currentTemperature.innerHTML - 32) * 5) / 9
  );
  currentTemperature.innerHTML = curTemperature;
  celsius.removeEventListener("click", convertCelsius);
  fahrenheit.addEventListener("click", convertFahrenheit);
}
let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", convertFahrenheit);
let celsius = document.querySelector("#celsius");

function changeWeatherInfo(response) {
  console.log(response);
  currentTemperature = document.querySelector("#current-temperature");
  let overcastElement = document.querySelector(".overcast");
  let currentDescriptionsElement = document.querySelector(
    ".current-descriptions"
  );
  let currentIconElement = document.querySelector("#current-weather-icon");
  currentTemperature.innerHTML = Math.round(response.data.temperature.current);
  overcastElement.innerHTML = response.data.condition.description;
  currentDescriptionsElement.innerHTML = `Pressure: ${response.data.temperature.pressure} hPa<br />
Humidity: ${response.data.temperature.humidity}%<br />
Wind: ${response.data.wind.speed} m/s`;
  currentIconElement.setAttribute("src", response.data.condition.icon_url);
  currentIconElement.setAttribute("alt", response.data.condition.icon);
}

let city = "Sydney";
let apiKey = "c4b386392fb5t0ca0c484e0cc09aob16";
let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;

axios.get(apiUrl).then(changeWeatherInfo);