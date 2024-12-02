import { setConfig } from './core/config';
import {
  generateCode,
  linkExistingNexus,
  generateAuthCode,
  getAllMembers,
  getMemberByPlayerId,
  getMemberByCodeOrId,
  getGroupTiers,
  getTierDetails,
  scheduleRevShare,
  listScheduledRevShares,
} from './services/manage';
import { sendTransaction, updateTransaction } from './services/attribution';

const NexusGG = {
  /**
   * Configure the Nexus SDK.
   */
  config: (
    publicKey: string,
    privateKey: string,
    environment: 'sandbox' | 'production' = 'production',
  ) => {
    const baseURL =
      environment === 'sandbox'
        ? 'https://api.nexus-dev.gg/v1'
        : 'https://api.nexus.gg/v1';

    setConfig({
      publicKey,
      privateKey,
      baseURL,
    });
  },

  manage: {
    generateCode,
    linkExistingNexus,
    generateAuthCode,
    getAllMembers,
    getMemberByPlayerId,
    getMemberByCodeOrId,
    getGroupTiers,
    getTierDetails,
    scheduleRevShare,
    listScheduledRevShares,
  },

  attribution: {
    sendTransaction,
    updateTransaction,
  },
};

module.exports = NexusGG;
export default NexusGG;
