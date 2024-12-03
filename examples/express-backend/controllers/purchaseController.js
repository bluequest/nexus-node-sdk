const NexusGG = require('nexus-node-sdk');

// delay helper for demo purposes
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.purchaseItem = async (req, res) => {
  const { skuId, playerId, creatorCode } = req.body;
  console.log(req.body);
  //mimic purchasing being successful with timeout
  await delay(3000);

  res.status(200).json({
    message: 'Purchase Successful',
    data: {
      transactionId: '123',
      itemId: 1234,
    },
  });
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
