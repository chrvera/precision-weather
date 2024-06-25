document.getElementById('search-button').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    getWeatherData(city);
});

document.querySelectorAll('.city-btn').forEach(button => {
    button.addEventListener('click', function() {
        const city = this.textContent;
        getWeatherData(city);
    });
});

function getWeatherData(city) {
    const apiKey = '2102de4397407863c20ebed40dec28d3';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            updateWeatherInfo(data);
            updateForecast(data);
            saveToLocalStorage(city);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function updateWeatherInfo(data) {
    const cityName = data.city.name;
    const currentDate = new Date(data.list[0].dt_txt).toLocaleDateString();
    const temperature = data.list[0].main.temp;
    const wind = data.list[0].wind.speed;
    const humidity = data.list[0].main.humidity;

    document.getElementById('city-name').textContent = `${cityName} (${currentDate})`;
    document.getElementById('temperature').textContent = `Temp: ${temperature} °F`;
    document.getElementById('wind').textContent = `Wind: ${wind} MPH`;
    document.getElementById('humidity').textContent = `Humidity: ${humidity} %`;
}

function updateForecast(data) {
    const forecastContainer = document.getElementById('forecast-cards');
    forecastContainer.innerHTML = '';

    for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const date = new Date(forecast.dt_txt).toLocaleDateString();
        const temp = forecast.main.temp;
        const wind = forecast.wind.speed;
        const humidity = forecast.main.humidity;

        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-card');
        forecastCard.innerHTML = `
            <h3>${date}</h3>
            <p>Temp: ${temp} °F</p>
            <p>Wind: ${wind} MPH</p>
            <p>Humidity: ${humidity} %</p>
        `;

        forecastContainer.appendChild(forecastCard);
    }
}

function saveToLocalStorage(city) {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem('cities', JSON.stringify(cities));
    }
}

// Load last searched city from localStorage
document.addEventListener('DOMContentLoaded', function() {
    const cities = JSON.parse(localStorage.getItem('cities'));
    if (cities && cities.length > 0) {
        getWeatherData(cities[cities.length - 1]);
    }
});