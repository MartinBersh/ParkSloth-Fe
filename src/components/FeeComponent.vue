<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { FeeDto, ParkingLotDto, VehicleTypeDto } from "@/models/models"; //
import feeService from "@/services/FeeService";
import VehicleTypeService from "@/services/VehicleTypeService";
import ParkingLotService from "@/services/ParkingLotService";

const fees = ref<FeeDto[]>([]);
const newFee = ref<FeeDto>({
  idFee: 0,
  name: '',
  price: 0,
  parkingLot: new ParkingLotDto,
  vehicleType: new VehicleTypeDto,
  status: '',
});
const editingFee = ref<FeeDto | null>(null);

const vehicles = ref<VehicleTypeDto[]>([]);
const parkingLots = ref<ParkingLotDto[]>([]);


onMounted(async () => {
  await loadFee();
  await loadVehicleType();
  await loadParkingLot();
});

// Cargar paymentMethods desde el servicio
const loadFee = async () => {
  try {
    fees.value = await feeService.getFees();
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
const createFee = async () => {
  try {
    await feeService.createFee(newFee.value);
    resetForm(); // Reiniciar el formulario
    await loadFee(); // Recargar métodos de pago
  } catch (error) {
    console.error('Error al crear:', error);
  }
};

const editFee = (fee: FeeDto) => {
  editingFee.value = { ...fee };
};

const updateFee = async () => {
  if (editingFee.value) {
    try {
      await feeService.updateFee(editingFee.value);
      resetForm();
      await loadFee();
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  }
};

const upgradeFee = async (fee: FeeDto) => {
  try {
    const newStatus = fee.status === 'A' ? 'I' : 'A';
    const upgradeFee = { ...fee, status: newStatus };

    const response = await feeService.updateStatus(upgradeFee);

    const updatedStatus = response.status ? response.status : newStatus; // Asigna el nuevo estado

    const index = fees.value.findIndex((p: FeeDto) => p.idFee === upgradeFee.idFee);
    if (index !== -1) {
      fees.value[index].status = updatedStatus;
    }

  } catch (error) {
    console.error('Error al alternar estado:', error);
  }
};

// Reiniciar el formulario
const resetForm = () => {
   newFee.value = {
    idFee: 0,
    name: '',
    price: 0,
    parkingLot: new ParkingLotDto,
    vehicleType: new VehicleTypeDto,
    status: ''
  };
  editingFee.value = null;
};

// Computed property para filtrar métodos de pago activos
const ActiveFees = computed(() => {
  return fees.value.filter((fee: FeeDto) => fee.status === 'A');
});

// Computed properties para manejar el formulario
const currentFees = computed(() => {
  return editingFee.value || newFee.value;
});

const toggleStatus = () => {
  if (currentFees.value.status === 'A') {
    currentFees.value.status = 'I';
  } else {
    currentFees.value.status = 'A';
  }
};

const isActive = computed(() => currentFees.value.status === 'A');

</script>

<template>
  <div class="container mx-auto p-6 grid grid-cols-" >
    <div class="payment-methods-list mb-8">
      <h2 class="text-2xl font-semibold mb-4">Lista de Tarifas</h2>

      <div class="overflow-x-auto bg-white shadow-md rounded-lg">
        <table class="user-lis">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-2 px-4 border-b text-left">Nombre</th>
              <th class="py-2 px-4 border-b text-left">Precio</th>
              <th class="py-2 px-4 border-b text-left">Parqueadero</th>
              <th class="py-2 px-4 border-b text-left">Tipo de vehiculo</th>
              <th class="py-2 px-4 border-b text-left">Estado</th>

            </tr>
          </thead>
          <tbody>
            <tr v-for="fee in ActiveFees" :key="fee.idFee" class="border-b">
              <td class="py-2 px-4">{{ fee.name }}</td>
              <td class="py-2 px-4">{{ fee.price }}</td>
              <td class="py-2 px-4">{{ fee.parkingLot?.name }}</td>
              <td class="py-2 px-4">{{ fee.vehicleType?.name }}</td>
              <td class="py-2 px-4">{{ fee.status }}</td>

              <td class="py-2 px-4">
                <button @click="editFee(fee)"
                  class="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mr-2">Editar</button>
                <button @click="upgradeFee(fee)"
                  class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Condición para mostrar mensaje cuando no hay métodos de pago activos -->
      <p v-if="!ActiveFees.length" class="text-center text-gray-500 mt-4">No hay tarifas disponibles.</p>
    </div>

    <div class="payment-methods-form bg-white shadow-md p-6 rounded-lg">
      <h2 class="text-2xl font-semibold mb-4">{{ editingFee ? 'Editar Tarifa' : 'Crear Tarifa' }}</h2>

      <div class="mb-4">
        <input v-model="currentFees.name" type="text" placeholder="Nombre"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="mb-4">
        <input v-model="currentFees.price" type="text" placeholder="Precio"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="mb-4">
        <select class="form-select" v-model="currentFees.parkingLot.idParkingLot" required>
          <option disabled value="">Select Parking Lot</option>
          <option v-for="parkingLot in parkingLots" :key="parkingLot.idParkingLot" :value="parkingLot.idParkingLot">
            {{ parkingLot.name }}
          </option>
        </select>
      </div>
      <div class="mb-4">
        <select class="form-select" v-model="currentFees.vehicleType.idVehicleType" required>
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
        <button @click="editingFee ? updateFee() : createFee()"
          class="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600">
          {{ editingFee ? 'Actualizar Tarifa' : 'Crear Tarifa' }}
        </button>

        <button @click="resetForm" v-if="editingFee"
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