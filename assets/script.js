var apiKey = "dfd38b3bee3055f620d66057ac768716";
var cityInput = document.getElementById("cityInput");
var weatherDataElement = document.getElementById("weatherData");
var locationElement = document.getElementById("location");
var historyList = document.getElementById("historyList");
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Function to display the weather data
function displayWeather(location, currentWeather, forecastData) {
  var temperature = Math.round(currentWeather.main.temp - 273.15);
  var weatherDescription = currentWeather.weather[0].description;
  var humidity = currentWeather.main.humidity;
  var windSpeed = currentWeather.wind.speed;
  var iconCode = currentWeather.weather[0].icon;
  var iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;

  var currentWeatherDataHtml = `
    <div>
      <h3>Current Weather</h3>
      <p>Temperature: ${temperature}°C</p>
      <p>Description: ${weatherDescription}</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${windSpeed} m/s</p>
      <img src="${iconUrl}" alt="Weather Icon">
    </div>
  `;

  let forecastDataHtml = '<div><h3>Forecast</h3>';
  for (let i = 1; i <= 4; i++) {
    var forecast = forecastData[i];
    var date = new Date(forecast.dt_txt);
    var dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    var temperature = Math.round(forecast.main.temp - 273.15);
    var weatherDescription = forecast.weather[0].description;
    var iconCode = forecast.weather[0].icon;
    var iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;

    forecastDataHtml += `
      <div>
        <h3>${dayOfWeek}</h3>
        <p>Temperature: ${temperature}°C</p>
        <p>Description: ${weatherDescription}</p>
        <img src="${iconUrl}" alt="Weather Icon">
      </div>
    `;
  }
  forecastDataHtml += '</div>';

  locationElement.textContent = location;
  weatherDataElement.innerHTML = currentWeatherDataHtml + forecastDataHtml;
}

// Function to fetch weather data and handle local storage
function getWeather() {
    var city = cityInput.value;
  
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        var location = data.name + ", " + data.sys.country;
        var currentWeather = data;
  
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
        )
          .then((response) => response.json())
          .then((data) => {
            const forecastData = data.list.filter((item) =>
              item.dt_txt.includes("12:00:00")
            );
            displayWeather(location, currentWeather, forecastData);
  
            
            searchHistory.unshift({ location: location, timestamp: Date.now() });
  
          
            if (searchHistory.length > 5) {
              searchHistory = searchHistory.slice(0, 5); 
            }
  
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
            displaySearchHistory(searchHistory);
          })
          .catch((error) => {
            displayError();
          });
      })
      .catch((error) => {
        displayError();
      });
  }
  
// Function to display search history
function displaySearchHistory(searchHistory) {
    while (historyList.firstChild) {
      historyList.removeChild(historyList.firstChild);
    }
  
    searchHistory.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${item.location} - ${new Date(
        item.timestamp
      ).toLocaleString()}`;
      
   
      listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
      listItem.style.backgroundColor = "#e9f4fd"; 
      
      historyList.appendChild(listItem);
    });
  }
  
  // Function to display error
  function displayError() {
    locationElement.textContent = "Error: City not found.";
    weatherDataElement.innerHTML = "";
  }
  
  // Function to initialize the app and display previous search history
  function init() {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || []; // Read search history from Local Storage again
    displaySearchHistory(searchHistory);
  }
  
  // Initialize the app and set up event listener for the search button
  document.addEventListener("DOMContentLoaded", init);