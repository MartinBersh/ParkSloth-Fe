<script setup lang="ts">
import { ParkingLotDto } from "@/models/models";
import ParkingLotService from "@/services/ParkingLotService";
import leaflet from "leaflet";
import { onMounted, ref, defineEmits } from "vue";

const emit = defineEmits(['map-click']);



let map: leaflet.Map;
const latRef = ref('Latitud: ');
const lngRef = ref('Longitud: ');

onMounted(async () => {
  map = leaflet.map("map").setView([51.505, -0.09], 13);

  leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  await loadParkings();

  map.on('click', function(e) {
    const { lat, lng } = e.latlng;

    latRef.value = `Latitud: ${lat.toFixed(5)}`;
    lngRef.value = `Longitud: ${lng.toFixed(5)}`;

    emit('map-click', { coordX: lat.toFixed(5), coordY: lng.toFixed(5) });

    const marker = leaflet.marker([lat, lng]).addTo(map);
    marker.bindPopup(`Coordenadas: ${lat.toFixed(5)}, ${lng.toFixed(5)}`).openPopup();

    marker.on('click', function() {
      map.removeLayer(marker);
    });
  });
});

const loadParkings = async () => {
  try {
    const parkings = await ParkingLotService.getParkingLots();
    parkings.forEach((parking: ParkingLotDto) => {
      const marker = leaflet.marker([parking.coordX, parking.coordY]).addTo(map);
      marker.bindPopup(`Nombre: ${parking.name}<br>Dirección: ${parking.address}`).openPopup();
    });
  } catch (error) {
    console.error('Error al cargar parkings:', error);
  }
  
};

</script>

<template>
  <div>
    <div id="map"></div>
    <div id="coordinates" style="margin-top: 10px; font-size: 16px;">
      Coordenadas: <span id="lat">{{ latRef }}</span> <span id="lng">{{ lngRef }}</span>
    </div>
  </div>
</template>

<style scoped>
#map {
  width: 1000px;
  height: 500px;
}
</style>
