class SuccessResponse {
  constructor({ status, message, data }) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

class ErrorResponse {
  constructor(status, message, errors) {
    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}

export { SuccessResponse, ErrorResponse };
