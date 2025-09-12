// A função initMap é declarada apenas aqui
function initMap() {
    const myLocation = { lat: -23.55052, lng: -46.633309 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: myLocation,
    });

    new google.maps.Marker({
        position: myLocation,
        map: map,
        title: "Você está aqui!",
    });
}