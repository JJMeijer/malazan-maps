(function wrapper() {
    const mapButtons = document.querySelectorAll('input[name="map-selector"]');
    const maps = document.querySelectorAll('[id^=map-image-]');

    mapButtons.forEach((element) => {
        element.addEventListener('change', (event) => {
            const mapId = event.target.id.split('-').slice(-1)[0];

            maps.forEach((map) => {
                if (!map.classList.contains('hidden')) {
                    map.classList.add('hidden');
                }
            });

            document.querySelector(`#map-image-${mapId}`).classList.remove('hidden');
        });
    });
}());
