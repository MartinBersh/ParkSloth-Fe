<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import scheduleService from "@/services/ScheduleService";
import type { ScheduleDto } from "@/models/models"; //

const schedules = ref<ScheduleDto[]>([]);
const newSchedule = ref<ScheduleDto>({ idSchdule: 0, startSchedule: 0, endSchedule: 0, status: '' });
const editingSchedule = ref<ScheduleDto | null>(null);

onMounted(async () => {
  await loadSchedules();
});

// Cargar paymentMethods desde el servicio
const loadSchedules = async () => {
  try {
    schedules.value = await scheduleService.getSchedules();
  } catch (error) {
    console.error('Error al cargar horarios:', error);
  }
};

// Crear un nuevo método de pago
const createSchedule = async () => {
  try {
    await scheduleService.createSchedule(newSchedule.value);
    resetForm(); // Reiniciar el formulario
    await loadSchedules(); // Recargar métodos de pago
  } catch (error) {
    console.error('Error al crear:', error);
  }
};

const editSchedule = (schedule: ScheduleDto) => {
  editingSchedule.value = { ...schedule };
};

const updateSchedule = async () => {
  if (editingSchedule.value) {
    try {
      await scheduleService.updateSchedule(editingSchedule.value);
      resetForm(); 
      await loadSchedules(); 
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  }
};

const upgradeScheduleStatus = async (schedule: ScheduleDto) => {
  try {
    const newStatus = schedule.status === 'A' ? 'I' : 'A'; 
    const updatedSchedule = { ...schedule, status: newStatus }; 

    const response = await scheduleService.updateStatus(updatedSchedule);
    
    const index = schedules.value.findIndex((p: ScheduleDto) => p.idSchdule === updatedSchedule.idSchdule);
    if (index !== -1) {
        schedules.value[index].status = response; 
    }

  } catch (error) {
    console.error('Error al alternar estado:', error);
  }
};

// Reiniciar el formulario
const resetForm = () => {
  newSchedule.value = { idSchdule: 0, startSchedule: 0, endSchedule: 0, status: 'I'  };
  editingSchedule.value = null;
};
// Computed property para filtrar métodos de pago activos
const activeSchedules = computed(() => {
  return schedules.value.filter((schedule: ScheduleDto) => schedule.status === 'A');
});

// Computed properties para manejar el formulario
const currentSchedule = computed(() => {
  return editingSchedule.value || newSchedule.value;
});

const toggleStatus = () => {
  if (currentSchedule.value.status === 'A') {
    currentSchedule.value.status = 'I';
  } else {
    currentSchedule.value.status = 'A';
  }
};

const isActive = computed(() => currentSchedule.value.status === 'A');

</script>

<template>
  <div class="container mx-auto p-6">
    <div class="payment-methods-list mb-8">
      <h2 class="text-2xl font-semibold mb-4">Lista de Horarios</h2>
      
      <div class="overflow-x-auto bg-white shadow-md rounded-lg">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-2 px-4 border-b text-left">Hora de Inicio</th>
              <th class="py-2 px-4 border-b text-left">Hora de Fin</th>
              <th class="py-2 px-4 border-b text-left">Estado</th>
              <th class="py-2 px-4 border-b text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="schedule in activeSchedules" :key="schedule.idPaymentMethod" class="border-b">
              <td class="py-2 px-4">{{ paymentMethod.startSchedule }}</td>
              <td class="py-2 px-4">{{ paymentMethod.endSchedule }}</td>
              <td class="py-2 px-4">{{ paymentMethod.status }}</td>
              <td class="py-2 px-4">
                <button @click="editSchedule(schedule)" class="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mr-2">Editar</button>
                <button @click="upgradeScheduleStatus(schedule)" class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Condición para mostrar mensaje cuando no hay métodos de pago activos -->
      <p v-if="!activeSchedules.length" class="text-center text-gray-500 mt-4">No hay horarios activos disponibles.</p>
    </div>

    <div class="payment-methods-form bg-white shadow-md p-6 rounded-lg">
      <h2 class="text-2xl font-semibold mb-4">{{ editingSchedule ? 'Editar Horario' : 'Crear Horario' }}</h2>

      <div class="mb-4">
        <input 
          v-model="currentSchedule.startSchedule"
          type="text"
          placeholder="Hora de Inicio 00:00"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="mb-4">
        <input 
          v-model="currentSchedule.endSchedule"
          type="text"
          placeholder="Hora de Fin 00:00"
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
      
<form class="max-w-[16rem] mx-auto grid grid-cols-2 gap-4">
    <div>
        <label for="start-time" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start time:</label>
        <div class="relative">
            <div class="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd"/>
                </svg>
            </div>
            <input type="time" id="start-time" class="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="09:00" max="18:00" value="00:00" required />
        </div>
    </div>
    <div>
        <label for="end-time" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End time:</label>
        <div class="relative">
            <div class="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd"/>
                </svg>
            </div>
            <input type="time" id="end-time" class="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="09:00" max="18:00" value="00:00" required />
        </div>
    </div>
</form>


      <div class="flex items-center space-x-4">
        <button 
          @click="editingSchedule ? updateSchedule() : createSchedule()"
          class="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600"
        >
          {{ editingSchedule ? 'Actualizar Horario' : 'Crear Horario' }}
        </button>

        <button 
          @click="resetForm"
          v-if="editingSchedule"
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