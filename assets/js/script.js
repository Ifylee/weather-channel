let searchHistoryForWeather = [];
const weatherAPIBaseURL = "https://api.openweathermap.org";
const weatherAPIKey = "479a66df12dc94804e1da449832ed7a9";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const todayContainer = document.querySelector("#today");
const forecastContainer = document.querySelector("#forecast");
const weatherHistory = document.querySelector("#weatherHistory");

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
        const latitude = data[0].lat;
        const longitude = data[0].lon;
        console.log(data, latitude, longitude);
    })
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
