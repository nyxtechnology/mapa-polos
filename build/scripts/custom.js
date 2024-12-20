document.addEventListener('DOMContentLoaded', function() {
    // Configuração inicial do mapa e suas funcionalidades
    class MapManager {
        constructor() {
            // Defini as variaveis inicieis que serão utilizas no projeto.
            this.map = null;
            // Imagens da interface
            this.customFloatImages = document.querySelector('.custom-float-images');
            // Div do foliummap
            this.foliumMap = document.querySelector('.folium-map');
            // Posições dos estados para dar o zoom.
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

            // Posição inicial do Brasil
            this.defaultView = {
                center: [-15.856, -47.856],
                zoom: 5
            };
            this.init();
        }

        async init() {
            // Await aguarda a promessa do mapa ser carregado para então iniciar as funcionalidades.
            await this.waitForMap();
            this.setupMapComponents();
            await this.setupFilterEvents();
            this.setupEventListeners();
        }

        /**
         * Retorna uma promessa que o mapa sera carregado.
         * 
         * @returns Promise
         */
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
            // Adiciona as imagens dentro da div do mapa, para quando der zoom ele continue aparecendo
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
            // Ao abrir um popup, para ele colorir as celulas de verde na tabela.
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
                            cell.style.backgroundColor = '#5BD978';
                            cell.style.fontSize = '1.3em';
                            cell.style.fontWeight = 'bold';
                        } else if (cell.textContent.trim() === 'Não') {
                            cell.style.backgroundColor = '#444444'
                            cell.style.fontSize = '1em';
                            cell.style.fontWeight = 'normal';
                        }
                    });
                }
            });
        }

        async setupFilterEvents() {
            const maxAttempts = 10;
            let attempts = 0;
            
            const trySetupFilter = setInterval(async () => {
                attempts++;
                
                const filterContainer = document.querySelector('.tag-filter-tags-container');
                if (filterContainer) {
                    clearInterval(trySetupFilter);
    
                    const observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.type === 'childList') {
                                // Configurar evento para o botão "Limpar filtros", ele volta o zoom para o mapa do Brasil
                                const clearButton = filterContainer.querySelector('ul.header .ripple');
                                if (clearButton && !clearButton.dataset.hasClickHandler) {
                                    clearButton.dataset.hasClickHandler = 'true';
                                    clearButton.addEventListener('click', () => {
                                        this.zoomToBrazil();
                                    });
                                }

                                // Configurar eventos para os estados, assim quando clicados o foco vai sobre eles
                                const rippleElements = filterContainer.querySelectorAll('ul:not(.header) .ripple');
                                rippleElements.forEach(element => {
                                    if (!element.dataset.hasClickHandler) {
                                        element.dataset.hasClickHandler = 'true';
                                        element.addEventListener('click', () => {
                                            // Verificar se há algum estado selecionado
                                            const anyStateSelected = filterContainer.querySelectorAll('ul:not(.header) .ripple[data-checked="checked"]').length;
                                            
                                            if (anyStateSelected === 0) {
                                                // Se não há estados selecionados, volta para visão do Brasil
                                                this.zoomToBrazil();
                                            } else {
                                                // Se há estado selecionado e este foi o último clicado
                                                const uf = element.getAttribute('data-value');
                                                if (uf && this.ufBounds[uf] && element.getAttribute('data-checked') === 'checked') {
                                                    this.zoomToState(uf);
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
    
                    // O observer é utilizado para monitorar alterações no html. 
                    // Os filtros demoram ser carregados, por isso foi inserido ess observer
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

        zoomToBrazil() {
            this.map.setView(
                this.defaultView.center,
                this.defaultView.zoom,
                {
                    animate: true,
                    duration: 1
                }
            );
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
            // Essa função utiliza o zoom para calcular o tamanho dos icones.
            // Se é removido o zoom, os icones ficam menores. Se for dado mais zoom acima de 5 eles mantem os valores iniciais
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

        // Valores iniciais do tamanho dos icones dos polos.
        getInitialIconSize(iconSrc) {
            if (iconSrc.includes('Regional')) return 20;
            if (iconSrc.includes('Estadual')) return 25;
            if (iconSrc.includes('Nacional')) return 30;
            if (iconSrc.includes('Internacional')) return 45;
            return 20;
        }

        // Calcula o tamanho dos icones a partir do zoom.
        calculateFinalSize(initialSize, zoom) {
            if (zoom >= 5) return initialSize;
            return initialSize * Math.pow(4, (zoom - 5) / 4);
        }

    }

    // Aguardar jQuery estar disponível antes de inicializar
    const waitForJQuery = setInterval(() => {
        if (window.jQuery) {
            clearInterval(waitForJQuery);
            new MapManager();
        }
    }, 100);

    // Esta função fecha o menu quando outro é aberto.
    $(document).ready(function() {
        jQuery('.easy-button-button').click(function() {
            var target = jQuery('.easy-button-button').not(this);
            target.parent().find('.tag-filter-tags-container').css({
                'display' : 'none',
            });
        });
    });
    
});