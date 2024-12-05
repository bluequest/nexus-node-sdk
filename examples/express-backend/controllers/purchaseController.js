const NexusGG = require('nexus-node-sdk');

// delay helper for demo purposes
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// transactionId generation for demo purposes
const generateTransactionId = () => {
  const randomPart = Math.random().toString(36).substring(2, 8);
  const timestampPart = Date.now().toString(36);
  return `${randomPart}_${timestampPart}`;
};

exports.purchaseItem = async (req, res) => {
  const { skuId, playerName, creatorCode } = req.body;

  // mock retrieving item information
  const itemInformation = {
    id: 'item_1234',
    skuId: skuId,
    description: 'Healing Pot',
  };

  // mock purchasing besing sent to payment gateway
  await delay(2000);

  // mock data sent back from payment gateway
  const transactionDetailsFromGateway = {
    transactionId: generateTransactionId(),
    transactionDate: new Date().toISOString(),
    subtotal: 4999,
    currency: 'USD',
  };

  // send successful response to award item in-game
  res.status(200).json({
    message: 'Purchase Successful',
    data: {
      transactionId: '123',
      itemId: 1234,
    },
  });

  // mock player lookup from playerName provided
  const playerData = {
    gameJoinDate: '2024-01-15T00:00:00.000Z',
    lastPurchaseDate: '2024-05-01T00:00:00.000Z',
    totalSpend: 25999,
    totalSpendCurrency: 'USD',
  };

  // mock transaction data for Nexus API
  const callback = async () => {
    try {
      const transactionDetails = {
        playerName,
        code: creatorCode,
        currency: transactionDetailsFromGateway.currency,
        description: itemInformation.description,
        skuId: itemInformation.skuId,
        subtotal: transactionDetailsFromGateway.subtotal,
        transactionId: transactionDetailsFromGateway.transactionId,
        transactionDate: transactionDetailsFromGateway.transactionDate,
        metrics: {
          joinDate: playerData.gameJoinDate,
          conversion: {
            lastPurchaseDate: playerData.lastPurchaseDate,
            totalSpendToDate: {
              total: playerData.totalSpend,
              currency: playerData.totalSpendCurrency,
            },
          },
        },
      };

      // creator program groupId (only required if more than 1 creator program exists)
      const groupId = '-XgND9kJQRre_UzlaptAE';

      const transactionResponse = await NexusGG.attribution.sendTransaction(
        transactionDetails,
        { groupId },
      );

      console.log('Transaction sent successfully:', transactionResponse);
    } catch (error) {
      console.error('Error in callback:', error.message);
    }
  };

  // Only send transaction to Nexus if creator code is found
  if (creatorCode && creatorCode.trim() !== '') {
    callback();
  }
};
