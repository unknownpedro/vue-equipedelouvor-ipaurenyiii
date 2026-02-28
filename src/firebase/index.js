import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Configurações do Firebase utilizando variáveis de ambiente do Vite (.env)
 * Lembre-se de criar o arquivo .env na raiz do projeto com as chaves começando com VITE_
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Analytics (Opcional - pode dar erro em ambientes de desenvolvimento específicos)
let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Exportações para uso nos outros arquivos do projeto
export const auth = getAuth(app);
export const db = getFirestore(app);
export const firebaseApp = app;
export { analytics };