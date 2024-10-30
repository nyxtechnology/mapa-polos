from branca.element import MacroElement, Template

class IconResize(MacroElement):
    """
    Adds JavaScript to resize icons based on zoom level
    """
    def __init__(self):
        super().__init__()
        self._name = 'IconResize'

    _template = Template(
    """
    {% macro script(this, kwargs) %}
    function adjustIconSize() {
        var zoom = {{ this._parent.get_name() }}.getZoom();
        var icons = document.getElementsByClassName('leaflet-marker-icon');
        for (var i = 0; i < icons.length; i++) {

            var initialSize = parseInt(icons[i].style.width);
            var finalSize;
            
            if (icons[i].src.includes('regional')) {
                finalSize = 20 * Math.pow(3, (zoom - 5) / 4);
            } else if (icons[i].src.includes('estadual')) {
                finalSize = 25 * Math.pow(3, (zoom - 5) / 4);
            } else if (icons[i].src.includes('nacional')) {
                finalSize = 30 * Math.pow(3, (zoom - 5) / 4);
            } else if (icons[i].src.includes('internacional')) {
                finalSize = 35 * Math.pow(3, (zoom - 5) / 4);
            } else {
                finalSize = 30 * Math.pow(3, (zoom - 5) / 4);
            }
            
            icons[i].style.width = finalSize + 'px';
            icons[i].style.height = finalSize + 'px';
            icons[i].style.marginLeft = -(finalSize/2) + 'px';
            icons[i].style.marginTop = -(finalSize/2) + 'px';
        }
    }
    
    {{ this._parent.get_name() }}.on('zoomend', adjustIconSize);
    adjustIconSize();  // Initial adjustment
    {% endmacro %}
    """
    )