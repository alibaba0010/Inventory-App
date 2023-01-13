class ErrorHandler extends Error {
  constructor(message, statusCode, stack) {
    super(message);
    this.statusCode = statusCode;
  }
}

export { ErrorHandler as default };
