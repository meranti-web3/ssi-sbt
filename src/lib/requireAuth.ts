import { NextFunction, Request, Response } from "express";
import { ClientError } from "./errors";

export function requireAuth(apiKey: string) {
  return function checkAuth(req: Request, res: Response, next: NextFunction) {
    if (req.get("X-API-KEY") === apiKey) {
      next();
      return;
    }

    const clientError = new ClientError("missing or incorrect API KEY");
    clientError.code = 401;
    clientError.name = "Unauthorized";

    throw clientError;
  };
}
