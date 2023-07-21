import "./styles/style.css";
import WindImage from "./images/wind.png";

const API_KEY = "8ba4e980a5c44bdfbb981113232107"; // it's a free key, I know it's not secured

const searchForm = document.querySelector("#search-form");
const locationInput = document.querySelector("#location-input");
const formErrorField = document.querySelector("#form-error");

const todayContainer = document.querySelector(".today-container");
const multiDayContainer = document.querySelector(".multi-day-container");

const todayName = todayContainer.querySelector("#today-name");
const todayDegrees = todayContainer.querySelector("#today-degrees");
const todayIcon = todayContainer.querySelector("#today-icon");

const todayWindImg = todayContainer.querySelector("#today-wind img");
const todayWindText = todayContainer.querySelector("#today-wind p");

async function getLocationData(location, days) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=${days}&aqi=no&alerts=no`,
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
  todayWindText.textContent = `${obj.currentWindKPH} km/h / ${obj.currentWindMPH} mph`;
}
