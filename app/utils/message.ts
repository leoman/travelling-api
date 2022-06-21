export class ResponseBodyVO {
  code: number;
  message: string;
  data?: object;
}

export class ResponseVO {
  statusCode: number;
  body: string;
}

enum StatusCode {
  success = 200,
  serverError = 500,
}

class Result {
  private statusCode: number;
  private code: number;
  private message: string;
  private data?: any;

  constructor(statusCode: number, code: number, message: string, data?: any) {
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
    this.data = data;
  }

  /**
   * Serverless: According to the API Gateway specs, the body content must be stringified
   */
  bodyToString () {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify({
        code: this.code,
        message: this.message,
        result: this.data,
      }),
    };
  }
}

export class MessageUtil {
  static success<T>(data: T): ResponseVO {
    const result = new Result(StatusCode.success, 200, 'success', data);

    return result.bodyToString();
  }

  static error(code: number = 500, message: string) {
    const result = new Result(StatusCode.serverError, code, message);

    console.log(result.bodyToString());
    return result.bodyToString();
  }
}
