/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
import { PrismaClient } from "@prisma/client";

import { Request, Response, NextFunction } from "express"; // Import NextFunction
import { IUser } from "../data/interface";
const prisma = new PrismaClient();

declare global {
  namespace Express {
    export interface Request {
      user: Partial<IUser>;
    }
  }
}
const verifyDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  console.log(user.role);
  if (user.role == "Doctor") {
    next();
  } else {
    next(res.sendStatus(401));
  }
};

module.exports = verifyDoctor;
