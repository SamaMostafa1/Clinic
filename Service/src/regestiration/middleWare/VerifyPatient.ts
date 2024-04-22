/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';

import { Request, Response, NextFunction } from 'express'; // Import NextFunction

const prisma = new PrismaClient();
const verifyPatient= async (req: Request, res: Response, next: NextFunction) => {
    const user=req.user;
    console.log(user.role);
    if(req.user.role=="Patient"){
        next();
    }else{
        next( res.sendStatus(401));
    }

};


module.exports = verifyPatient;