import "./styles/style.css";
import WindImage from "./images/wind.png";

const API_KEY = "8ba4e980a5c44bdfbb981113232107"; // it's a free key, I know it's not secured

const searchForm = document.querySelector("#search-form");
const locationInput = document.querySelector("#location-input");
const formErrorField = document.querySelector("#form-error");

const todayContainer = document.querySelector(".today-container");
const multiDayContainer = document.querySelector(".multi-day-container");
const dayContainers = multiDayContainer.querySelectorAll(".day-container");

const todayName = todayContainer.querySelector("#today-name");
const todayDegrees = todayContainer.querySelector("#today-degrees");
const todayIcon = todayContainer.querySelector("#today-icon");

const todayWindImg = todayContainer.querySelector("#today-wind img");
const todayWindText = todayContainer.querySelector("#today-wind p");

async function getLocationData(location, days) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=${days}&aqi=no&alerts=no`,
      { mode: "cors" }
    );

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function objectFromWeatherJSON(json) {
  if (!json) {
    return null;
  }

  let obj = {};

  obj.name = json.location.name;

  obj.currentTempC = json.current.temp_c;
  obj.currentTempF = json.current.temp_f;

  obj.feelsLikeC = json.current.feelslike_c;
  obj.feelsLikeF = json.current.feelslike_f;

  obj.currentCondition = {
    icon: json.current.condition.icon,
    text: json.current.condition.text,
  };

  obj.currentWindKPH = json.current.wind_kph;
  obj.currentWindMPH = json.current.wind_mph;

  obj.forecastDays = json.forecast.forecastday.map((day) =>
    parseForecastDayJSON(day)
  );

  return obj;
}

function parseForecastDayJSON(json) {
  let obj = {};

  obj.date = json.date;

  obj.averageTempC = json.day.avgtemp_c;
  obj.averageTempF = json.day.avgtemp_f;

  obj.condition = {
    icon: json.day.condition.icon,
    text: json.day.condition.text,
  };

  obj.chanceOfRain = json.day.daily_chance_of_rain;
  obj.chanceOfSnow = json.day.daily_chance_of_snow;

  obj.highC = json.day.maxtemp_c;
  obj.highF = json.day.maxtemp_f;

  obj.lowC = json.day.mintemp_c;
  obj.lowF = json.day.mintemp_f;

  return obj;
}

searchForm.onsubmit = async (e) => {
  e.preventDefault();
  const inputValue = locationInput.value;

  if (!inputValue) {
    return;
  }

  const result = objectFromWeatherJSON(await getLocationData(inputValue, 3));
  if (result) {
    console.log(result);
    formErrorField.textContent = "Showing results for: " + result.name;
    displayResult(result);
  } else {
    formErrorField.textContent =
      "Location not found! Try searching for a city...";
  }
};

function displayResult(obj) {
  todayName.textContent = obj.name;

  todayDegrees.textContent = `${obj.currentTempC}° C / ${obj.currentTempF}° F`;

  todayIcon.textContent = "Weather is " + obj.currentCondition.text;

  todayWindImg.src = WindImage;
  todayWindText.textContent = `${obj.currentWindKPH} kph / ${obj.currentWindMPH} mph`;

  for (let i = 0; i < dayContainers.length; i++) {
    const con = dayContainers[i];
    const data = obj.forecastDays[i];

    const date = con.querySelector("#day-date");
    const tempsC = con.querySelector("#day-temps-c");
    const tempsF = con.querySelector("#day-temps-f");
    const rain = con.querySelector("#day-rain");
    const snow = con.querySelector("#day-snow");

    const dateObj = new Date(data.date);
    date.textContent = `${dateObj.getDate()}.${(dateObj.getMonth() + 1).toString().padStart(2, "0")}`;

    tempsC.textContent = `H: ${data.highC}° C L: ${data.lowC}° C`;
    tempsF.textContent = `H: ${data.highF}° F L: ${data.lowF}° F`;

    rain.textContent = "Rain: " + data.chanceOfRain + "%";
    snow.textContent = "Snow: " + data.chanceOfSnow + "%";
  }
}
