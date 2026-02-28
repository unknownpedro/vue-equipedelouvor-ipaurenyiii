<template>
  <div class="top-bar">
    <div class="top-bar-left">
      <router-link to="/home" class="logo logo-bold">MyApp</router-link>
    </div>

    <div class="top-bar-center">
      <router-link to="/lista_de_musicas" class="logo">Lista de Músicas</router-link>
    </div>

    <div class="top-bar-right">
      <nav v-if="authStore.user">
        <ul>
          <li class="user-info">{{ authStore.role }}</li>
          <li><button @click="handleLogout" class="btn-logout">Sair</button></li>
        </ul>
      </nav>
      <nav v-else>
        <router-link to="/login">Entrar</router-link>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  height: 60px;
  background-color: #86e0ac;
  color: #000;
}

.logo {
  text-decoration: none;
  color: #000;
  font-size: 0.9rem;
}

.logo-bold {
  font-weight: bold;
}

.top-bar-right ul {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  font-size: 0.8rem;
  text-transform: uppercase;
  background: rgba(0,0,0,0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.btn-logout {
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}
</style>