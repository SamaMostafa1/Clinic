import { PrismaClient } from '@prisma/client';
import { User } from "@prisma/client";
import  express from "express";

import { Request, Response, NextFunction } from 'express'; // Import NextFunction

const jwt = require("jsonwebtoken");
require("dotenv").config();

const prisma = new PrismaClient();
export interface IUser {
  name: string;
  email: string;
  password: string;
  repeatPassword?: string | undefined;
}
declare global {
  namespace Express {
      export interface Request {
          user: Partial<IUser>
      }
  }
}

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    console.log(authHeader); // Bearer token
    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as { userId: number };
        const user = await prisma.user.findUnique({
            where: {
                userId: payload.userId,
            },
        });
        if (!user) return res.sendStatus(401); // User not found
        req.user = user;
        console.log(req.user);
        next(); // Call next function
    } catch (error) {
        console.error(error);
        return res.sendStatus(401); // Invalid or expired token
    }
};


module.exports = verifyJWT;

