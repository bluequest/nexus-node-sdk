# Nexus Node.js SDK

The **Nexus Node.js SDK** simplifies integration with the Nexus platform, enabling you to handle attributions, manage members, and process transactions with ease. Designed for game and backend developers, this SDK provides a seamless way to implement Nexus' creator program APIs in your backend applications.

---

## Features

- **Member Management**:

  - Retrieve and manage members in attribution groups.
  - Search for members by player ID, creator code, or group ID.

- **Tier Management**:

  - Access and manage group tiers with revenue share details.
  - Retrieve details for specific tiers and their members.

- **Scheduled Revenue Shares**:

  - Schedule temporary revenue shares with optional tier-specific adjustments.
  - Retrieve and manage scheduled revenue share details.

- **Transaction Handling**:

  - Attribute transactions securely to group members with detailed metrics.
  - Support for multiple members attributed to the same transaction.
  - Update transaction statuses for refunds, fraud, or chargebacks.

- **Sandbox & Production Support**:

  - Seamlessly switch between sandbox and production environments.

- **Flexible Query Parameters**:

  - Add optional query parameters like pagination and group filtering to customize API requests.

- **Comprehensive Error Handling**:

  - Handle API errors gracefully with detailed error types for authentication, bad requests, and server issues.

- **Lightweight and Configurable**:
  - Initialize the SDK with public and private keys to suit your application's needs.
  - Set up environment-specific configurations with ease.

---

## Installation

Install the SDK via npm:

```bash
npm install nexus-node-sdk
```

---

## Getting Started

### 1. **Import the SDK**

Use `require` to import the SDK:

```javascript
const NexusGG = require('nexus-node-sdk');
```

### 2. **Initialize the SDK**

Configure the SDK with your public and private API keys:

```javascript
NexusGG.config(
  'your-public-key', // Replace with your Nexus public key
  'your-private-key', // Replace with your Nexus private key
  'sandbox', // Set to 'sandbox' or 'production'
);
```

---

## Usage

### Manage Services

The `manage` service includes methods for managing members, tiers, and revenue shares.

#### Get All Members

Fetch all members of a group:

```javascript
const members = await NexusGG.manage.getAllMembers({
  page: 1,
  pageSize: 10,
  groupId: 'group123',
});
```

**Example Response:**

```json
{
  "groupId": "-XgND9kJQRre_UzlaptAE",
  "groupName": "Bluequest",
  "currentPage": 1,
  "currentPageSize": 2,
  "totalCount": 3917,
  "members": [
    {
      "id": "oleyE4Z6zwN07YnytKuw2",
      "name": "DasNeids Gaming",
      "codes": [
        {
          "code": "dasneids",
          "isPrimary": true,
          "isGenerated": false,
          "isManaged": false
        }
      ]
    },
    {
      "id": "yHa0CrwKaG4m4dM4W5mPN",
      "name": "CohhCarnage Game Store",
      "logoImage": "https://cdn.nexus.gg/yHa0CrwKaG4m4dM4W5mPN/images/logo-image.jpg",
      "profileImage": "https://cdn.nexus.gg/yHa0CrwKaG4m4dM4W5mPN/images/profile-image.jpg",
      "codes": [
        {
          "code": "cohhcarnage",
          "isPrimary": true,
          "isGenerated": false,
          "isManaged": false
        }
      ]
    }
  ]
}
```

#### Get Member By Code Or Id

Fetch a single member of a group:

```javascript
const members = await NexusGG.manage.getMemberByCodeOrId(
  { groupId: '-XgND9kJQRre_UzlaptAE' },
  'dasneids',
);
```

**Example Response:**

```json
{
  "groupId": "-XgND9kJQRre_UzlaptAE",
  "groupName": "Bluequest",
  "id": "oleyE4Z6zwN07YnytKuw2",
  "name": "DasNeids Gaming",
  "codes": [
    {
      "code": "dasneids",
      "isPrimary": true,
      "isGenerated": false,
      "isManaged": false
    }
  ]
}
```

#### Get Member By PlayerId

Fetch a single member by playerId:

```javascript
const members = await NexusGG.manage.getMemberByPlayerId(
  'oleyE4Z6zwN07YnytKuw2',
);
```

**Example Response:**

```json
{
  "groupId": "-XgND9kJQRre_UzlaptAE",
  "groupName": "Bluequest",
  "id": "oleyE4Z6zwN07YnytKuw2",
  "name": "DasNeids Gaming",
  "codes": [
    {
      "code": "dasneids",
      "isPrimary": true,
      "isGenerated": false,
      "isManaged": false
    }
  ]
}
```

#### Generate Code

Generate a code for a member:

```javascript
const response = await NexusGG.manage.generateCode(
  { playerId: 'player123' },
  { groupId: 'group123' },
);
```

#### Link Existing Nexus

Link an existing Nexus to a member:

```javascript
const response = await NexusGG.manage.linkExistingNexus(
  { playerId: 'player123', authCode: 'auth123' },
  { groupId: 'group123' },
);
```

#### Link Existing Nexus

Schedule a temporary revenue share:

```javascript
const response = await NexusGG.manage.scheduleRevShare({
  revShare: 15,
  startDate: '2023-06-21T15:00:00Z',
  endDate: '2023-06-23T15:00:00Z',
  tierRevenueShares: [
    { tierId: 'tier1', revShare: 20 },
    { tierId: 'tier2', revShare: 25 },
  ],
});
```

---

### Attribution Services

The `attribution` service includes methods for handling transactions and updates.

#### Attribute a Transaction

Attribute a transaction to a member:

```javascript
const transaction = await NexusGG.attribution.sendTransaction({
  playerName: 'gamePlayer',
  code: 'creatorCode123',
  currency: 'USD',
  description: '1000 gems',
  platform: 'PC',
  status: 'Normal',
  subtotal: 999,
  transactionId: 'uniqueTransactionId',
  transactionDate: '2023-12-01T15:00:00Z',
});
```

#### Update a Transaction

Update the status of a transaction:

```javascript
const updatedTransaction = await NexusGG.attribution.updateTransaction(
  'transaction123',
  {
    action: 'Refund',
  },
);
```

---

## Testing Your Integration

The SDK is designed to work seamlessly in both `sandbox` and `production` environments. When testing:

Use your sandbox API keys during development:

```javascript
NexusGG.config(
  'your-sandbox-public-key',
  'your-sandbox-private-key',
  'sandbox',
);
```

---

## Error Handling

The SDK provides custom error classes for more precise error handling. You can use these to identify the exact issue:

- `AuthenticationError`: Indicates invalid API keys or unauthorized access (401).
- `MemberNotFoundError`: Indicates that the provided creator code or member does not exist (400 with `CodeNotInGroup`).
- `BadRequestError`: Indicates an invalid request to the Nexus API (400).
- `ServerError`: Indicates an unexpected server-side issue (500 or other server errors).

Use `try...catch` blocks to handle errors gracefully:

```javascript
try {
  const member = await NexusGG.manage.getMemberByCodeOrId('creatorCode');
} catch (error) {
  if (error instanceof NexusGG.AuthenticationError) {
    console.error('Authentication failed:', error.message);
  } else if (error instanceof NexusGG.MemberNotFoundError) {
    console.error('Member not found:', error.message);
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

---

## API Documentation

For more details on available endpoints, parameters, and responses, refer to the [Nexus API Documentation](https://docs.nexus.gg).

---

## Examples

### **Basic Example**

```javascript
const NexusGG = require('nexus-node-sdk');

NexusGG.config('your-public-key', 'your-private-key', 'sandbox');

async function main() {
  try {
    const member = await NexusGG.manage.getMemberByCodeOrId('code');
    console.log('Member Data:', member);
  } catch (error) {
    if (error.code === 'AuthenticationError') {
      res.status(401).json({ message: error.message });
    } else if (error.code === 'MemberNotFoundError') {
      res.status(404).json({ message: error.message });
    } else if (error.code === 'BadRequestError') {
      res.status(400).json({ message: error.message });
    } else {
      console.error('Unhandled error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

main();
```

---

## Contributing

We welcome contributions! Please open an issue or submit a pull request for improvements or bug fixes.

---

## License

MIT License

Copyright (c) 2024 Chrono, Inc & Nexus

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
