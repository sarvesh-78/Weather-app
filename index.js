const weatherForm=document.querySelector(".weatherForm");
const input=document.querySelector(".cityInp");
const card=document.querySelector(".card");
const bgVid=document.querySelector(".video-bg");
const apiKey="a0b9c3fb2572882925d606e2cf83140a";

weatherForm.addEventListener("submit",async event =>{
    event.preventDefault();
    let city=input.value;
    if(city){
        try{
            const weatherData=await getWeatherData(city);
            displayWeatherInfo(weatherData);
        }
        catch(e){
            console.log(e);
            displayDefault(e);
        }
    }
    else{
        const message = "Please enter valid city...";
        displayDefault(message);
    }
});

async function getWeatherData(city){
    const URL=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    const response=await fetch(URL);
    if(!response.ok){
        throw new Error("Could not fetch weather data");
    }

    return await response.json();
}


function isDayTime(sunrise,sunset,timezone){
    let now=Math.floor(Date.now()/1000);
    let localTime=now+timezone;
    return sunrise<=localTime && sunset>=localTime;
}

function weatherEmojiFunc(id,sunrise,sunset,timezone) {
    const vidSource = bgVid.querySelector("source");

    let weatherSymbol;
    switch (true) {
        case (id >= 200 && id < 300):
            vidSource.src = "./images/thunder1.mp4";
            weatherSymbol = "⛈️";
            break;
        case (id >= 300 && id < 400):
            vidSource.src = "./images/drizzle.mp4";
            weatherSymbol = "🌦️";
            break;
        case (id >= 500 && id < 600):
            vidSource.src = "./images/rain.mp4";
            weatherSymbol = "🌧️";
            break;
        case (id >= 600 && id < 700):
            vidSource.src = "./images/snow1.mp4";
            weatherSymbol = "🌨️";
            break;
        case (id >= 700 && id < 800):
            vidSource.src = "./images/windy.mp4";
            weatherSymbol = "🌫️";
            break;
        case (id == 800):
            if(isDayTime(sunrise,sunset,timezone)){
                vidSource.src = "./images/sunny.mp4";
                weatherSymbol = "☀️";
                break;
            }
            else{
                vidSource.src = "./images/night.mp4";
                weatherSymbol = "🌙";
                break;
            }
        case (id >= 801 && id < 810):
            vidSource.src = "./images/windy.mp4";
            weatherSymbol = "☁️";
            break;
        default:
            weatherSymbol = "💀";
    }

    bgVid.load(); 
    bgVid.play();

    return weatherSymbol;
}


let map; // Declare the map variable globally

function displayWeatherInfo(data) {
    const { name: city, main: { temp, humidity }, weather: [{ description, id }], sys: { sunrise, sunset }, timezone } = data;
    card.textContent = "";
    card.style.display = "flex";

    // Create elements for the weather information
    const cityDisplay = document.createElement("h2");
    const tempDisplay = document.createElement("p");
    const humDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}℃`;
    humDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = `Condition: ${description}`;
    weatherEmoji.textContent = weatherEmojiFunc(id, sunrise, sunset, timezone);

    cityDisplay.classList.add("cityName");
    tempDisplay.classList.add("cityTemp");
    humDisplay.classList.add("cityHumidity");
    descDisplay.classList.add("cityHumidity");
    weatherEmoji.classList.add("weatherSymbol");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);

    const mapContainer = document.getElementById('weather-map');
    if (mapContainer) {
        // Clear existing map if it exists
        if (map) {
            map.remove(); // Remove the previous map instance
        }

        // Create a new map for the new city
        map = L.map(mapContainer).setView([data.coord.lat, data.coord.lon], 10);  // Adjust zoom level if needed

        // OpenStreetMap base layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        // OpenWeatherMap weather layer
        const weatherLayerUrl = 'https://{s}.tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={apiKey}';
        const layer = 'clouds_new';  // Weather layer for temperature. You can change this to 'clouds_new', 'precipitation_new', etc.

        // Insert API key and replace layer type
        L.tileLayer(weatherLayerUrl.replace('{layer}', layer).replace('{apiKey}', apiKey), {
            attribution: '&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>',
        }).addTo(map);
    }
}


function displayDefault(message){
    console.log("displayDefault called with message:", message);
    const error=document.createElement("p");
    error.textContent=message; 
    error.classList.add("errorDisplay"); 
    
    card.textContent="";
    card.style.display="flex";
    card.appendChild(error);
}