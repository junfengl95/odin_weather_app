document.addEventListener('DOMContentLoaded', () => {

    const location = document.getElementById('location');
    const country = document.querySelector('.country');
    const weatherForm = document.getElementById('weather-form');
    const weatherDisplay = document.querySelector('.weather-display');
    const unitToggle = document.getElementById('unit-toggle');
    const loadingIcon = document.getElementById('loading-icon');

    let isCelsius = false; // Default unit is Farenheit
    
    weatherForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        weatherDisplay.innerHTML = '';
        loadingIcon.style.display = 'block';
        loadingIcon.textContent = 'Loading...';

        try {
            const searchLocation = location.value.trim().toLowerCase();

            const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURI(searchLocation)}?key=93D29TV4HCSYRGZB7RB8U9EWC`,
                { mode: 'cors'}
            );

            if (!response.ok){
                throw new Error('Weather data not found.');
            }

            const data = await response.json();

            let next5days = data.days.slice(0,5);

            //Clear previous weather data and country name
            country.innerHTML = '';

            country.textContent = data.resolvedAddress;

            console.log(next5days[0].conditions);
            changeBackground(next5days[0].conditions);

            // Display next 5 days forecast
            displayWeather(next5days, isCelsius);

        } catch (e) {
            console.error(`Error: ${e}`);
        } finally {
            loadingIcon.style.display = 'none';
        }
    });


    // Event listener for the unit toggle
    unitToggle.addEventListener('change', () => {
        isCelsius = unitToggle.checked;
        const searchLocation = location.value.trim().toLowerCase();

        if(searchLocation) {
            weatherForm.dispatchEvent(new Event('submit'));
        }
    });

    function displayWeather(forecast, toCelius) {
        forecast.forEach((day) => {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day-forecast');

            const dateElement = document.createElement('h3');
            dateElement.textContent = day.datetime;
            dayElement.appendChild(dateElement);

            const conditionsElement = document.createElement('p');
            conditionsElement.textContent = `${day.conditions}`;
            dayElement.appendChild(conditionsElement);

            const tempMaxElement = document.createElement('p');
            tempMaxElement.textContent = `Max Temp: ${convertTemperature(day.tempmax, toCelius).toFixed(1)}° ${toCelius ? 'C' : 'F'}`;
            dayElement.appendChild(tempMaxElement);

            const tempMinElement = document.createElement('p');
            tempMinElement.textContent = `Max Temp: ${convertTemperature(day.tempmin, toCelius).toFixed(1)}° ${toCelius ? 'C' : 'F'}`;
            dayElement.appendChild(tempMinElement);

            weatherDisplay.appendChild(dayElement);
        })
    }

    function convertTemperature(temp, toCelius){
        return toCelius ? (temp - 32) * (5 / 9) : temp * (9/ 5) + 32;
    }

    function changeBackground(conditions) {
        //Remoev all exisiting weather-related background classes
        document.body.classList.remove('clear', 'partially-cloudy', 'rain', 'overcast');

        // Add the appropraite class based on conditions
        if (conditions.toLowerCase().includes('clear')){
            document.body.classList.add('clear');
        } else if (conditions.toLowerCase().includes('rain')) {
            document.body.classList.add('rain');
        } else if (conditions.toLowerCase().includes('partially cloudy')) {
            document.body.classList.add('partially-cloudy');
        }else if (conditions.toLowerCase().includes('overcast')) {
            document.body.classList.add('overcast');
        }
    }
});