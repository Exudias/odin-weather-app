import "./styles/style.css";

const API_KEY = "8ba4e980a5c44bdfbb981113232107"; // it's a free key, I know it's not secured

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

console.log(await getLocationData("London", 2));
