<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import vehicleTypeService from "@/services/VehicleTypeService";
import type { VehicleTypeDto } from "@/models/models"; //

const vehicleTypes = ref<VehicleTypeDto[]>([]);
const newVehicleType = ref<VehicleTypeDto>({ idVehicleType: 0, name: '', status: '' });
const editingVehicleType = ref<VehicleTypeDto | null>(null);

onMounted(async () => {
  await loadVehicleType();
});

// Cargar paymentMethods desde el servicio
const loadVehicleType = async () => {
  try {
    vehicleTypes.value = await vehicleTypeService.getVehicleType();
  } catch (error) {
    console.error('Error al cargar métodos de pago:', error);
  }
};

// Crear un nuevo método de pago
const createVehicleType = async () => {
  try {
    await vehicleTypeService.createVehicleType(newVehicleType.value);
    resetForm(); // Reiniciar el formulario
    await loadVehicleType(); // Recargar métodos de pago
  } catch (error) {
    console.error('Error al crear:', error);
  }
};

const editVehicleType = (vehicleType: VehicleTypeDto) => {
    editingVehicleType.value = { ...vehicleType };
};

const updateVehicleType = async () => {
  if (editingVehicleType.value) {
    try {
      await vehicleTypeService.updateVehicleType(editingVehicleType.value);
      resetForm(); 
      await loadVehicleType(); 
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  }
};

const upgradeVehicleType = async (vehicleType: VehicleTypeDto) => {
  try {
    const newStatus = vehicleType.status === 'A' ? 'I' : 'A'; 
    const upgradeVehicleType = { ...vehicleType, status: newStatus }; 

    const response = await vehicleTypeService.updateStatus(upgradeVehicleType);
    
    const index = vehicleTypes.value.findIndex((p: VehicleTypeDto) => p.idVehicleType === upgradeVehicleType.idVehicleType);
    if (index !== -1) {
      vehicleTypes.value[index].status = response; 
    }

  } catch (error) {
    console.error('Error al alternar estado:', error);
  }
};

// Reiniciar el formulario
const resetForm = () => {
    newVehicleType.value = { idVehicleType: 0, name: '', status: 'I' };
  editingVehicleType.value = null;
};
// Computed property para filtrar métodos de pago activos
const activeVehicleTypes = computed(() => {
  return vehicleTypes.value.filter((vehicleType: VehicleTypeDto) => vehicleType.status === 'A');
});

// Computed properties para manejar el formulario
const currentVehicleType = computed(() => {
  return editingVehicleType.value || newVehicleType.value;
});

const toggleStatus = () => {
  if (currentVehicleType.value.status === 'A') {
    currentVehicleType.value.status = 'I';
  } else {
    currentVehicleType.value.status = 'A';
  }
};

const isActive = computed(() => currentVehicleType.value.status === 'A');

</script>

<template>
  <div class="container mx-auto p-6">
    <div class="payment-methods-list mb-8">
      <h2 class="text-2xl font-semibold mb-4">Lista de Típos de Vehiculo</h2>
      
      <div class="overflow-x-auto bg-white shadow-md rounded-lg">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-2 px-4 border-b text-left">Tipo</th>
              <th class="py-2 px-4 border-b text-left">Estado</th>
              <th class="py-2 px-4 border-b text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vehicleType in activeVehicleTypes" :key="vehicleType.idVehicleType" class="border-b">
              <td class="py-2 px-4">{{ vehicleType.name }}</td>
              <td class="py-2 px-4">{{ vehicleType.status }}</td>
              <td class="py-2 px-4">
                <button @click="editVehicleType(vehicleType)" class="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mr-2">Editar</button>
                <button @click="upgradeVehicleType(vehicleType)" class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Condición para mostrar mensaje cuando no hay métodos de pago activos -->
      <p v-if="!activeVehicleTypes.length" class="text-center text-gray-500 mt-4">No hay tipos de vehiculos activos disponibles.</p>
    </div>

    <div class="payment-methods-form bg-white shadow-md p-6 rounded-lg">
      <h2 class="text-2xl font-semibold mb-4">{{ editingVehicleType ? 'Editar Tipo de Vehiculo' : 'Crear Tipo de Vehiculo' }}</h2>

      <div class="mb-4">
        <input 
          v-model="currentVehicleType.name"
          type="text"
          placeholder="Tipo de vehiculo"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="flex items-center mb-4">
        <input 
          type="checkbox"
          :checked="isActive"
          @change="toggleStatus"
          id="status"
          class="mr-2"
        />
        <label for="status" class="text-sm text-gray-700">Activo</label>
      </div>

      <div class="flex items-center space-x-4">
        <button 
          @click="editingVehicleType ? updateVehicleType() : createVehicleType()"
          class="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600"
        >
          {{ editingVehicleType ? 'Actualizar Tipo de Vehiculo' : 'Crear Tipo de Vehiculo' }}
        </button>

        <button 
          @click="resetForm"
          v-if="editingVehicleType"
          class="bg-gray-400 text-white py-2 px-6 rounded hover:bg-gray-500"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column; /* Cambia la dirección del flujo a columna */
  align-items: center; /* Centra los elementos en el eje horizontal */
  margin: 20px;
  width: 100%; /* Asegúrate de que el contenedor ocupe el 100% del ancho */
}

.payment-methods-list, .payment-methods-form {
  width: 100%; /* Asegúrate de que ocupen el 100% del ancho del contenedor */
  max-width: 600px; /* Puedes establecer un ancho máximo para que no se extiendan demasiado */
  margin: 20px 0; /* Margen vertical para separación */
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.payment-methods-list h2, .payment-methods-form h2 {
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
</style>