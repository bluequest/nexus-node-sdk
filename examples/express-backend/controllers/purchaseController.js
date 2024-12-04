const NexusGG = require('nexus-node-sdk');

// delay helper for demo purposes
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateTransactionId = () => {
  const randomPart = Math.random().toString(36).substring(2, 8);
  const timestampPart = Date.now().toString(36);
  return `${randomPart}_${timestampPart}`;
};

exports.purchaseItem = async (req, res) => {
  const { skuId, playerName, creatorCode } = req.body;
  console.log(req.body);

  // Mimic purchasing besing sent to payment gateway
  await delay(2000);

  // mimic data sent back from payment gateway
  const transactionDetailsFromGateway = {
    transactionId: generateTransactionId(),
    transactionDate: new Date().toISOString(),
    subtotal: 4999,
    currency: 'USD',
  };

  res.status(200).json({
    message: 'Purchase Successful',
    data: {
      transactionId: '123',
      itemId: 1234,
    },
  });

  const itemInformation = {
    skuId: 'sku123',
    description: 'Healing Pot',
  };

  // mimic player lookup from playerName provided
  const playerData = {
    gameJoinDate: '2024-01-15T00:00:00.000Z',
    lastPurchaseDate: '2024-05-01T00:00:00.000Z',
    totalSpend: 25999,
    totalSpendCurrency: 'USD',
  };

  // After item is rewarded send transaction to Nexus
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

exports.sendTransaction = async (req, res) => {
  const transactionDetails = {
    playerName: 'DasNeids Gaming',
    code: 'dasneids',
    currency: 'USD',
    description: 'Purchase of 500 Gems',
    platform: 'PC',
    status: 'completed',
    subtotal: 4999,
    transactionId: 'txn_12345',
    transactionDate: new Date().toISOString(),
    metrics: {
      joinDate: '2024-01-15T00:00:00.000Z',
      conversion: {
        lastPurchaseDate: '2024-11-30T00:00:00.000Z',
        totalSpendToDate: {
          total: 249.99,
          currency: 'USD',
        },
      },
    },
  };

  const groupId = '-XgND9kJQRre_UzlaptAE';

  try {
    const transactionResponse = await NexusGG.sendTransaction(
      transactionDetails,
      { groupId },
    );

    console.log('Transaction sent successfully:');
    console.log(
      'Transaction ID:',
      transactionResponse.transaction.transactionId,
    );
    console.log(
      'Total:',
      transactionResponse.transaction.total,
      transactionResponse.transaction.totalCurrency,
    );
    console.log('Player Name:', transactionResponse.transaction.playerName);
  } catch (error) {
    if (error.code === 'AuthenticationError') {
      console.error('Authentication failed:', error.message);
    } else if (error.code === 'BadRequestError') {
      console.error('Bad request:', error.message);
    } else {
      console.error('An unexpected error occurred:', error.message);
    }
  }
};
