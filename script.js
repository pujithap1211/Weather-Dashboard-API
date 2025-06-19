window.onload = function() {
    const submit_button = document.getElementById("submit_btn");
    submit_button.addEventListener("click", fetchWeatherDetails);

    const toggle = document.getElementById("dark_mode_toggle");
    toggle.addEventListener("change", () => {
        document.body.classList.toggle("dark-mode");
    });
};


async function fetchWeatherDetails(event) {
    event.preventDefault();
    const city_name = document.getElementById("city").value.trim();
    const weatherDiv = document.getElementById("weather_details");
    const currentDiv = document.getElementById("current_weather");
    const forecastDiv = document.getElementById("forecast_details");
    const errorMessageDiv = document.getElementById("error_message");

    errorMessageDiv.innerHTML = "";
    currentDiv.innerHTML = "";
    forecastDiv.innerHTML = "";
    currentDiv.style.display = "none";
    forecastDiv.style.display = "none";
    weatherDiv.style.display = "none";

    if (!city_name) {
        alert("Enter a valid city name");
        return;
    }
    console.log("City entered is", city_name);
    try {

        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=557c780f44e84738bef175351251406&q=${city_name}`);
        if (!response.ok) {
            errorMessageDiv.innerHTML = `<h3>Entered City ${city_name} not found.Please search for another City</h3>`;
            errorMessageDiv.style.display = "block";
            throw new Error(`${response.status}`);
        }
        const data = await response.json();
        console.log("current weather response is", data);

        if (city_name.toLowerCase() !== data.location.name.toLowerCase()) {
            errorMessageDiv.innerHTML = `<h3>Entered City ${city_name} not found.Please search for another City</h3>`;
            errorMessageDiv.style.display = "block";
            return;
        }
        errorMessageDiv.style.display = 'none';

        weatherDiv.style.display = "block";
        currentDiv.style.display = "flex";
        forecastDiv.style.display = "block";

        const leftDiv = document.createElement('div');
        const rightDiv = document.createElement("div");
        leftDiv.className = "left-box";
        rightDiv.className = "right-box";

        leftDiv.innerHTML = `
    <h2>Weather in ${data.location.name}</h2>
    <p><strong>Date:</strong> ${data.location.localtime.split(' ')[0]}</p>
    <p><strong>Temperature:</strong> ${data.current.temp_c} °C</p>
    <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${data.current.wind_kph} km/h</p>
`;

        const iconUrl = "https:" + data.current.condition.icon;
        const Image = document.createElement("img");
        Image.src = iconUrl;
        Image.alt = "Image";
        const condition = document.createElement("p");
        condition.innerHTML = `<strong>Condition:</strong> ${data.current.condition.text}`;
        rightDiv.appendChild(Image);
        rightDiv.appendChild(condition);

        currentDiv.appendChild(leftDiv);
        currentDiv.appendChild(rightDiv);
        weatherDiv.appendChild(currentDiv);

        const forecast_response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=557c780f44e84738bef175351251406&q=${city_name}&days=6`);
        if (!forecast_response.ok) {
            forecastDiv.innerHTML = `<h3 style="color:red;text-align:center;">City not found.Please search for another City</h3>`;
            throw new Error(`${response.status}`);
        }
        const forecast_details = await forecast_response.json();
        console.log("5 day forecast details", forecast_details);

        const forecastHeading = document.createElement("h2");
        forecastHeading.textContent = "5-Day Forecast";
        forecastHeading.style.color = "white";

        let forecastData = forecast_details.forecast.forecastday.slice(1);
        const forecastBoxes = document.createElement("div");
        forecastBoxes.className = "forecast_boxes";

        forecastData.forEach(item => {
            const forecastItem = document.createElement("div");
            const forecastIconUrl = "https:" + item.day.condition.icon;
            forecastItem.innerHTML = `
    <p><strong>Date:</strong> ${item.date}</p>
    <p><strong>Temperature:</strong> ${item.day.avgtemp_c} °C</p>
    <p><strong>Condition:</strong> ${item.day.condition.text}</p><br>
    <img src=${forecastIconUrl} alt="Forecast weather">`;
            forecastBoxes.appendChild(forecastItem);
            console.log("forecast item", forecastItem);
        });

        forecastDiv.appendChild(forecastHeading);
        forecastDiv.appendChild(forecastBoxes);
        weatherDiv.appendChild(forecastDiv);

    } catch (error) {
        console.log("error caught is", error);
    }
}
