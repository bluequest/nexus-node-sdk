export class NexusError extends Error {
  constructor(
    public code: string,
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AuthenticationError extends NexusError {
  constructor(message: string) {
    super('AuthenticationError', 401, message);
  }
}

export class MemberNotFoundError extends NexusError {
  constructor(message: string) {
    super('MemberNotFoundError', 404, message);
  }
}

export class BadRequestError extends NexusError {
  constructor(message: string) {
    super('BadRequestError', 400, message);
  }
}

export class ServerError extends NexusError {
  constructor(message: string) {
    super('ServerError', 500, message);
  }
}
