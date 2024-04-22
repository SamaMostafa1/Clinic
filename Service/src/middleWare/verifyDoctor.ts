import { PrismaClient } from '@prisma/client';

import { Request, Response, NextFunction } from 'express'; // Import NextFunction

const prisma = new PrismaClient();
const verifyDoctor= async (req: Request, res: Response, next: NextFunction) => {
    const user=req.user;
    if(user.role="Doctor"){
        next();
    }else{
        next( res.sendStatus(401));
    }

};


module.exports = verifyDoctor;

