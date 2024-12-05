<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { AddOnServiceDto, ParkingLotDto } from "@/models/models"; //
import parkingLotService from "@/services/ParkingLotService";
import addOnServicesService from "@/services/AddOnServicesService";

const addOnservices = ref<AddOnServiceDto[]>([]);
const newAddOnservice = ref<AddOnServiceDto>({
    idAddOnService: 0,
    name: '',
    price: 0,
    parkingLot: new ParkingLotDto,
    status: ''
});
const editingAddOnService = ref<AddOnServiceDto | null>(null);

const parkingLots = ref<ParkingLotDto[]>([]);


onMounted(async () => {
  await loadParkingLots();
  await loadAddOnService();


});

// Cargar paymentMethods desde el servicio
const loadAddOnService = async () => {
  try {
    addOnservices.value = await addOnServicesService.getAddOnServices();
  } catch (error) {
    console.error('Error al cargar métodos de pago:', error);
  }
};



const loadParkingLots = async () => {
  try {
    parkingLots.value = await parkingLotService.getParkingLots();
    console.log('Parqueaderso cargados:', parkingLots.value); // Verifica que los roles se carguen correctamente
  } catch (error) {
    console.error('Error al cargar roles:', error);
  }
};

// Crear un nuevo método de pago
const createAddOnService = async () => {
  try {
    await addOnServicesService.createAddOnService(newAddOnservice.value);
    resetForm(); // Reiniciar el formulario
    await loadAddOnService(); // Recargar métodos de pago
  } catch (error) {
    console.error('Error al crear:', error);
  }
};

const editAddOnService = (addOnService: AddOnServiceDto) => {
  editingAddOnService.value = { ...addOnService };
};

const updateAddOnService = async () => {
  if (editingAddOnService.value) {
    try {
      await parkingLotService.updateParkingLot(editingAddOnService.value);
      resetForm();
      await loadAddOnService();
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  }
};

const upgradeAddOnService = async (addOnService: AddOnServiceDto) => {
  try {
    const newStatus = addOnService.status === 'A' ? 'I' : 'A';
    const upgradeAddOnService = { ...addOnService, status: newStatus };

    const response = await addOnServicesService.updateStatus(upgradeAddOnService);

    const updatedStatus = response.status ? response.status : newStatus; // Asigna el nuevo estado

    const index = addOnservices.value.findIndex((p: AddOnServiceDto) => p.idAddOnService === upgradeAddOnService.idAddOnService);
    if (index !== -1) {
        addOnservices.value[index].status = updatedStatus;
    }

  } catch (error) {
    console.error('Error al alternar estado:', error);
  }
};

// Reiniciar el formulario
const resetForm = () => {
    newAddOnservice.value = {
    idAddOnService: 0,
    name: '',
    price: 0,
    parkingLot: new ParkingLotDto,
    status: ''
  };
  editingAddOnService.value = null;
};

// Computed property para filtrar métodos de pago activos
const activeAddOnService = computed(() => {
  return addOnservices.value.filter((addOnService: AddOnServiceDto) => addOnService.status === 'A');
});

// Computed properties para manejar el formulario
const currentAddOnService = computed(() => {
  return editingAddOnService.value || newAddOnservice.value;
});

const toggleStatus = () => {
  if (currentAddOnService.value.status === 'A') {
    currentAddOnService.value.status = 'I';
  } else {
    currentAddOnService.value.status = 'A';
  }
};

const isActive = computed(() => currentAddOnService.value.status === 'A');

</script>

<template>
  <div class="container mx-auto p-6 grid grid-cols-2 gap 20" >
    <div class="payment-methods-list mb-8">
      <h2 class="text-2xl font-semibold mb-4">Lista de Típos de Vehiculo</h2>

      <div class="overflow-x-auto bg-white shadow-md rounded-lg">
        <table class="user-lis">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-2 px-4 border-b text-left">Nombre</th>
              <th class="py-2 px-4 border-b text-left">Precio</th>
              <th class="py-2 px-4 border-b text-left">Parqueadero</th>
              <th class="py-2 px-4 border-b text-left">Estado</th>

            </tr>
          </thead>
          <tbody>
            <tr v-for="addOnService in activeAddOnService" :key="addOnService.idAddOnService" class="border-b">
              <td class="py-2 px-4">{{ addOnService.name }}</td>
              <td class="py-2 px-4">{{ addOnService.price }}</td>
              <td class="py-2 px-4">{{ addOnService.parkingLot?.name }}</td>
              <td class="py-2 px-4">{{ addOnService.status }}</td>



              <td class="py-2 px-4">
                <button @click="editAddOnService(addOnService)"
                  class="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mr-2">Editar</button>
                <button @click="upgradeAddOnService(addOnService)"
                  class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Condición para mostrar mensaje cuando no hay métodos de pago activos -->
      <p v-if="!activeAddOnService.length" class="text-center text-gray-500 mt-4">No hay servicios disponibles.</p>
    </div>

    <div class="payment-methods-form bg-white shadow-md p-6 rounded-lg">
      <h2 class="text-2xl font-semibold mb-4">{{ editingAddOnService ? 'Editar Servicio' : 'Crear Servicio' }}</h2>
      <div class="mb-4">
        <input v-model="currentAddOnService.name" type="text" placeholder="Nombre de usuario"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="mb-4">
        <input v-model="currentAddOnService.price" type="text" placeholder="Nombre"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="mb-4">
        <select class="form-select" v-model="currentAddOnService.parkingLot.name" required>
          <option disabled value="">Select User</option>
          <option v-for="parkingLot in parkingLots" :key="parkingLot.idParkingLot" :value="parkingLot.idParkingLot">
            {{ parkingLot.name }}
          </option>
        </select>
      </div>

      <div class="flex items-center mb-4">
        <input type="checkbox" :checked="isActive" @change="toggleStatus" id="status" class="mr-2" />
        <label for="status" class="text-sm text-gray-700">Activo</label>
      </div>

      <div class="flex items-center space-x-4">
        <button @click="editingAddOnService ? updateAddOnService() : createAddOnService()"
          class="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600">
          {{ editingAddOnService ? 'Actualizar Servicio' : 'Crear Servicio' }}
        </button>

        <button @click="resetForm" v-if="editingAddOnService"
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