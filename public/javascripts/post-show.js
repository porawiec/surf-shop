mapboxgl.accessToken = 'pk.eyJ1IjoicG9yYXdpZWMiLCJhIjoiY2tiMXEzcTlrMDBmazMxbjd1cTJvNnRnYyJ9.tcblYOoSlRIJmdD85XlvlA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: post.coordinates,
    zoom: 7
});

// create a HTML element for post location/marker
var el = document.createElement('div');
el.className = 'marker';

// make a marker for location and add to the map
new mapboxgl.Marker(el)
.setLngLat(post.coordinates)
.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
.setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
.addTo(map);

// Toggle edit review form
$('.toggle-edit-form').on('click', function () {
    // toggle edit button text on click
    $(this).text() === 'Edit' ? $(this).text('Cancel') : $(this).text('Edit');
    // toggle visibility of this specific edit review form
    $(this).siblings('.edit-review-form').toggle();
});

// adds click listener to clear rating whenever it is clicked (edit/new form)
$('.clear-rating').click(function() {
    $(this).siblings('.input-no-rate').click();
});