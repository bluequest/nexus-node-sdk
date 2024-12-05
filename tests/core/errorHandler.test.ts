import { handleError } from '../../src/core/errorHandler';
import {
  AuthenticationError,
  BadRequestError,
  ServerError,
} from '../../src/core/errors';

describe('handleError', () => {
  it('should throw AuthenticationError for 401 status', () => {
    const mockError = {
      response: {
        status: 401,
        data: {},
      },
    };

    expect(() => handleError(mockError)).toThrow(AuthenticationError);
    expect(() => handleError(mockError)).toThrow(
      'Invalid API key or unauthorized access.',
    );
  });

  it('should throw BadRequestError for 400 status with message', () => {
    const mockError = {
      response: {
        status: 400,
        data: {
          message: 'Invalid request payload.',
        },
      },
    };

    expect(() => handleError(mockError)).toThrow(BadRequestError);
    expect(() => handleError(mockError)).toThrow('Invalid request payload.');
  });

  it('should throw BadRequestError for 400 status without message', () => {
    const mockError = {
      response: {
        status: 400,
        data: {},
      },
    };

    expect(() => handleError(mockError)).toThrow(BadRequestError);
    expect(() => handleError(mockError)).toThrow('Bad request.');
  });

  it('should throw ServerError for non-400/401 status with message', () => {
    const mockError = {
      response: {
        status: 500,
        data: {
          message: 'Internal server error.',
        },
      },
    };

    expect(() => handleError(mockError)).toThrow(ServerError);
    expect(() => handleError(mockError)).toThrow('Internal server error.');
  });

  it('should throw ServerError for non-400/401 status without message', () => {
    const mockError = {
      response: {
        status: 500,
        data: {},
      },
    };

    expect(() => handleError(mockError)).toThrow(ServerError);
    expect(() => handleError(mockError)).toThrow('Unexpected server error.');
  });

  it('should throw ServerError when response is undefined', () => {
    const mockError = {};

    expect(() => handleError(mockError)).toThrow(ServerError);
    expect(() => handleError(mockError)).toThrow(
      'Failed to communicate with the Nexus API.',
    );
  });
});
