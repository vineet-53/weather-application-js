const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const weatherInterface = document.querySelector(".weather-interface");
const searchWeatherInterface = document.querySelector(
  ".search-weather-interface"
);
const grantLocationInterface = document.querySelector(
  ".grant-access-interface"
);
const loader = document.querySelector(".loader-interface");
const searchForm = document.querySelector("[data-searchForm]");
// data values
const API_AUTH = "5428228fdff2602f15a8bdcc5f4bb63c";
const searchInput = document.querySelector("[data-searchInput]");
const grantAccessButton = document.querySelector("[data-grantAccessButton]");
let currentTab = userTab;
function renderChangesToUi(data) {
  // variables
  const countryFlag = document.querySelector("[data-countryFlag]");
  const city = document.querySelector("[data-cityName]");
  const windSpeed = document.querySelector("[data-windSpeed]");
  const humid = document.querySelector("[data-humidity]");
  const clouds = document.querySelector("[data-clouds]");
  const cloudDesc = document.querySelector("[data-cloudDesc]");
  const temprature = document.querySelector("[data-temprature]");

  countryFlag.src = `https://flagsapi.com/${data.sys.country}/flat/64.png`;
  city.textContent = data.name;
  windSpeed.textContent = `${data.wind.speed} m/s`;
  humid.textContent = `${data.main.humidity}%`;
  clouds.textContent = `${data.clouds.all}%`;
  temprature.textContent = `${new String(data?.main?.temp - 273).slice(
    0,
    5
  )} deg C`;
  cloudDesc.textContent = data?.weather?.[0]?.description;
}
async function setUserCoords(position) {
  navigator.geolocation.getCurrentPosition((position) => {
    let userCoordinates = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  });
}
function wantLoaderVisible(state) {
  state ? loader.classList.add("active") : loader.classList.remove("active");
}
async function fetchWeatherData(API) {
  try {
    return fetch(API).then((res) => res.json());
  } catch (err) {
    return err;
  }
}
function getUserCoords() {
  return JSON.parse(sessionStorage.getItem("user-coordinates"));
}
// 
async function userWeatherData() {
  let coords = await getUserCoords();
  let { lat, lon } = coords;
  const API = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_AUTH}`;
  try {
    // visible loader
    wantLoaderVisible(true);
    // fetch api
    const data = await fetchWeatherData(API);
    // hide loader
    wantLoaderVisible(false);
    // display
    weatherInterface.classList.add("active");
    grantLocationInterface.classList.remove("active");
    searchWeatherInterface.classList.remove("active");
    // render data on ui
    renderChangesToUi(data);
  } catch (err) {
    wantLoaderVisible(false);
    // show error fetching box
    console.log(err);
  }
}
async function searchWeatherData() { 
  const API = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&appid=${API_AUTH}`;
  
  try {
    // visible loader
    wantLoaderVisible(true);
    // fetch api
    const data = await fetchWeatherData(API);
    // hide loader
    wantLoaderVisible(false);
    // display
    weatherInterface.classList.add("active");
    searchWeatherInterface.classList.add("active");
    // render data on ui
    renderChangesToUi(data);
  } catch (err) {
    wantLoaderVisible(false);
    // show error fetching box
    console.log(err);
  }

}
function switchTo(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("active-tab");
    currentTab = clickedTab;
    currentTab.classList.add("active-tab");
  }
  if (clickedTab == userTab) {
    // hide search interface
    searchWeatherInterface.classList.remove("active");
    userWeatherData();
    // show weather
    weatherInterface.classList.add("active");
  } else {
    // hide weather tab
    weatherInterface.classList.remove("active");
    // show search tab
    searchWeatherInterface.classList.add("active");
  }
}
function checkLocalCoords() {
  if (getUserCoords() == undefined)
    grantLocationInterface.classList.add("active");
  else userWeatherData();
}
function handleUserTab() {
  switchTo(userTab);
}
function handleSearchTab() {
  switchTo(searchTab);
}
function setAttributesOnPageLoad() {
  checkLocalCoords();
}
async function handleGrantLocation() {
  await setUserCoords();
  setTimeout(() => {
    userWeatherData();
  }, 250);
}
function handleFormClick(event) { 
  if(searchInput.value == ""){
    event.preventDefault();
    return;
  }
  event.preventDefault();
  searchWeatherData();


}
userTab.addEventListener("click", handleUserTab);
searchTab.addEventListener("click", handleSearchTab);
grantAccessButton.addEventListener("click", handleGrantLocation);
searchForm.addEventListener('click' , handleFormClick);
window.addEventListener("load", setAttributesOnPageLoad);
