import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import hashing from '../Scripts/hashing';

const jwt=require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require('fs').promises;
const path = require('path');

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
export const loginUser = async (req: Request, res: Response) => {
  const { userName, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        userName: userName,
      },
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Use your existing function to compare hashed password
    await hashing.compareHashPassword(password, user.password, { error: 'Invalid credentials' });
    const accessToken = jwt.sign(
      { userId: user.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '5m' }
  );

    // Generate refresh token
  // const refreshToken = jwt.sign(
  //     { userId: user.userId },
  //     process.env.REFERSH_TOKEN_SECRET,
  //     { expiresIn: '1d' }
  // );
  
  //   const savedToken = await prisma.user.create({
  //     data: {
  //       userName:userName,
  //       refreshToken: refreshToken
  //     }
  // });
    //  res.cookie('jwt', refreshToken, { httpOnly: true,  secure: true, maxAge: 24 * 60 * 60 * 1000 });
    res.status(200).json({ accessToken: accessToken});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
};

export const logedIn = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "You are innnnn" });
};