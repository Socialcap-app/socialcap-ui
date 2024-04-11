export type { Session }

interface Session {
    host: string;
    port: number;
    protocol: 'https' | 'http';
    authorization: string;
};