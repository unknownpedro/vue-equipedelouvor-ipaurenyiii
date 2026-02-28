<template>
  <div id="app-container">
    <main class="content">
      <router-view /> 
    </main>
  </div>
</template>

<style>
/* Estilo global ou no App.vue */
#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Faz o app ter no mínimo a altura da tela */
}

.content {
  flex: 1; /* Isso força o conteúdo a 'crescer' e empurrar o BottomBar para baixo */
}
</style>