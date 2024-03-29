import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";

export class ClientError extends Error {
  date: string;
  uuid: string;
  code: number;

  constructor(message: string) {
    super(message);
    this.date = new Date().toISOString();
    this.uuid = randomUUID();
    this.code = 430;
    this.name = "Client Error";
  }
}

export class ServerError extends Error {
  date: string;
  uuid: string;
  code: number;

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServerError);
    }

    this.date = new Date().toISOString();
    this.uuid = randomUUID();
    this.code = 500;
    this.name = "Server Error";
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorMiddleware(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ClientError) {
    console.error(err);
    res.statusMessage = err.name;
    res.status(err.code).send(`${err.name}, ${err.message}.\n error id #${err.uuid}`);
  } else {
    const serverError = new ServerError(err.message);
    console.error(`original error ${serverError.uuid}\n`, err);
    console.error("server error \n", serverError);
    res
      .status(serverError.code)
      .send(`Something went wrong, please reach out to support.\nerror id #${serverError.uuid}`);
  }
}

export function asyncErrorHandling(fn: (req: Request, res: Response, next: NextFunction) => void) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}
