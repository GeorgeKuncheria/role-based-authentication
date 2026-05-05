import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {Role, User} from '@/app/types/index';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


const JWT_SECRET = process.env.JWT_SECRET || null;


export const hashPassword = async (password : string ) : Promise<string> => {
    const salt= await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}


export const comparePassword = async (password : string, hashPassword : string) : Promise<boolean> => {
    return bcrypt.compare(password, hashPassword);
}


export const generateToken = (userId : string) : string => {
    return jwt.sign({ userId }, JWT_SECRET!, { expiresIn: '7d' });
}


export const verifyToken = (token : string) : {userId : string} => {
    return jwt.verify(token, JWT_SECRET!) as {userId:string};
}


export const getCurrentUser = async () : Promise<User | null> => {
    // This is a placeholder implementation. In a real application, you would retrieve the user from the database based on the token.
    try{
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token){
            return null;
        }

        // Retrieve the user ID from the token and fetch the user from the database
        const decode = verifyToken(token);

        // Once we get the userId, we can fetch the user from the database using the userId and return the user object through Prisma Client.
        const userFromDb = await prisma.user.findUnique({
            where : {id : decode.userId}
        })
        
        if(!userFromDb) {
            return null;
        }

        const {password, ...user} = userFromDb;
        return user as User;
        
    }

    catch(error){

        console.error('Error fetching current user:', error);
        return null;

    }
}




export const checkUserPermission= (user: User, requiredRole : Role) : boolean => {
    const roleHierarchy = {
        [Role.GUEST]:0,
        [Role.USER]:1,
        [Role.MANAGER]:2,
        [Role.ADMIN]:3
    }

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

