<template>
  <div id="app" class="font-sans text-gray-800">
    <!-- Header fijo en la parte superior -->
    <header class="bg-gray-800 text-white fixed top-0 left-0 w-full z-10 shadow-md">
      <nav class="container mx-auto flex justify-between items-center p-4">
        <div>
          <router-link to="/" class="text-lg font-bold hover:text-green-400">Home</router-link>
          <span class="mx-2">|</span>
          <router-link to="/about" class="text-lg font-bold hover:text-green-400">About</router-link>
        </div>
      </nav>
    </header>

    <!-- Contenido principal desplazado debajo del header -->
    <main class="container mx-auto p-4 mt-20"> <!-- `mt-20` es para agregar margen superior y evitar que el contenido quede cubierto por el header fijo -->
      <router-view />
    </main>
  </div>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Estilo para los enlaces activos */
nav a.router-link-exact-active {
  color: #42b983; /* Puedes mantener esta regla si deseas personalizar el color activo */
}
</style>
