import NexusGG from '../src/index';
import { setConfig } from '../src/core/config';
import * as manageServices from '../src/services/manage';
import * as attributionServices from '../src/services/attribution';
import { Currency, ZERO_DECIMAL_CURRENCIES } from '../src/types/currencies';

jest.mock('../src/core/config');

describe('NexusGG SDK', () => {
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
});
