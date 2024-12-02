import { AuthenticationError, BadRequestError, ServerError } from './errors';

export const handleError = (error: any): never => {
  if (error.response) {
    const { status, data } = error.response;
    if (status === 401) {
      throw new AuthenticationError('Invalid API key or unauthorized access.');
    }
    if (status === 400) {
      throw new BadRequestError(data.message || 'Bad request.');
    }
    throw new ServerError(data.message || 'Unexpected server error.');
  }
  throw new ServerError('Failed to communicate with the Nexus API.');
};
