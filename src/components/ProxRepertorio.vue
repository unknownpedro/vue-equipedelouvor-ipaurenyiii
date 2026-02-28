<script setup>
import { ref, onMounted } from 'vue';
import { db } from '@/firebase';
import { 
    collection, 
    query, 
    where, 
    orderBy, 
    limit, 
    getDocs, 
    doc, 
    getDoc 
} from 'firebase/firestore';

// 1. Variáveis reativas sem tipagem
const proximoRepertorio = ref(null);
const detalhesMusicas = ref([]);
const isLoading = ref(true);

// 2. Função para buscar o repertório e os detalhes das músicas
async function buscarRepertorio() {
    try {
        isLoading.value = true;
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        // Busca o primeiro repertório agendado a partir de hoje
        const q = query(
            collection(db, 'repertorios'),
            where('data', '>=', hoje),
            orderBy('data', 'asc'),
            limit(1)
        );

        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const resDoc = querySnapshot.docs[0];
            const dataRep = resDoc.data();
            
            // Guardamos os dados do repertório com o ID
            proximoRepertorio.value = { 
                ...dataRep, 
                id: resDoc.id 
            };

            // 3. Buscar detalhes de cada música (como o nome e tom) usando os IDs
            if (dataRep.musicasIds && dataRep.musicasIds.length > 0) {
                const promises = dataRep.musicasIds.map(async (mId) => {
                    const mDoc = await getDoc(doc(db, 'musicas', mId));
                    if (mDoc.exists()) {
                        return { id: mId, ...mDoc.data() };
                    }
                    return { id: mId, nome: 'Música não encontrada', tom: '-' };
                });

                detalhesMusicas.value = await Promise.all(promises);
            }
        }
    } catch (error) {
        console.error("Erro ao carregar repertório:", error);
    } finally {
        isLoading.value = false;
    }
}

onMounted(buscarRepertorio);
</script>

<template>
    <div class="repertorio-card">
        <div class="header">
            <h3>🎵 Próximo Repertório</h3>
            <span v-if="proximoRepertorio?.domingoOrdinal" class="badge">
                {{ proximoRepertorio.domingoOrdinal }}º Domingo
            </span>
        </div>

        <div v-if="isLoading" class="status">Carregando músicas...</div>

        <div v-else-if="proximoRepertorio" class="lista-musicas">
            <p class="data-info">
                {{ proximoRepertorio.data?.toDate().toLocaleDateString('pt-BR') }} - {{ proximoRepertorio.titulo }}
            </p>
            
            <ul>
                <li v-for="(musica, index) in detalhesMusicas" :key="musica.id">
                    <span class="ordem">{{ index + 1 }}</span>
                    <router-link :to="'/view-letras/' + musica.id" class="musica-nome">
                        {{ musica.nome }}
                    </router-link>
                    <span class="musica-tom">{{ musica.tom }}</span>
                </li>
            </ul>
        </div>

        <div v-else class="vazio">Nenhum repertório agendado.</div>
    </div>
</template>

<style scoped>

.repertorio-card {
    background: #1a1a1a;
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid #333;
}
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}
.badge {
    background: #42b883;
    color: black;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
}
.data-info {
    color: #888;
    font-size: 0.9rem;
    margin-bottom: 1rem;
}
ul {
    list-style: none;
    padding: 0;
}
li {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #222;
}
.ordem {
    color: #42b883;
    font-weight: bold;
    margin-right: 15px;
    width: 20px;
}
.musica-nome {
    flex-grow: 1;
    text-decoration: none;
    color: #e0e0e0;
}
.musica-tom {
    background: #333;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.8rem;
    color: #42b883;
}
</style>