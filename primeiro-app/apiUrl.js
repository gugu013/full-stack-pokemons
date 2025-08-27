// primeiro-app/apiUrl.js (VERSÃO FINAL PARA PRODUÇÃO)
import { Platform } from 'react-native';

// URL pública do seu servidor no Render, que já está online.
const PUBLIC_API_URL = 'https://pokedex-api-gito.onrender.com';

/**
 * Retorna a URL base da API.
 * Para o aplicativo final (APK), esta função sempre retornará a URL pública
 * para garantir que ele funcione em qualquer rede (Wi-Fi, 4G, 5G).
 */
export const getApiBaseUrl = () => {
  return PUBLIC_API_URL;
};