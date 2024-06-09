let searchHistoryForWeather = [];
const weatherAPIBaseURL = "https://api.openweathermap.org";
const weatherAPIKey = "479a66df12dc94804e1da449832ed7a9";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const todayContainer = document.querySelector("#today");
const forecastContainer = document.querySelector("#forecast");
const weatherHistory = document.querySelector("#weatherHistory");
