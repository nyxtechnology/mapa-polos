document.addEventListener('DOMContentLoaded', function() {
    const customFloatImages = document.querySelector('.custom-float-images');
    const foliumMap = document.querySelector('.folium-map');
    
    if (customFloatImages && foliumMap) {
        foliumMap.appendChild(customFloatImages);
    }
});