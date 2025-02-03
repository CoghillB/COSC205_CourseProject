let map;

function initMap() {

    let lat, lng;
    if (!window.userLocation) {
        lat = 49.2827;
        lng = -123.1207;
    } else {
        lat = window.userLocation.lat;
        lng = window.userLocation.lng;
    }

    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat, lng },
        zoom: 14,
    });

    console.log("Map initialized");
}

$(document).ready(() => {
    $('#searchButton').on('click', async (event) => {
        console.log("clicked");
        event.preventDefault();
        const search = $('#search').val();

        try {
            const response = await fetch('http://localhost:3000/textSearch', {
                method: 'POST', // HTTP method
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ str: search }),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch geocoding data');
            }

            const data = await response.json();
            console.log(data);
            if (data.results && data.results.length > 0) {
                const location = data.results[0].geometry.location;
                const newCenter = { lat: location.lat, lng: location.lng };

                if (map) {
                    map.setCenter(newCenter);
                } else {
                    console.error('Map is not initialized.');
                }
            } else {
                console.error('No results found for the search term.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

async function getKey() {
    try {
        const response = await fetch('http://localhost:3000/getApiKey');
        if (!response.ok) {
            throw new Error('Failed to fetch API key');
        }

        const { apiKey } = await response.json();
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
        document.head.appendChild(script);

        // Request user's location
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        window.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };

    } catch (error) {
        console.error('Error:', error);
    }
}

getKey()