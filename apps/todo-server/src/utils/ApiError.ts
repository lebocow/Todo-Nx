class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  errors: any[];

  constructor(
    statusCode: number,
    message?: string,
    isOperational = true,
    errors: any[] = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;
  }
}

export default ApiError;
