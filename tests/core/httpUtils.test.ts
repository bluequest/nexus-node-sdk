import nock from 'nock';
import { getHttpClient, makeRequest } from '../../src/core/httpUtils';
import { setupHttpMock } from '../setupHttpMock';

jest.mock('../../src/core/errorHandler', () => ({
  handleError: jest.fn((error) => {
    throw error; // Re-throw the error to propagate it in the test
  }),
}));

describe('httpUtils', () => {
  const baseURL = 'https://mock.api.nexus.gg';

  beforeEach(() => {
    setupHttpMock(baseURL); // Set up the Config and baseURL
    nock.cleanAll(); // Clear any existing nock interceptors
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('getHttpClient', () => {
    it('should create an Axios instance with public key headers', () => {
      const client = getHttpClient('public');
      expect(client.defaults.baseURL).toBe(baseURL);
      expect(client.defaults.headers['x-shared-secret']).toBe('mockPublicKey');
      expect(client.defaults.headers['Content-Type']).toBe('application/json');
      expect(client.defaults.timeout).toBe(5000);
    });

    it('should create an Axios instance with private key headers', () => {
      const client = getHttpClient('private');
      expect(client.defaults.baseURL).toBe(baseURL);
      expect(client.defaults.headers['x-shared-secret']).toBe('mockPrivateKey');
    });

    it('should throw an error if public key is not set', () => {
      const Config = require('../../src/core/config').Config;
      Config.publicKey = ''; // Simulate missing key
      expect(() => getHttpClient('public')).toThrow(
        'publicKey is not set. Please initialize the SDK with the required keys.',
      );
    });

    it('should throw an error if private key is not set', () => {
      const Config = require('../../src/core/config').Config;
      Config.privateKey = ''; // Simulate missing key
      expect(() => getHttpClient('private')).toThrow(
        'privateKey is not set. Please initialize the SDK with the required keys.',
      );
    });
  });

  describe('makeRequest', () => {
    it('should make a GET request and return response data', async () => {
      const responseMock = { data: 'mock-response' };
      nock(baseURL).get('/test').reply(200, responseMock);

      const result = await makeRequest('public', 'get', '/test');
      expect(result).toEqual(responseMock); // Adjust to match the entire response structure
    });

    it('should make a POST request with data and return response data', async () => {
      const requestData = { foo: 'bar' };
      const responseMock = { data: 'mock-response' };
      nock(baseURL).post('/test', requestData).reply(200, responseMock);

      const result = await makeRequest('private', 'post', '/test', requestData);
      expect(result).toEqual(responseMock); // Adjust to match the entire response structure
    });

    it('should call handleError if a request fails', async () => {
      const mockError = new Error('Request failed');
      nock(baseURL).get('/test').replyWithError(mockError);

      await expect(makeRequest('public', 'get', '/test')).rejects.toThrow(
        'Request failed',
      );

      const handleError = require('../../src/core/errorHandler').handleError;
      expect(handleError).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
