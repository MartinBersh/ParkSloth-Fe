<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {ParkingLotDto, SlotDto, VehicleTypeDto} from "@/models/models"; //
import VehicleTypeService from "@/services/VehicleTypeService";
import ParkingLotService from "@/services/ParkingLotService";
import slotService from "@/services/SlotService";

const slots = ref<SlotDto[]>([]);
const newSlot = ref<SlotDto>({
    idSlot: 0,
    slotNumber: 0,
    parkingLot: new ParkingLotDto, 
    vehicleType: new VehicleTypeDto,
    status: ''
});
const editingSlot = ref<SlotDto | null>(null);

const vehicles = ref<VehicleTypeDto[]>([]);
const parkingLots = ref<ParkingLotDto[]>([]);


onMounted(async () => {
  await loadSlot();
  await loadVehicleType();
  await loadParkingLot();
});

// Cargar paymentMethods desde el servicio
const loadSlot = async () => {
  try {
    slots.value = await slotService.getSlots();
  } catch (error) {
    console.error('Error al cargar tarifas:', error);
  }
};



const loadVehicleType = async () => {
  try {
    vehicles.value = await VehicleTypeService.getVehicleType();
  } catch (error) {
    console.error('Error al cargar vehiculos:', error);
  }
};

const loadParkingLot = async () => {
  try {
    parkingLots.value = await ParkingLotService.getParkingLots();
  } catch (error) {
    console.error('Error al cargar parqueaderos:', error);
  }
};

// Crear un nuevo método de pago
const createSlot = async () => {
  try {
    await slotService.createSlot(newSlot.value);
    resetForm(); // Reiniciar el formulario
    await loadSlot(); // Recargar métodos de pago
  } catch (error) {
    console.error('Error al crear:', error);
  }
};

const editSlot = (slot: SlotDto) => {
  editingSlot.value = { ...slot };
};

const updateSlot = async () => {
  if (editingSlot.value) {
    try {
      await slotService.updateSlot(editingSlot.value);
      resetForm();
      await loadSlot();
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  }
};

const upgradeSlot = async (slot: SlotDto) => {
  try {
    const newStatus = slot.status === 'A' ? 'I' : 'A';
    const upgradeSlot = { ...slot, status: newStatus };

    const response = await slotService.updateStatus(upgradeSlot);

    const updatedStatus = response.status ? response.status : newStatus; // Asigna el nuevo estado

    const index = slots.value.findIndex((p: SlotDto) => p.idSlot === upgradeSlot.idSlot);
    if (index !== -1) {
      slots.value[index].status = updatedStatus;
    }

  } catch (error) {
    console.error('Error al alternar estado:', error);
  }
};

// Reiniciar el formulario
const resetForm = () => {
   newSlot.value = {
    idSlot: 0,
    slotNumber: 0,
    parkingLot: new ParkingLotDto, 
    vehicleType: new VehicleTypeDto,
    status: ''
  };
  editingSlot.value = null;
};

// Computed property para filtrar métodos de pago activos
const ActiveSlots = computed(() => {
  return slots.value.filter((slot: SlotDto) => slot.status === 'A');
});

// Computed properties para manejar el formulario
const currentSlot = computed(() => {
  return editingSlot.value || newSlot.value;
});

const toggleStatus = () => {
  if (currentSlot.value.status === 'A') {
    currentSlot.value.status = 'I';
  } else {
    currentSlot.value.status = 'A';
  }
};

const isActive = computed(() => currentSlot.value.status === 'A');

</script>

<template>
  <div class="container mx-auto p-6 grid grid-cols-" >
    <div class="payment-methods-list mb-8">
      <h2 class="text-2xl font-semibold mb-4">Lista de Espacios De Parqueo</h2>

      <div class="overflow-x-auto bg-white shadow-md rounded-lg">
        <table class="user-lis">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-2 px-4 border-b text-left">Numero</th>
              <th class="py-2 px-4 border-b text-left">Parqueadero</th>
              <th class="py-2 px-4 border-b text-left">Tipo de vehiculo</th>
              <th class="py-2 px-4 border-b text-left">Estado</th>

            </tr>
          </thead>
          <tbody>
            <tr v-for="slot in ActiveSlots" :key="slot.idSlot" class="border-b">
              <td class="py-2 px-4">{{ slot.slotNumber }}</td>
              <td class="py-2 px-4">{{ slot.parkingLot?.name }}</td>
              <td class="py-2 px-4">{{ slot.vehicleType?.name }}</td>
              <td class="py-2 px-4">{{ slot.status }}</td>

              <td class="py-2 px-4">
                <button @click="editSlot(slot)"
                  class="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mr-2">Editar</button>
                <button @click="upgradeSlot(slot)"
                  class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Condición para mostrar mensaje cuando no hay métodos de pago activos -->
      <p v-if="!ActiveSlots.length" class="text-center text-gray-500 mt-4">No hay Espacios de Parqueo disponibles.</p>
    </div>

    <div class="payment-methods-form bg-white shadow-md p-6 rounded-lg">
      <h2 class="text-2xl font-semibold mb-4">{{ editingSlot ? 'Editar Espacio De Parqueo' : 'Crear Espacio De Parqueo' }}</h2>

      <div class="mb-4">
        <input v-model="currentSlot.slotNumber" type="text" placeholder="Numero de Espacio De Parqueo"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      
      <div class="mb-4">
        <select class="form-select" v-model="currentSlot.parkingLot.idParkingLot" required>
          <option disabled value="">Select Parking Lot</option>
          <option v-for="parkingLot in parkingLots" :key="parkingLot.idParkingLot" :value="parkingLot.idParkingLot">
            {{ parkingLot.name }}
          </option>
        </select>
      </div>
      <div class="mb-4">
        <select class="form-select" v-model="currentSlot.vehicleType.idVehicleType" required>
          <option disabled value="">Select Vehicle</option>
          <option v-for="vehicle in vehicles" :key="vehicle.idVehicleType" :value="vehicle.idVehicleType">
            {{ vehicle.name }}
          </option>
        </select>
      </div>

      <div class="flex items-center mb-4">
        <input type="checkbox" :checked="isActive" @change="toggleStatus" id="status" class="mr-2" />
        <label for="status" class="text-sm text-gray-700">Activo</label>
      </div>

      <div class="flex items-center space-x-4">
        <button @click="editingSlot ? updateSlot() : createSlot()"
          class="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600">
          {{ editingSlot ? 'Actualizar Parqueadero' : 'Crear Parqueadero' }}
        </button>

        <button @click="resetForm" v-if="editingSlot"
          class="bg-gray-400 text-white py-2 px-6 rounded hover:bg-gray-500">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {

  flex-direction: column;
  /* Cambia la dirección del flujo a columna */
  align-items: center;
  /* Centra los elementos en el eje horizontal */
  margin: 20px;
  width: 100%;
  /* Asegúrate de que el contenedor ocupe el 100% del ancho */
}

.payment-methods-list,
.payment-methods-form {
  width: 100%;
  /* Asegúrate de que ocupen el 100% del ancho del contenedor */
  max-width: 600px;
  /* Puedes establecer un ancho máximo para que no se extiendan demasiado */
  margin: 20px 0;
  /* Margen vertical para separación */
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.payment-methods-list h2,
.payment-methods-form h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 1.5em;
}

.payment-methods-list ul {
  list-style-type: none;
  padding: 0;
}

.payment-methods-form button {
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.payment-methods-form button:hover {
  background-color: #0056b3;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.user-list,
.user-form {
  flex: 1;
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>