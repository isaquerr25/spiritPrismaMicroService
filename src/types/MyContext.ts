import { Request, Response } from 'express';

export interface MyContext {
  req: Request;
  
}

export interface MyContextAdvance {
  req: Request;
  res: Response;
  process: any
}
