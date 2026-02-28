import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import LoginView from '@/pages/LoginView.vue'; 

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/RegisterView.vue')
  },
  {
    path: '/esqueci-senha',
    name: 'esqueci-senha',
    component: () => import('@/pages/ForgotPassword.vue')
  },
  {
    path: '/externo/lista_de_musicas',
    name: 'externo/lista_de_musicas',
    component: () => import('@/pages/external/ListaMusicaExt.vue'),
    meta: { requiresAuth: false } // Externo não exige autenticação
  },
  {
    path: '/lista_de_musicas',
    name: 'lista_de_musicas',
    component: () => import('@/pages/ListaMusica.vue'),
    meta: { requiresAuth: true } // Protegendo a lista de músicas
  },
  {
    path: '/externo/view-letras/:id',
    name: 'ViewLetrasExt',
    component: () => import('@/pages/external/ViewLetrasExt.vue'),
    meta: { requiresAuth: false } // Externo não exige autenticação
  },
  {
    path: '/view-letras/:id',
    name: 'ViewLetras',
    component: () => import('@/pages/ViewLetras.vue'),
    meta: { requiresAuth: true } // Geralmente letras também precisam de login
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/pages/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guarda de navegação (Navigation Guard)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // O "!!" converte o objeto user em um valor booleano (true/false)
  const isAuthenticated = !!authStore.user;

  // 1. Se a rota exige autenticação e o usuário NÃO está logado
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } 
  // 2. Se o usuário já está logado e tenta ir para o login ou registro
  else if (isAuthenticated && (to.path === '/login' || to.path === '/register')) {
    next('/home');
  } 
  // 3. Caso contrário, segue normalmente
  else {
    next();
  }
});

export default router;