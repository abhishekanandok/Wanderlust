// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com


// mapboxgl.accessToken = mapToken;
// const map = new mapboxgl.Map({
//     container: 'map', // container ID
//     center: listing.geometry.coordinates, // starting position [lng, lat]
//     zoom: 9 // starting zoom
// });


// // Create a default Marker and add it to the map.
// const marker = new mapboxgl.Marker()
//     .setLngLat(listing.geometry.coordinates)
//     .setPopup(
//         new mapboxgl.Popup({ offset: 25 })
//             .setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`)
//     )
//     .addTo(map);


mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 1 // starting zoom, set to a low value initially
});

// Function to perform a zoom-in effect
function zoomInEffect() {
    map.flyTo({
        center: listing.geometry.coordinates,
        zoom: 9, // Zoom level you want to achieve
        essential: true, // If true, then it disables the easing effect
        speed: 1.5, // Speed of the fly animation
        curve: 1, // Animation curve of the fly animation
        easing(t) {
            return t;
        }
    });
}

// Once the map is loaded, trigger the zoom-in effect
map.on('load', () => {
    zoomInEffect();

    // Create a default Marker and add it to the map after the zoom-in effect completes
    const marker = new mapboxgl.Marker({
        color: "#ff0000",
        draggable: true
        })
        .setLngLat(listing.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`)
        )
        .addTo(map);
});

