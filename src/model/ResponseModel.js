class SuccessResponse {
  constructor({ status, message, data, statusCode }) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }
}

class ErrorResponse {
  constructor({ status, message, error, statusCode }) {
    this.status = status;
    this.message = message;
    this.error = error;
    this.statusCode = statusCode;
  }
}

export { SuccessResponse, ErrorResponse };
