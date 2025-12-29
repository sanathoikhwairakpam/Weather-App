const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const cityNameEl = document.getElementById('city-name');
const tempEl = document.getElementById('temperature');
const conditionEl = document.getElementById('condition');
const windEl = document.getElementById('wind');
const humidityEl = document.getElementById('humidity');

// Default city
let currentCity = 'London';

async function getCoordinates(city) {
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            throw new Error('City not found');
        }
        return data.results[0];
    } catch (error) {
        console.error(error);
        alert('City not found. Please try again.');
        return null;
    }
}

async function getWeather(lat, lon) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`);
        const data = await response.json();
        return data.current;
    } catch (error) {
        console.error(error);
        return null;
    }
}

function getWeatherDescription(code) {
    // WMO Weather interpretation codes (WW)
    const codes = {
        0: 'Clear sky',
        1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Depositing rime fog',
        51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
        61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
        71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
        95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail'
    };
    return codes[code] || 'Unknown';
}

async function updateWeather(city) {
    cityNameEl.innerText = 'Loading...';

    const locationData = await getCoordinates(city);
    if (!locationData) {
        cityNameEl.innerText = 'Error';
        return;
    }

    const weatherData = await getWeather(locationData.latitude, locationData.longitude);

    if (weatherData) {
        cityNameEl.innerText = locationData.name;
        tempEl.innerText = Math.round(weatherData.temperature_2m);
        conditionEl.innerText = getWeatherDescription(weatherData.weather_code);
        windEl.innerText = `${weatherData.wind_speed_10m} km/h`;
        humidityEl.innerText = `${weatherData.relative_humidity_2m}%`;
    }
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        updateWeather(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            updateWeather(city);
        }
    }
});

// Initial load
updateWeather(currentCity);
