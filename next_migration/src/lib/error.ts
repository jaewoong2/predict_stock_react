export class CustomError extends Error {
  public isCustomError: boolean;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;

    this.isCustomError = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NetworkError extends CustomError {
  constructor(message: string = 'Network error occurred') {
    super(message);
  }
}

export class ResponseError extends CustomError {
  public status: number;
  public statusText: string;
  public data?: any;

  constructor(status: number, statusText: string, data?: any) {
    super(`HTTP Error: ${status} ${statusText}`);
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

export class JSONParseError extends CustomError {
  constructor(message: string = 'Failed to parse JSON response') {
    super(message);
  }
}

export class AuthValidationError extends CustomError {
  public errors: any;

  constructor(errors: any, message: string = 'Authentication validation error') {
    super(message);
    this.errors = errors;
  }
}
