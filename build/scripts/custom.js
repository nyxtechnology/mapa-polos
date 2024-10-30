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


        if (map) {
            // Coordenadas e zoom para cada UF
            const ufBounds = {
                'Acre': { center: [-8.77, -70.55], zoom: 7 },
                'Alagoas': { center: [-9.62, -36.82], zoom: 8 },
                'Amazonas': { center: [-3.47, -65.10], zoom: 6 },
                'Amapá': { center: [1.41, -51.77], zoom: 7 },
                'Bahia': { center: [-12.96, -41.68], zoom: 7 },
                'Ceará': { center: [-5.20, -39.53], zoom: 7 },
                'Distrito Federal': { center: [-15.83, -47.86], zoom: 10 },
                'Espírito Santo': { center: [-19.19, -40.34], zoom: 8 },
                'Goiás': { center: [-15.98, -49.86], zoom: 7 },
                'Maranhão': { center: [-5.42, -45.44], zoom: 7 },
                'Minas Gerais': { center: [-18.10, -44.38], zoom: 7 },
                'Mato Grosso do Sul': { center: [-20.51, -54.54], zoom: 7 },
                'Mato Grosso': { center: [-12.64, -55.42], zoom: 7 },
                'Pará': { center: [-3.79, -52.48], zoom: 6 },
                'Paraíba': { center: [-7.28, -36.72], zoom: 8 },
                'Pernambuco': { center: [-8.28, -37.86], zoom: 8 },
                'Piauí': { center: [-6.60, -42.28], zoom: 7 },
                'Paraná': { center: [-24.89, -51.55], zoom: 7 },
                'Rio de Janeiro': { center: [-22.25, -42.66], zoom: 8 },
                'Rio Grande do Norte': { center: [-5.81, -36.59], zoom: 8 },
                'Rondônia': { center: [-10.83, -63.34], zoom: 7 },
                'Roraima': { center: [2.81, -61.75], zoom: 7 },
                'Rio Grande do Sul': { center: [-30.17, -53.50], zoom: 7 },
                'Santa Catarina': { center: [-27.45, -50.95], zoom: 8 },
                'Sergipe': { center: [-10.57, -37.45], zoom: 9 },
                'São Paulo': { center: [-22.19, -48.79], zoom: 7 },
                'Tocantins': { center: [-10.17, -48.33], zoom: 7 }
            };
     
            // Observer para monitorar mudanças no DOM
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length) {
                        const firstTagContainer = $('.tag-filter-tags-container').first();
                        if (firstTagContainer.length) {
                            firstTagContainer.on('click', '.ripple', function() {
                                const uf = $(this).data('value');
                                console.log(uf)
                                if (uf && ufBounds[uf]) {
                                    map.setView(ufBounds[uf].center, ufBounds[uf].zoom, {
                                        animate: true,
                                        duration: 1
                                    });
                                }
                            });
                            observer.disconnect(); // Para de observar após encontrar e configurar
                        }
                    }
                });
            });
            // Começa a observar o documento
            observer.observe(document.body, {
                childList: true,
                subtree: true
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
            if (icons[i].src.includes('Regional')) {
                initialSize = 20;
            } else if (icons[i].src.includes('Estadual')) {
                initialSize = 25;
            } else if (icons[i].src.includes('Nacional')) {
                initialSize = 30;
            } else if (icons[i].src.includes('Internacional')) {
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

