<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import paymentMethodService from "@/services/PaymentMethodService";
import type { PaymentMethodDto } from "@/models/models"; //

const paymentMethods = ref<PaymentMethodDto[]>([]);
const newPaymentMethod = ref<PaymentMethodDto>({ idPaymentMethod: 0, name: '', status: '' });
const editingPaymentMethod = ref<PaymentMethodDto | null>(null);

onMounted(async () => {
  await loadPaymentMethods();
});

// Cargar paymentMethods desde el servicio
const loadPaymentMethods = async () => {
  try {
    paymentMethods.value = await paymentMethodService.getPaymentMethod();
  } catch (error) {
    console.error('Error al cargar métodos de pago:', error);
  }
};

// Crear un nuevo método de pago
const createPaymentMethod = async () => {
  try {
    await paymentMethodService.createPaymentMethod(newPaymentMethod.value);
    resetForm(); // Reiniciar el formulario
    await loadPaymentMethods(); // Recargar métodos de pago
  } catch (error) {
    console.error('Error al crear:', error);
  }
};

const editPaymentMethod = (paymentMethod: PaymentMethodDto) => {
  editingPaymentMethod.value = { ...paymentMethod };
};

const updatePaymentMethod = async () => {
  if (editingPaymentMethod.value) {
    try {
      await paymentMethodService.updatePaymentMethod(editingPaymentMethod.value);
      resetForm(); 
      await loadPaymentMethods(); 
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  }
};

const upgradePaymentMethodStatus = async (paymentMethod: PaymentMethodDto) => {
  try {
    const newStatus = paymentMethod.status === 'A' ? 'I' : 'A'; 
    const updatedPaymentMethod = { ...paymentMethod, status: newStatus }; 

    const response = await paymentMethodService.updateStatus(updatedPaymentMethod);
    
    const index = paymentMethods.value.findIndex((p: PaymentMethodDto) => p.idPaymentMethod === updatedPaymentMethod.idPaymentMethod);
    if (index !== -1) {
      paymentMethods.value[index].status = response; 
    }

  } catch (error) {
    console.error('Error al alternar estado:', error);
  }
};

// Reiniciar el formulario
const resetForm = () => {
  newPaymentMethod.value = { idPaymentMethod: 0, name: '', status: 'I' };
  editingPaymentMethod.value = null;
};
// Computed property para filtrar métodos de pago activos
const activePaymentMethods = computed(() => {
  return paymentMethods.value.filter((paymentMethod: PaymentMethodDto) => paymentMethod.status === 'A');
});

// Computed properties para manejar el formulario
const currentPaymentMethod = computed(() => {
  return editingPaymentMethod.value || newPaymentMethod.value;
});

const toggleStatus = () => {
  if (currentPaymentMethod.value.status === 'A') {
    currentPaymentMethod.value.status = 'I';
  } else {
    currentPaymentMethod.value.status = 'A';
  }
};

const isActive = computed(() => currentPaymentMethod.value.status === 'A');

</script>

<template>
  <div class="container mx-auto p-6">
    <div class="payment-methods-list mb-8">
      <h2 class="text-2xl font-semibold mb-4">Lista de Métodos de Pago</h2>
      
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
            <tr v-for="paymentMethod in activePaymentMethods" :key="paymentMethod.idPaymentMethod" class="border-b">
              <td class="py-2 px-4">{{ paymentMethod.name }}</td>
              <td class="py-2 px-4">{{ paymentMethod.status }}</td>
              <td class="py-2 px-4">
                <button @click="editPaymentMethod(paymentMethod)" class="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mr-2">Editar</button>
                <button @click="upgradePaymentMethodStatus(paymentMethod)" class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Condición para mostrar mensaje cuando no hay métodos de pago activos -->
      <p v-if="!activePaymentMethods.length" class="text-center text-gray-500 mt-4">No hay métodos de pago activos disponibles.</p>
    </div>

    <div class="payment-methods-form bg-white shadow-md p-6 rounded-lg">
      <h2 class="text-2xl font-semibold mb-4">{{ editingPaymentMethod ? 'Editar Método de Pago' : 'Crear Método de Pago' }}</h2>

      <div class="mb-4">
        <input 
          v-model="currentPaymentMethod.name"
          type="text"
          placeholder="Método de Pago"
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
          @click="editingPaymentMethod ? updatePaymentMethod() : createPaymentMethod()"
          class="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600"
        >
          {{ editingPaymentMethod ? 'Actualizar Método de Pago' : 'Crear Método de Pago' }}
        </button>

        <button 
          @click="resetForm"
          v-if="editingPaymentMethod"
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