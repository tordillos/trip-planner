export interface TokenCache {
  getToken: (key: string) => Promise<string | undefined | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  clearToken?: (key: string) => void;
}

export interface ClerkError {
  errors: [
    {
      code: string;
      message: string;
      longMessage: string;
    },
  ];
}
