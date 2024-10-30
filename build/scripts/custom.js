document.addEventListener('DOMContentLoaded', function() {
    const customFloatImages = document.querySelector('.custom-float-images');
    const foliumMap = document.querySelector('.folium-map');
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
     
     map.on('zoomend', adjustIconSize);

     function adjustIconSize() {
        var zoom = map.getZoom();
        console.log(zoom)
        var icons = document.getElementsByClassName('leaflet-marker-icon');
        
        for (var i = 0; i < icons.length; i++) {
            var initialSize;
            var finalSize;
            
            // Define tamanhos iniciais baseado no tipo
            if (icons[i].src.includes('regional')) {
                initialSize = 20;
            } else if (icons[i].src.includes('estadual')) {
                initialSize = 25;
            } else if (icons[i].src.includes('nacional')) {
                initialSize = 30;
            } else if (icons[i].src.includes('internacional')) {
                initialSize = 35;
            } else {
                initialSize = 30;
            }
     
            // Se zoom <= 5, mantém tamanho inicial
            if (zoom >= 5) {
                finalSize = initialSize;
            } else {
                // Senão, aplica o cálculo de escala
                finalSize = initialSize * Math.pow(4, (zoom - 5) / 4);
            }
     
            icons[i].style.width = finalSize + 'px';
            icons[i].style.height = finalSize + 'px';
            icons[i].style.marginLeft = -(finalSize/2) + 'px';
            icons[i].style.marginTop = -(finalSize/2) + 'px';
        }
     }
});

