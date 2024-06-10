let searchHistoryForWeather = [];
const weatherAPIBaseURL = "https://api.openweathermap.org";
const weatherAPIKey = "479a66df12dc94804e1da449832ed7a9";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const todayContainer = document.querySelector("#today");
const forecastContainer = document.querySelector("#forecast");
const weatherHistory = document.querySelector("#weatherHistory");

const fetchWeather = (location) => {

}

const appendWeatherHistory = (search) =>{
    if(searchHistoryForWeather.indexOf(search) === -1) {
        return;
    }
    searchHistoryForWeather.push(search);
    localStorage.setItem('weatherHistory', JSON.stringify(searchHistoryForWeather));
}

function fetchCoordinates(search) {
    // console.log("fetchCoordinates", search);
    // a. url -> endpoint
    // b. parameters -> query string
    // c. fetch -> GET

    
    const url = `${weatherAPIBaseURL}/geo/1.0/direct?q=${search}&appid=${weatherAPIKey}`  
    fetch(url)
    .then(function(response) {
        return response.json();
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


// searchForm.addEventListener("submit", handleSearchFormSubmit);
