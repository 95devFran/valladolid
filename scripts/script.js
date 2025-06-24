// Inicialización del mapa
const map = L.map('map', {
    center: [41.654262, -4.721053],
    zoom: 14,
    fullscreenControl: true,
    fullscreenControlOptions: {
      position: 'topleft'
    }
  });
  
  // Capas base
  const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  
  const pnoaLayer = L.tileLayer('https://tms-pnoa-ma.idee.es/1.0.0/pnoa-ma/{z}/{x}/{-y}.jpeg', {
    maxZoom: 19,
    attribution: 'CC BY 4.0 scne.es'
  });
  
  const catastroLayer = L.tileLayer.wms("http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?", {
    layers: 'Catastro',
    format: 'image/png',
    transparent: true,
    version: '1.1.1',
    attribution: "DIRECCIÓN GENERAL DEL CATASTRO",
    maxZoom: 19
  });
  
  
  const iconTuristico = L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-icon">📌</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
  

  // Cargar puntos turísticos desde un GeoJSON o archivo JS
  const puntosTuristicos = L.geoJson(puntos, {
    pointToLayer: (feature, latlng) => L.marker(latlng, { icon: iconTuristico }),
    onEachFeature: onEachPunto
  }).addTo(map);
  
  
  function onEachPunto(feature, layer) {
    let fuenteHTML = "";
  
    // Solo generamos el enlace si existe el valor "fuente"
    if (feature.properties.fuente) {
      fuenteHTML = `<p><a href="${feature.properties.fuente}" target="_blank" rel="noopener noreferrer">👉 Fuente 👈</a></p>`;
    }
  
    const popupContent = `
      <div class="custom-popup">
        <p><strong>${feature.properties.nombre}</strong></p>
        <p>${feature.properties.dato || ""}</p>
        ${fuenteHTML}
      </div>
    `;
  
    layer.bindPopup(popupContent);
  
    // Mostrar imagen al hacer clic, si existe
    layer.on("click", function () {
      const imageUrl = feature.properties.imagenes;
      const imageContainer = document.getElementById("image-container");
      const imageDisplay = document.getElementById("image-display");
  
      if (imageUrl) {
        imageDisplay.src = imageUrl;
        imageContainer.style.display = "block";
      } else {
        imageContainer.style.display = "none";
      }
    });
  }
    //-----------------------PARA CERRAR LA IMAGEN AL CLICAR EN LA X-----------------------------\\

document.getElementById("close-image").addEventListener("click", function () {
    document.getElementById("image-container").style.display = "none";
  });
  
  
  
  // Control de capas
  L.control.layers(
    {
    "Open Street Map": osmLayer,
    "Satélite (PNOA)": pnoaLayer
    },
    {
      "Catastro": catastroLayer,
      "Puntos turísticos": puntosTuristicos
    },
    { collapsed: false, position: 'topright' }
  ).addTo(map);


  
  // Medición
  L.control.measure({
    position: 'bottomleft',
    primaryLengthUnit: 'meters',
    secondaryLengthUnit: 'kilometers',
    activeColor: '#d4a373',
    completedColor: '#b85c38'
  }).addTo(map);
  