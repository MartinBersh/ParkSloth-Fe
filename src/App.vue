<template>
  <div id="app" class="font-sans text-gray-800">
    <!-- Header fijo en la parte superior -->
    <header class="bg-gray-800 text-white fixed top-0 left-0 w-full z-10 shadow-md">
      <nav class="container mx-auto flex justify-between items-center p-4">
        <div class="relative inline-block text-left">
          <div>
            <button type="button" @click="toggleDropdown" class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" 
                    :aria-expanded="isOpen ? 'true' : 'false'" aria-haspopup="true">
              Menú
              <svg class="-mr-1 size-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <!-- Dropdown menu, show/hide based on menu state -->
          <div v-if="isOpen" class="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
            <div v-if="role =='ROLE_ADMIN'" class="py-1" role="none">
              <a href="/#/user" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="menu-item-0">Usuarios</a>
              <a href="/#/vehicle-type" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="menu-item-0">Tipos de vehiculos</a>
              <a href="/#/payment-method" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="menu-item-0">Métodos de pago</a>
              <a href="/#/add-on-service" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="menu-item-0">Servicios adicionales</a>
              <a href="/#/parking-lot" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="menu-item-0">Parqueaderos</a>
              <a href="/#/schedule" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="menu-item-0">Horarios</a>
            </div>
            <div v-if="role =='ROLE_USER'" class="py-1" role="none">
              <a href="/#/schedule" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="menu-item-0">Horarios</a>
            </div>
            <div v-if="role =='ROLE_ADMINP'" class="py-1" role="none">
              <a href="/#/schedule" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="menu-item-0">Horarios</a>

            </div>
          </div>
        </div>
        <div>
          <router-link to="/" class="text-lg font-bold hover:text-green-400">Home</router-link>
          <span class="mx-2">|</span>
          <router-link to="/about" class="text-lg font-bold hover:text-green-400">About</router-link>
          <span class="mx-2">|</span>
          <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200">Cerrar Sesión</button>
        </div>
      </nav>
    </header>

    <!-- Contenido principal desplazado debajo del header -->
    <main class="pt-16">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isOpen = ref(false);
const role = localStorage.getItem('userRole');

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const logout = () => {
  localStorage.removeItem('userRole');
  router.push('/login');
};
</script>

<style scoped>
/* Estilos para el header y el botón de cerrar sesión */
header {
  @apply bg-gray-800 text-white fixed top-0 left-0 w-full z-10 shadow-md;
}

nav {
  @apply container mx-auto flex justify-between items-center p-4;
}

button {
  @apply bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200;
}
</style>