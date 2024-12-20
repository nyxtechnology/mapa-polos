#### Carregar as bibliotecas ####

import folium
from folium.plugins import FloatImage, TagFilterButton
import pandas as pd
import requests as re

#### Carregar bases de dados ####

df_imagem = pd.read_excel("./data/dim_polo_imagem.xlsx")

df_polos_br = pd.read_excel("./data/polos_municipios_coordenadas2.xlsx")
df_detalhamento = pd.read_csv("./data/df_detalhamento.csv", sep=';', decimal=',')

#### Ajustes na df_imagem ####

# Tirar espaco da string do setor_polo 

df_imagem['setor_polo'] = df_imagem['setor_polo'].str.replace(' ', '_')
df_imagem['setor_polo'] = df_imagem['setor_polo'].str.replace(',', '')


#### Ajustes na df_polos_br ####

# Trocar a categoria dos polos

## Criar lista de substituicoes 

trocar_categorias = {
    'Nacional': 'Polo nacional',
    'Regional': 'Polo regional',
    'Estadual': 'Polo estadual',
    'Internacional': 'Polo internacional'
}

## Aplicar as substituicoes 

df_polos_br['polo'] = df_polos_br['polo'].replace(trocar_categorias)

# Criar o setor_polo

df_polos_br['setor_polo'] = df_polos_br['arranjo_setorial'] + '_' + df_polos_br['polo']

# Tirar espaco da string do setor_polo

df_polos_br['setor_polo'] = df_polos_br['setor_polo'].str.replace(' ', '_')
df_polos_br['setor_polo'] = df_polos_br['setor_polo'].str.replace(',', '')

#### Ajustes na df_merged ####

# Fazer o join das bases 

df_merged = df_polos_br.merge(df_imagem, on='setor_polo')

# Criar a coluna sk

df_merged['sk'] = df_merged['uf'] + '_' + df_merged['mesorregiao'] + '_' + df_merged['arranjo_setorial']

#### Configuracoes do mapa ####

# Criar o mapa

mapa = folium.Map([-15.856, -47.856], tiles=folium.TileLayer("Cartodb dark_matter", no_wrap = True), zoom_start=5)

# Adiciona arquivos js externos. (arquivos dentro da pasta do projeto)

# mapa.get_root().header.add_child(folium.Element("""
#     <link rel="stylesheet" href="styles/custom.css">
#     <script defer src="scripts/custom.js"></script>
# """))

# Adiciona arquivos js externos. (arquivos em um link publico )

mapa.get_root().header.add_child(folium.Element("""
    <link rel="stylesheet" href="./styles/custom.css?sp=r&st=2024-10-31T18:31:46Z&se=2025-11-01T02:31:46Z&spr=https&sv=2022-11-02&sr=b&sig=iIRXm%2FXmFR1EHIYCqcdcprI9yPSqj8OI2bK4OykpRIk%3D">
    <script defer src="./scripts/custom.js?sp=r&st=2024-10-31T18:31:09Z&se=2025-11-01T02:31:09Z&spr=https&sv=2022-11-02&sr=b&sig=IFhv%2BueX7NXi0t%2BKiwH3jlAOf0FwGKpwJsfNVypM1Xs%3D"></script>
"""))

# Inserir uma imagem personalizada no mapa

## url das imagens

logo_rosi = 'https://bigdatastorageobs.blob.core.windows.net/containerobs/oni_polos/1000056284.png?sv=2021-10-04&st=2024-10-24T19%3A07%3A54Z&se=2025-10-25T19%3A07%3A00Z&sr=b&sp=r&sig=hx5bg3B%2FjHbOER85YHtGo8wH2vIFjam4eszA2zda1rg%3D'
logo_legenda_icones = 'https://bigdatastorageobs.blob.core.windows.net/containerobs/oni_polos/1000056283.png?sv=2021-10-04&st=2024-10-24T19%3A07%3A31Z&se=2025-10-25T19%3A07%3A00Z&sr=b&sp=r&sig=JWfr8To4TK17Cx0%2B8jsdjEb84aNipvEbIPYrvngqhGE%3D'
logo_legenda_polos = 'https://bigdatastorageobs.blob.core.windows.net/containerobs/oni_polos/1000056281%20%281%29.png?sv=2021-10-04&st=2024-10-24T21%3A03%3A11Z&se=2025-10-25T21%3A03%3A00Z&sr=b&sp=r&sig=Xs5Dg1WkqHYKQfqt7rpK4ZZUSRA3Lt%2FEFEppdZnErlg%3D'
logo_obs = 'https://bigdatastorageobs.blob.core.windows.net/containerobs/oni_polos/1000056282.png?sv=2021-10-04&st=2024-10-24T19%3A07%3A09Z&se=2025-10-25T19%3A07%3A00Z&sr=b&sp=r&sig=hkHdB7VT4a7oczgLc7ZQhInrgAQuc7EazUeanZQQNaI%3D'

## Inserir a imagem no mapa

# Adicione uma classe personalizada para cada imagem
# Substitua os FloatImage por um template personalizado
custom_image_html = f"""
<div class="custom-float-images">
    <img src="{logo_rosi}" class="rosi-logo">
    <img src="{logo_obs}" class="obs-logo">
    <img src="{logo_legenda_icones}" class="icons-legend">
    <img src="{logo_legenda_polos}" class="polos-legend">
</div>
"""

# folium.raster_layers.ImageOverlay(
#     name = "Legenda dos setores",
#     image =logo_legenda_icones,
#     bounds = [[-33.3122, -27.5098], [-5.1754, -15.0293]]
# ).add_to(mapa)

# folium.raster_layers.ImageOverlay(
#     name = "Legenda dos polos",
#     image =logo_legenda_polos,
#     bounds = [[-32.7688, -45.7031], [-23.712, -28.0811]]
# ).add_to(mapa)

# folium.raster_layers.ImageOverlay(
#     name = "teste",
#     image =logo_legenda_icones,
#     bounds = [[-33.8704, -33.2227], [0, -4.2500]]
# ).add_to(mapa)

# folium.raster_layers.ImageOverlay(
#     name = "teste",
#     image =logo_legenda_icones,
#     bounds = [[-33.8704, -33.2227], [0, -4.2500]]
# ).add_to(mapa)


# Adicione ao mapa
mapa.get_root().html.add_child(folium.Element(custom_image_html))
# Inserir o botao de tela cheia

folium.plugins.Fullscreen(
    position="topright",
    title="Tela cheia",
    title_cancel="Sair",
    force_separate_button=True,
).add_to(mapa)

# Criar lista com as categorias dos filtros

categorias_uf = df_merged['uf'].unique().tolist()
categorias_mesorregiao = df_merged['mesorregiao'].unique().tolist()
categorias_arrajo_setorial = df_merged['arranjo_setorial'].unique().tolist()
categorias_polos = df_merged['polo'].unique().tolist()

# Colocar as categorias das listas em ordem alfabetica

categorias_uf.sort()
categorias_mesorregiao.sort()
categorias_arrajo_setorial.sort()
categorias_polos.sort()

# Inserir os botoes de filtro nos mapas

TagFilterButton(categorias_uf,
                icon = '<img src="https://bigdatastorageobs.blob.core.windows.net/containerobs/oni_polos/1000056285.png?sv=2021-10-04&st=2024-10-24T19%3A08%3A21Z&se=2025-10-25T19%3A08%3A00Z&sr=b&sp=r&sig=y5rTx7jKj9TqFTKsOVpsLYoORgvBRVrtm0txhilKlNk%3D" width="30" height="30">',
                name='Estados',
                clear_text = 'Limpar filtros',
                filter_on_every_click=True,
                open_popup_on_hover=False
                ).add_to(mapa)
# TagFilterButton(categorias_mesorregiao, icon = 'fa-filter', clear_text = 'Limpar filtros', filter_on_every_click=True, open_popup_on_hover=False).add_to(mapa)
TagFilterButton(categorias_arrajo_setorial, icon = '<img src="https://bigdatastorageobs.blob.core.windows.net/containerobs/oni_polos/1000056286.png?sv=2021-10-04&st=2024-10-24T19%3A08%3A59Z&se=2025-10-25T19%3A08%3A00Z&sr=b&sp=r&sig=k9xcXHsVy2VCZv6mc9JSF8zAWacRYJ9hygGdsxBfAZs%3D" width="30" height="30">', clear_text = 'Limpar filtros', filter_on_every_click=True, open_popup_on_hover=False).add_to(mapa)
TagFilterButton(categorias_polos, icon = '<img src="https://bigdatastorageobs.blob.core.windows.net/containerobs/oni_polos/1000056287.png?sv=2021-10-04&st=2024-10-24T19%3A09%3A21Z&se=2025-10-25T19%3A09%3A00Z&sr=b&sp=r&sig=jOsC5w3BwBUPp%2BXSWxqcyLd3TiVefT%2Fk3ZUSMo0qb74%3D" width="30" height="30">', clear_text = 'Limpar filtros', filter_on_every_click=True, open_popup_on_hover=False).add_to(mapa)

geojson_br = re.get(
    "https://raw.githubusercontent.com/giuliano-macedo/geodata-br-states/refs/heads/main/geojson/br_states.json"
).json()

geojson_meso = re.get(
    "https://raw.githubusercontent.com/fititnt/gis-dataset-brasil/refs/heads/master/mesorregiao/geojson/mesorregiao.json"
).json()

folium.GeoJson(
    geojson_br,
    style_function=lambda feature: {
        "fillColor": "#8c8a87",
        "color": "white",
        "weight": 1,
        # "dashArray": "5, 5",
    },
).add_to(mapa)

folium.GeoJson(
    geojson_meso,
    style_function=lambda feature: {
        "fillColor": "#8c8a87",
        "color": "white",
        "weight": 0.5,
        "dashArray": "5, 5",
    },
).add_to(mapa)

#### Criar objetos das ulrs dos icones ####

for index, row in df_imagem.iterrows():

    # Definir o setor_polo
    
    setor_polo_formatado = row['setor_polo']

    # Criar o nome da variavel dinamicamente

    var_name = f"url_icon_{setor_polo_formatado}"

    # Criar a string completa da URL

    url_completa = f"{row['Link']}"

    # Criar variaveis dinamicamente

    globals()[var_name] = url_completa

#### Adicionar os icones no mapa ####

for index, row in df_merged.iterrows():

    #### Criar variaveis ####

    # Coordenadas

    latitude = row['latitude']
    longitude = row['longitude']

    # Setor e polo 

    setor_polo = row['setor_polo']

    # Arranjo setorial

    setor = row['arranjo_setorial']

    # Polo

    polo = row['polo']

    # Regiao
    
    uf = row['uf']
    mesorregiao = row['mesorregiao']

    #### Criar o df que ira aparecer no popup ####

    # Criar objeto com a categoria que sera filtrada 

    sk_filtro = row['sk']

    # Criar o df_temporario, trazendo o detalhamento do sk_filtro

    df_temporario = df_detalhamento[df_detalhamento['sk'] == sk_filtro].reset_index()

    # Selecionar colunas de intesse

    df_temporario = df_temporario[['UF', 'Mesorregiao', 'arranjo_setorial', 'CNAE', 'Polo Regional', 'Polo Estadual', 'Polo Nacional', 'Polo Internacional']]

    # Renomear as colunas 

    df_temporario.columns = ['Estado', 'Mesorregião', 'Arranjo Setorial', 'CNAE', 'Polo Regional', 'Polo Estadual', 'Polo Nacional', 'Polo Internacional']

    # Fazer um sort com base nos arranjos

    df_temporario = df_temporario.sort_values(by=['Polo Internacional', 'Polo Nacional', 'Polo Estadual', 'Polo Regional'], ascending=[False, False, False, False])

    # Transformar o df pandas em um df html

    df_html = df_temporario.to_html(classes = 'table table-condensed table-responsive', index = False)

    # Personalizar a tabela

    df_html = f'''
    <div style="max-height: 400px; overflow-y: auto; width: 1000px;">
    {df_html}
    </div>
    '''

    #### Configurar e inserir os icones no mapa ####

    # Nome da variavel para coletar o icone 

    var_name = f"url_icon_{setor_polo}"

    # Se encontrar o objeto com a url, inserir o icone no mapa. Caso contrario, indicar que nao possivel encontrar o icone do setor_polo

    if var_name in globals():

        # Pegar a url do icone 

        url_icon = globals()[var_name]
        
        # Definir um tamanho de icone personalizado

        if 'regional' in var_name.lower():
            icon_size = (20, 20)
        elif 'estadual' in var_name.lower():
            icon_size = (25, 25)
        elif '_nacional' in var_name.lower():
            icon_size = (30, 30)
        elif 'internacional' in var_name.lower():
            icon_size = (45, 45)
        else:
            icon_size = (20, 20)

        # Criar o objeto CustomIcon

        custom_icon = folium.CustomIcon(url_icon, icon_size=icon_size)
        
        # Adicionar o icone no mapa
        folium.Marker(
            location=[latitude, longitude],
            icon=custom_icon,
            tags=[uf, mesorregiao, setor, polo],
            tooltip = 'Clique para abrir o detalhamento',
            popup = df_html
        ).add_to(mapa)

    else:
        print(f"Ícone não encontrado para {setor_polo}")

#### Salvar o arquivo html do mapa ####

mapa.save("./build/polos_industriais_mapa_interativo.html")