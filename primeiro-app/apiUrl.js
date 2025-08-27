// primeiro-app/apiUrl.js (VERSÃO FINAL DE PRODUÇÃO)
import { Platform } from 'react-native';

// URL pública do seu servidor no Render
const PUBLIC_API_URL = 'https://pokedex-api-gito.onrender.com';

export const getApiBaseUrl = () => {
  // Para desenvolvimento, ainda podemos usar o localhost se quisermos,
  // mas para o build final (APK), usaremos a URL pública.
  // Esta lógica simples garante que o APK sempre use a URL correta.
  return PUBLIC_API_URL;
};