async function getWeather(latitude, longitude) {
    const locationEl = document.getElementById('location');
    const temperatureEl = document.getElementById('temperature');
    const descriptionEl = document.getElementById('description');
    const detailsEl = document.getElementById('details');
    const forecastContainer = document.getElementById('forecast-container');
    const iconEl = document.getElementById('weather-icon');

    try {
        const apiKey = 'bd5e378503939ddaee76f12ad7a97608';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        locationEl.textContent = data.name;
        temperatureEl.textContent = `${data.main.temp} °C`;
        descriptionEl.textContent = data.weather[0].description;
        detailsEl.textContent = `Humidity: ${data.main.humidity}% | Wind: ${data.wind.speed} km/h`;
        iconEl.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=metric`);
        const forecastData = await forecastResponse.json();

        forecastContainer.innerHTML = '';
        forecastData.daily.forEach((day, index) => {
            if (index < 7) {
                const forecastItem = document.createElement('div');
                forecastItem.className = 'forecast-item';
                forecastItem.innerHTML = `
                    <p>${new Date(day.dt * 1000).toLocaleDateString()}</p>
                    <p>${Math.round(day.temp.day)}°C</p>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}" style="width: 40px; height: 40px;">
                `;
                forecastContainer.appendChild(forecastItem);
            }
        });
    } catch (error) {
        alert('Could not fetch weather data. Please try again.');
    }
}

function getLocation() {
    const loadingEl = document.getElementById('loading');
    loadingEl.style.display = 'block';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;

            const map = L.map('map').setView([latitude, longitude], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            L.marker([latitude, longitude]).addTo(map);

            getWeather(latitude, longitude);
            loadingEl.style.display = 'none';
        }, () => {
            alert('Geolocation not allowed. Please enable it or enter your city manually.');
            loadingEl.style.display = 'none';
        });
    } else {
        alert('Geolocation is not supported by this browser.');
        loadingEl.style.display = 'none';
    }
}

window.onload = getLocation;
