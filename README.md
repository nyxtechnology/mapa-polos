# Mapa interativo dos polos industriais do Brasil

## Descrição

Esse projeto visa apresentar, através do georreferenciamento, onde estão localizados os polos industriais do Brasil. Dessa forma, foi construído um mapa interativo (Leaflet map) via a biblioteca Folium do Python. Os marcadores no mapa são ícones personalizados, que buscam identificar os setores e as categorias de polo industrial.

## Bibliotecas utilizadas

Para realizar os tratamentos nos dados e gerar o mapa, foram utilizadas as seguintes bibliotecas:

- Folium
- Pandas
- Requests

O arquivo "requirements.txt" apresentar essa lista de bibliotecas utilizadas, assim como as suas respectivas versões.

## Estrutura das pastas 

Existem 3 (três) pastas no projeto: coordenadas_regioes, data, src.

### coordenadas_regioes

Nessa pasta existem arquivos que apresentam as coordenadas geográficas das regiões brasileiras. Eles estão em dois formatos (json e shapefile). Para o formato json, existe o arquivo "br_states.json" que apresenta as coordenadas geográficas dos Estados brasileiros e o "mesorregiao.json" que foca nas mesorregiões. Os arquivos shapefiles estão dentro de arquivos zip (.zip), onde o "BR_UF_2022.zip" apresenta as coordenadas para os Estados brasileiros e o "BR_Mesorregioes_2022.zip" foca nas mesorregiões.

### data

Na pasta "data", existem todos os bancos de dados que são utilizados no projeto. Primeiramente, existe a dimensão de imagens (dim_polo_imagem.xlsx) que apresenta as urls de todos os ícones personalizados que serão georrefenciados no mapa. Os arquivos "polos_municipios_coordenadas2.xlsx" e "df_detalhamento.csv" são referentes as bases de dados que trazem informações sobre os polos industriais.

### src

A pasta "src" apresenta o código que irá gerar o arquivo ".html" contendo o mapa interativo (mapa_polos_industriais.py). 

Além disso, existe o arquivo "tag_filter_button.py". Foi realizado um ajuste na classe "TagFilterButton" para modificar o comportamento dos filtros que estão sendo utilizados no mapa. Foi acrescentado o seguinte código para deslocar a caixa do menu 30px para a esquerda:

``` python
    {% macro header(this,kwargs) %}
        <style>
            .easy-button-button {
                display: block !important;
            }
            .tag-filter-tags-container {
                left: 30px;
            }
        </style>
    {% endmacro %}
```

O outro ajuste é referente a inserção de um javascript para fazer com que o filtro feche sozinho no momento que outro filtro é selecionado. Para isso, foi acrescentado um jquery em outra parte do script?

```python
    {% macro script(this, kwargs) %}
        var {{ this.get_name() }} = L.control.tagFilterButton(
            {{ this.options|tojson }}
        ).addTo({{ this._parent.get_name() }});

        // Função jQuery que ira fazer o tag_filter fechar no momento que selecionar um novo filtro
        $(document).ready(function() {
            jQuery('.easy-button-button').click(function() {
                var target = jQuery('.easy-button-button').not(this);
                target.parent().find('.tag-filter-tags-container').css({
                    'display' : 'none',
                });
            });
        });
    {% endmacro %}
    """
```  

Dessa forma, é importante substituir o arquivo "tag_filter_button.py", por esse modificado. O diretório padrão do arquivo original é "c:\users\SEUUSUARIO\appdata\local\programs\python\python38\lib\site-packages\folium\plugins\tag_filter_button.py".