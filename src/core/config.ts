export interface SDKConfig {
  publicKey: string | null;
  privateKey: string | null;
  baseURL: string;
}

export const Config: SDKConfig = {
  publicKey: null,
  privateKey: null,
  baseURL: 'https://api.nexus.gg',
};

export const setConfig = (newConfig: Partial<SDKConfig>): void => {
  const { publicKey, privateKey, baseURL } = newConfig;

  if (!publicKey) {
    throw new Error('Public API key is required for Nexus SDK configuration.');
  }
  if (!privateKey) {
    throw new Error('Private API key is required for Nexus SDK configuration.');
  }
  if (!baseURL || !baseURL.startsWith('https://')) {
    throw new Error('A valid baseURL is required for Nexus SDK configuration.');
  }

  Object.assign(Config, newConfig);
};
