// created the variables for easy reference
let searchHistoryForWeather = [];
const weatherAPIBaseURL = "https://api.openweathermap.org";
const weatherAPIKey = "3191bbb5bba0d2fbfd147dad7dd75f0b";

// declared my variables with their associated id as their selectors
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const todayContainer = document.querySelector("#today");
const forecastContainer = document.querySelector("#forecast");
const weatherHistoryContainer = document.querySelector("#weather-history");

// Function to display the current weather for a given city using weather data.
const displayCurrentWeather = (city, weatherData) => {
    // uses dayjs library to get the current date and formats it also
    const date = dayjs().format("M/D/YYYY");
    // these codes are extracting temperature, windspeed, humidity, icon and description from the weather API
    const tempF = weatherData.main.temp;
    const windMph = weatherData.wind.speed;
    const humidity = weatherData.main.humidity;
    const iconUrl = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
    const iconDescription = weatherData.weather[0].description || "No Description";
  
// These sets up the structure of a weather card by creating several HTML elements intended to display weather information.
    const card = document.createElement("div");
    const cardBody = document.createElement("div");
    const heading = document.createElement("h3");
    const weatherIcon = document.createElement("img");
    const temperatureElement = document.createElement("p");
    const windElement = document.createElement("p");
    const humidityElement = document.createElement("p");

//   Using bootstrap classes to set up a styled card container with nested body section, ready to be furnished with weather information and added to the DOM
    card.setAttribute("class", "card bg-light border-primary text-black mb-3");
    cardBody.setAttribute("class", "card-body");
    card.append(cardBody);

    heading.setAttribute("class", "h3 card-title");
    temperatureElement.setAttribute("class", "card-text");
    windElement.setAttribute("class", "card-text");
    humidityElement.setAttribute("class", "card-text");

    // These populates the HTML elements with content using the previously set classes and attributes and appends them to form a structured weather card.
    heading.textContent = `${city} (${date})`;
    weatherIcon.setAttribute("src", iconUrl);
    weatherIcon.setAttribute("alt", iconDescription);
    heading.append(weatherIcon);
    temperatureElement.textContent = `Temperature : ${tempF} °F`;
    windElement.textContent = `Wind: ${windMph} MPH`;
    humidityElement.textContent = `Humidity: ${humidity} %`;
    cardBody.append(heading, temperatureElement, windElement, humidityElement);

// this clears any existing content in the container and appends a newly created weather card to it.
    todayContainer.innerHTML = "";
    todayContainer.append(card);
}

// This function is extracting and preparing the weather forecast data to be used for creating an HTML card.
const createForecastCard = (forecastData) => {
    const iconUrl = `https://openweathermap.org/img/w/${forecastData.weather[0].icon}.png`;
    const iconDescription = forecastData.weather[0].description || "No description";
    const temperature = forecastData.main.temp;
    const wind = forecastData.wind.speed;
    const humidity = forecastData.main.humidity;

    // creates new elements in memory but hasn't yet added them to the DOM. Will be used later to build the weather card structure.
    const column = document.createElement("div");
    const card = document.createElement("div");
    const cardBody = document.createElement("div");
    const cardTitle = document.createElement("h5");
    const weatherIcon = document.createElement("img");
    const temperatureElement = document.createElement("p");
    const windElement = document.createElement("p");
    const humidityElement = document.createElement("p");

    // appending the structure to create the card layout.
    column.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, weatherIcon, temperatureElement, windElement, humidityElement);

    // setting attributes and classes for the previously created HTML elements using bootstrap classes
    column.setAttribute("class", "col-md");
    column.classList.add("five-day-card");
    card.setAttribute("class", "card bg-dark text-white");
    cardBody.setAttribute("class", "card-body");
    cardTitle.setAttribute("class", "card-title");
    temperatureElement.setAttribute("class", "card-text");
    windElement.setAttribute("class", "card-text");
    humidityElement.setAttribute("class", "card-text");

    // It is dynamically updating the content and attributes of the element to display specific information on weather forecast data and appending it to the forecast container
    cardTitle.textContent = dayjs(forecastData.dt_txt).format("M/D/YYYY");
    weatherIcon.setAttribute("src", iconUrl);
    weatherIcon.setAttribute("alt", iconDescription);
    temperatureElement.textContent = `Temperature🌡️: ${temperature} °F`;
    windElement.textContent = `wind༄: ${wind} MPH`;
    humidityElement.textContent = `Humidity💦: ${humidity} %`;

    forecastContainer.append(column);
}

// This function expression effectively sets up the structure and content for displaying a 5-day weather forecast.
// It creates and appends a forecast card for this specific weather data item.
const displayForecast = (weatherData) => {
    // this calculates the unix timestamp for the start of the day.
    // the  'dayjs().add(1, 'day')' adds one day to the current date and the `startOf('day)` sets the time of the start of that day.
    // the `unix()` converts it to a unix timestamp.
    const startDate = dayjs().add(1, "day").startOf("day").unix();
    const endDate = dayjs().add(6, "day").startOf("day").unix(); 

    const headingColumn = document.createElement("div");
    const heading = document.createElement("h3");
    headingColumn.setAttribute("class", "col-12");
    heading.textContent = "5-Day Forecast:";
    headingColumn.append(heading);

// clears any existing content inside the forecastContainer.
    forecastContainer.innerHTML = "";
    forecastContainer.append(headingColumn);

    // loops over each item in the weatherData array
    for(let i = 0; i < weatherData.length; i++) {
        // checks if the unix timestamp `dt` of the current weatherData item is within the 5-day forecast period.
        if(weatherData[i].dt >= startDate && weatherData[i].dt < endDate ) {

// Checks if the time part of the dt_txt string (which represents the forecast time) is 12:00 PM. This ensures the forecast is for midday, providing a steady time for the displayed forecasts.
            if(weatherData[i].dt_txt.slice(11,13)=== "12") {

// calls the createForecastCard function with the current weatherData item as an argument.
             createForecastCard(weatherData[i]);   
            }
        }
    }
}

// this function retrieves weather data for a specified location and uses the retrieved data to update the weather display on the webpage.
const fetchWeather = (location) => {
    const latitude = location.lat;
    const longitude = location.lon;

    const city = location.name;
    
    const apiURL = `${weatherAPIBaseURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherAPIKey}`;
   
    fetch(apiURL).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
        displayCurrentWeather(city, data.list[0]);
        displayForecast(data.list);
    }).catch(function(error) {
        console.log(error);
    });
};

    const createSearchHistory = () => {
    
    weatherHistoryContainer.innerHTML = "";
    for(let i = 0; i < searchHistoryForWeather.length; i++) {
        // searchHistoryForWeather.forEach(searchHistoryForWeather => {
        const buttonEl = document.createElement("button");
        buttonEl.setAttribute("type", "button");
        buttonEl.setAttribute("id", "city-button");
        buttonEl.setAttribute("class", "btn btn-secondary");
        buttonEl.setAttribute("aria-controls", "today forecast");
        buttonEl.classList.add("history-button");
        buttonEl.setAttribute("data-search", searchHistoryForWeather[i]);
        buttonEl.textContent = searchHistoryForWeather[i];
        weatherHistoryContainer.append(buttonEl);
        
    };
    
};

// this function takes care of the search history for weather queries.
const appendWeatherHistory = (search) =>{
    if(searchHistoryForWeather.includes(search)) {
        return searchHistoryForWeather;
    }
    searchHistoryForWeather.push(search);
    localStorage.setItem('weatherHistory', JSON.stringify(searchHistoryForWeather));
    createSearchHistory();
};

function fetchCoordinates(search) {
    // console.log("fetchCoordinates", search);
    // a. url -> endpoint
    // b. parameters -> query string
    // c. fetch -> GET

    
    const url = `${weatherAPIBaseURL}/geo/1.0/direct?q=${search}&appid=${weatherAPIKey}`; 
    fetch(url)
    .then(function(response) {
            // console.log(response.json())
            return response.json()
        // return JSON.parse(response);
    }).then(function(data) {

        if(!data[0]) {
            alert("City not found");
        } else {
            console.log(data);
            appendWeatherHistory(search);
            fetchWeather(data[0]);
        }
    }).catch(function(error) {
        console.log(error);
    });
}

// this function handles the search form submission
const handleSearchFormSubmit = (event) => {
    // prevents refreshing the page
    event.preventDefault();
    
    const search = searchInput.value.trim();
    if(search) {
        fetchCoordinates(search);
    }

    searchInput.value = "";
}

//this function initializes the search history for weather queries based on data previously saved in the local storage. 
const initializeSearchHistory = () => {
    const storedWeatherHistory = JSON.parse(localStorage.getItem("weatherHistory"));
    if(storedWeatherHistory) {
        searchHistoryForWeather = storedWeatherHistory;
    }
    createSearchHistory();
};

// This function lets users to click on previous search entries in a history list and retrieves the associated search query from the data search attribute of the clicked element.
const handleSearchHistoryClick = (event) => {
    console.log(event.target)
    if (!event.target.matches(".history-button")) {
        return;
    }
    const buttonEl = event.target;

    const search = buttonEl.getAttribute("data-search");

    fetchCoordinates(search);
   

};


initializeSearchHistory();

// event listeners
searchForm.addEventListener("submit", handleSearchFormSubmit);

weatherHistoryContainer.addEventListener("click", handleSearchHistoryClick);