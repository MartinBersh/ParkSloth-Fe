<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import userService from "@/services/UserService";
import { FeeDto, PaymentMethodDto, ReservationDto, SlotDto, UserDto } from "@/models/models"; //
import PaymentMethodService from "@/services/PaymentMethodService";
import FeeService from "@/services/FeeService";
import SlotService from "@/services/SlotService";
import ReservationService from "@/services/ReservationService";

const reservations = ref<ReservationDto[]>([]);
const newReservation = ref<ReservationDto>({
    idReservation: 0,
    reservationDate: new Date(),
    paymentDate: new Date(),
    startDate: new Date(),
    endDate: new Date(),
    user: new UserDto,
    paymentMethod: new PaymentMethodDto,
    slot: new SlotDto,
    fee: new FeeDto,
    status: ''
});
const editingReservation = ref<ReservationDto | null>(null);

const users = ref<UserDto[]>([]);
const slots = ref<SlotDto[]>([]);
const fees = ref<FeeDto[]>([]);
const paymentMethods = ref<PaymentMethodDto[]>([]);



onMounted(async () => {
  await loadPaymentMethod();
  await loadUser();
  await loadFee();
  await loadReservation();
  await loadSlot();

});

const loadReservation = async () => {
  try {
    reservations.value = await ReservationService.getReservations();
  } catch (error) {
    console.error('Error al cargar roles:', error);

  }

};const loadUser = async () => {
  try {
    users.value = await userService.getUsers();
  } catch (error) {
    console.error('Error al cargar roles:', error);

  }
};
const loadPaymentMethod = async () => {
  try {
    paymentMethods.value = await PaymentMethodService.getPaymentMethod();
  } catch (error) {
    console.error('Error al cargar roles:', error);
  }
};

const loadFee = async () => {
  try {
    fees.value = await FeeService.getFees();
  } catch (error) {
    console.error('Error al cargar roles:', error);
  }
};



const loadSlot = async () => {
  try {
    slots.value = await SlotService.getSlots();
  } catch (error) {
    console.error('Error al cargar roles:', error);
  }
};

// Crear un nuevo método de pago
const createReservation = async () => {
  try {
    await ReservationService.createReservation(newReservation.value);
    resetForm(); // Reiniciar el formulario
    await loadReservation(); // Recargar métodos de pago
  } catch (error) {
    console.error('Error al crear:', error);
  }
};

const editReservation = (reservation: ReservationDto) => {
  editingReservation.value = { ...reservation };
};

const updateReservation = async () => {
  if (editingReservation.value) {
    try {
      await userService.updateUser(editingReservation.value);
      resetForm();
      await loadReservation();
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  }
};

const upgradeReservation = async (reservation: ReservationDto) => {
  try {
    const newStatus = reservation.status === 'A' ? 'I' : 'A';
    const upgradeReservation = { ...reservation, status: newStatus };

    const response = await ReservationService.updateStatus(upgradeReservation);

    const updatedStatus = response.status ? response.status : newStatus; // Asigna el nuevo estado

    const index = reservations.value.findIndex((p: ReservationDto) => p.idReservation === upgradeReservation.idReservation);
    if (index !== -1) {
      reservations.value[index].status = updatedStatus;
    }

  } catch (error) {
    console.error('Error al alternar estado:', error);
  }
};

// Reiniciar el formulario
const resetForm = () => {
  newReservation.value = {
    idReservation: 0,
    reservationDate: new Date(),
    paymentDate: new Date(),
    startDate: new Date(),
    endDate: new Date(),
    user: new UserDto,
    paymentMethod: new PaymentMethodDto,
    slot: new SlotDto,
    fee: new FeeDto,
    status: ''
  };
  editingReservation.value = null;
};

// Computed property para filtrar métodos de pago activos
const activeReservation = computed(() => {
  return reservations.value.filter((reservation: ReservationDto) => reservation.status === 'A');
});

// Computed properties para manejar el formulario
const currentReservation = computed(() => {
  return editingReservation.value || newReservation.value;
});

const toggleStatus = () => {
  if (currentReservation.value.status === 'A') {
    currentReservation.value.status = 'I';
  } else {
    currentReservation.value.status = 'A';
  }
};

const formatDate = (date: string | Date | undefined): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-ES'); 
};

const isActive = computed(() => currentReservation.value.status === 'A');

</script>

<template>
  <div class="container mx-auto p-6 grid grid-cols-" >
    <div class="payment-methods-list mb-8">
      <h2 class="text-2xl font-semibold mb-4">Lista de reservaciones</h2>

      <div class="overflow-x-auto bg-white shadow-md rounded-lg">
        <table class="user-lis">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-2 px-4 border-b text-left">Fecha de reserva</th>
              <th class="py-2 px-4 border-b text-left">Fecha de pago</th>
              <th class="py-2 px-4 border-b text-left">Fecha de inicio</th>
              <th class="py-2 px-4 border-b text-left">Fecha final</th>
              <th class="py-2 px-4 border-b text-left">Usuario</th>
              <th class="py-2 px-4 border-b text-left">Metodo de pago</th>
              <th class="py-2 px-4 border-b text-left">Parqueadero </th>
              <th class="py-2 px-4 border-b text-left">Tarifa </th>
              <th class="py-2 px-4 border-b text-left">Estado</th>


            </tr>
          </thead>
          <tbody>
            <tr v-for="reservation in activeReservation" :key="reservation.idReservation" class="border-b">
              <td class="py-2 px-4">{{ formatDate(reservation.reservationDate) }}</td>
              <td class="py-2 px-4">{{ formatDate(reservation.paymentDate) }}</td>
              <td class="py-2 px-4">{{ formatDate(reservation.startDate) }}</td>
              <td class="py-2 px-4">{{ formatDate(reservation.endDate) }}</td>
              <td class="py-2 px-4">{{ reservation.user?.name }}</td>
              <td class="py-2 px-4">{{ reservation.paymentMethod?.name }}</td>
              <td class="py-2 px-4">{{ reservation.slot?.slotNumber }}</td>
              <td class="py-2 px-4">{{ reservation.fee?.name }}</td>
              <td class="py-2 px-4">{{ reservation.status }}</td>

              <td class="py-2 px-4">
                <button @click="editReservation(reservation)"
                  class="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mr-2">Editar</button>
                <button @click="upgradeReservation(reservation)"
                  class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Condición para mostrar mensaje cuando no hay métodos de pago activos -->
      <p v-if="!activeReservation.length" class="text-center text-gray-500 mt-4">No hay reservas disponibles.</p>
    </div>

    <div class="payment-methods-form bg-white shadow-md p-6 rounded-lg">
      <h2 class="text-2xl font-semibold mb-4">{{ editingReservation ? 'Editar Reserva' : 'Crear Reserva' }}</h2>

      <div class="grid gap-6 p-4 bg-white rounded-lg shadow-md">

        <div class="form-group flex flex-col">
    <label class="mb-2 text-sm font-medium text-gray-700">Reservation Date:</label>
    <input 
      type="date" 
      v-model="currentReservation.reservationDate" 
      required 
      class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div class="form-group flex flex-col">
    <label class="mb-2 text-sm font-medium text-gray-700">Payment Date:</label>
    <input 
      type="date" 
      v-model="currentReservation.paymentDate" 
      required 
      class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div class="form-group flex flex-col">
    <label class="mb-2 text-sm font-medium text-gray-700">Start Date:</label>
    <input 
      type="date" 
      v-model="currentReservation.startDate" 
      required 
      class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div class="form-group flex flex-col">
    <label class="mb-2 text-sm font-medium text-gray-700">End Date:</label>
    <input 
      type="date" 
      v-model="currentReservation.endDate" 
      required 
      class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

</div>


      <div class="mb-4">
        <select class="form-select" v-model="currentReservation.user.idUser" required>
          <option disabled value="">Seleccione Usuario</option>
          <option v-for="user in users" :key="user.idUser" :value="user.idUser">
            {{ user.name }}
          </option>
        </select>
      </div>
      <div class="mb-4">
        <select class="form-select" v-model="currentReservation.paymentMethod.idPaymentMethod" required>
          <option disabled value="">Select Metodo de Pago</option>
          <option v-for="mehtod in paymentMethods" :key="mehtod.idPaymentMethod" :value="mehtod.idPaymentMethod">
            {{ mehtod.name }}
          </option>
        </select>
      </div>
      <div class="mb-4">
        <select class="form-select" v-model="currentReservation.slot.idSlot" required>
          <option disabled value="">Select Espacio de Parqueo</option>
          <option v-for="slot in slots" :key="slot.idSlot" :value="slot.idSlot">
            {{ slot.slotNumber }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <select class="form-select" v-model="currentReservation.fee.idFee" required>
          <option disabled value="">Select Trifa</option>
          <option v-for="fee in fees" :key="fee.idFee" :value="fee.idFee">
            {{ fee.name }}
          </option>
        </select>
      </div>

      <div class="flex items-center mb-4">
        <input type="checkbox" :checked="isActive" @change="toggleStatus" id="status" class="mr-2" />
        <label for="status" class="text-sm text-gray-700">Activo</label>
      </div>

      <div class="flex items-center space-x-4">
        <button @click="editingReservation ? updateReservation() : createReservation()"
          class="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600">
          {{ editingReservation ? 'Actualizar Reserva' : 'Crear Reserva' }}
        </button>

        <button @click="resetForm" v-if="editingReservation"
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