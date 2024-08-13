// env.d.ts
interface ImportMetaEnv {
  readonly NEXT_PUBLIC_API_URL: string; // example for public environment variable
  // add more environment variables as needed
  readonly MODE: string;
  readonly VITE_FRONTEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
