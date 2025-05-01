import {NextFunction, Request, Response, RequestHandler} from 'express';

export const catchError =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(err => next(err));
