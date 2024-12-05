<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import userService from "@/services/UserService";
import { ParkingLotDto, UserDto  } from "@/models/models"; //
import parkingLotService from "@/services/ParkingLotService";

const parkingLots = ref<ParkingLotDto[]>([]);
const newParkingLot = ref<ParkingLotDto>({
  idParkingLot: 0,
  name: '',
  address: '',
  phoneNumber: '',
  nit: '',
  coordX: '',
  coordY: '',
  user: new UserDto ,
  status: ''
});
const editingParkingLot = ref<ParkingLotDto | null>(null);

const users = ref<UserDto[]>([]);


onMounted(async () => {
  await loadParkingLots();
  await loadUser();


});


const loadUser = async () => {
  try {
    users.value = await userService.getUsers();
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
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

// Crear un nuevo parqueadero
const createParkingLot = async () => {
  try {
    await parkingLotService.createParkingLot(newParkingLot.value);
    resetForm(); // Reiniciar el formulario
    await loadUser(); // Recargar métodos de pago
  } catch (error) {
    console.error('Error al crear:', error);
  }
};

const editParkingLot = (vehicleType: ParkingLotDto) => {
  editingParkingLot.value = { ...vehicleType };
};

const updateParkingLot = async () => {
  if (editingParkingLot.value) {
    try {
      await parkingLotService.updateParkingLot(editingParkingLot.value);
      resetForm();
      await loadParkingLots();
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  }
};

const upgradeParkingLot = async (parkingLot: ParkingLotDto) => {
  try {
    const newStatus = parkingLot.status === 'A' ? 'I' : 'A';
    const upgradeParkinLot = { ...parkingLot, status: newStatus };

    const response = await parkingLotService.updateStatus(upgradeParkinLot);

    const updatedStatus = response.status ? response.status : newStatus; // Asigna el nuevo estado

    const index = parkingLots.value.findIndex((p: ParkingLotDto) => p.idParkingLot === upgradeParkinLot.idParkingLot);
    if (index !== -1) {
      parkingLots.value[index].status = updatedStatus;
    }

  } catch (error) {
    console.error('Error al alternar estado:', error);
  }
};

// Reiniciar el formulario
const resetForm = () => {
  newParkingLot.value = {
    idParkingLot: 0,
    name: '',
    address: '',
    phoneNumber: '',
    nit: '',
    coordX: '',
    coordY: '',
    user: new UserDto ,
    status: ''
  };
  editingParkingLot.value = null;
};

// Computed property para filtrar métodos de pago activos
const activePrkingLots = computed(() => {
  return parkingLots.value.filter((parkingLot: ParkingLotDto) => parkingLot.status === 'A');
});

// Computed properties para manejar el formulario
const currentParkingLot = computed(() => {
  return editingParkingLot.value || newParkingLot.value;
});

const toggleStatus = () => {
  if (currentParkingLot.value.status === 'A') {
    currentParkingLot.value.status = 'I';
  } else {
    currentParkingLot.value.status = 'A';
  }
};

const isActive = computed(() => currentParkingLot.value.status === 'A');

</script>

<template>
  <div class="container mx-auto p-6 grid grid-cols-2 gap 20" >
    <div class="payment-methods-list mb-8">
      <h2 class="text-2xl font-semibold mb-4">Lista de Parqueaderos</h2>

      <div class="overflow-x-auto bg-white shadow-md rounded-lg">
        <table class="user-lis">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-2 px-4 border-b text-left">Nombre</th>
              <th class="py-2 px-4 border-b text-left">Dirección</th>
              <th class="py-2 px-4 border-b text-left">Telefono</th>
              <th class="py-2 px-4 border-b text-left">NIT</th>
              <th class="py-2 px-4 border-b text-left">Coord X</th>
              <th class="py-2 px-4 border-b text-left">Coord Y</th>
              <th class="py-2 px-4 border-b text-left">Usuario</th>
              <th class="py-2 px-4 border-b text-left">Estado</th>

            </tr>
          </thead>
          <tbody>
            <tr v-for="parkingLot in activePrkingLots" :key="parkingLot.idParkingLot" class="border-b">
              <td class="py-2 px-4">{{ parkingLot.name }}</td>
              <td class="py-2 px-4">{{ parkingLot.address }}</td>
              <td class="py-2 px-4">{{ parkingLot.phoneNumber }}</td>
              <td class="py-2 px-4">{{ parkingLot.nit }}</td>
              <td class="py-2 px-4">{{ parkingLot.coordX }}</td>
              <td class="py-2 px-4">{{ parkingLot.coordY }}</td>
              <td class="py-2 px-4">{{ parkingLot.user?.name }}</td>
              <td class="py-2 px-4">{{ parkingLot.status }}</td>



              <td class="py-2 px-4">
                <button @click="editParkingLot(parkingLot)"
                  class="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mr-2">Editar</button>
                <button @click="upgradeParkingLot(parkingLot)"
                  class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Condición para mostrar mensaje cuando no hay métodos de pago activos -->
      <p v-if="!activePrkingLots.length" class="text-center text-gray-500 mt-4">No hay parqueaderos disponibles.</p>
    </div>

    <div class="payment-methods-form bg-white shadow-md p-6 rounded-lg">
      <h2 class="text-2xl font-semibold mb-4">{{ editingParkingLot ? 'Editar Parqueadero' : 'Crear Parqueadero' }}</h2>
      <div class="mb-4">
        <input v-model="currentParkingLot.name" type="text" placeholder="Nombre"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="mb-4">
        <input v-model="currentParkingLot.address" type="text" placeholder="Dirección"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="mb-4">
        <input v-model="currentParkingLot.phoneNumber" type="text" placeholder="Telefono"
          class="w-full p-2 border border-gray-3    00 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="mb-4">
        <input v-model="currentParkingLot.nit" type="text" placeholder="NIT"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div class="mb-4">
        <input v-model="currentParkingLot.coordX" type="text" placeholder="Coordenada X"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div class="mb-4">
        <input v-model="currentParkingLot.coordY" type="text" placeholder="Coordenada Y"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div class="mb-4">
        <select class="form-select" v-model="currentParkingLot.user.idUser" required>
          <option disabled value="">Seleccione Usuario</option>
          <option v-for="user in users" :key="user.idUser" :value="user.idUser">
            {{ user.name }}
          </option>
        </select>
      </div>

      <div class="flex items-center mb-4">
        <input type="checkbox" :checked="isActive" @change="toggleStatus" id="status" class="mr-2" />
        <label for="status" class="text-sm text-gray-700">Activo</label>
      </div>

      <div class="flex items-center space-x-4">
        <button @click="editingParkingLot ? updateParkingLot() : createParkingLot()"
          class="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600">
          {{ editingParkingLot ? 'Actualizar Parqueadero' : 'Crear Parqueadero' }}
        </button>

        <button @click="resetForm" v-if="editingParkingLot"
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