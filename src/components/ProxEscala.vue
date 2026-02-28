<script setup>
import { ref, onMounted } from 'vue';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

// 1. Variáveis reativas sem tipagem
const escala = ref(null);
const isLoading = ref(true);
const infoDomingo = ref("");

/**
 * LÓGICA PARA CALCULAR O PRÓXIMO DOMINGO
 * Retorna se é o 1º, 2º, 3º... domingo do mês
 */
function calcularProximoDomingoOrdinal() {
    const hoje = new Date();
    const dataBusca = new Date(hoje);
    
    // Se hoje não for domingo (0), avançamos até o próximo domingo
    if (hoje.getDay() !== 0) {
        dataBusca.setDate(hoje.getDate() + (7 - hoje.getDay()));
    }

    const dia = dataBusca.getDate();
    
    // Calcula o ordinal (1 a 5) baseado no dia do mês
    const ordinal = Math.ceil(dia / 7);
    
    // Formata o nome do mês para exibição
    const nomeMes = dataBusca.toLocaleDateString('pt-BR', { month: 'long' });
    infoDomingo.value = `${ordinal}º Domingo de ${nomeMes}`;
    
    return ordinal;
}

/**
 * Busca a escala fixa no Firestore baseada no número do domingo
 */
async function buscarEscala() {
    try {
        isLoading.value = true;
        const ordinal = calcularProximoDomingoOrdinal();
        
        // Referência para o documento na coleção 'escalas_fixas'
        // IDs esperados: "1", "2", "3", "4", "5"
        const docRef = doc(db, "escalas_fixas", ordinal.toString());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            escala.value = docSnap.data();
        } else {
            escala.value = null;
        }
    } catch (error) {
        console.error("Erro ao buscar escala:", error);
    } finally {
        isLoading.value = false;
    }
}

onMounted(buscarEscala);
</script>

<template>
    <div class="escala-card">
        <div class="header-escala">
            <span class="badge-domingo">{{ infoDomingo }}</span>
            <h3>Próxima Escala</h3>
        </div>

        <div v-if="isLoading" class="loader">Verificando calendário...</div>

        <div v-else-if="escala" class="escala-conteudo">
            <h4>{{ escala.titulo }}</h4>
            <p class="ministro-info">
                <strong>Líder:</strong> {{ escala.ministro }}
            </p>
            
            <div class="equipe-tags">
                <span v-for="membro in escala.equipe" :key="membro" class="tag">
                    {{ membro }}
                </span>
            </div>
        </div>

        <div v-else class="aviso">
            <p>Escala para este domingo ainda não foi definida no sistema.</p>
        </div>
    </div>
</template>

<style scoped>

.escala-card {
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 10px;
    padding: 20px;
    color: white;
}

.header-escala {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 15px;
}

.badge-domingo {
    background: #42b883;
    color: #121412;
    padding: 3px 10px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: bold;
    width: fit-content;
    text-transform: uppercase;
}

.equipe-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.tag {
    background: #2a2a2a;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.85rem;
    border: 1px solid #444;
}

h4 {
    color: #42b883;
    margin-bottom: 5px;
}
</style>