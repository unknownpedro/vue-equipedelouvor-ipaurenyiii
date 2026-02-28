<script setup>
import { ref, onMounted } from 'vue';
// Usando @ para garantir que o caminho aponte para src/components
import TopBar from '@/components/TopBar.vue'; 
import BottomBar from '@/components/BottomBar.vue';
import { db } from '@/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// 1. Variáveis reativas (sem tipagem de interface)
const musicas = ref([]);
const isLoading = ref(true);

// 2. Função para buscar os dados do Firestore
async function buscarMusicas() {
    try {
        isLoading.value = true;
        
        // Referência da coleção e ordenação
        const musicasRef = collection(db, 'musicas');
        const q = query(musicasRef, orderBy('nome'));
        
        const querySnapshot = await getDocs(q);
        
        // Mapeamos os documentos para um array simples
        musicas.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

    } catch (error) {
        console.error("Erro ao buscar músicas:", error);
    } finally {
        isLoading.value = false;
    }
}

// 3. Inicialização
onMounted(() => {
    buscarMusicas();
});
</script>

<template>
    <div class="page-wrapper">
        
        <div class="container-lista">
            <h1>Lista de Músicas</h1>

            <p v-if="isLoading" class="status-msg">Carregando músicas...</p>

            <p v-else-if="musicas.length === 0" class="status-msg">Nenhuma música encontrada.</p>

            <div v-else class="listaMusicas">
                <div v-for="musica in musicas" :key="musica.id" class="card-musica">
                    <div class="musica-info">
                        <router-link :to="'/externo/view-letras/' + musica.id" class="link-titulo" style="text-decoration: none;">
                            <h3 class="musica-titulo">{{ musica.nome }}</h3>
                        </router-link>
                        
                        <p class="musica-artista">
                            <strong>Artista:</strong> {{ musica.artista || 'Desconhecido' }}
                        </p>
                        <p class="musica-detalhe">
                            <strong>Tom:</strong> {{ musica.tom || 'N/A' }}
                        </p>
                    </div>
                    
                    <div class="musica-links">
                        <a v-if="musica.link" :href="musica.link" target="_blank" class="btn-link">
                            Ouvir
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <BottomBar />
</template>

<style scoped>
/* Adicione aqui o CSS que você já tinha para o card-musica */
.container-lista {
    padding: 20px;
    align-items: center;
    display: flex;
    flex-direction: column;
    color: white; /* Ajuste conforme seu tema dark */
    min-height: 100vh; /* Faz a página ter no mínimo a altura da tela */
}

/* Container da lista */
.listaMusicas {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 15px;
    width: 100%;
    max-width: 1000px;
    padding: 20px;
}

/* Card de música individual */
.card-musica {
    background-color: var(--input-bg);
    border: 1px solid var(--border-color);
    padding: 15px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: 0.3s;
}

.card-musica:hover {
    border-color: #2b7c5a;
    background-color: #1a1a1a;
}

.musica-titulo {
    color: #86e0ac;
    font-size: 1.1rem;
    margin-bottom: 5px;
}

.musica-artista {
    font-size: 0.85rem;
    color: #888;
}

.btn-link {
    text-decoration: none;
    color: #fff;
    font-size: 0.75rem;
    background: #333;
    padding: 5px 10px;
    border-radius: 5px;
    margin-left: 5px;
    transition: 0.3s;
}

.btn-link:hover {
    background: #2b7c5a;
}

.listaMusicas {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    padding: 20px;
    width: 100%;
}

.card-musica {
    background-color: var(--input-bg);
    border: 1px solid var(--border-color);
    padding: 15px;
    border-radius: 12px;
    width: 280px;
    transition: transform 0.3s ease;
}

.card-musica:hover {
    transform: translateY(-5px);
    border-color: #86e0ac;
}

template {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.status-msg {
    font-size: 1rem;
    color: #ccc;
    margin-top: 20px;
}

.container-lista :deep(.finalBar) {
    margin-top: 50px; 
}
</style>