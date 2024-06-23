let map;
let autocomplete;
let marker;

function initMap() {
    // Inicializar el mapa
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 4.8087174, lng: -75.690601 },
        zoom: 8,
    });

    // Inicializar el campo de autocomplete
    const input = document.getElementById("location-input");
    autocomplete = new google.maps.places.Autocomplete(input); //Metodo de google
    autocomplete.bindTo("bounds", map);

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            console.error("No hay detalles : '" + place.name + "'");
            return;
        }

        // Centrar el mapa en la ubicación seleccionada
        map.setCenter(place.geometry.location);
        map.setZoom(10);

        // Colocar un marcador en la ubicación seleccionada
        if (marker) {
            marker.setMap(null);
        }
        marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
        });

        // Obtener y mostrar el clima actual en la ubicación seleccionada
        getWeather(place.geometry.location.lat(), place.geometry.location.lng());
    });
}

async function getWeather(lat, lon) {
    // Obtener el clima actual usando la API de Open Meteo
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weather_code,wind_speed_10m`);
    const data = await response.json();
   

    const weather = data.current.weather_code;
    const wind = data.current.wind_speed_10m;
    const precipitation = data.current.precipitation;

    // Actualizar el contenido del elemento con la temperatura
    const temperatureElement = document.getElementById("temperature");
    temperatureElement.textContent = `Temperatura: ${data.current.temperature_2m} °C`;

    const windElement = document.getElementById("wind");
    windElement.textContent = `Viento: ${wind} km/h`;

    const precipitationElement = document.getElementById("precipitation");
    precipitationElement.textContent = `Precipitacion: ${precipitation} mm`;

    const weatherElement = document.getElementById("weather-img");
    // Mostrar la imagen correspondiente según el código del clima
    if (weather === 0 || weather == 1) {
        weatherElement.src = "https://static.vecteezy.com/system/resources/previews/000/449/867/non_2x/sun-vector-icon.jpg";
        weatherElement.className = "weather-icon";
            weatherElement.alt = "Desconocido";
    } else if ([45, 48, 71, 73, 75, 77, 85, 86].includes(weather)) {
        weatherElement.src = "https://st3.depositphotos.com/2398103/14532/v/950/depositphotos_145320043-stock-illustration-red-question-mark-icon.jpg";
        weatherElement.className = "weather-icon";
            weatherElement.alt = "Desconocido";
    } else {
        weatherElement.src = "https://th.bing.com/th/id/OIP.AlacEyAEr3-6JifEyqSXFAHaHa?w=178&h=180&c=7&r=0&o=5&pid=1.7";
        weatherElement.className = "weather-icon";
            weatherElement.alt = "Desconocido";
    }
}

// Cargar el mapa cuando se carga la página
window.onload = initMap;