
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
// const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//-------------------Get All Users -----------------------
export const getAllUsers = async (req: Request, res: Response) => {
  // const getAllUsers = async (req, res) => {
    // const { role } = req.params;
  
    try {
      const roleMembers = await prisma.user.findMany();
  
      res.status(200).json({ data: roleMembers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  };

//-------------------Get User By ID-----------------------
export const getALLUserById = async (req: Request, res: Response) => {
  // const getALLUserById = async (req, res) => {
  const {userId } = req.params;
  console.log(userId);

  try {
    console.log(userId);
    const userMember = await prisma.user.findUnique({
      where: {
        userId: parseInt(userId),
      }
    });
    if (userMember) {
      res.status(200).json({ data: userMember });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
};  

//-------------------Get User By userName-----------------------
export const getALLUserByUserName = async (req: Request, res: Response) => {
  // const getALLUserById = async (req, res) => {
  const {UserName } = req.params;

  try {
    // console.log(userID);
    const userMember = await prisma.user.findUnique({
      where: {
        userName: UserName,
      }
    });
    if (!userMember) {
      res.status(404).json({ error: 'User member not found' });
    } else {
      res.status(200).json({ data: userMember });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
};  

