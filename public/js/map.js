let mapToken= "pk.eyJ1IjoicHVuZWV0LWRldmVsb3BzIiwiYSI6ImNsdjNtbDg5bzB2amQycXJ5bzk1ZnA5MGEifQ.DDHdfkvC0kR1PGJq83usqQ";
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [77.209, 28.6139], // starting position [lng, lat]
    zoom: 9 // starting zoom
});