declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    TZ?: string;
    NEXT_PUBLIC_API_URL: string;
  }
}