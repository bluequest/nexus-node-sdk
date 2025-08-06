import NexusGG from '../src/index';
import { setConfig } from '../src/core/config';
import * as manageServices from '../src/services/manage';
import * as attributionServices from '../src/services/attribution';
import { Currency, ZERO_DECIMAL_CURRENCIES } from '../src/types/currencies';

jest.mock('../src/core/config');

describe('NexusGG SDK', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('config', () => {
    it('should call setConfig with production environment by default', () => {
      NexusGG.config('publicKey', 'privateKey');

      expect(setConfig).toHaveBeenCalledWith({
        publicKey: 'publicKey',
        privateKey: 'privateKey',
        baseURL: 'https://api.nexus.gg/v1',
      });
    });

    it('should call setConfig with sandbox environment', () => {
      NexusGG.config('publicKey', 'privateKey', 'sandbox');

      expect(setConfig).toHaveBeenCalledWith({
        publicKey: 'publicKey',
        privateKey: 'privateKey',
        baseURL: 'https://api.nexus-dev.gg/v1',
      });
    });

    it('should handle invalid environment gracefully', () => {
      NexusGG.config('publicKey', 'privateKey', 'invalid' as any);

      expect(setConfig).toHaveBeenCalledWith({
        publicKey: 'publicKey',
        privateKey: 'privateKey',
        baseURL: 'https://api.nexus.gg/v1',
      });
    });
  });

  describe('manage', () => {
    it('should expose all manage services', () => {
      expect(NexusGG.manage.generateCode).toBe(manageServices.generateCode);
      expect(NexusGG.manage.linkExistingNexus).toBe(
        manageServices.linkExistingNexus,
      );
      expect(NexusGG.manage.generateAuthCode).toBe(
        manageServices.generateAuthCode,
      );
      expect(NexusGG.manage.getAllMembers).toBe(manageServices.getAllMembers);
      expect(NexusGG.manage.getMemberByPlayerId).toBe(
        manageServices.getMemberByPlayerId,
      );
      expect(NexusGG.manage.getMemberByCodeOrId).toBe(
        manageServices.getMemberByCodeOrId,
      );
      expect(NexusGG.manage.getGroupTiers).toBe(manageServices.getGroupTiers);
      expect(NexusGG.manage.getTierDetails).toBe(manageServices.getTierDetails);
      expect(NexusGG.manage.scheduleRevShare).toBe(
        manageServices.scheduleRevShare,
      );
      expect(NexusGG.manage.listScheduledRevShares).toBe(
        manageServices.listScheduledRevShares,
      );
    });
  });

  describe('attribution', () => {
    it('should expose all attribution services', () => {
      expect(NexusGG.attribution.sendTransaction).toBe(
        attributionServices.sendTransaction,
      );
      expect(NexusGG.attribution.updateTransaction).toBe(
        attributionServices.updateTransaction,
      );
    });
  });

  describe('currencies', () => {
    it('should expose currency types and zero-decimal currencies', () => {
      expect(NexusGG.currencies.Currency).toBe(Currency);
      expect(NexusGG.currencies.ZERO_DECIMAL_CURRENCIES).toBe(
        ZERO_DECIMAL_CURRENCIES,
      );
    });
  });

  describe('Integration Tests', () => {
    it('should support full SDK workflow', () => {
      expect(typeof NexusGG.config).toBe('function');
      expect(typeof NexusGG.manage.getAllMembers).toBe('function');
      expect(typeof NexusGG.manage.generateCode).toBe('function');
      expect(typeof NexusGG.attribution.sendTransaction).toBe('function');
      expect(typeof NexusGG.attribution.updateTransaction).toBe('function');
      expect(NexusGG.currencies).toBeDefined();
    });

    it('should maintain consistent API structure', () => {
      expect(NexusGG).toHaveProperty('config');
      expect(NexusGG).toHaveProperty('manage');
      expect(NexusGG).toHaveProperty('attribution');
      expect(NexusGG).toHaveProperty('currencies');

      expect(NexusGG.manage).toHaveProperty('generateCode');
      expect(NexusGG.manage).toHaveProperty('linkExistingNexus');
      expect(NexusGG.manage).toHaveProperty('generateAuthCode');
      expect(NexusGG.manage).toHaveProperty('getAllMembers');
      expect(NexusGG.manage).toHaveProperty('getMemberByPlayerId');
      expect(NexusGG.manage).toHaveProperty('getMemberByCodeOrId');
      expect(NexusGG.manage).toHaveProperty('getGroupTiers');
      expect(NexusGG.manage).toHaveProperty('getTierDetails');
      expect(NexusGG.manage).toHaveProperty('scheduleRevShare');
      expect(NexusGG.manage).toHaveProperty('listScheduledRevShares');

      expect(NexusGG.attribution).toHaveProperty('sendTransaction');
      expect(NexusGG.attribution).toHaveProperty('updateTransaction');

      expect(NexusGG.currencies).toHaveProperty('Currency');
      expect(NexusGG.currencies).toHaveProperty('ZERO_DECIMAL_CURRENCIES');
    });

    it('should handle configuration changes', () => {
      const originalConfig = jest.fn();
      (setConfig as jest.Mock).mockImplementation(originalConfig);

      NexusGG.config('key1', 'secret1');
      expect(setConfig).toHaveBeenCalledWith({
        publicKey: 'key1',
        privateKey: 'secret1',
        baseURL: 'https://api.nexus.gg/v1',
      });

      jest.clearAllMocks();

      NexusGG.config('key2', 'secret2', 'sandbox');
      expect(setConfig).toHaveBeenCalledWith({
        publicKey: 'key2',
        privateKey: 'secret2',
        baseURL: 'https://api.nexus-dev.gg/v1',
      });
    });
  });
});
