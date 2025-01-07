import { Config, setConfig, SDKConfig } from '../../src/core/config';

describe('Config', () => {
  it('should have default values set correctly', () => {
    expect(Config.publicKey).toBeNull();
    expect(Config.privateKey).toBeNull();
    expect(Config.baseURL).toBe('https://api.nexus.gg');
  });
});

describe('setConfig', () => {
  it('should update the Config object with valid values', () => {
    const newConfig: Partial<SDKConfig> = {
      publicKey: 'mockPublicKey',
      privateKey: 'mockPrivateKey',
      baseURL: 'https://mock.api.nexus.gg',
    };

    setConfig(newConfig);

    expect(Config.publicKey).toBe(newConfig.publicKey);
    expect(Config.privateKey).toBe(newConfig.privateKey);
    expect(Config.baseURL).toBe(newConfig.baseURL);
  });

  it('should throw an error if publicKey is missing', () => {
    expect(() =>
      setConfig({
        privateKey: 'mockPrivateKey',
        baseURL: 'https://mock.api.nexus.gg',
      }),
    ).toThrow('Public API key is required for Nexus SDK configuration.');
  });

  it('should throw an error if privateKey is missing', () => {
    expect(() =>
      setConfig({
        publicKey: 'mockPublicKey',
        baseURL: 'https://mock.api.nexus.gg',
      }),
    ).toThrow('Private API key is required for Nexus SDK configuration.');
  });

  it('should throw an error if baseURL is invalid', () => {
    expect(() =>
      setConfig({
        publicKey: 'mockPublicKey',
        privateKey: 'mockPrivateKey',
        baseURL: 'http://mock.api.nexus.gg', // Invalid because it's not HTTPS
      }),
    ).toThrow('A valid baseURL is required for Nexus SDK configuration.');
  });

  it('should throw an error if baseURL is missing', () => {
    expect(() =>
      setConfig({
        publicKey: 'mockPublicKey',
        privateKey: 'mockPrivateKey',
      }),
    ).toThrow('A valid baseURL is required for Nexus SDK configuration.');
  });
});
