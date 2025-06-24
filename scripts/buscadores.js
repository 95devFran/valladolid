/*-------------------------------------------------------------- 
                    BARRA DE BÚSQUEDA - Estaciones y Vías de Tren
---------------------------------------------------------------*/

// Crear un control personalizado de búsqueda
var searchcontrol = L.Control.extend({
  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-search');
    
    // Crear el input de búsqueda
    var input = L.DomUtil.create('input', '', container);
    input.type = 'text';
    input.placeholder = 'Buscar Estación o Vía...';
    
    // Establecer el estilo para el input
    input.style.width = '200px';
    input.style.padding = '5px';
    input.style.borderRadius = '4px';
    
    // Añadir el evento de 'input' para realizar la búsqueda
    L.DomEvent.addListener(input, 'input', function (e) {
      searchcontrol.search(e.target.value);  // Llamar a la función de búsqueda al escribir
    });
    
    return container;
  }
});

// Crear un grupo de capas para la búsqueda de estaciones y vías de tren
var grupo_capas = L.layerGroup([puntos]);

// Instanciar el control de búsqueda, pasando el grupo de capas
var searchcontrolInstance = L.control.search({
  layer: grupo_capas,
  initial: false,
  propertyName: 'nombre', // Usar la propiedad 'nombre' para la búsqueda
  marker: false, // Desactivar el marcador rojo que aparece por defecto
  buildTip: function (text, val) {
    var layer = val.layer;
    var type = '';

    // Identificar el tipo de capa y cambiar cada categoría
    if (estaciones.hasLayer(layer)) {
      type = 'Estación';
    } else if (vias_tren.hasLayer(layer)) {
      type = 'Vía de Tren';
    }

    return `<a href="#" class="${type}">${text} <b>${type}</b></a>`;
  },
  filterData: function (text, records) {
    const filtered = {};
    Object.keys(records).forEach((key) => {
      const layer = records[key].layer;
      const properties = layer.feature.properties;

      let searchField = properties.nombre;
      if (searchField && searchField.toLowerCase().includes(text.toLowerCase())) {
        filtered[key] = records[key];
      }
    });
    return filtered;
  },
  zoom: 15, // Zoom al encontrar la ubicación
  moveToLocation: function (latlng, title, map) {
    map.setView(latlng, 15); // Centrar el mapa en la ubicación
  },
});

// Evento para cambiar el estilo de la entidad al encontrar su ubicación
searchcontrolInstance.on('search:locationfound', function(e) {
  var layer = e.layer;
  layer.setStyle({fillColor: '#00FF00', color: '#00FF00', weight: 3, fillOpacity: 0.6});

  if (layer.getBounds) {
    map.fitBounds(layer.getBounds());
  } else {
    map.setView(e.latlng, 15);
  }
});

// Reseteo de estilos al colapsar la búsqueda
searchcontrolInstance.on('search:collapsed', function(e) {
  estaciones.eachLayer(function(layer) {
    estaciones.resetStyle(layer); 
  });
  vias_tren.eachLayer(function(layer) {
    vias_tren.resetStyle(layer);
  });
});

// Añadir el control de búsqueda al mapa
map.addControl(searchcontrolInstance);


