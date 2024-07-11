import type { Session } from "$lib/types";

const API_ENDPOINTS: any = {
  'local': {
    host: '127.0.0.1',
    protocol: 'http',
    port: 30800, 
    authorization: "",
    key: ""
  },
  'dev': {
    host: 'api.socialcap.dev',
    protocol: 'https',
    port: 443, 
    authorization: "",
    key: ""
  },
  'main': {
    host:  'api.socialcap.app',
    protocol: 'https',
    port: 443, 
    authorization: "",
    key: ""
  }
}

const MINANFT_ENDPOINTS: any = {
  'testing': {
    url: 'https://testnet.minanft.io'
  },
  'production': {
      url: 'https://minanft.io'
  }
}

const MINASCAN_ENDPOINTS: any = {
  'testing': {
    url: 'https://minascan.io/devnet/tx'
  },
  'production': {
      url: 'https://minascan.io/mainnet/tx'
  }
}

export function getDefaultAPISessionFromEnv(): Session {
  const key = import.meta.env.VITE_USE_API;
  const session = API_ENDPOINTS[key] || API_ENDPOINTS['local'];
  console.log("store/api/getDefaultAPISessionFromEnv", session);
  return session;
}

export function getMinaNftUrl(): string {
  const key = import.meta.env.VITE_APP_ENV;
  const endpoint = MINANFT_ENDPOINTS[key] || MINANFT_ENDPOINTS['testing'];
  return endpoint.url;
}

export function getMinascnanUrl(): string {
  const key = import.meta.env.VITE_APP_ENV;
  const endpoint = MINASCAN_ENDPOINTS[key] || MINASCAN_ENDPOINTS['testing'];
  return endpoint.url;
}
