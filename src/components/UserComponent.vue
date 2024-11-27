<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import userService from "@/services/UserService";
import { RoleDto, type UserDto } from "@/models/models"; //
import RoleService from "@/services/RoleService";

const users = ref<UserDto[]>([]);
const newUser = ref<UserDto>({
  idUser: 0,
  username: '',
  password: '',
  name: '',
  phoneNumber: '',
  identification: '',
  email: '',
  role: new RoleDto ,
  status: ''
});
const editingUser = ref<UserDto | null>(null);

const roles = ref<RoleDto[]>([]);


onMounted(async () => {
  await loadRoles();
  await loadUser();


});

// Cargar paymentMethods desde el servicio
const loadUser = async () => {
  try {
    users.value = await userService.getUsers();
  } catch (error) {
    console.error('Error al cargar métodos de pago:', error);
  }
};



const loadRoles = async () => {
  try {
    roles.value = await RoleService.getRole();
    console.log('Roles cargados:', roles.value); // Verifica que los roles se carguen correctamente
  } catch (error) {
    console.error('Error al cargar roles:', error);
  }
};

// Crear un nuevo método de pago
const createUser = async () => {
  try {
    await userService.createUser(newUser.value);
    resetForm(); // Reiniciar el formulario
    await loadUser(); // Recargar métodos de pago
  } catch (error) {
    console.error('Error al crear:', error);
  }
};

const editUser = (vehicleType: UserDto) => {
  editingUser.value = { ...vehicleType };
};

const updateUser = async () => {
  if (editingUser.value) {
    try {
      await userService.updateUser(editingUser.value);
      resetForm();
      await loadUser();
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  }
};

const upgradeUser = async (user: UserDto) => {
  try {
    const newStatus = user.status === 'A' ? 'I' : 'A';
    const upgradeUser = { ...user, status: newStatus };

    const response = await userService.updateStatus(upgradeUser);

    const updatedStatus = response.status ? response.status : newStatus; // Asigna el nuevo estado

    const index = users.value.findIndex((p: UserDto) => p.idUser === upgradeUser.idUser);
    if (index !== -1) {
      users.value[index].status = updatedStatus;
    }

  } catch (error) {
    console.error('Error al alternar estado:', error);
  }
};

// Reiniciar el formulario
const resetForm = () => {
  newUser.value = {
    idUser: 0,
    username: '',
    password: '',
    name: '',
    phoneNumber: '',
    identification: '',
    email: '',
    role: new RoleDto,
    status: ''
  };
  editingUser.value = null;
};

// Computed property para filtrar métodos de pago activos
const activeUsers = computed(() => {
  return users.value.filter((user: UserDto) => user.status === 'A');
});

// Computed properties para manejar el formulario
const currentUsers = computed(() => {
  return editingUser.value || newUser.value;
});

const toggleStatus = () => {
  if (currentUsers.value.status === 'A') {
    currentUsers.value.status = 'I';
  } else {
    currentUsers.value.status = 'A';
  }
};

const isActive = computed(() => currentUsers.value.status === 'A');

</script>

<template>
  <div class="container mx-auto p-6">
    <div class="payment-methods-list mb-8">
      <h2 class="text-2xl font-semibold mb-4">Lista de Típos de Vehiculo</h2>

      <div class="overflow-x-auto bg-white shadow-md rounded-lg">
        <table class="user-lis">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-2 px-4 border-b text-left">Usuario</th>
              <th class="py-2 px-4 border-b text-left">Nombre</th>
              <th class="py-2 px-4 border-b text-left">Telefono</th>
              <th class="py-2 px-4 border-b text-left">Cedula</th>
              <th class="py-2 px-4 border-b text-left">Correo</th>
              <th class="py-2 px-4 border-b text-left">Rol</th>
              <th class="py-2 px-4 border-b text-left">Estado</th>

            </tr>
          </thead>
          <tbody>
            <tr v-for="user in activeUsers" :key="user.idUser" class="border-b">
              <td class="py-2 px-4">{{ user.username }}</td>
              <td class="py-2 px-4">{{ user.name }}</td>
              <td class="py-2 px-4">{{ user.phoneNumber }}</td>
              <td class="py-2 px-4">{{ user.identification }}</td>
              <td class="py-2 px-4">{{ user.email }}</td>
              <td class="py-2 px-4">{{ user.role?.name }}</td>
              <td class="py-2 px-4">{{ user.status }}</td>

              <td class="py-2 px-4">
                <button @click="editUser(user)"
                  class="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mr-2">Editar</button>
                <button @click="upgradeUser(user)"
                  class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Condición para mostrar mensaje cuando no hay métodos de pago activos -->
      <p v-if="!activeUsers.length" class="text-center text-gray-500 mt-4">No hay usuarios disponibles.</p>
    </div>

    <div class="payment-methods-form bg-white shadow-md p-6 rounded-lg">
      <h2 class="text-2xl font-semibold mb-4">{{ editingUser ? 'Editar Usuario' : 'Crear Usuario' }}</h2>

      <div class="mb-4">
        <input v-model="currentUsers.username" type="text" placeholder="Nombre de usuario"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="mb-4">
        <input v-model="currentUsers.name" type="text" placeholder="Nombre"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="mb-4">
        <input v-model="currentUsers.phoneNumber" type="text" placeholder="Telefono"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="mb-4">
        <input v-model="currentUsers.identification" type="text" placeholder="Cedula"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div class="mb-4">
        <input v-model="currentUsers.email" type="text" placeholder="Correo"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div class="mb-4">
        <select class="form-select" v-model="currentUsers.role.idRole" required>
          <option disabled value="">Select User Role</option>
          <option v-for="role in roles" :key="role.idRole" :value="role.idRole">
            {{ role.name }}
          </option>
        </select>
      </div>

      <div class="flex items-center mb-4">
        <input type="checkbox" :checked="isActive" @change="toggleStatus" id="status" class="mr-2" />
        <label for="status" class="text-sm text-gray-700">Activo</label>
      </div>

      <div class="flex items-center space-x-4">
        <button @click="editingUser ? updateUser() : createUser()"
          class="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600">
          {{ editingUser ? 'Actualizar Usuario' : 'Crear Usuario' }}
        </button>

        <button @click="resetForm" v-if="editingUser"
          class="bg-gray-400 text-white py-2 px-6 rounded hover:bg-gray-500">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
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