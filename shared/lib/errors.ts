export class ResponseError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number,code?: string) {
    super(message);
    this.status = status;
    this.name = "ResponseError";
    this.code = code;
    Object.setPrototypeOf(this, ResponseError.prototype);
  }

}