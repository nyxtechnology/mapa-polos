document.addEventListener('DOMContentLoaded', function() {
    const customFloatImages = document.querySelector('.custom-float-images');
    const foliumMap = document.querySelector('.leaflet-map-pane');
    const map = window[$('[id^="map_"]').attr('id')];
    
    if (customFloatImages && foliumMap) {
        foliumMap.appendChild(customFloatImages);
    }


    if (map) {
        $('.folium-map').css({
            'position': 'relative',
            'isolation': 'isolate'
        });
        
        $('.leaflet-popup-pane').css({
            'position': 'relative',
            'z-index': '9999999'
        });

        map.on('popupopen', function() {
            $('.leaflet-popup').css({
                'position': 'relative',
                'z-index': '9999999'
            });
        });
        map.on('popupopen', function() {
            $('.leaflet-popup').css('z-index', '2000');
           $('.leaflet-popup-content').css('z-index', '2000');
            $('.leaflet-popup td').each(function() {
                if ($(this).text().trim() === 'Sim') {
                    $(this).css('backgroundColor', '#00A550');
                }
            });
        });
    }
});