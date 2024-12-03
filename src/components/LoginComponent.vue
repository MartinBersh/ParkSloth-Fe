<template>
  <div class="login-container max-w-md mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg">
    <h2 class="title text-2xl font-semibold text-center text-gray-800 mb-6">Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin" class="login-form space-y-4">
      <div class="input-group">
        <label for="username" class="block text-gray-700">Nombre de usuario:</label>
        <input type="text" v-model="username" id="username" required class="input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="input-group">
        <label for="password" class="block text-gray-700">Contraseña:</label>
        <input type="password" v-model="password" id="password" required class="input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <button type="submit" class="submit-button w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200">Iniciar Sesión</button>
      <div v-if="errorMessage" class="error text-red-500 text-center mt-2">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:8080/Login/login', {
      username: username.value,
      password: password.value,
    });

    const role = response.data.rol;
    localStorage.setItem('userRole', role);
    router.push('/home');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      errorMessage.value = 'Credenciales no válidas';
    } else {
      errorMessage.value = 'Error al iniciar sesión';
    }
  }
};
</script>

<style scoped>
.login-container {
  @apply max-w-md mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg;
}

.title {
  @apply text-2xl font-semibold text-center text-gray-800 mb-6;
}

.input-group {
  @apply space-y-2;
}

.input {
  @apply w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.submit-button {
  @apply w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200;
}

.error {
  @apply text-red-500 text-center mt-2;
}
</style>