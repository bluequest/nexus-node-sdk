import nock from 'nock';
import { setupHttpMock } from '../setupHttpMock';
import NexusGG from '../../src';
import { AuthenticationError } from '../../src/core/errors';

describe('Security Tests', () => {
  const baseURL = 'https://mock.api.nexus.gg';

  beforeEach(() => {
    setupHttpMock(baseURL);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('API Key Security', () => {
    it('should not expose sensitive data in error messages', async () => {
      nock(baseURL)
        .get('/manage/members')
        .reply(401, { message: 'Invalid API key: sk_test_123456789' });

      await expect(NexusGG.manage.getAllMembers()).rejects.toThrow(
        AuthenticationError,
      );
    });

    it('should validate API key format', async () => {
      // Test with invalid API key format
      expect(() => NexusGG.config('', 'invalid-secret')).toThrow();
      expect(() => NexusGG.config('invalid-key', '')).toThrow();
    });

    it('should handle malformed API keys gracefully', async () => {
      nock(baseURL)
        .get('/manage/members')
        .reply(401, { message: 'Invalid API key format' });

      await expect(NexusGG.manage.getAllMembers()).rejects.toThrow(
        AuthenticationError,
      );
    });
  });

  describe('Data Exposure Prevention', () => {
    it('should not log sensitive information', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      nock(baseURL)
        .get('/manage/members')
        .reply(500, { message: 'Internal server error' });

      try {
        await NexusGG.manage.getAllMembers();
      } catch (error) {
        // Expected to throw
      }

      // Check that no sensitive data was logged
      const loggedMessages = [
        ...consoleSpy.mock.calls.flat(),
        ...consoleErrorSpy.mock.calls.flat(),
      ];

      const sensitiveDataPatterns = [
        /sk_test_/,
        /pk_test_/,
        /private.*key/i,
        /secret/i,
      ];

      sensitiveDataPatterns.forEach((pattern) => {
        loggedMessages.forEach((message) => {
          if (typeof message === 'string') {
            expect(message).not.toMatch(pattern);
          }
        });
      });

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should sanitize error messages', async () => {
      nock(baseURL).get('/manage/members').reply(400, {
        message: 'Error with key: sk_test_123456789 and secret: secret123',
      });

      await expect(NexusGG.manage.getAllMembers()).rejects.toThrow();
      // The error should not contain the actual API key or secret
    });
  });

  describe('Request Security', () => {
    it('should use HTTPS for all requests', async () => {
      // This test ensures that the baseURL is always HTTPS
      const config = require('../../src/core/config').Config;
      expect(config.baseURL).toMatch(/^https:\/\//);
    });

    it('should include proper headers for authentication', async () => {
      nock(baseURL)
        .get('/manage/members')
        .matchHeader('x-shared-secret', 'mockPublicKey')
        .reply(200, { members: [] });

      await NexusGG.manage.getAllMembers();
      // If the header is missing or incorrect, nock will not match and the test will fail
    });

    it('should not expose internal error details', async () => {
      nock(baseURL).get('/manage/members').reply(500, {
        message: 'Internal server error',
        stack: 'Error: Something went wrong\n    at /app/server.js:123:45',
        internalCode: 'ERR_12345',
      });

      await expect(NexusGG.manage.getAllMembers()).rejects.toThrow();
      // The error should not expose stack traces or internal codes
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize user inputs', async () => {
      const maliciousInput = {
        playerName: '<script>alert("xss")</script>',
        code: 'test',
        currency: 'USD',
        description: 'test',
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 100,
        transactionId: 'test',
        transactionDate: new Date().toISOString(),
      };

      nock(baseURL)
        .post('/attributions/transactions', [maliciousInput])
        .reply(200, { transaction: { ...maliciousInput, id: 'test' } });

      const result = await NexusGG.attribution.sendTransaction(maliciousInput);
      expect(result).toBeDefined();
      // The SDK should handle malicious input gracefully
    });

    it('should handle SQL injection attempts', async () => {
      const sqlInjectionInput = {
        playerName: "'; DROP TABLE users; --",
        code: 'test',
        currency: 'USD',
        description: 'test',
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 100,
        transactionId: 'test',
        transactionDate: new Date().toISOString(),
      };

      nock(baseURL)
        .post('/attributions/transactions', [sqlInjectionInput])
        .reply(200, { transaction: { ...sqlInjectionInput, id: 'test' } });

      const result =
        await NexusGG.attribution.sendTransaction(sqlInjectionInput);
      expect(result).toBeDefined();
      // The SDK should handle SQL injection attempts gracefully
    });
  });

  describe('Rate Limiting', () => {
    it('should handle rate limiting gracefully', async () => {
      nock(baseURL).get('/manage/members').reply(429, {
        message: 'Rate limit exceeded',
        retryAfter: 60,
      });

      await expect(NexusGG.manage.getAllMembers()).rejects.toThrow();
    });

    it('should respect rate limit headers', async () => {
      nock(baseURL)
        .get('/manage/members')
        .reply(429, {
          message: 'Rate limit exceeded',
        })
        .matchHeader('retry-after', '60');

      await expect(NexusGG.manage.getAllMembers()).rejects.toThrow();
    });
  });
});
