import {
  NexusError,
  AuthenticationError,
  MemberNotFoundError,
  BadRequestError,
  ServerError,
} from '../../src/core/errors';

describe('NexusError', () => {
  it('should correctly set properties and prototype', () => {
    const error = new NexusError('TestError', 418, 'I am a teapot');

    expect(error.code).toBe('TestError');
    expect(error.status).toBe(418);
    expect(error.message).toBe('I am a teapot');
    expect(error.name).toBe('NexusError');
    expect(error instanceof NexusError).toBe(true);
    expect(Object.getPrototypeOf(error)).toBe(NexusError.prototype);
  });
});

describe('AuthenticationError', () => {
  it('should extend NexusError and set correct properties', () => {
    const error = new AuthenticationError('Invalid credentials');

    expect(error.code).toBe('AuthenticationError');
    expect(error.status).toBe(401);
    expect(error.message).toBe('Invalid credentials');
    expect(error.name).toBe('AuthenticationError');
    expect(error instanceof NexusError).toBe(true);
    expect(error instanceof AuthenticationError).toBe(true);
  });
});

describe('MemberNotFoundError', () => {
  it('should extend NexusError and set correct properties', () => {
    const error = new MemberNotFoundError('Member not found');

    expect(error.code).toBe('MemberNotFoundError');
    expect(error.status).toBe(404);
    expect(error.message).toBe('Member not found');
    expect(error.name).toBe('MemberNotFoundError');
    expect(error instanceof NexusError).toBe(true);
    expect(error instanceof MemberNotFoundError).toBe(true);
  });
});

describe('BadRequestError', () => {
  it('should extend NexusError and set correct properties', () => {
    const error = new BadRequestError('Bad request');

    expect(error.code).toBe('BadRequestError');
    expect(error.status).toBe(400);
    expect(error.message).toBe('Bad request');
    expect(error.name).toBe('BadRequestError');
    expect(error instanceof NexusError).toBe(true);
    expect(error instanceof BadRequestError).toBe(true);
  });
});

describe('ServerError', () => {
  it('should extend NexusError and set correct properties', () => {
    const error = new ServerError('Internal server error');

    expect(error.code).toBe('ServerError');
    expect(error.status).toBe(500);
    expect(error.message).toBe('Internal server error');
    expect(error.name).toBe('ServerError');
    expect(error instanceof NexusError).toBe(true);
    expect(error instanceof ServerError).toBe(true);
  });
});
