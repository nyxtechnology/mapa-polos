document.addEventListener('DOMContentLoaded', function() {
    // Configuração inicial do mapa e suas funcionalidades
    class MapManager {
        constructor() {
            this.map = null;
            this.customFloatImages = document.querySelector('.custom-float-images');
            this.foliumMap = document.querySelector('.folium-map');
            this.ufBounds = {
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
            this.init();
        }

        async init() {
            await this.waitForMap();
            this.setupMapComponents();
            await this.setupFilterEvents();
            this.setupEventListeners();
        }

        async waitForMap() {
            return new Promise(resolve => {
                const checkMap = setInterval(() => {
                    // Usar jQuery para encontrar o ID do mapa e acessar o objeto do mapa
                    const mapId = $('[id^="map_"]').attr('id');
                    if (mapId && window[mapId]) {
                        clearInterval(checkMap);
                        this.map = window[mapId];
                        resolve();
                    }
                }, 100);
            });
        }


        setupMapComponents() {
            if (this.customFloatImages && this.foliumMap) {
                this.foliumMap.appendChild(this.customFloatImages);
                
                // Configurar estilos das imagens flutuantes
                const images = this.customFloatImages.querySelectorAll('img');
                images.forEach(img => {
                    img.style.pointerEvents = 'auto';
                });
                
                this.customFloatImages.style.pointerEvents = 'none';
                this.customFloatImages.style.position = 'relative';
                this.customFloatImages.style.zIndex = '400';
            }
        
            if (this.foliumMap) {
                this.foliumMap.style.position = 'relative';
                this.foliumMap.style.isolation = 'isolate';
            }
        }

        setupEventListeners() {
            // Configurar eventos do mapa
            this.setupPopupEvents();
            this.setupFilterEvents();
            this.setupZoomEvents();
        }

        setupPopupEvents() {
            this.map.on('popupopen', (e) => {
                const popup = e.popup.getElement();
                if (popup) {
                    popup.style.position = 'absolute';
                    popup.style.zIndex = '1000';
                    
                    // Garantir que o wrapper e o conteúdo também tenham z-index alto
                    const contentWrapper = popup.querySelector('.leaflet-popup-content-wrapper');
                    const content = popup.querySelector('.leaflet-popup-content');
                    
                    if (contentWrapper) contentWrapper.style.zIndex = '1000';
                    // Colorir células com "Sim"
                    const cells = popup.querySelectorAll('td');
                    cells.forEach(cell => {
                        
                        if (cell.textContent.trim() === 'Sim') {
                            cell.style.backgroundColor = '#00A550';
                        }
                    });
                }
            });
        }

        async setupFilterEvents() {
            // Tentar múltiplas vezes até encontrar o container
            const maxAttempts = 10;
            let attempts = 0;
            
            const trySetupFilter = setInterval(async () => {
                attempts++;
                
                const filterContainer = document.querySelector('.tag-filter-tags-container');
                if (filterContainer) {
                    clearInterval(trySetupFilter);
    
                    // Observar mudanças no container de filtros
                    const observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.type === 'childList') {
                                const rippleElements = filterContainer.querySelectorAll('.ripple');
                                rippleElements.forEach(element => {
                                    if (!element.dataset.hasClickHandler) {
                                        element.dataset.hasClickHandler = 'true';
                                        element.addEventListener('click', (e) => {
                                            if (!element.closest('.header')) {
                                                // Verificar se o elemento está marcado
                                                const isChecked = element.getAttribute('data-checked') === 'checked';
                                                
                                                if (isChecked) {
                                                    const uf = element.getAttribute('data-value');
                                                    if (uf && this.ufBounds[uf]) {
                                                        this.zoomToState(uf);
                                                    }
                                                } 
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
    
                    observer.observe(filterContainer, {
                        childList: true,
                        subtree: true
                    });
                    
                } else if (attempts >= maxAttempts) {
                    console.log('Não foi possível encontrar o container de filtros após várias tentativas');
                    clearInterval(trySetupFilter);
                }
            }, 500);
        }

        setupZoomEvents() {
            this.map.on('zoomend', () => {
                this.adjustIconSize();
            });
        }

        zoomToState(uf) {
            if (uf && this.ufBounds[uf]) {
                this.map.setView(
                    this.ufBounds[uf].center,
                    this.ufBounds[uf].zoom,
                    {
                        animate: true,
                        duration: 1
                    }
                );
            }
        }

        adjustIconSize() {
            const zoom = this.map.getZoom();
            const icons = document.getElementsByClassName('leaflet-marker-icon');
            
            Array.from(icons).forEach(icon => {
                let initialSize = this.getInitialIconSize(icon.src);
                let finalSize = this.calculateFinalSize(initialSize, zoom);
                
                icon.style.width = `${finalSize}px`;
                icon.style.height = `${finalSize}px`;
                icon.style.marginLeft = `${-(finalSize/2)}px`;
                icon.style.marginTop = `${-(finalSize/2)}px`;
            });
        }

        getInitialIconSize(iconSrc) {
            if (iconSrc.includes('Regional')) return 20;
            if (iconSrc.includes('Estadual')) return 25;
            if (iconSrc.includes('Nacional')) return 30;
            if (iconSrc.includes('Internacional')) return 35;
            return 30;
        }

        calculateFinalSize(initialSize, zoom) {
            if (zoom >= 5) return initialSize;
            return initialSize * Math.pow(4, (zoom - 5) / 4);
        }

        async waitForElement(selector) {
            return new Promise(resolve => {
                if (document.querySelector(selector)) {
                    return resolve(document.querySelector(selector));
                }

                const observer = new MutationObserver(() => {
                    if (document.querySelector(selector)) {
                        observer.disconnect();
                        resolve(document.querySelector(selector));
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            });
        }
    }

    // Aguardar jQuery estar disponível antes de inicializar
    const waitForJQuery = setInterval(() => {
        if (window.jQuery) {
            clearInterval(waitForJQuery);
            new MapManager();
        }
    }, 100);
});