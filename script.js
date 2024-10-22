const apiKey = 'cc7b640d8b4e660dfe876438c3df4396'; // Your OpenWeatherMap API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';

const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const weatherInfo = document.getElementById('weather-info');

// New elements for searched city weather
const searchedCityName = document.getElementById('searched-city-name');
const searchedTemperature = document.getElementById('searched-temperature');
const searchedDescription = document.getElementById('searched-description');
const searchedWeatherIcon = document.getElementById('searched-weather-icon');

let currentSlide = 0;

// Array of cities corresponding to slides
const cities = ['London', 'Abuja', 'New York', 'Tokyo'];

// Function to get weather data
async function getWeather(city, isSearched = false) {
    try {
        const response = await fetch(`${apiUrl}${encodeURIComponent(city)}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (data.cod === 200) {
            if (isSearched) {
                // Update searched city weather
                searchedCityName.textContent = data.name;
                searchedTemperature.textContent = `Temperature: ${data.main.temp}°C`;
                searchedDescription.textContent = `Weather: ${data.weather[0].description}`;

                // Add weather icon
                const existingIcon = document.getElementById('searched-weather-icon');
                existingIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                existingIcon.alt = data.weather[0].description;
            } else {
                // Update slideshow city weather
                weatherInfo.style.opacity = '0'; // Hide data before new fetch
                cityName.textContent = data.name;
                temperature.textContent = `Temperature: ${data.main.temp}°C`;
                description.textContent = `Weather: ${data.weather[0].description}`;

                // Add weather icon
                const weatherIcon = document.createElement('img');
                weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                weatherIcon.alt = data.weather[0].description;
                // Clear previous icon if exists
                const existingIcon = document.getElementById('weather-icon');
                if (existingIcon) {
                    existingIcon.remove();
                }
                weatherIcon.id = 'weather-icon';
                document.getElementById('weather-info').appendChild(weatherIcon);

                // Trigger fade-in animation
                setTimeout(() => {
                    weatherInfo.style.opacity = '1';
                }, 300);
            }
        } else {
            alert('City not found');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Event listener for search button click
searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getWeather(city, true); // Fetch weather for the searched city
    }
});

// Event listener for "Enter" key press
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const city = cityInput.value;
        if (city) {
            getWeather(city, true); // Fetch weather for the searched city
        }
    }
});

// Slideshow functionality
function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    if (index >= slides.length) {
        currentSlide = 0; // Loop to the first slide
    } else if (index < 0) {
        currentSlide = slides.length - 1; // Loop to the last slide
    } else {
        currentSlide = index;
    }

    // Calculate the offset to show the current slide
    const offset = -currentSlide * 100; // Move slides
    document.querySelector('.slides').style.transform = `translateX(${offset}%)`;

    // Fetch weather for the current slide's city
    getWeather(cities[currentSlide]);
}

// Automatic slideshow change every 3.5 seconds
setInterval(() => {
    showSlide(currentSlide + 1);
}, 3500); // Change slide every 3500 ms (3.5 seconds)

// Show the first slide on page load and fetch the weather for it
showSlide(currentSlide);
getWeather(cities[currentSlide]); // Get weather for the initial city

// Hover effect to show weather information
const slides = document.querySelectorAll('.slide');

slides.forEach((slide, index) => {
    slide.addEventListener('mouseover', () => {
        const city = cities[index];
        getWeather(city); // Fetch weather data for the hovered city
    });

    slide.addEventListener('mouseout', () => {
        // Optionally, clear the weather info when mouse leaves
        cityName.textContent = '';
        temperature.textContent = '';
        description.textContent = '';
        const existingIcon = document.getElementById('weather-icon');
        if (existingIcon) {
            existingIcon.remove();
        }
    });
});
