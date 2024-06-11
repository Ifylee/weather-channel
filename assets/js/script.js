let searchHistoryForWeather = [];
const weatherAPIBaseURL = "https://api.openweathermap.org";
const weatherAPIKey = "3191bbb5bba0d2fbfd147dad7dd75f0b";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const todayContainer = document.querySelector("#today");
const forecastContainer = document.querySelector("#forecast");
const weatherHistoryContainer = document.querySelector("#weather-history");


const displayCurrentWeather = (city, weatherData) => {
    const date = dayjs().format("M/D/YYYY");
    const tempF = weatherData.main.temp;
    const windMph = weatherData.wind.speed;
    const iconUrl = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
    const iconDescription = weatherData.weather[0].description || "No Description";

    const card = document.createElement("div");
    const cardBody = document.createElement("div");
    const heading = document.createElement("h3");
    const weatherIcon = document.createElement("img");
    const temperatureElement = document.createElement("p");
    const windElement = document.createElement("p");
    const humidityElement = document.createElement("p");

    card.setAttribute("class", "card");
    cardBody.setAttribute("class", "card-body");
    card.append(cardBody);

    heading.setAttribute("class", "h3 card-title");
    temperatureElement.setAttribute("class", "card-text");
    windElement.setAttribute("class", "card-text");
    humidityElement.setAttribute("class", "card-text");

    heading.textContent = `${city} (${date})`;
    weatherIcon.setAttribute("src", iconUrl);
    heading.append(weatherIcon);
    temperatureElement.textContent = `Temperature: ${tempF} F`;
    windElement.textContent = `Wind: ${windMph} MPH`;
    humidityElement.textContent = `Humidity: ${weatherData.main.humidity}`

}



const fetchWeather = (location) => {
    const latitude = location.lat;
    const longitude = location.lon;

    const city = location.name;
    
    const apiURL = `${weatherAPIBaseURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherAPIKey}`
   
    fetch(apiURL).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
        displayCurrentWeather(city, data.list[0]);
        //  displayForecast(data);
    }).catch(function(error) {
        console.log(error);
    });
};

    const createSearchHistory = () => {
    
        weatherHistoryContainer.innerHTML = "";
        searchHistoryForWeather.forEach(searchHistoryForWeather => {
        const buttonEl = document.createElement("button");
        buttonEl.setAttribute("id", "city-button");
        buttonEl.setAttribute("class", "btn btn-secondary");
        buttonEl.setAttribute("aria-controls", "today forecast");
        buttonEl.classList.add("history-button");
        buttonEl.setAttribute("data-search", searchHistoryForWeather);
        buttonEl.textContent = searchHistoryForWeather;
        weatherHistoryContainer.append(buttonEl);
    });
    
};

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

    
    const url = `${weatherAPIBaseURL}/geo/1.0/direct?q=${search}&appid=${weatherAPIKey}`  
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

const handleSearchFormSubmit = (event) => {
    event.preventDefault();
    
    const search = searchInput.value.trim();
    if(search) {
        fetchCoordinates(search);
    }

    searchInput.value = "";
}

const initializeSearchHistory = () => {
    const storedWeatherHistory = JSON.parse(localStorage.getItem("weatherHistory"));
    if(storedWeatherHistory) {
        searchHistoryForWeather = storedWeatherHistory;
    }
    createSearchHistory();
}

const handleSearchHistoryClick = (event) => {
    console.log(event.target)
    if (!event.target.matches(".history-button")) {
        return;
    }
    const buttonEl = event.target;

    const search = buttonEl.getAttribute("data-search");
    fetchCoordinates(search);
   

}

initializeSearchHistory();

searchForm.addEventListener("submit", handleSearchFormSubmit);

weatherHistoryContainer.addEventListener("click", handleSearchHistoryClick);