function initMap() {

    let lat, lng;
    if (!window.userLocation) {
        lat = 49.2827;
        lng = -123.1207;
    } else {
        lat = window.userLocation.lat;
        lng = window.userLocation.lng;
    }

    const map = new google.maps.Map(document.getElementById('map'), {

        center: { lat, lng },
        zoom: 14,
    });
}

$(document).ready(() => {

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