/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOCKET_URL: string;
  readonly VITE_XIRSYS_URL: string;
  readonly VITE_XIRSYS_USER: string;
  readonly VITE_XIRSYS_CRED: string;
  readonly VITE_S3_BUCKET: string;
  readonly VITE_S3_REGION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
